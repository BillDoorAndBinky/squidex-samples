/* eslint-disable @next/next/no-img-element */
import { Article } from '@/model';
import Link from 'next/link';
import * as React from 'react';
import { AuthorView } from './AuthorView';
import { Badge } from './Badge';
import { H4 } from './Typography';

export type ArticleListItemProps = {
  article: Article;
};

export const ArticleListItem = (props: ArticleListItemProps) => {
  const { article } = props;

  return (
    <Link href={article.slug} key={article.slug}>
      <div className='flex mb-6'>
        <div className='w-2/5 pe-4'>
          <img className='rounded-lg' src={`${article.teaserImage}?width=400&height=300`} alt={article.title} />
        </div>
        <div className='w-3/5'>
          <AuthorView author={article.author} date={article.lastModified} />

          <div className='mt-2'>
            <div>
              {article.categories.map(c => 
                <Badge key={c.id}>{c.name}</Badge>
              )}
            </div>

            <H4>{article.title}</H4>
          </div>
        </div>
      </div>
    </Link>
  );
};