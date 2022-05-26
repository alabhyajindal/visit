import Image from 'next/image';
import Link from 'next/link';
import SignIn from './SignIn';

export default function Header() {
  // Function to show the Sign in modal when the "Sign in" button is clicked
  function showModal() {
    document.getElementById('modal-cont').classList.remove('hidden');
  }

  return (
    <div className='shadow-md py-4 px-8 sticky flex items-center justify-between'>
      {/* Sign In Modal */}
      <SignIn className='' />
      {/* Left */}
      <Link href='/'>
        <a>
          <Image
            src='/logo.png'
            objectPosition='left'
            alt='Visit Logo'
            height={50}
            width={100}
            className='cursor-pointer'
          />
        </a>
      </Link>

      {/* Right */}
      <div className='flex gap-4 text-sm items-center'>
        <Link href='/create'>
          <a>
            <h2 className='font-medium text-gray-600'>List a visit</h2>
          </a>
        </Link>

        <button
          onClick={showModal}
          className='bg-purple-500 hover:bg-gray-600 text-white rounded-md p-2 px-4 font-medium transition transform duration-200'
        >
          Sign in
        </button>
      </div>
    </div>
  );
}
