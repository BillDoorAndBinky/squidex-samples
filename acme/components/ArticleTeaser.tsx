/* eslint-disable @next/next/no-img-element */
import { Article } from '@/model';
import * as React from 'react';
import { AuthorView } from './AuthorView';
import { Badge } from './Badge';
import { H2 } from './Typography';

export type ArticleTeaserProps = {
  article: Article;
};

export const ArticleTeaser = (props: ArticleTeaserProps) => {
  const { article } = props;

  return (
    <div>
      <div className='mb-4 relative'>
        <img className='rounded-lg' src={`${article.teaserImage}?width=1000&height=600`} alt={article.title} />

        <div className='absolute top-5 left-5'>
          {article.categories.map(c => 
            <Badge key={c.id} size='sm'>{c.name}</Badge>
          )}
        </div>
      </div>
      
      <AuthorView author={article.author} date={article.lastModified} />

      <div className='mt-3'>
        <H2>{article.title}</H2>
      </div>

      <div className='text-slate-600'>
        {article.teaserText}
      </div>
    </div>
  );
};