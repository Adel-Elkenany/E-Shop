import React from 'react'

const ProfileIcon = () => {
    return (
        <div>
            <svg
                className="w-12 h-12 flex items-center justify-center border-2 rounded-full shadow-md shadow-slate-300 border-slate-300 text-slate-500 dark:text-blue hover:scale-105 hover:bg-blue-500 hover:text-white duration-200"
                aria-hidden="true"
                width="42" height="42"
                fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeWidth="1" d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
        </div>
    )
}

export default ProfileIcon
