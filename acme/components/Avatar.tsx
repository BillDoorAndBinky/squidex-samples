/* eslint-disable @next/next/no-img-element */
import * as React from 'react';

export type AvatarProps = {
  // The url to the the image.
  url: string;

  // The fallback name.
  name?: string;

  // The size in pixels.
  size: number;
};

export const Avatar = (props: AvatarProps) => {
  const {
    name,
    size,
    url
  } = props;

  const finalUrl = `${url}?width=${size}&height=${size}&mode=Crop`;

  return (
    <div className='rounded-full border border-gray-300 bg-white'>
      <img className='rounded-full' src={finalUrl} alt={name} width={size} height={size} />
    </div>
  );
};
