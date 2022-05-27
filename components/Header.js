import { supabase } from '../client';
import Image from 'next/image';
import Link from 'next/link';
import SignIn from './SignIn';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Header() {
  const [user, setUser] = useState(null);

  const router = useRouter();

  useEffect(() => {
    // Stores the userData to the user state immediately when the user signs in or out.
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        handleAuthChange(event, session);
        if (event === 'SIGNED_IN') {
          setUser(session.user);
          if (Object.keys(session.user.user_metadata).length === 0) {
            router.push('/profile');
          }
        }
        if (event === 'SIGNED_OUT') {
          setUser(null);
          router.push('/');
        }
      }
    );

    // Fetches the user data on the initial page render. Important in order to access the user data at all times.
    fetchProfile();

    return () => {
      authListener.unsubscribe();
    };
  }, []);

  // Function to show the Sign in modal when the "Sign in" button is clicked
  function showModal() {
    const modal = document.getElementById('modal-cont');
    modal.classList.remove('invisible');
    modal.classList.add('flex');
    document.getElementById('sign-in-cont').classList.remove('opacity-50');
    document.getElementById('sign-in-cont').classList.add('opacity-100');
  }

  async function fetchProfile() {
    const userData = supabase.auth.user();
    if (userData) {
      setUser(userData);
      if (!userData.user_metadata.category) {
        router.push('/profile');
      }
    }
    console.log(userData);
  }

  async function signOut() {
    await supabase.auth.signOut();
    // Replace with a toast
    console.log('You have been signed out');
  }

  async function handleAuthChange(event, session) {
    // Sets and removes the Supabase cookie
    await fetch('/api/auth', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      credentials: 'same-origin',
      body: JSON.stringify({ event, session }),
    });
  }

  return (
    <div className='shadow-md py-4 px-8 sticky top-0 bg-white flex items-center justify-between z-50'>
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
        {/* We want to show the 'List a visit' option when the user registers as
        a company. If they register as a student then we want to show the
        'Explore' option. */}
        {/* <Link href='/create'>
          <a>
            <h2 className='font-medium text-gray-600'>List a visit</h2>
          </a>
        </Link> */}
        {!user && (
          <button
            onClick={showModal}
            className='bg-blue-500 hover:bg-gray-600 text-white rounded-md p-2 px-4 font-medium transition transform duration-200 hover:shadow-md hover:shadow-blue-200'
          >
            Sign in
          </button>
        )}
        {user && (
          <button
            onClick={signOut}
            className='hover:bg-gray-600 hover:text-white text-gray-600  rounded-md p-2 px-4 font-medium transition transform duration-200 hover:shadow-md hover:shadow-blue-200'
          >
            Sign out
          </button>
        )}
      </div>

      {/* Sign In Modal */}
      <SignIn />
    </div>
  );
}
