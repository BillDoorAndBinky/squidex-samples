/* eslint-disable @next/next/no-img-element */
import { Article } from '@/model';
import * as React from 'react';
import { AuthorView } from './AuthorView';
import { Badge } from './Badge';
import { H2, H3 } from './Typography';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';

export type ArticleTeaserProps = {
  // The article to render.
  article: Article;

  // True if the category should not be hidden.
  hideCategory?: boolean;

  // True to show the teaser text only.
  teaserText?: boolean;

  // The header level.
  header?: 'h2' | 'h3';
};

export const ArticleTeaser = (props: ArticleTeaserProps) => {
  const {
    article,
    header,
    hideCategory,
    teaserText
  } = props;

  const text = teaserText ? article.teaserText || article.text : article.text;

  return (
    <Link href={`/news/${article.slug}`}>
      <div className='mb-4 relative'>
        <img className='rounded-lg' src={`${article.teaserImage}?width=1000&height=600`} alt={article.title} />

        {!hideCategory &&
          <div className='absolute top-5 left-5'>
            {article.categories.map(c => 
              <Badge key={c.id} size='sm'>{c.name}</Badge>
            )}
          </div>
        }
      </div>
      
      <AuthorView author={article.author} date={article.lastModified} />

      <div className='mt-3'>
        {header === 'h3' ? (
          <H3>{article.title}</H3>
        ) : (
          <H2>{article.title}</H2>
        )}
      </div>

      <div className='text-slate-600'>
        <ReactMarkdown>{text}</ReactMarkdown>
      </div>
    </Link>
  );
};