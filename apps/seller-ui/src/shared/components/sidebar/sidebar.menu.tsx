"use client";
import React from "react";

interface Props {
    title: string;
    children: React.ReactNode;
}

const SidebarMenu = ({title,children}:Props) => {
    return (
        <div className="block">
            <div className="flex items-center gap-2 pl-1 my-2 w-full">
                <h3 className="text-lg font-semibold text-white tracking-[0.04rem] whitespace-nowrap">{title}</h3>
                <div className="h-[2px] flex-1 bg-slate-700 rounded-full w-[calc(100%-2rem)] block" />
                <div className="h-[8px] right-4 z-[10000] translate-x-1/2 relative w-[8px] bg-slate-700/50 rounded-full" />
                <div className="h-[4px] right-7 z-[10000] shadow-lg shadow-slate-100 translate-x-1/2 relative w-[4px] bg-slate-200/50 rounded-full" />
            </div>
            {children}
        </div>
    )
}

export default SidebarMenu