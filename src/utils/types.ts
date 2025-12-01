export type User = {
  id?: number;
  username: string;
  email: string;
  password?: string;
};

export type CreateBookmarkDto = {
  body: string;
  description: string;
  url: string;
};

export type Bookmark = {
  id: number;
  body: string;
  description: string;
  url: string;
  icon_url?: string;
  short_url?: string;
  visit?: number;
  created_at?: string;
  updated_at?: string;
};
