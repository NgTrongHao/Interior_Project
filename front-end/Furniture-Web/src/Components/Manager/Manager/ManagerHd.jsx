import React from 'react';
import Sidebar from '../Sidebar';
import ManagerProjectHD from './ManagerProjectHD';


function ManagerHd() {
    return (
        <div className='flex'>
            <div className=''>
                <Sidebar />
            </div>

            <ManagerProjectHD />
        </div>
    )
}

export default ManagerHd