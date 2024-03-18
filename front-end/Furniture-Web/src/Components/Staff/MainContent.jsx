import React from 'react';
import { Pagination } from '@mui/material';
import { Outlet, Link } from "react-router-dom";



function MainContent() {

    return (
        <div>
            <div className="h-[700px]">
                <div className="p-20 border-gray-800">
                    <div className="grid grid-cols-2 gap-4 mb-4 rounded-full">
                        <Link to='/staff/requestList'>
                            <div className="flex items-center justify-center bg-gray-200 h-28 dark:bg-gray-800 cursor-pointer rounded-2xl hover:bg-gray-300">
                                <h1 className='pathTitle'>Customer Request List</h1>
                            </div>
                        </Link>
                        
                        <Link to='/staff/proposalList'>
                            <div className="flex items-center justify-center bg-gray-200 h-28 dark:bg-gray-800 cursor-pointer rounded-2xl hover:bg-gray-300">
                                <h1>Planing Quatation List</h1>
                            </div>
                        </Link>
                        <Link to='/staff/proposalList'>
                            <div className="flex items-center justify-center bg-gray-200 h-28 dark:bg-gray-800 cursor-pointer rounded-2xl hover:bg-gray-300">
                                <p className="text-2xl text-gray-400 dark:text-gray-500">
                                    <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                                    </svg>
                                </p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            <Pagination count={10} color="secondary" size="large" className='text-8xl' />
        <Outlet />
        </div>
        
    )
}

export default MainContent