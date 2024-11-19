import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom' 
import './index.css'

import MainPage from './pages/ShipsPage/ShipsPage';
import ShipPage from './pages/ShipPage/ShipPage';
import {HomePage} from './pages/HomePage/HomePage';
import Layout from './components/Layout/Layout';

const router = createBrowserRouter([
  {
    path: '/',
    element:( 
      <Layout>
        <HomePage />
      </Layout>)
  },
  {
    path: '/ships',
    element:( 
    <Layout>
      <MainPage />
    </Layout>)
  },
  {
    path: '/ships/:shipId',
    element:( 
      <Layout>
        <ShipPage />
      </Layout>)
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </StrictMode>,
)