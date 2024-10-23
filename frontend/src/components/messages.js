import { Avatar } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom'
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaAngleLeft, FaImage, FaPlus, FaVideo } from "react-icons/fa6";
import { IoClose } from 'react-icons/io5';
import Loader from './loader';
import backgroundImage from '../assets/wallapaper.jpeg'
import { IoIosSend, IoMdSend } from "react-icons/io";
import axios from 'axios';
import moment from 'moment'

function stringToColor() {
  const colors = [
      '#fdba74',
      '#fde047',
      '#bef264',
      '#86efac',
      '#5eead4',
      '#f0abfc',
      '#fda4af',
  ]

  const num = Math.floor(Math.random() * 7) 
  

  return colors[num];
}

function stringAvatar(name) {
return {
  sx: {
    bgcolor: stringToColor(),
    width: {lg: 50}, 
    height: {lg: 50},
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

const Messages = () => {
  const params = useParams()
  const socketConnection = useSelector(state => state?.user?.socketConnection)
  const user = useSelector(state => state?.user)
  const [loading, setLoading] = useState(false)
  const [dataUser, setDataUser] = useState({
    _id: '',
    name: '',
    email: '',
    profile_pic: '',
    online: false
  })
  const [openVideoImageUpload, setOpenVideoImageUpload] = useState(false)
  const [message, setMessage] = useState({
    text: '',
    imagePath: '',
    videoPath: ''
  })
  const [allMessages, setAllMessages] = useState([])
  const currentMessage = useRef(null)

  const onlineUsers = useSelector(state => state?.user?.onlineUser)  
  const isOnline = onlineUsers.includes(dataUser?._id)
  console.log('online', onlineUsers);
  

  useEffect(() => {
    if(currentMessage.current){
      currentMessage.current.scrollIntoView({behavior : 'smooth', block : 'end'})
    }
    if (socketConnection) {
      socketConnection.emit('seen', params.userId)
    }
  },[allMessages])

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit('message-page', params.userId)

      socketConnection.emit('seen', params.userId)

      socketConnection.on('messages-user', (data) => {
        setDataUser(data)
      })

      socketConnection.on('message', (data) => {
        setAllMessages(data?.messages)
      })
    }
  }, [socketConnection, params?.userId, user])

  
  const handleChangeUploadImage = async (e) => {
    const image = e.target.files[0]
    if(image){   
      setLoading(true)
      const formData = new FormData()
      formData.append('image', image)
    
      await axios.post(`image-uploads`, formData)
      .then(res => {
        if(res?.data?.upload === true){
            setMessage(preve => {
              return{
                ...preve,
                imagePath: res?.data?.filePath
              }
            })
        }    
      }).catch(err => {
        console.log(err.response.data.message);        
      })
      setOpenVideoImageUpload(false)
      setLoading(false)
    }
  }

  const handleChangeUploadVideo = async (e) => {
    const video = e.target.files ? e.target.files[0] : null
    
    if(video){
      setLoading(true)
      const formData = new FormData()
      formData.append('video', video)
    
      await axios.post(`video-uploads`, formData)
      .then(res => {
        if(res?.data?.upload === true){
          setMessage(preve => {
            return{
              ...preve,
              videoPath: res?.data?.filePath
            }
          })
      }      
      }).catch(err => {
        console.log(err.response.data.message);        
      })
      setOpenVideoImageUpload(false)
      setLoading(false)
    }
  }
  

  const handleClearUploadImage = () => {
    setMessage(preve => {
      return{...preve, imagePath: ''}
    })
    setMessage(preve => {
      return{...preve, videoPath: ''}
    })
    setOpenVideoImageUpload(false)
  }


  const handleOnChange = (e) => {
    const {name , value } = e.target
    setMessage(preve => {
      return{
        ...preve,
        text: value
      }
    })
  }

  const handleSendMessage = (e) => {
    e.preventDefault()


    if(message.text || message.imagePath || message.videoPath){
      if(socketConnection){
        socketConnection.emit('new-message', {
          sender : user?._id,
          receiver : params.userId,
          text : message.text,
          imageUrl : message.imagePath,
          videoUrl : message.videoPath,
          msgByUserId : user?._id
        })
        setMessage({
          text: '',
          imagePath: '',
          videoPath: ''
        })
      }
    }
  }

  return (
    <div style={{backgroundImage: `url(${backgroundImage})`}} className='bg-no-repeat bg-cover '>
      <header className='sticky top-0 h-16 p-2 px-4 bg-white'>
        <div className='flex gap-5 items-center h-full '>
          <Link to={'/'} className='lg:hidden'>
              <FaAngleLeft size={25}/>
          </Link>
          <div>
            {isOnline ? (
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
              >
                <Avatar
                  alt={dataUser?.name}
                  className=' border'
                  {...stringAvatar('Muzaffar')}
                  src={dataUser?.profile_pic && `${process.env.REACT_APP_BACKEND_URL}/uploads/${dataUser?.profile_pic}`}
                />
              </StyledBadge>
            ) : (
              <Avatar
                alt={dataUser?.name}
                className=' border'
                {...stringAvatar('Muzaffar')}
                src={dataUser?.profile_pic && `${process.env.REACT_APP_BACKEND_URL}/uploads/${dataUser?.profile_pic}`}
              />
            )
            }
          </div>
          <div>
            <h3 className='font-semibold  text-ellipsis line-clamp-1'>{dataUser?.name}</h3>
            <p className='text-sm font-semibold -mt-1'>{dataUser?.online ? <span className=' text-primary'>online</span> : <span className='text-stone-500'>offline</span>}</p>
          </div>

          <div className='ml-auto'>
              <button className='cursor-pointer hover:text-primary text-lg'>
                  <BsThreeDotsVertical />
              </button>
          </div>
        </div>
      </header>


      {/* show all messages */}
      <section className='h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-700 bg-opacity-60'>

        

        {/* all message show here */}
        <div className='flex flex-col gap-2 py-2 mx-2' ref={currentMessage}>
            {allMessages &&
              allMessages.map((msg, index) => {
                return (
                  <div className={`bg-white p-1 rounded  w-fit max-w-[280px] md:max-w-sm lg:max-w-md  ${user?._id === msg.msgByUserId ? "ml-auto rounded-br-none bg-teal-200" : "rounded-bl-none"}`}>
                      <div className='w-full'>
                          {msg?.imageUrl &&
                              <img
                                src={`${process.env.REACT_APP_BACKEND_URL}/uploads/${msg?.imageUrl}`}
                                className='w-full h-full object-scale-down cursor-pointer'
                              />
                          }
                      </div>

                      <div className='w-full'>
                          {msg?.videoUrl &&
                              <video
                                src={`${process.env.REACT_APP_BACKEND_URL}/uploads/${msg?.videoUrl}`}
                                className='w-full h-full object-scale-down cursor-pointer'
                                controls
                              />
                          }
                      </div>

                      <p className='px-2'>{msg.text}</p>
                      <p className='text-xs text-right'>{moment(msg.createdAt).format('hh:mm')}</p>

                  </div>
                )
              })
            }
        </div>


        {/* upload Image display */}
        {message.imagePath && (
            <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
              <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-white' onClick={handleClearUploadImage}>
                <IoClose size={20}/>
              </div>
                <div className='bg-white p-3'>
                  <img 
                    src={`${process.env.REACT_APP_BACKEND_URL}/uploads/${message?.imagePath}`} 
                    className='aspect-square w-full h-full object-scale-down max-w-2xl m-2' 
                    alt='uploadImage'/>
                </div>
            </div>
          )
        }

        {/* upload Video display */}
        {message.videoPath && (
            <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
              <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-white' onClick={handleClearUploadImage}>
                <IoClose size={20}/>
              </div>
                <div className='bg-white'>
                  <video 
                      src={`${process.env.REACT_APP_BACKEND_URL}/uploads/${message?.videoPath}`} 
                      className='aspect-square w-full h-full max-w-2xl '
                      controls
                      muted                      
                  />
                </div>
            </div>
          )
        }

        {/* loading display */}
        {loading && (
            <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
              <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-white' onClick={handleClearUploadImage}>
                <IoClose size={20}/>
              </div>
                <Loader/>
            </div>
          )
        }
      </section>

      {/* send message */}
      <section className='h-16 bg-white flex items-center px-4'>
        <div className='relative '>
          <button onClick={(e) => setOpenVideoImageUpload(true)} className='flex justify-center items-center w-11 h-11 rounded-full hover:bg-primary hover:text-white'>
            <FaPlus size={20}/>
          </button>

          {/* video and image */}
          {openVideoImageUpload && (
            <div className='bg-white shadow rounded absolute bottom-14 w-36 p-2'>
              <form>
                  <label htmlFor='uploadImage' className='flex items-center p-2 px-3 gap-3 hover:bg-slate-100 cursor-pointer'>
                      <div className='text-primary'>
                        <FaImage size={18}/>
                      </div>
                      <p>Image</p>
                      <input 
                        type='file' 
                        name='uploadImage' 
                        id='uploadImage' 
                        onChange={(e) => handleChangeUploadImage(e)}
                        className='hidden'
                      />
                  </label>
                  <label htmlFor='uploadVideo'  className='flex items-center p-2 px-3 gap-3 hover:bg-slate-100 cursor-pointer'>
                      <div className='text-purple-500'>
                        <FaVideo size={18}/>
                      </div>
                      <p>Video</p>
                      <input 
                        type='file' 
                        name='uploadVideo' 
                        id='uploadVideo' 
                        onChange={(e) => handleChangeUploadVideo(e)}
                        className='hidden'
                      />
                  </label>
              </form>
            </div>
          )}
        </div>

          <form onSubmit={handleSendMessage} className='w-full h-full flex gap-2 mr-4'>
              <input 
                type='text' 
                placeholder='Type here message'
                className='py-1 px-4 outline-none w-full h-full'
                value={message.text}
                onChange={handleOnChange}
              />
              <button className='hover:text-blue-500 text-primary'>
                <IoIosSend size={25} />
              </button>
          </form>
      </section>
    </div>
  )
}

export default Messages