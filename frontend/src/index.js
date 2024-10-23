import React from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { RouterProvider } from 'react-router-dom'
import router from './routes'
import axios from 'axios'
import { Provider } from 'react-redux'
import { store } from './redux/store';


axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
        <RouterProvider router={router}>
          <App />
        </RouterProvider>
    </Provider>
  </React.StrictMode>
);
