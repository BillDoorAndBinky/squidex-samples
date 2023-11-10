/* eslint-disable @next/next/no-img-element */
import { AuthorView, H1 } from '@/components';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/Badge';
import { ARTICLE_FIELDS, parseArticleFromGraphQL } from '@/model';
import { getSquidexClient } from '@/squidex/client';
import Markdown from 'react-markdown';

export default async function Page({ params }: { params: { slug: string }}) {
  const response = await getSquidexClient().contents.getGraphQl({
    query: `{
      queryNewsContents(filter: "data/slug/iv eq '${decodeURIComponent(params.slug)}'") {
        ${ARTICLE_FIELDS}
      },
    }`
  }) as any;

  const articles =
    (response.data.queryNewsContents as any[])
      .map(parseArticleFromGraphQL);

  if (articles.length === 0) {
    return notFound();
  }

  const article = articles[0];

  return (
    <div className='pt-6 pb-6'>
      <div className='mb-4 relative'>
        <img className='rounded-lg' src={`${article.teaserImage}?width=1000&height=600`} alt={article.title} />

        <div className='absolute top-5 left-5'>
          {article.categories.map(c =>
            <Badge key={c.id} size='sm'>{c.name}</Badge>
          )}
        </div>
      </div>

      <AuthorView author={article.author} date={article.lastModified} />

      <div className='mt-4 mb-4'>
        <H1>{article.title}</H1>
      </div>

      <div className='text-slate-600'>
        <Markdown>{article.text}</Markdown>
      </div>
    </div>
  );
}