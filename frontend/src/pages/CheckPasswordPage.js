import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { setToken } from '../redux/userSlice'

const CheckPasswordPage = () => {

  const navigate = useNavigate()
  const location = useLocation();
  const userId = location?.state?.userId ? location?.state?.userId : null;  

  const dispatch = useDispatch()

  const [password, setPassword ] = useState('')
  const [loadding , setLoading ]= useState(false)
  const [error , setError ]= useState('')

  useEffect(() => {
    if(userId === null || userId === undefined){
      navigate('email')
    }
  })
  

  const closeAlert= () => {
    setError('')    
  }

  const handleSubmit = async (e) => {
    try {
      setLoading(true)
      await axios.post('password', {
          password: password,
          userId: userId
        },
        {
          withCredentials : true
        }
      )
      .then(res => {
         if(res.status === 200){
            dispatch(setToken(res?.data?.token))
            localStorage.setItem('token', res?.data?.token)  
            setPassword('')        
            toast.success('Login succesfuly')
            navigate('/')
         }
        }).catch(function (error) {
          setError(error.response.data.message)
        }).finally(() => {
          setLoading(false)
      });
    } catch (error) {
      console.log('try error', error);
    }
  }
  return (
    <div className='w-full bg-secondary flex justify-center items-center h-[calc(100vh-80px)]'>
      <div className='w-[450px] bg-white p-8 '>
        <h3 className='text-xl font-bold text-center my-6'>Enter password!</h3>
        {error &&
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span class="block sm:inline text-sm">{error}</span>
            <span class="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={closeAlert}>
              <svg class="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
            </span>
          </div>
        }
        <div className='mt-5 flex flex-col gap-5'>

          <div className='w-full flex flex-col'>
            <label htmlFor='password' className='text-sm'>Password</label>
            <input
              type='password'
              id='password'
              name='password'
              placeholder='Enter password'
              className='p-2 border-b  border-secondary focus:outline-primary'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {loadding ?
            <button disabled={true} className='bg-secondary p-3 text-black font-semibold text-lg flex justify-center items-center gap-4'>
              Loading ...
            </button>
            :
            <button className='bg-primary p-3 text-white font-semibold text-lg flex justify-center items-center gap-4' onClick={handleSubmit}>
              Let's Go
            </button>
          }

        </div>
        <p className='text-center text-sm mt-4'>Forget password? <Link to={'/forget-password'} className='font-semibold text-primary hover:text-black underline'>forget-password</Link></p>
      </div>
    </div>
  )
}

export default CheckPasswordPage