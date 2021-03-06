import Image from 'next/image';
import { useRouter } from 'next/router';

export default function LargeCard({ heading, sub, image, alt, isCompany }) {
  const router = useRouter();

  function clickSignIn() {
    const signInButton = document.getElementById('sign-in-btn');
    if (signInButton === null) router.push('/create');
    else signInButton.click();
  }

  function handleClick() {
    if (isCompany) clickSignIn();
    else router.push('/explore');
  }

  return (
    <div
      id='main'
      onClick={handleClick}
      className='flex justify-center active:scale-95 transition transform duration-75 cursor-pointer'
    >
      <div className='relative w-[30rem] h-[30rem]'>
        <Image
          src={image}
          alt={alt}
          objectFit='cover'
          layout='fill'
          className='rounded-md brightness-50 hover:opacity-95 transition transform duration-100'
        />
        <h1 className='absolute top-5 left-10 text-white text-5xl font-semibold '>
          <span className='text-blue-500 font-bold text-xl uppercase'>
            {sub}
          </span>
          <br />
          {heading}
        </h1>
      </div>
      <style jsx>{`
        #main {
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>
    </div>
  );
}
