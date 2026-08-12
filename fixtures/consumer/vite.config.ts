import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// The fixture runs its own Tailwind build so it reproduces what a real consumer
// has: our precompiled utilities and theirs, in one stylesheet, independently
// sorted. See src/app.css.
export default defineConfig({
  plugins: [tailwindcss()],
})
