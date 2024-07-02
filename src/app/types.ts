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
  ownerId: string;
  content: any;
  title: string;
  status: string;
  images?: Images[] | null;
  createdAt: Date;
  updatedAt?: Date;
  owner?: User;
  tags?: { tag: string }[];
  _count?: countForBlog;
}

interface Images {
  imageUrl?: string;
}

interface subscribe {
  subscriptionsAsPublisher?: number;
  susubscriptionsAsReader?: number;
}

interface countForBlog {
  likes?: number;
  comments?: number;
}
