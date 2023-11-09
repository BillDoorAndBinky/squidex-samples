import { getSquidexClient } from '@/squidex/client';
import { ARTICLE_FIELDS, POST_FIELDS, parseArticleFromGraphQL, parsePostFromGraphQL } from '@/model';
import { ArticleTeaser, H2, PostCard, RedLink } from '@/components';

export default async function Home() {
  const response = await getSquidexClient().contents.getGraphQl({
    query: `{
      queryNewsContents(top: 3) {
        ${ARTICLE_FIELDS}
      },
      queryPostsContents(top: 4) {
        ${POST_FIELDS}
      },
    }`
  }) as any;

  const posts =
    (response.data.queryPostsContents as any[])
      .map(parsePostFromGraphQL);

  const articles =
    (response.data.queryNewsContents as any[])
      .map(parseArticleFromGraphQL);

  return (
    <>
      <div className='pt-6 pb-6'>
        <div className='mb-2 flex justify-between align-items-center'>
          <H2>Blog</H2>
          
          <RedLink className='px-3 py-2 text-sm' href='/blog'>
            View More
          </RedLink>
        </div>

        <div className='grid gap-x-4 gap-y-4 md:grid-cols-2 lg:grid-cols-4 grid-cols-1 items-stretch'>
          {posts.map(x =>
            <PostCard key={x.id} fullHeight post={x} />
          )}
        </div>
      </div>

      <div className='pt-6 pb-6'>
        <div className='mb-2 flex justify-between align-items-center'>
          <H2>News</H2>
          
          <RedLink className='px-3 py-2 text-sm' href='/news'>
            View More
          </RedLink>
        </div>

        <div className='grid gap-x-6 gap-y-4 lg:grid-cols-3 grid-cols-1 items-stretch'>
          {articles.map(x =>
            <ArticleTeaser key={x.id} header='h3' hideCategory article={x} />
          )}
        </div>
      </div>
    </>
  );
}
