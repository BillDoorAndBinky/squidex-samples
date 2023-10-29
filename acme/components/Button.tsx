import classNames from 'classnames';
import * as React from 'react';

export type ButtonProps = React.PropsWithChildren<{
  color: 'gray' | 'dark-gray' | 'red';
}> &  React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = (props: ButtonProps) => {
  const { children, className, color, ...other } = props;

  let extraClasses = '';
  switch (color) {
  case 'red':
    extraClasses = 'bg-red-600 text-white hover:bg-red-700';
    break;
  case 'dark-gray':
    extraClasses = 'bg-gray-500 text-white';
    break;
  case 'gray':
    extraClasses = 'bg-gray-300';
    break;
  }

  return (
    <button className={classNames('rounded-md text-sm py-1 px-3', className, extraClasses)} {...other}>
      {children}
    </button>
  );
};