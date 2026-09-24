"use server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { Notifications, User } from "./types";
import { Option } from "@/components/ui/multiple-selector";
import { revalidatePath } from "next/cache";
import { deleteObject } from "@/lib/s3";
import {
  encrypt,
  decrypt,
  getSession,
  updateSession,
  SESSION_DURATION_MS,
} from "@/lib/session";

export { encrypt, decrypt, getSession, updateSession };
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// A server-side function to compare a password with a hashed password
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}
export default async function signUp(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const hashpassword = await hashPassword(password);
  const response = await prisma.user.create({
    data: {
      email,
      username: email.split("@")[0],
      password: hashpassword,
    },
  });

  if (!response)
    return {
      error: "Something Went Wrong",
    };
  const expires = new Date(Date.now() + 900 * 1000);
  const userInfo = {
    id: response.id,
    email: response.email,
    username: response.username,
    avatar: response.avatar,
  };
  const session = await encrypt({ userInfo, expires });
  // Save the session in a cookie
  cookies().set("session", session, { expires, httpOnly: true });
  return {
    status: 200,
  };
}

export async function signIn(formData: FormData) {
  // Verify credentials && get the user
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const getUser: User | null = await prisma.user.findFirst({
    where: { email },
  });
  if (!getUser)
    return {
      error: "User doesn't exist with this email.",
    };
  if (!(await comparePassword(password, getUser.password!))) {
    return {
      error: "Password entered is Incorrect",
    };
  }
  const userInfo = {
    id: getUser.id,
    email: getUser.email,
    username: getUser.username,
    avatar: getUser.avatar,
  };
  // Create the session
  const expires = new Date(Date.now() + SESSION_DURATION_MS);
  const session = await encrypt({ userInfo, expires });

  // Save the session in a cookie
  cookies().set("session", session, { expires, httpOnly: true });
  return {
    status: 200,
  };
}

export async function logout() {
  // Destroy the session
  cookies().set("session", "", { expires: new Date(0) });
}

export async function userInfo(result: {
  username: string | null;
  avatarUrl: string | null;
  bio?: string | null;
}) {
  const currentSession = await getSession();
  const username = result.username ?? currentSession.userInfo.username;
  const avatarUrl = (result.avatarUrl as string) ?? currentSession.avatarUrl;
  const updateuserInfo = await prisma.user.update({
    where: { id: currentSession.userInfo.id },
    data: {
      username,
      avatar: avatarUrl,
      ...(result.bio !== undefined ? { bio: result.bio } : {}),
    },
  });
  const userInfo = {
    id: updateuserInfo.id,
    email: updateuserInfo.email,
    username: updateuserInfo.username,
    avatar: updateuserInfo.avatar,
  };
  // Create the session
  const expires = new Date(Date.now() + SESSION_DURATION_MS);
  const session = await encrypt({ userInfo, expires });

  // Save the session in a cookie
  cookies().set("session", session, { expires, httpOnly: true });
  return {
    status: 200,
  };
}
export async function addTags(tags: Option[] | null, blogId: string) {
  try {
    const deleteTags = await prisma.tag.deleteMany({ where: { blogId } });
    if (deleteTags)
      tags?.forEach(
        async (val) =>
          await prisma.tag.create({ data: { blogId, tag: val.value } })
      );
    revalidatePath("/");
    return {
      status: 200,
    };
  } catch (error) {
    console.log(error);
  }
}

export async function deleteBlog(blogId: string) {
  try {
    const existing = await prisma.blog.findUnique({
      where: { id: blogId },
      select: { slug: true, title: true },
    });
    const images = await prisma.image.findMany({ where: { blogId } });
    const deleteBlog = await prisma.$transaction([
      prisma.tag.deleteMany({ where: { blogId } }),
      prisma.comment.deleteMany({ where: { blogId } }),
      prisma.like.deleteMany({ where: { blogId } }),
      prisma.bookmark.deleteMany({ where: { blogId } }),
      prisma.image.deleteMany({ where: { blogId } }),
      prisma.blogVisit.deleteMany({ where: { blogId } }),
      prisma.blog.delete({ where: { id: blogId } }),
    ]);

    if (deleteBlog && images.length > 0) {
      await Promise.all(images.map((val) => deleteObject(val.imageUrl)));
    }
    revalidatePath("/manage-blog");
    revalidatePath("/");
    if (existing) revalidatePath(`/blogs/${existing.slug || existing.title}`);
    return {
      status: 200,
    };
  } catch (error) {
    console.log(error);
  }
}

export async function subscribe(publisherId: string) {
  try {
    const session = await getSession();
    const isSubscribed = await prisma.subscription.findFirst({
      where: { publisherId, readerId: session.userInfo.id },
    });
    if (!isSubscribed) {
      await prisma.subscription.create({
        data: { publisherId, readerId: session.userInfo.id },
      });
    } else
      await prisma.subscription.delete({
        where: { id: isSubscribed.id },
      });
    revalidatePath("/");
    return {
      status: 200,
    };
  } catch (error) {
    console.log(error);
  }
}

export async function likes(blogId: string) {
  try {
    const session = await getSession();
    if (!session) return { status: 401, liked: false };
    const isLiked = await prisma.like.findFirst({
      where: { blogId, ownerId: session.userInfo.id },
    });
    if (!isLiked) {
      await prisma.like.create({
        data: { blogId, ownerId: session.userInfo.id },
      });
      return { status: 200, liked: true };
    }
    await prisma.like.delete({
      where: { id: isLiked.id },
    });
    return { status: 200, liked: false };
  } catch (error) {
    console.log(error);
    return { status: 500, liked: false };
  }
}

export async function toggleBookmark(blogId: string) {
  try {
    const session = await getSession();
    if (!session) return { status: 401, bookmarked: false };

    const existing = await prisma.bookmark.findFirst({
      where: { blogId, ownerId: session.userInfo.id },
    });
    if (!existing) {
      await prisma.bookmark.create({
        data: { blogId, ownerId: session.userInfo.id },
      });
      revalidatePath("/");
      revalidatePath("/saved");
      return { status: 200, bookmarked: true };
    }
    await prisma.bookmark.delete({ where: { id: existing.id } });
    revalidatePath("/");
    revalidatePath("/saved");
    return { status: 200, bookmarked: false };
  } catch (error) {
    console.log(error);
    return { status: 500, bookmarked: false };
  }
}

export async function comment(formData: FormData) {
  try {
    const session = await getSession();
    const comment = await prisma.comment.create({
      data: {
        blogId: formData.get("blogId") as string,
        comment: formData.get("comment") as string,
        ownerId: session.userInfo.id,
      },
    });
    if (comment) revalidatePath("/");
    return {
      status: 200,
    };
  } catch (error) {
    console.log(error);
  }
}

export async function addFavoriteTopics(tags: Option[] | null) {
  try {
    const session = await getSession();
    const tagsToCheck = await prisma.interestedTopics.findMany({
      where: { userId: session.userInfo.id },
    });
    console.log(tagsToCheck);

    if (tags !== null)
      tags.forEach(async (val) => {
        if (
          !tagsToCheck.some((tag) => tag.tagId === val.id) ||
          tagsToCheck.length === 0
        )
          await prisma.interestedTopics.create({
            data: { userId: session.userInfo.id, tagId: val.id as string },
          });
      });
    revalidatePath("/");
    return {
      status: 200,
    };
  } catch (error) {
    console.log(error);
  }
}

export async function updateNotifications(result: Notifications) {
  try {
    const session = await getSession();
    const notifications = await prisma.notifications.upsert({
      where: { userId: session.userInfo.id },
      update: result,
      create: { userId: session.userInfo.id, ...result },
    });
    if (notifications) revalidatePath("/");
    return {
      status: 200,
    };
  } catch (error) {
    console.log(error);
  }
}

export async function contactUs(formData: FormData) {
  try {
    const message = await prisma.contactUs.create({
      data: {
        email: formData.get("email") as string,
        message: formData.get("message") as string,
      },
    });
    if (message) revalidatePath("/");
    return {
      status: 200,
    };
  } catch (error) {
    console.log(error);
  }
}
