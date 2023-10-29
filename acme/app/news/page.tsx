
import { useSquidexClient } from '@/client';
import { Article, Category } from '@/model';
import { ArticleListItem, ArticleTeaser, Button, H1 } from '@/components';

export default async function Page() {
  const response: any = await useSquidexClient().contents.getGraphQl({
    query: `
      {
        queryNewsContents {
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
          }
        },
        queryNewsCategoryContents {
          id,
          data: flatData {
            slug,
            name
          }
        }
      }
    `
  });

  const categories = (response.data.queryNewsCategoryContents as any[]).map(item => {
    const { data, id } = item;

    return {
      id,
      slug: data.slug,
      name: data.name,
    } as Category;
  });

  const articles = (response.data.queryNewsContents as any[]).map(item => {
    const { data, id, lastModified } = item;
    const newsAuthor = data.author[0];
    const newsCategories = data.categories as any[];

    return {
      id,
      lastModified,
      author: { id: newsAuthor.id, name: newsAuthor.data.name, avatar: newsAuthor.data.avatar[0].url },
      categories: newsCategories.map(c => ({ id: c.id, slug: c.data.slug, name: c.data.name })),
      slug: data.slug,
      teaserImage: data.teaserImage[0].url,
      teaserText: data.teaserText,
      title: data.title,
    } as Article;
  });

  const firstArticle = articles[0];

  return (
    <div className='mt-4'>
      <H1>Blog</H1>

      <div className='flex mt-6'>
        <div className='w-1/2'>
          <Button className='me-2' color='red'>
            All
          </Button>

          {categories.map(c => 
            <Button key={c.id} className='me-2' color='gray'>
              {c.name}
            </Button>
          )}
        </div>
        <div className='w-1/2 text-right'>
          <Button className='ms-2' color='dark-gray'>
            Newst first
          </Button>

          <Button className='ms-2' color='gray'>
            Oldest first
          </Button>
        </div>
      </div>

      <div className='flex mt-6'>
        <div className='pe-10 flex-grow hidden md:block'>
          {firstArticle &&
            <ArticleTeaser article={firstArticle} />
          }
        </div>
        <div className='md:basis-[24rem] shrink-0'>
          <div className='md:hidden'>
            {firstArticle &&
              <ArticleListItem article={firstArticle} />
            }
          </div>

          {articles.filter((_, i) => i > 0).map(article =>
            <div key={article.id}>
              <ArticleListItem article={article} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}