import * as React from 'react';

export type BadgeProps = React.PropsWithChildren<{
  size?: 'xs' | 'sm';
}>;

export const Badge = (props: BadgeProps) => {
  const { children, size } = props;

  return (size === 'sm' ? 
    <div className='bg-red-600 px-3 py-1 text-sm text-white me-1 rounded-lg inline-block'>
      {children}
    </div> 
    :
    <div className='bg-red-600 px-2 text-xs text-white me-1 rounded-lg inline-block'>
      {children}
    </div>
  );
};