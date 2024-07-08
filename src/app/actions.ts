"use server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { User } from "./types";
import { Option } from "@/components/ui/multiple-selector";
import { revalidatePath } from "next/cache";
const secretKey = "secret";
const key = new TextEncoder().encode(secretKey);

export default async function signUp(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const hashpassword = bcrypt.hashSync(password, 10);
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

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1 hour from now")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
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
  if (!(await bcrypt.compare(password, getUser.password!))) {
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
  const expires = new Date(Date.now() + 3600 * 1000);
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

export async function getSession() {
  const session = cookies().get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 3600 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: "session",
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}

export async function userInfo(result: {
  username: string | null;
  avatarUrl: string | null;
}) {
  const currentSession = await getSession();
  const username = result.username ?? currentSession.userInfo.username;
  const avatarUrl = (result.avatarUrl as string) ?? currentSession.avatarUrl;
  const updateuserInfo = await prisma.user.update({
    where: { id: currentSession.userInfo.id },
    data: {
      username,
      avatar: avatarUrl,
    },
  });
  const userInfo = {
    id: updateuserInfo.id,
    email: updateuserInfo.email,
    username: updateuserInfo.username,
    avatar: updateuserInfo.avatar,
  };
  // Create the session
  const expires = new Date(Date.now() + 3600 * 1000);
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
    const deleteBlog = await prisma.$transaction([
      prisma.tag.deleteMany({ where: { blogId } }),
      prisma.comment.deleteMany({ where: { blogId } }),
      prisma.like.deleteMany({ where: { blogId } }),
      prisma.image.deleteMany({ where: { blogId } }),
      prisma.blog.delete({ where: { id: blogId } }),
    ]);
    if (deleteBlog) revalidatePath("/manage-blog");
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
    const isLiked = await prisma.like.findFirst({
      where: { blogId, ownerId: session.userInfo.id },
    });
    if (!isLiked) {
      await prisma.like.create({
        data: { blogId, ownerId: session.userInfo.id },
      });
    } else
      await prisma.like.delete({
        where: { id: isLiked.id },
      });
    revalidatePath("/");
    return {
      status: 200,
    };
  } catch (error) {
    console.log(error);
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
    revalidatePath("/");
    return {
      status: 200,
    };
  } catch (error) {
    console.log(error);
  }
}
