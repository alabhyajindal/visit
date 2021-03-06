import { supabase } from '../client';
import { nanoid } from 'nanoid';
import { useState } from 'react';
import { useRouter } from 'next/router';
import toast, { Toaster } from 'react-hot-toast';

export default function ListingForm() {
  const [info, setInfo] = useState({
    id: nanoid(),
    createdAt: new Date(),
    updatedAt: new Date(),
    title: '',
    description: '',
    location: '',
    duration: '',
    maxGuests: '',
    price: '',
    image: '',
  });

  const router = useRouter();

  function updateFormData(e) {
    setInfo((prevInfo) => {
      return {
        ...prevInfo,
        [e.target.id]: e.target.value,
      };
    });
  }

  function validateForm() {
    let correctKeyCount = 0;

    for (let property in info) {
      info[property] !== '' && correctKeyCount++;
    }

    if (correctKeyCount === 9) return true;
  }

  async function submitForm() {
    if (
      validateForm() &&
      document.getElementById('imageInput').files.length !== 0
    ) {
      let toastId;
      const visitImage = document.getElementById('imageInput').files[0];
      const imageTitle = nanoid();

      // visitImage.type returns 'image/jpeg' or 'image/png'. Statement below removes the 'image/' and returns the file extension
      const imageExtension = `.${visitImage.type.slice(6)}`;

      try {
        toastId = toast.loading('Uploading...');
        await supabase.storage
          .from('visitimages')
          .upload(`${imageTitle}${imageExtension}`, visitImage);

        const { data, error } = await supabase.from('Visit').insert([
          {
            ...info,
            image: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/visitimages/${imageTitle}${imageExtension}`,
          },
        ]);

        if (error) {
          throw new Error(error);
        } else {
          toast.dismiss(toastId);
          toast.success('Uploaded');
          router.push('/');
        }
      } catch (e) {
        toast.dismiss(toastId);
        toast.error('Something went wrong');
      }

      setInfo({
        id: nanoid(),
        createdAt: new Date(),
        updatedAt: new Date(),
        title: '',
        description: '',
        location: '',
        duration: '',
        maxGuests: '',
        price: '',
        image: '',
      });
    } else {
      toast.error('Please complete the form to submit');
    }
  }

  return (
    <div className='my-4'>
      <div className='max-w-md md:max-w-lg flex flex-col gap-4'>
        <label className='text-gray-700'>
          Title
          <input
            value={info.title}
            type='text'
            id='title'
            onChange={(e) => updateFormData(e)}
            className='
          mt-1
          block
          w-full
          rounded-md
          border-gray-300
          shadow-sm
          focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50
          '
          />
        </label>
        <label className='text-gray-700'>
          Description
          <textarea
            value={info.description}
            id='description'
            onChange={(e) => updateFormData(e)}
            className='mt-1
          block
          w-full
          rounded-md
          border-gray-300
          shadow-sm
          focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50'
          />
        </label>
        <div className='grid md:grid-cols-2 gap-4'>
          <label className='text-gray-700'>
            City
            <input
              value={info.location}
              id='location'
              onChange={(e) => updateFormData(e)}
              type='text'
              className='block
            w-md
            rounded-md
            border-gray-300
            shadow-sm
            focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50'
            />
          </label>
          <label className='text-gray-700'>
            Duration (in hours)
            <input
              value={info.duration}
              type='number'
              id='duration'
              onChange={(e) => updateFormData(e)}
              className='block
            w-md
            rounded-md
            border-gray-300
            shadow-sm
            focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50'
            />
          </label>
          <label className='text-gray-700'>
            Maximum visitors
            <input
              value={info.maxGuests}
              type='number'
              id='maxGuests'
              onChange={(e) => updateFormData(e)}
              className='block
          w-md
          rounded-md
          border-gray-300
          shadow-sm
          focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50'
            />
          </label>
          <label className='text-gray-700'>
            Price
            <input
              value={info.price}
              type='number'
              id='price'
              onChange={(e) => updateFormData(e)}
              className='block
          w-md
          rounded-md
          border-gray-300
          shadow-sm
          focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50'
            />
          </label>
        </div>
        <label className='text-gray-700'>
          <input
            type='file'
            accept='image/*'
            id='imageInput'
            className='text-gray-700'
          />
        </label>
      </div>
      <button onClick={submitForm} className='btn-primary mt-4'>
        Submit
      </button>
      <Toaster />
    </div>
  );
}
