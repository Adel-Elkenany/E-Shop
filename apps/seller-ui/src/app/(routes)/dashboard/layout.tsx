import React from 'react'
import SidebarWrapper from 'apps/seller-ui/src/shared/components/sidebar/sidebar'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex h-full min-h-screen bg-black 
             bg-gradient-to-l from-indigo-900/50 via-gray-900 to-black 
             shadow-inner shadow-indigo-900'>
        {/* Sidebar */}
        <aside className='w-[250px] min-w-[220px] max-w-[280px] border-r border-r-slate-900 text-white px-2'>
         <div className='sticky top-0 h-[calc(100vh-4rem)]'>
          <SidebarWrapper/>
         </div>
        </aside>

        {/* main content area */}
        <main className='flex-1'>
         <div className='overflow-auto'>
            {children}
         </div>
        </main>
    </div>
  )
}

export default Layout