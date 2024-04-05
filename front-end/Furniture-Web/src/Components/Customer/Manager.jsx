
import Project from './Project';
function Manager() {
    return (
        <div className='flex flex-col w-screen left-0 fixed top-0 bg-white h-screen z-10 overflow-auto p-3'>
            <main className='w-screen left-0 fixed h-full  overflow-auto p-6'>
                <Project />
            </main>
        </div>
    );
}

export default Manager;
