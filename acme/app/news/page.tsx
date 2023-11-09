'use client';

import { useSquidexContentsByGraphQL } from '@/squidex/client-hooks';
import { ARTICLE_FIELDS, CATEGORY_FIELDS, parseArticleFromGraphQL, parseCategoryFromGraphQL } from '@/model';
import { useSearchParams } from 'next/navigation';
import { ArticleListItem, ArticleTeaser, Button, H1 } from '@/components';
import { useMemo } from 'react';
import { useSearchBuilder } from '@/components/hooks';

type Sorting = 
  'date_asc' |
  'date_desc';

export default function Page() {
  const searchParams = useSearchParams();
  const searchBuilder = useSearchBuilder();
  const searchOrder = searchParams.get('order') as Sorting ?? 'date_desc';
  const searchCategory = searchParams.get('category') ?? 'all';

  const query = useMemo(() => {
    const queries = [];
  
    if (searchOrder === 'date_asc') {
      queries.push("orderby: 'lastModified asc'");
    }
  
    return queries.length > 0 ? `(${queries.join(', ')})` : '';
  }, [searchOrder]);

  const { isLoading, error, result } = useSquidexContentsByGraphQL(
    searchCategory !== 'all'
      ? `{
          category: queryNewsCategoryContents(filter: "data/slug/iv eq '${searchCategory}'") {
            referencingNewsContents${query} {
              ${ARTICLE_FIELDS}
            }
          },
          queryNewsCategoryContents {
            ${CATEGORY_FIELDS}
          }
        }`
      : `{
          queryNewsContents${query} {
            ${ARTICLE_FIELDS}
          },
          queryNewsCategoryContents {
            ${CATEGORY_FIELDS}
          }
        }`, {
      transform: response => {
        const articlesSource: any[] =
          searchCategory !== 'all'
            ? response.data.category[0]?.referencingNewsContents || []
            : response.data.queryNewsContents;
          
        const categories =
          (response.data.queryNewsCategoryContents as any[])
            .map(parseCategoryFromGraphQL);
        
        const articles =
          articlesSource
            .map(parseArticleFromGraphQL);

        return { articles, categories };
      }
    }
  );

  return (
    <div className='mt-6 mb-6'>
      <H1>Blog</H1>

      {isLoading ? (
        <div>Loading News</div>
      ) : error ? (
        <div>Failed to load News</div>
      ) : result ? (
        <>
          <div className='flex mt-6 mb-4'>
            <div className='w-1/2'>
              <Button href={searchBuilder({ category: null })} className='me-2' color={searchCategory === 'all' ? 'red' : 'gray'}>
                All
              </Button>

              {result.categories.map(c => 
                <Button key={c.id} href={searchBuilder({ category: c.slug })} className='me-2' color={searchCategory === c.slug ? 'red' : 'gray'}>
                  {c.name}
                </Button>
              )}
            </div>
            <div className='w-1/2 text-right'>
              <Button href={searchBuilder({ order: null })} className='ms-2' color={searchOrder === 'date_desc' ? 'red' : 'gray'}>
                Newst first
              </Button>

              <Button href={searchBuilder({ order: 'date_asc' })} className='ms-2' color={searchOrder === 'date_asc' ? 'red' : 'gray'}>
                Oldest first
              </Button>
            </div>
          </div>

          {result.articles.length === 0 &&
            <div className='bg-white shadow-lg shadow-gray-200 rounded-md p-4'>
              No matching article found.
            </div>
          }

          <div className='md:flex mt-6'>
            <div className='pe-10 flex-grow hidden md:block'>
              {result.articles[0] &&
                <ArticleTeaser article={result.articles[0]} />
              }
            </div>
            <div className='md:basis-[24rem] shrink-0'>
              <div className='md:hidden pb-4'>
                {result.articles[0] &&
                  <ArticleListItem article={result.articles[0]} />
                }
              </div>

              {result.articles.filter((_, i) => i > 0).map(article =>
                <div key={article.id} className='pt-4 pb-4'>
                  <ArticleListItem article={article} />
                </div>
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}