import React, { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { logout, setOnlineUser, setUser, setSocketConnection } from '../redux/userSlice'
import Sidebar from '../components/sidebar'
import logo from '../assets/logo.png'
import io from 'socket.io-client'

const HomePage = () => {

  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()  
  const location = useLocation()

  console.log(user);
  
  

  const getUserDetails = async () => {
    try {
        await axios.get(`user-details`, {
          withCredentials : true
        }).then(res => { 
            if(res?.data?.data?.logout){              
              dispatch(logout())
              navigate('/email')
              return
            }   
            
            if(res.status === 200){
              dispatch(setUser(res.data.data))
            }
        })    

    } catch (error) {
        console.log('home page error', error);        
    }
  }

  useEffect(() => {
    getUserDetails()
  },[])


  // io socket connection
  useEffect(() => {
    const socketConnection = io(process.env.REACT_APP_BACKEND_URL, {
      auth: {
        token : localStorage.getItem('token')
      }
    })

    socketConnection.on('onlineUser', (data) => {
      console.log('onlineUser',data);
      dispatch(setOnlineUser(data))
    })

    dispatch(setSocketConnection(socketConnection))

    return () => {
      socketConnection.disconnect()
    }
  },[])

  const basePath = location.pathname === '/'
  
  
  return (
    <div className='grid lg:grid-cols-[300px,1fr] h-screen max-h-screen'>
      <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
        <Sidebar/>
      </section>
      <section className={`${basePath && "hidden"}`}>
        <Outlet/>
      </section>

      <div className={`justify-center items-center flex-col gap-2 hidden ${!basePath ? "hidden" : "lg:flex" }`}>
        <div>
          <img src={logo} width={250} alt='logo'/>
        </div>
        <p className='text-lg mt-2 text-slate-500'>Select user to send message</p>
      </div>
    </div>
  )
}

export default HomePage