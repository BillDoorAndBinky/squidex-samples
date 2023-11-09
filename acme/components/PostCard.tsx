/* eslint-disable @next/next/no-img-element */
import { Post } from '@/model';
import Link from 'next/link';
import * as React from 'react';
import { AuthorView } from './AuthorView';
import Card from './Card';
import { H3 } from './Typography';
import classNames from 'classnames';

export type PostCardProps = {
  // The post to show.
  post: Post;

  // Indicates whether the card should be stretched to 100% height.
  fullHeight?: boolean;
};

export const PostCard = (props: PostCardProps) => {
  const { fullHeight, post } = props;

  return (
    <Link href={`/blog/${post.slug}`} className={classNames({ 'h-full': fullHeight })}>
      <Card fullHeight={fullHeight}>
        <Card.Header>
          <img className='rounded-t-md' src={`${post.teaserImage}?width=400&height=300`} alt={post.title} />
        </Card.Header>
        <Card.Body>
          <AuthorView author={post.author} date={post.lastModified} />

          <div className='mt-3'>
            <H3>{post.title}</H3>
          </div>

          <div className='text-slate-600'>
            {post.teaserText}
          </div>
        </Card.Body>
      </Card>
    </Link>
  );
};