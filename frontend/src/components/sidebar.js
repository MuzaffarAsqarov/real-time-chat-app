import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { FaImage, FaUserPlus, FaVideo } from "react-icons/fa6";
import { RiLogoutBoxLine } from "react-icons/ri";
import Avatar from '@mui/material/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import EditUserDetails from './editUserDetails';
import { logout } from '../redux/userSlice'
import axios from 'axios';
import Devider from './Devider';
import { FiArrowUpLeft } from "react-icons/fi";
import SearchUser from './searchUser';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
 

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
      children: `${name.split('')[0][0]}`,
  };
}

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const Sidebar = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(state => state?.user)
  const socketConnection = useSelector(state => state?.user?.socketConnection) 

  const [ editUserOpen, setEditUserOpen ] = useState(false)    
  const [ openSearchUser, setOpenSearchUser ] = useState(false) 
  const [allUsers, setAllUsers] = useState([])  

  const handleLogout = async() => {
    try {
      await axios.get(`logout`).then(res => {        
          if(res.data.success === true){ 
            localStorage.clear()                               
            dispatch(logout())
            navigate('/email')
          }  
      })
    } catch (error) {
      console.log(error);      
    }    
  }

  const handleOpenSearchUser = () => {
    setOpenSearchUser(false)
  }

  useEffect(()=>{    
      if(socketConnection){
        socketConnection.emit('sidebar', user?._id)

        socketConnection.on('conversation', (data) => {
          console.log('conversation',data);

          const conversationUserData = data.map((conversationUser, index) => {
            if(conversationUser?.sender?._id === conversationUser?.receiver?._id){
              return{
                ...conversationUser,
                userDetails : conversationUser?.sender
              }
            }else if(conversationUser?.receiver?._id !== user?._id){
              return{
                ...conversationUser,
                userDetails : conversationUser?.receiver
              }
            }else{
              return{
                ...conversationUser,
                userDetails : conversationUser?.sender
              }
            }
          })

          setAllUsers(conversationUserData)
        })
      }
  },[socketConnection, user])  

  const onlineUsers = useSelector(state => state?.user?.onlineUser)  

  const checkOnline = (id) => {
    const isOnline = onlineUsers.includes(id)    
    return isOnline 
  }
  

  return (
    <div className='w-full h-full flex'>
      <div className='bg-slate-100 w-12 h-full py-5 text-slate-600 flex flex-col justify-between'>
        <div>
          <NavLink className={({ isActive }) => `w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 ${isActive && 'bg-slate-200'}`}>
            <IoChatbubbleEllipsesSharp size={20}/>
          </NavLink>

          <div title='Add friend' onClick={() => setOpenSearchUser(true)} className='w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200'>
              <FaUserPlus size={20}/>
          </div>
        </div>

        {user.name &&
          <div className='flex flex-col items-center'>
              <button className='mx-auto ' title={user?.name} onClick={() => setEditUserOpen(true)}>
                <Avatar
                  alt="Remy Sharp"
                  className='bg-white'
                  {...stringAvatar('Muzafffar')}
                  src={user?.profile_pic && `http://localhost:8000/uploads/${user?.profile_pic}`}
                  sx={{ width: 38, height: 38,  }}
                />
              </button>

            <button onClick={handleLogout} title='logout' className='w-12 h-12   flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded'>
              <span className='ml-[-3px]'>
                <RiLogoutBoxLine  size={20}/>
              </span>
            </button>
          </div>
        }
      </div>
      <div className='w-full'>
        <div className='p-2 px-4 w-full'>
          <p className='text-lg font-bold py-4'>Messages</p>
        </div>
        <Devider/>
        <div className='h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar'>
            {allUsers.length === 0 &&
                <div className='flex flex-col items-center justify-center gap-5 p-6 py-12'>
                  <FiArrowUpLeft className='text-4xl text-stone-500' />
                  <p className='text-center text-stone-400 font-semibold'>Explore users to start a conversation with.</p>
                </div>
            }
            {
              allUsers.map((conv, index) => {
                  return (
                    <NavLink to={'/'+conv?.userDetails?._id} key={conv?._id}  className='flex items-center box-content gap-2 p-2 cursor-pointer rounded border border-transparent border-b hover:border-primary hover:bg-slate-50'>
                      <div>
                        {checkOnline(conv?.userDetails?._id) ? (
                          <StyledBadge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            variant="dot"
                          >
                            <Avatar
                              alt={conv?.userDetails?.name}
                              className=' border'
                              {...stringAvatar(conv?.userDetails?.name)}
                              src={conv?.userDetails?.profile_pic && `${process.env.REACT_APP_BACKEND_URL}/uploads/${conv?.userDetails?.profile_pic}`}
                            />
                          </StyledBadge>
                        ) : (
                          <Avatar
                            alt={user?.name}
                            className=' border'
                            {...stringAvatar(conv?.userDetails?.name)}
                            src={conv?.userDetails?.profile_pic && `${process.env.REACT_APP_BACKEND_URL}/uploads/${conv?.userDetails?.profile_pic}`}
                          />
                        )
                        }
                      </div>

                      <div>
                        <h3 className='text-ellipsis line-clamp-1  font-semibold'>{conv?.userDetails?.name}</h3>
                        <div className='text-slate-500 text-xs flex items-center gap-1'>
                          <div className='flex items-center gap-1'>
                            {
                              conv?.lastMsg?.imageUrl && (
                                <div className='flex items-center gap-1'>
                                  <span className=''><FaImage/></span>
                                  {!conv?.lastMsg?.text && <span>Image</span>}
                                </div>
                              )
                            }
                            {
                              conv?.lastMsg?.videoUrl && (
                                <div className='flex items-center gap-1'>
                                  <span className=''><FaVideo/></span>
                                  {!conv?.lastMsg?.text && <span>Video</span>}
                                </div>
                              )
                            }
                          </div>
                          <p className='text-xs text-ellipsis line-clamp-1'>{conv?.lastMsg?.text}</p>
                        </div>
                      </div>
                      {conv?.unseenMsg !== 0 &&
                        <p className='text-xs ml-auto  px-1.5 bg-primary text-white font-semibold rounded-full' >{conv?.unseenMsg}</p>
                      }
                    </NavLink>
                  )
              })
            }
        </div>
      </div>

        {/* {edit user data} */}
      {
        editUserOpen && (
          <EditUserDetails onClose={() => setEditUserOpen(false)} user={user}/>
        )
      }

      {/* search user  */}
      {openSearchUser && (
          <SearchUser onClose={handleOpenSearchUser}/>
        )
      }
    </div>
  )
}

export default Sidebar
