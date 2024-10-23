import React, { useState } from 'react'
import { IoClose } from "react-icons/io5";
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

const RegisterPage = () => {

  const navigate = useNavigate()

  const [file, setFile ] = useState(null)
  const [data, setData ] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [loadding , setLoading ]= useState(false)
  const [error , setError ]= useState('')


  const handleImageUpload= (e) => {
    const file = e.target.files[0]
    setFile(file)    
  }

  const handleDeleteImage= (e) => {
    e.preventDefault()
    setFile(null)    
  }

  const closeAlert= () => {
    setError('')    
  }

  const handleSubmit = async (e) => {
    try {
      setLoading(true)
      const formdata = new FormData()
      formdata.append('name', data.name)
      formdata.append('email', data.email)
      formdata.append('password', data.password)
      formdata.append('image', file)

      await axios.post('register', formdata)
      .then(res => {
          if(res.status === 201){
            console.log(res.data);
            
            navigate('/email')
          }
        }).catch(function (error) {
          console.log('catch error', error)
          setError(error.response.data.message)
        }).finally(() => {
          setLoading(false)
      });

    } catch (error) {
      console.log('try error', error);
    }
  }

  const handleOnChange = (e) => {
    const { name, value } = e.target    

    setData((preve) => {
      return{
        ...preve, 
        [name] : value
      }
    })
  }





  return (
    <div className='w-full bg-secondary flex justify-center items-center h-[calc(100vh-80px)]'>
        <div className='w-[450px] bg-white p-8 '>
          <h3 className='text-xl font-bold text-center my-6'>Welcome to Chat app!</h3>
          {error &&
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span class="block sm:inline text-sm">{error}</span>
              <span class="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={closeAlert}>
                <svg class="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
              </span>
            </div>
          }
          <div className='mt-5 flex flex-col gap-5'>

            <div className='w-full flex flex-col'>
              <label htmlFor='name' className='text-sm'>Name</label>
              <input 
                type='text' 
                name='name'
                id='name' 
                placeholder='Enter Name' 
                className='p-2 border-b border-secondary  focus:outline-primary'
                value={data.name}
                onChange={handleOnChange}
              />
            </div>

            <div className='w-full flex flex-col'>
              <label htmlFor='email' className='text-sm'>Email</label>
              <input 
                type='email' 
                id='email' 
                name='email'
                placeholder='Enter Email' 
                className='p-2 border-b  border-secondary focus:outline-primary'
                value={data.email}
                onChange={handleOnChange}
              />
            </div>

            <div className='w-full flex flex-col'>
              <label htmlFor='password' className='text-sm'>Password</label>
              <input 
                type='password' 
                id='password' 
                name='password'
                placeholder='Enter password' 
                className='p-2 border-b  border-secondary focus:outline-primary'
                value={data.password}
                onChange={handleOnChange}
              />
            </div>

            {file &&
              <div className='w-24 h-24 rounded-full overflow-hidden'>
                <img src={URL.createObjectURL(file)} alt='image' className='w-full h-full object-scale-down'/>
              </div>
            }

            <div>
              <label htmlFor='file' className='text-sm'>Image</label>
              <div className='w-full flex flex-col bg-secondary '>
                  <label className='relative   flex  gap-4 h-10 justify-center items-center cursor-pointer'>
                    upload
                    <input 
                      type='file' 
                      id='file'  
                      className='p-2 border-b hidden absolute w-full h-full border-secondary focus:outline-primary'
                      onChange={(e) => handleImageUpload(e)}
                    />
                    {
                      <div>
                        <IoClose className='mt-1 text-black hover:text-primary' onClick={handleDeleteImage}/>
                      </div>
                    }
                  </label>
              </div>
            </div>

              {loadding ? 
                  <button disabled={true} className='bg-secondary p-3 text-black font-semibold text-lg flex justify-center items-center gap-4'>
                    Loading ...
                  </button> 
                  :
                  <button className='bg-primary p-3 text-white font-semibold text-lg flex justify-center items-center gap-4' onClick={handleSubmit}>
                    Register
                  </button>
              }
            
          </div>
          <p className='text-center text-sm mt-4'>Already have account? <Link to={'/email'} className='font-semibold text-primary hover:text-black underline'>Login</Link></p>
        </div>
    </div>
  )
}

export default RegisterPage