export interface Post {
  author: Author;
  id: string;
  lastModified: string;
  slug: string;
  teaserImage: string;
  teaserText: string;
  text?: string;
  title: string;
}

export interface Article {
  author: Author;
  categories: Category[];
  lastModified: string;
  id: string;
  slug: string;
  teaserImage: string;
  teaserText: string;
  text?: string;
  title: string;
}

export interface Author {
  id: string;
  name: string;
  avatar: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
}
