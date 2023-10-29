/* eslint-disable @next/next/no-img-element */
import { Post } from '@/model';
import Link from 'next/link';
import * as React from 'react';
import { AuthorView } from './AuthorView';
import Card from './Card';
import { H3 } from './Typography';

export type PostCardProps = {
  post: Post;
};

export const PostCard = (props: PostCardProps) => {
  const { post } = props;

  return (
    <Link href={post.slug} key={post.slug}>
      <Card>
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