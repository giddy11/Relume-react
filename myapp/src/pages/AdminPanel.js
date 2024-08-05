import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaRegCircleUser } from "react-icons/fa6";
import { Link, Outlet, useNavigate } from 'react-router-dom';
import ROLE from '../common/role';

const AdminPanel = () => {
    const user = useSelector(state => state?.user?.user);
    const navigate = useNavigate();

    useEffect(() => {
        // Ensure `user` is not null and has a `role` property before checking
        if (!user) {
            // Handle loading state or redirect to a loading page if needed
            return;
        }
        if (user.role !== ROLE.ADMIN) {
            navigate("/");
        }
    }, [user, navigate]); // Added `navigate` to dependencies

    if (!user) {
        // Render a loading state or nothing while user data is being fetched
        return <div>Loading...</div>;
    }

    return (
        <div className='min-h-[calc(100vh-120px)] border-red md:flex hidden'>
            <aside className='bg-white min-h-full w-full max-w-60 customShadow'>
                <div className='h-32 border-red flex justify-center items-center flex-col'>
                    <div className='text-5xl cursor-pointer relative flex justify-center'>
                        {
                            user?.profile ? (
                                <img src={user?.profile} className='w-20 h-20 rounded-full' alt={user?.name} />
                            ) : (
                                <FaRegCircleUser />
                            )
                        }
                    </div>
                    <p className='capitalize border-bluex text-lg font-semibold'>{user?.username}</p>
                    <p className='text-sm'>{user?.role}</p>
                </div>

                {/* Navigation */}
                <div>   
                    <nav className='grid p-4'>
                        <Link to="all-users" className='px-2 py-1 hover:bg-slate-100'>All Users</Link>
                        <Link to="all-products" className='px-2 py-1 hover:bg-slate-100'>All Products</Link>
                    </nav>
                </div>  
            </aside>

            <main className='w-full h-full p-2'>
                <Outlet />
            </main>
        </div>
    );
};

export default AdminPanel;
