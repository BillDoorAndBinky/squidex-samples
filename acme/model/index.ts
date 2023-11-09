export interface Post {
  id: string;
  author?: Author | null;
  categories: Category[];
  slug: string;
  teaserImage: string;
  teaserText: string;
  text?: string;
  title: string;
  lastModified: string;
}

export const POST_FIELDS = `
  id
  lastModified,
  data: flatData {
    text,
    title,
    teaserText,
    teaserImage {
      url
    },
    slug,
    author {
      id,
      data: flatData {
        name,
        avatar {
          url
        }
      }
    },
    categories {
      id,
      data: flatData {
        slug,
        name
      }
    }
  }
`;

export function parsePostFromGraphQL(source: any): Post {
  const { data, id, lastModified } = source;
  const nestedAuthor = data.author[0];
  const nestedCategories = data.categories as any[] || [];

  return {
    id,
    author: nestedAuthor ? parseAuthorFromGraphQL(nestedAuthor) : null,
    categories: nestedCategories.map(parseCategoryFromGraphQL),
    slug: data.slug,
    teaserImage: data.teaserImage[0].url,
    teaserText: data.teaserText,
    text: data.text,
    title: data.title,
    lastModified,
  } as Post;
}

export interface Article {
  id: string;
  author?: Author | null;
  categories: Category[];
  slug: string;
  teaserImage: string;
  teaserText: string;
  text?: string;
  title: string;
  lastModified: string;
}

export const ARTICLE_FIELDS = `
  lastModified
  data: flatData {
    text
    title
    teaserText
    teaserImage {
      url
    }
    slug
    author {
      id
      data: flatData {
        name
        avatar {
          url
        }
      }
    },
    categories {
      id,
      data: flatData {
        slug,
        name
      }
    }
  }`;

export function parseArticleFromGraphQL(source: any): Article {
  const { data, id, lastModified } = source;
  const nestedAuthor = data.author[0];
  const nestedCategories = data.categories as any[] || [];

  return {
    id,
    author: nestedAuthor ? parseAuthorFromGraphQL(nestedAuthor) : null,
    categories: nestedCategories.map(parseCategoryFromGraphQL),
    slug: data.slug,
    teaserImage: data.teaserImage[0].url,
    teaserText: data.teaserText,
    text: data.text,
    title: data.title,
    lastModified,
  };
}

export interface Author {
  id: string;
  name: string;
  avatar: string;
}

export function parseAuthorFromGraphQL(source: any): Author {
  const { id, data } = source;

  return { id, name: data.name, avatar: data.avatar[0]?.url };
}

export interface Category {
  id: string;
  slug: string;
  name: string;
}

export const CATEGORY_FIELDS = `
  id,
  data: flatData {
    slug,
    name
  }`;

export function parseCategoryFromGraphQL(source: any): Category {
  const { id, data } = source;

  return { id, name: data.name, slug: data.slug };
}