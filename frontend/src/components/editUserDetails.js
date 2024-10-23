import React, { useEffect, useState } from 'react'
import Devider from './Devider'
import Avatar from '@mui/material/Avatar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice'

function stringToColor(string) {
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
  
    return color;
}

function stringAvatar(name) {
    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
}

const EditUserDetails = ({onClose, user}) => {

    const dispatch = useDispatch()

    const [data , setData ] = useState({
        name: user?.name,
        profile_pic: user?.profile_pic
    })
    const [image, setImage] = useState(null)
    const [loading, setLoading ] = useState(false)    

    const handleOnChange = (e) => {
        const { name, value } = e.target
        setData((preve) => {
            return{
                ...preve, 
                [name] : value
            }
        })
    }
    const handleUploadPhoto = (e) => {
        const file = e.target.files[0]
        setImage(file)
    }

    

    useEffect(() => {
        setData((preve) => {
            return{
                ...preve, 
                ...user
            }
        })
    }, [user])


    const handleClick = async(e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const formData = new FormData()
            formData.append('name', data.name)
            formData.append('image', image)

            await axios.put(`user-update`, formData,  {
                withCredentials : true
            }).then(res => {
                if(res?.status === 200){                    
                    dispatch(setUser(res.data.user))
                    toast.success(res.data.message)
                    onClose()
                }              
            })
        } catch (error) {
            console.log(error);  
            toast.error(error.response.data.message)          
        }
        setLoading(false)
    }


  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-40 flex justify-center items-center z-10'>
        <div className='bg-white p-4 py-5 m-1 rounded w-full max-w-sm '>
            <h2 className=' font-semibold'>Profile Detailes</h2>
            <p className='text-sm'>Edit User Details</p>

            <form className='grid gap-3 mt-3'> 
                <div className='flex flex-col gap-1'>
                    <label htmlFor='name' className='text-sm font-semibold'>Name:</label>
                    <input
                        type='text'
                        name='name'
                        id='name'
                        value={data.name}
                        onChange={handleOnChange}
                        className='block px-2 py-1 border  w-full text-sm focus:outline-primary'
                    />
                </div>

                <div className='mb-2'>
                    <label htmlFor='profile_pic'>Photo</label>
                    <div className='my-1 flex items-center  gap-3 relative'>
                        <Avatar
                            alt="Remy Sharp"
                            {...stringAvatar('Jed Watson')}
                            src={image ? URL.createObjectURL(image) : `http://localhost:8000/images/${user?.profile_pic}`} 
                            sx={{ width: 56, height: 56, outline: '1px solid gray', outlineOffset: 3 }}
                        />
                        <button type='button' className='font-semibold'>Change Photo</button>
                        <input
                            type='file'
                            id='file'
                            className='opacity-0 w-full h-full absolute'
                            onChange={handleUploadPhoto}
                        />
                    </div>
                </div>

                <Devider/>
                <div className='flex gap-2 w-fit ml-auto'>
                    <button onClick={onClose} className='border-primary border text-primary px-4 py-1 rounded hover:shadow-md focus:bg-primary focus:text-white'>Cancel</button>
                    {loading ?
                        <button disabled className='border-primary bg-primary text-white border px-4 py-1 rounded hover:bg-blue-400 hover:shadow-md'>loading...</button> :
                        <button className='border-primary bg-primary text-white border px-4 py-1 rounded hover:bg-blue-400 hover:shadow-md' onClick={handleClick}>Save</button>
                    }
                </div>
            </form>
        </div>
    </div>
  )
}

export default EditUserDetails