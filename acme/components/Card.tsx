import classNames from 'classnames';
import * as React from 'react';

export type CardProps = React.PropsWithChildren<{
  // Indicates whether the card should be stretched to 100% height.
  fullHeight?: boolean;
}>;

export type CardBaseProps = React.PropsWithChildren;

const Card = ({ children, fullHeight }: CardProps) => {
  return (
    <div className={classNames('bg-white shadow-lg shadow-gray-200 rounded-md', { 'h-full': fullHeight })}>
      {children}
    </div>
  );
};

const CardHeader = ({ children }: CardBaseProps) => {
  return (
    <div>
      {children}
    </div>
  );
};

const CardBody = ({ children }: CardBaseProps) => {
  return (
    <div className='p-6'>
      {children}
    </div>
  );
};

Card.Body = CardBody;
Card.Header = CardHeader;

export default Card;