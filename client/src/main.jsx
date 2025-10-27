import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { CartProvider } from "./context/CartContext";
import AppRouter from './route.jsx'


createRoot(document.getElementById('root')).render(
 <CartProvider>
    <AppRouter />
  </CartProvider>
)
