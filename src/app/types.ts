import { OutputData } from "@editorjs/editorjs";
export interface Session {
  userInfo: { id: string; username: string; email: string; avatar: string };
}
export interface User {
  id: string;
  username?: string | null;
  email: string;
  password?: string;
  avatar?: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count?: subscribe;
}

export interface Blog {
  id: string;
  ownerId?: string;
  content?: any;
  title: string;
  status?: string;
  images: Images[];
  createdAt?: Date;
  updatedAt?: Date;
  owner?: User;
  tags?: { tag: string }[];
  comments?: { owner: User; comment: string; id: string }[];
  _count?: countForBlog;
  blocks?: OutputData;
}

interface Images {
  imageUrl: string;
}

interface subscribe {
  subscriptionsAsPublisher?: number;
  susubscriptionsAsReader?: number;
}

interface countForBlog {
  likes?: number;
  comments?: number;
}

export interface EditorProps {
  data?: OutputData;
  onChange(val: OutputData): void;
  holder: string;
  setTitle(val: string): void;
  error: [];
}
