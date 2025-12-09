'use client';
import { NavItems } from 'apps/user-ui/src/configs/constsnts';
import { AlignLeft, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import ProfilrIcon from "../../../assets/svgs/profile-icon"
import HeartIcon from "../../../assets/svgs/heart-icon"
import CartIcon from '../../../assets/svgs/cart-icon'
import useUser from 'apps/user-ui/src/hooks/useUser';

const HeaderBottom = () => {
  const [show, setShow] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const { } = useUser();
  const { user, isLoading } = useUser();


  // Teack scroll postion
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll)
  }, []);

  return (
    <div className={`w-full transition-all duration-200 ${isSticky ? "fixed top-0 left-0 bg-white shadow-lg" : "relative"}`}>
      <div className={`w-[80%] relative m-auto flex items-center justify-between ${isSticky ? 'pt-auto' : 'py-0'}`}>
        {/* All Dropdowns */}
        <div className={`w-60 ${isSticky && '-mb-8'} cursor-pointer flex items-center justify-between px-5 h-12 bg-blue-500`}
          onClick={() => setShow(!show)}>
          <div className='flex items-center gap-2'>
            <AlignLeft color='white' />
            <span className='text-white font-medium'>All Departments</span>
          </div>
          <ChevronDown color='white' />
        </div>

        {/* Dropdown menu */}
        {show && (
          <div className={`absolute left-0 ${isSticky ? "top-20" : "top-12"} w-60 h-[400px] bg-[#f5f5f5]`}>

          </div>
        )}

        {/* Nav Links */}
        <div className='flex items-center'>
          {NavItems.map((i: NavItemsTypes, index: number) => (
            <Link className='px-5 font-medium text-lg hover:bg-gray-100 hover:text-blue-700 hover:border-b-4 hover:border-b-blue-500 duration-100 transition-all' href={i.href} key={index}>
              {i.title}
            </Link>
          ))}
        </div>

        <div>
          {isSticky && (
            <div className='flex items-center gap-8 py-4 duration-900 transition-all'>
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
                        <span className="font-semibold">{isLoading ? " " : "Sign In"}</span>
                      </Link>
                    </>
                  )}

                </div>

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
          )}
        </div>
      </div>
    </div >
  )
}

export default HeaderBottom
