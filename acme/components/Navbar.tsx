import * as React from 'react';
import Image from 'next/image';

export const Navbar = () => {
  return (
    <nav className='fixed top-0 left-0 right-0 bg-white p-4'>
      <div className='container px-4 mx-auto'>
        <Image src='/logo.webp' alt='ACME Corporation Logo' width={100} height={30} priority />
      </div>
    </nav>
  );
};