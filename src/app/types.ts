import { string } from "zod";
export interface Session {
  userInfo: { id: string; username: string; email: string; avatar: string };
}
export interface User {
  id: string;
  username?: string | null;
  email: string;
  password?: string;
  avatar?: string | null;
  bio?: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count?: subscribe;
}

export interface Blog {
  id: string;
  ownerId?: string;
  content?: any;
  title: string;
  headline?: string | null;
  slug?: string | null;
  description?: string | null;
  coverUrl?: string | null;
  publishAt?: Date | null;
  status?: string;
  images: Images[];
  createdAt?: Date;
  updatedAt?: Date;
  owner?: User;
  series?: { id: string; title: string } | null;
  tags?: { tag: string }[];
  comments?: { owner: User; comment: string; id: string }[];
  _count?: countForBlog;
  blocks?: any;
}

export interface Images {
  imageUrl: string;
  ownerId?: string;
}

interface subscribe {
  subscriptionsAsPublisher?: number;
  susubscriptionsAsReader?: number;
}

interface countForBlog {
  likes?: number;
  comments?: number;
}

export interface Notifications {
  publisherEmails?: boolean;
  socialEmails?: boolean;
  marketingEmails?: boolean;
  securityEmails: boolean;
}
