import { defineConfig } from 'vite'
import dotenv from 'dotenv';
import react from '@vitejs/plugin-react'

dotenv.config();
export default defineConfig({
  server: {
    port: 80,
    host: '0.0.0.0',
    strictPort: true
  },
  plugins: [react()],
  define: {
    'process.env.GOOGLE_API_KEY': JSON.stringify(process.env.GOOGLE_API_KEY), // Expose the variable
  },
  logLevel: 'warn',
})




