import classNames from 'classnames';
import Link from 'next/link';

export type ButtonProps = ButtonElementProps | ButtonAnchorProps;

type ButtonBaseProps = {
  // The color of the button.
  color: 'gray' | 'dark-gray' | 'red';
};

type ButtonElementProps = React.PropsWithChildren & ButtonBaseProps & React.ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: undefined;
};

type ButtonAnchorProps = React.PropsWithChildren & ButtonBaseProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

export const Button = (props: ButtonProps) => {
  let extraClasses = '';
  switch (props.color) {
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

  if ('href' in props) {
    const { children, className, color, ...other } = props as ButtonAnchorProps;

    return (
      <Link className={classNames('rounded-md whitespace-nowrap text-sm py-1 px-3', className, extraClasses)} {...other}>
        {children}
      </Link>
    );
  } else {
    const { children, className, color, ...other } = props;

    return (
      <button className={classNames('rounded-md whitespace-nowrap text-sm py-1 px-3', className, extraClasses)} {...other}>
        {children}
      </button>
    );
  }
};