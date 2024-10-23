import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {  
  return (
    <main className='bg-secondary'>
      <Outlet/>
      <ToastContainer />
    </main>
  );
}

export default App;
