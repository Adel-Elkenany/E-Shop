'use client'
import React from 'react'

const Success = () => {
  return (
    <div className='w-full min-h-screen flex flex-col items-center justify-center'>
      <h1 className='text-4xl font-bold mb-4'>Success!</h1>
      <p className='text-lg mb-8'>Your shop has been successfully connected to Stripe.</p>
      <a href="/login" className='bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold'>
        Go to Login
      </a>
    </div>
  )
}

export default Success
