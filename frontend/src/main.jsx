import React from 'react' 
import ReactDOM from 'react-dom/client' 
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'

import LoginPage from './pages/LoginPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
  },
  {
    path: '/dashboard',
    
    element: <DashboardPage />,
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)