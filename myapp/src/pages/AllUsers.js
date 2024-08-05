import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import moment from 'moment';
import { MdModeEdit } from "react-icons/md";
import axios from "axios";
import ChangeUserRole from '../components/ChangeUserRole';

const AllUsers = () => {
    const [allUser, setAllUsers] = useState([]);
    const [openUpdateRole, setOpenUpdateRole] = useState(false);
    const [updateUserDetails, setUpdateUserDetails] = useState({
        email: "",
        username: "",
        role: "",
        _id: ""
    });
    const [loading, setLoading] = useState(true); // New state for loading

    const fetchAllUsers = async () => {
        try {
            const fetchData = await axios.get(SummaryApi.allUser.url, {
                withCredentials: true, // Ensure this is set to include credentials
            });
            const dataResponse = fetchData.data;

            if (dataResponse.success) {
                setAllUsers(dataResponse.data);
            }

            if (dataResponse.error) {
                toast.error(dataResponse.message);
            }
        } catch (error) {
            toast.error("An error occurred while fetching users");
        } finally {
            setLoading(false); // Set loading to false after data fetch
        }
    };

    useEffect(() => {
        fetchAllUsers();
    }, []);

    return (
        <div className='bg-white pb-4'>
            {loading ? (
                <div className='flex justify-center items-center h-[100vh]'>
                    <div className='spinner1'></div>
                </div>
            ) : (
                <table className='w-full userTable'>
                    <thead>
                        <tr className='bg-black text-white'>
                            <th>Sr.</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Created Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allUser.length > 0 ? (
                            allUser.map(el => (
                                <tr key={el._id}> {/* Ensure unique key */}
                                    <td>{allUser.indexOf(el) + 1}</td>
                                    <td>{el?.username}</td>
                                    <td>{el?.email}</td>
                                    <td>{el?.role}</td>
                                    <td>{moment(el?.createdAt).format('LL')}</td>
                                    <td>
                                        <button
                                            className='bg-green-100 p-2 rounded-full cursor-pointer hover:bg-green-500 hover:text-white'
                                            onClick={() => {
                                                setUpdateUserDetails(el);
                                                setOpenUpdateRole(true);
                                            }}
                                        >
                                            <MdModeEdit />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className='text-center py-4'>No users found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}

            {openUpdateRole && (
                <ChangeUserRole
                    onClose={() => setOpenUpdateRole(false)}
                    name={updateUserDetails.username}
                    email={updateUserDetails.email}
                    role={updateUserDetails.role}
                    userId={updateUserDetails._id}
                    callFunc={fetchAllUsers}
                />
            )}
        </div>
    );
};

export default AllUsers;