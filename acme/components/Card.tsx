import * as React from 'react';

export type CardProps = React.PropsWithChildren;

const Card = ({ children }: CardProps) => {
  return (
    <div className='bg-white shadow-lg shadow-gray-200 rounded-md'>
      {children}
    </div>
  );
};

const CardHeader = ({ children }: CardProps) => {
  return (
    <div>
      {children}
    </div>
  );
};

const CardBody = ({ children }: CardProps) => {
  return (
    <div className='p-6'>
      {children}
    </div>
  );
};

Card.Body = CardBody;
Card.Header = CardHeader;

export default Card;