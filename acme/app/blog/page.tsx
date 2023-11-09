'use client';

import { useSquidexContentsByGraphQL } from '@/squidex/client-hooks';
import { CATEGORY_FIELDS, POST_FIELDS, parseCategoryFromGraphQL, parsePostFromGraphQL } from '@/model';
import { PostCard, H1, Button } from '@/components';
import { useSearchParams } from 'next/navigation';
import { useSearchBuilder } from '@/components/hooks';
import { useMemo } from 'react';

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
            referencingPostsContents${query} {
              ${POST_FIELDS}
            }
          },
          queryNewsCategoryContents {
            ${CATEGORY_FIELDS}
          }
        }` 
      : `{
          queryPostsContents${query} {
            ${POST_FIELDS}
          },
          queryNewsCategoryContents {
            ${CATEGORY_FIELDS}
          }
        }`, {
      transform: response => {
        const postsSource: any[] =
          searchCategory !== 'all'
            ? response.data.category[0]?.referencingPostsContents || []
            : response.data.queryPostsContents;

        const categories =
          (response.data.queryNewsCategoryContents as any[])
            .map(parseCategoryFromGraphQL);
            
        const posts =
          postsSource
            .map(parsePostFromGraphQL);

        return { categories, posts };
      }
    }
  );

  return (
    <div className='mt-4 mb-6'>
      <H1>Blog</H1>

      {isLoading ? (
        <div>Loading Posts</div>
      ) : error ? (
        <div>Failed to load Posts</div>
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

          {result.posts.length === 0 &&
            <div className='bg-white shadow-lg shadow-gray-200 rounded-md p-4'>
              No matching post found.
            </div>
          }

          <div className='grid gap-x-4 gap-y-4 md:grid-cols-3 lg:grid-cols-4 items-stretch'>
            {result.posts.map(post =>
              <PostCard key={post.id} fullHeight={true} post={post} />
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}