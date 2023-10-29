import * as React from 'react';

export type BaseProps = React.PropsWithChildren;

export const H1 = ({ children }: BaseProps) => {
  return (
    <h1 className='text-2xl font-semibold mb-2 mt-3'>{children}</h1>
  );
};

export const H2 = ({ children }: BaseProps) => {
  return (
    <h2 className='text-xl font-semibold mb-2'>{children}</h2>
  );
};

export const H3 = ({ children }: BaseProps) => {
  return (
    <h3 className='text-lg font-semibold mb-1 mt-1'>{children}</h3>
  );
};

export const H4 = ({ children }: BaseProps) => {
  return (
    <h3 className='text-md font-semibold mb-1 mt-1'>{children}</h3>
  );
};