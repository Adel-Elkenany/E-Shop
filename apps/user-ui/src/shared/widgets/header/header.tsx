'use client'
import Link from 'next/link'
import React from 'react'
import { Search } from "lucide-react"
import ProfilrIcon from "../../../assets/svgs/profile-icon"
import HeartIcon from "../../../assets/svgs/heart-icon"
import CartIcon from '../../../assets/svgs/cart-icon'
import HeaderBottom from './header-bottom'
import useUser from 'apps/user-ui/src/hooks/useUser'

const Header = () => {
 const { user, isLoading } = useUser();

 return (
  <div className='w-full bg-white'>
   <div className="w-[80%] py-5 m-auto flex items-center justify-between">
    <div>
     <Link href={"/"}>
      <span className='text-2xl font-bold'>E-Shop</span>
     </Link>
    </div>
    <div className='w-1/2 relative'>
     <input type='text' placeholder='Search for products'
      className='w-full px-4 font-Poppins font-medium border-2 rounded-md border-blue-500 outline-none h-12'
     />
     <div className='w-14 cursor-pointer flex items-center justify-center rounded-e-md h-12 bg-blue-500 absolute top-0 right-0'>
      <Search color='#fff' />
     </div>

    </div>
    <div className='flex items-center gap-8 pv'>
     <div className='flex items-center gap-2'>
      {!isLoading && user ? (
       <>
        <Link href={"/profile"}>
         <ProfilrIcon />
        </Link>
        <Link href={"/profile"}>
         <span className="block font-medium">Hello,</span>
         <span className="font-semibold">{user?.name?.split(" ")[0]}</span>
        </Link>
       </>
      ) : (
       <>
        <Link href={"/login"}>
         <ProfilrIcon />
        </Link>
        <Link href={"/login"}>
         <span className="block font-medium">Hello,</span>
         <span className="font-semibold">{isLoading ? " " + " " : "Sign In"}</span>
        </Link>
       </>
      )}

     </div>
     <div className='flex items-center gap-5'>
      <Link href={"/wishlist"} className='relative'>
       <HeartIcon />
       <div className='w-4 h-4 border-2 p-2 border-white bg-red-400 rounded-full flex items-center justify-center absolute top-[-2px] right-[-1px]'>
        <span className='text-white text-sm font-medium text-center'>0</span>
       </div>
      </Link>
      <Link href={"/wishlist"} className='relative'>
       <CartIcon />
       <div className='w-5 h-5 border-2 p-2 border-white bg-red-400 rounded-full flex items-center justify-center absolute top-[-5px] right-[-7px]'>
        <span className='text-white text-sm font-medium text-center'>0</span>
       </div>
      </Link>
     </div>
    </div>
   </div>
   <div className='border-b border-b-slate-300' />
   <HeaderBottom />
  </div >
 )
}

export default Header
