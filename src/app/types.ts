export interface User {
  id: string;
  username?: string | null;
  email: string;
  password: string;
  avatar?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Blog {
  id: string;
  ownerId: string;
  content: any;
  title: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
