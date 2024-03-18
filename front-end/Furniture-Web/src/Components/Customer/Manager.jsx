import React from 'react';
import { NavLink } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import Project from './Project';
import Quotation from './Quotation';
import History from './History';


function Manager() {
    return (
        <div className='flex flex-col w-full'>
            {/* <div className='justify-center mt-5 h-1/5'>
                {/* <nav className='flex gap-4 justify-center'>
                    <NavLink to="project" className='h-6 w-[300px] text-center font-semibold text-2xl'>
                        <div className='border-2 border-blue-500 px-8 py-4 rounded-md text-gray-950 hover:bg-blue-500 hover:text-white'>Project</div>
                    </NavLink>
                    <NavLink to="quotation" className='h-6 w-[300px] text-center font-semibold text-2xl'>
                        <div className='border-2 border-blue-500 px-8 py-4 rounded-md text-gray-950 hover:bg-blue-500 hover:text-white'>Quotation</div>
                    </NavLink>
                    <NavLink to="history" className='h-6 w-[300px] text-center font-semibold text-2xl'>
                        <div className='border-2 border-blue-500 px-8 py-4 rounded-md text-gray-950 hover:bg-blue-500 hover:text-white'>History</div>
                    </NavLink>
                </nav> */}
            <main className='mt-5 flex gap-16 justify-center border-[2px] h-screen' >
                <Project />
            </main>
        </div>
    );
}

export default Manager;
