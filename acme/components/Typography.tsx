import classNames from 'classnames';
import Link, { LinkProps } from 'next/link';
import * as React from 'react';

export type BaseProps = React.PropsWithChildren & { className?: string };

export const H1 = ({ className, children }: BaseProps) => {
  return (
    <h1 className={classNames('text-2xl font-semibold mb-2 mt-3', className)}>
      {children}
    </h1>
  );
};

export const H2 = ({ className, children }: BaseProps) => {
  return (
    <h2 className={classNames('text-xl font-semibold mb-2', className)}>
      {children}
    </h2>
  );
};

export const H3 = ({ className, children }: BaseProps) => {
  return (
    <h3 className={classNames('text-lg font-semibold mb-1 mt-1', className)}>
      {children}
    </h3>
  );
};

export const H4 = ({ className, children }: BaseProps) => {
  return (
    <h3 className={classNames('text-md font-semibold mb-1 mt-1', className)}>
      {children}
    </h3>
  );
};

type InternalLinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & LinkProps & React.PropsWithChildren;

export const RedLink = (props: InternalLinkProps) => {
  const { className, ...other } = props;

  return (
    <Link {...other} className={classNames('text-red-600 hover:text-red-800 font-semibold underline underline-offset-2', className)}>
      {other.children}
    </Link>
  );
};