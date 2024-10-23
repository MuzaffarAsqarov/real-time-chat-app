import React, { useEffect, useState } from 'react'
import { FiSearch } from "react-icons/fi";
import Loader from './loader';
import SearchUserCard from './SearchUserCard';
import { toast } from 'react-toastify'
import axios from 'axios';
import { IoMdClose } from "react-icons/io";

const SearchUser = ({onClose}) => {

    const [searchUser, setSearchUser] = useState([])
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState('')
    console.log(search);
    

    const handleSearchUser = async () => {
        try {
            setLoading(true)
            await axios.post('search-users', {search: search})
                .then(res => {
                    if (res.status === 200) {                        
                        setSearchUser(res.data.users)
                    }
                }).finally(() => {
                    setLoading(false)
                });
        } catch (error) {
            toast.error(error?.response?.data?.message)
        }
    }

    const handleChange = (e) => {
        const value = e.target.value
        setSearch(value) 
    }

    useEffect(() => {
        handleSearchUser()
    }, [search])

    console.log('searchUser', searchUser);
    

  return (
    <div className='fixed top-0 left-0 right-0 bottom-0 bg-slate-700 bg-opacity-40 p-2 z-10'>
        <button className='absolute top-4 right-4 text-lg font-semibold hover:text-white' onClick={onClose}><IoMdClose size={20}/></button>
        <div className='w-full max-w-lg mx-auto mt-10'>
            <div className='bg-white rounded h-14 overflow-hidden flex'>
                <input 
                    type='text' 
                    placeholder=' Search user by name, email....'
                    className='w-full outline-none py-1 h-full px-4'
                    onChange={handleChange}
                    value={search}
                />
                <div className='w-14 h-14 flex justify-center items-center cursor-pointer'>
                    <FiSearch  size={24} onClick={handleSearchUser}/>
                </div>
            </div>
            <div className='w-full mt-2 rounded p-4 bg-white'>
                {searchUser.length === 0 && !loading && (
                        <p className='text-center text-slate-500'>User not founded</p>
                    )
                }

                {loading && (
                        <p className='text-center text-slate-500'>
                            <Loader/>
                        </p>
                    )
                }

                {searchUser.length !== 0 && !loading && (
                    searchUser.map((user, index) => {
                        return (
                            <SearchUserCard key={user._id} user={user} onClose={onClose}/>
                        )
                    })
                    )
                }
            </div>
        </div>

    </div>
  )
}

export default SearchUser