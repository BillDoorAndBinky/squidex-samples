/* eslint-disable @next/next/no-img-element */
import { Article } from '@/model';
import Link from 'next/link';
import * as React from 'react';
import { AuthorView } from './AuthorView';
import Card from './Card';
import { H3 } from './Typography';

export type ArticleCardProps = {
  article: Article;
};

export const ArticleCard = (props: ArticleCardProps) => {
  const { article } = props;

  return (
    <Link href={article.slug} key={article.slug}>
      <Card>
        <Card.Header>
          <img className='rounded-t-md' src={`${article.teaserImage}?width=400&height=300`} alt={article.title} />
        </Card.Header>
        <Card.Body>
          <AuthorView author={article.author} date={article.lastModified} />

          <div className='mt-3'>
            <H3>{article.title}</H3>
          </div>

          <div className='text-slate-600'>
            {article.teaserText}
          </div>
        </Card.Body>
      </Card>
    </Link>
  );
};