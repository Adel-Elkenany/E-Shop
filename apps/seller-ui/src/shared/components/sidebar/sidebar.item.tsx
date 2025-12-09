"use client";
import Link from "next/link";
import React from "react";

interface Props {
    title: string;
    icon: React.ReactNode;
    isActive: boolean;
    href: string;
}

const SidebarItem = ({title,icon,isActive,href}:Props) => {
    return (
       <Link href={href} className="my-2 px-0 disabled:block">
        <div 
        className={`flex gap-2 w-full min-h-8 h-full items-center px-4 py-3 rounded-sm cursor-pointer transition-all duration-300 ease-in-out hover:bg-slate-700 
        ${isActive && 'scale-105 bg-gray-900 fill-blue-200 hover:bg-gray-800 hover:fill-blue-200'}`}>
         {icon}
         <h5 className="text-slate-200 text-sm">{title}</h5>
        </div>
       </Link>
    )
}

export default SidebarItem