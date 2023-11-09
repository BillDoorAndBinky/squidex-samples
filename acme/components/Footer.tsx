import Link from 'next/link';
import Image from 'next/image';

export const Footer = () => {
  return (
    <div className='border-t border-gray-300 mt-6'>
      <div className='container mx-auto text-slate-600'>
        <div className='md:flex pt-8 pb-8'>
          <div className='md:w-1/3'>
            <Image src='/logo.svg' alt='PawJoy' width={150} height={50} priority />
          </div>

          <div className='md:w-1/3 pt-6'>
            <h3 className='font-semibold uppercase mb-4'>Quick Links</h3>

            <Link className='hover:text-red-600 block mb-4' href='news'>
              News
            </Link>

            <Link className='hover:text-red-600 block mb-4' href='blog'>
              Blog
            </Link>
          </div>
          <div className='md:w-1/3 pt-6'>
            <h3 className='font-semibold uppercase mb-4'>About Squidex</h3>
            
            <a target='_blank' className='hover:text-red-600 block mb-4' href='https://squidex.io'>
              Website
            </a>
            
            <a target='_blank' className='hover:text-red-600 block mb-4' href='https://cloud.squidex.io'>
              Cloud
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};