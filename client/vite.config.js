import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// Change this import
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
    // Ensure tailwindcss() is here
    tailwindcss(),
  ],
})