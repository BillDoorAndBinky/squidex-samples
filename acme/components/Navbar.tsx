import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export const Navbar = () => {
  return (
    <nav className='fixed top-0 left-0 right-0 bg-white p-4'>
      <div className='container px-4 mx-auto'>
        <div className='flex justify-between'>
          <Link href='/'>
            <Image src='/logo.svg' alt='PawJoy' width={100} height={30} priority />
          </Link>
          
          <div className='flex text-center text-slate-600'>
            <Link className='hover:text-red-600 px-3 py-2' href='/news'>
              News
            </Link>

            <Link className='hover:text-red-600 px-3 py-2' href='/blog'>
              Blog
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};