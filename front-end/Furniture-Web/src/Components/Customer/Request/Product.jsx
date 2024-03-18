import React from 'react';

function Product({ children }) {
    return (
        <div>
            <h3 className='text-center text-2xl font-semibold mb-6'>Products</h3>
            <ul className='flex flex-col gap-3'>
                {children}
            </ul>
        </div>
    )
}

export default Product