import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import RegisterPage from '../pages/RegisterPage'
import CheckEmailPage from '../pages/CheckEmailPage'
import CheckPasswordPage from '../pages/CheckPasswordPage'
import HomePage from '../pages/HomePage'
import Messages from '../components/messages'
import AuthLayout from '../layouts'
import ForgotPasswordPage from '../pages/forgotPasswordPage'


const router = createBrowserRouter([
    {
        path: '/',
        element: <App/>,
        children: [
            {
                path: 'register',
                element: <AuthLayout><RegisterPage/></AuthLayout> 
            },
            {
                path: 'email',
                element: <AuthLayout><CheckEmailPage/></AuthLayout> 
            },
            {
                path: 'password',
                element: <AuthLayout><CheckPasswordPage/></AuthLayout>  
            },
            {
                path: 'forget-password',
                element: <AuthLayout><ForgotPasswordPage/></AuthLayout> 
            },
            {
                path: '',
                element: <HomePage/>,
                children: [
                    {
                        path: ':userId',
                        element: <Messages/>
                    }
                ]
            },
        ]
    }
])

export default router