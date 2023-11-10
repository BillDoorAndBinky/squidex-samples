/* eslint-disable @next/next/no-img-element */
import { AuthorView, H1, Markdown } from '@/components';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/Badge';
import { POST_FIELDS, parseArticleFromGraphQL, parsePostFromGraphQL } from '@/model';
import { getSquidexClient } from '@/squidex/client';

export default async function Page({ params }: { params: { slug: string }}) {
  const response = await getSquidexClient().contents.getGraphQl({
    query: `{
      queryPostsContents(filter: "data/slug/iv eq '${decodeURIComponent(params.slug)}'") {
        ${POST_FIELDS}
      },
    }`
  }) as any;

  const posts =
    (response.data.queryPostsContents as any[])
      .map(parsePostFromGraphQL);

  if (posts.length === 0) {
    return notFound();
  }

  const post = posts[0];

  return (
    <div className='pt-6 pb-6'>
      <div className='mb-4'>
        <img className='rounded-lg' src={`${post.teaserImage}?width=1000&height=600`} alt={post.title} />

        <div className='absolute top-5 left-5'>
          {post.categories.map(c =>
            <Badge key={c.id} size='sm'>{c.name}</Badge>
          )}
        </div>
      </div>

      <AuthorView author={post.author} date={post.lastModified} />

      <div className='mt-4 mb-4'>
        <H1>{post.title}</H1>
      </div>

      <div className='text-slate-600'>
        <Markdown>{post.text}</Markdown>
      </div>
    </div>
  );
}