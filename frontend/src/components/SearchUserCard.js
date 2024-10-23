import React from 'react'
import Avatar from '@mui/material/Avatar';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import { useSelector } from 'react-redux';

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

const SearchUserCard = ({user, onClose}) => {  
  const onlineUsers = useSelector(state => state?.user?.onlineUser)  

  const isOnline = onlineUsers.includes(user?._id)

  return (
    <Link to={'/'+ user?._id} onClick={onClose} className='flex gap-3 md:mt-2 border-b rounded border-b-slate-200 md:p-2 p-1 hover:border-primary hover:border overflow-hidden hover:bg-slate-50 cursor-pointer'>
        <div>
          {isOnline ? (
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
              >
                <Avatar
                    alt={user?.name}
                    className=' border'
                    {...stringAvatar('Muzaffar')}
                    src={user?.profile_pic && `${process.env.REACT_APP_BACKEND_URL}/uploads/${user?.profile_pic}`}
                />
              </StyledBadge>
            ) : (
              <Avatar
                  alt={user?.name}
                  className=' border'
                  {...stringAvatar('Muzaffar')}
                  src={user?.profile_pic && `${process.env.REACT_APP_BACKEND_URL}/uploads/${user?.profile_pic}`}
              />
            )
          }
        </div>
        <div className='overflow-hidden '>
            <div className='font-semibold line-clamp-1'>{user?.name}</div>
            <p className='text-sm line-clamp-1'>{user?.email}</p>
        </div>
    </Link>
  )
}

export default SearchUserCard