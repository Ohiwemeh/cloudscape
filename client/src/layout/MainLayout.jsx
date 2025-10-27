import React, { useState, useEffect } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import NavBar from '../components/NavBar';

const MainLayout = () => {
 
  return (
    <div>
    <NavBar/>

      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
