/* eslint-disable @next/next/no-img-element */
import { Author } from '@/model';
import { format } from 'date-fns';
import * as React from 'react';
import { Avatar } from './Avatar';

export type AuthorViewprops = {
  author: Author;

  date?: string;
};

export const AuthorView = (props: AuthorViewprops) => {
  const { author, date } = props;

  return (
    <div className='flex items-center'>
      <Avatar url={author.avatar} size={40} />

      <div className='ms-2 text-sm'>
        {date &&
          <div className='text-slate-600'>
            {format(Date.parse(date), 'PPP')}
          </div>
        }
        <div className='font-semibold'>
          {author.name}
        </div>
      </div>
    </div>
  );
};
