import { RouterProvider } from 'react-router-dom'
import { router } from '@/routes'
import { PrimeReactProvider } from 'primereact/api'

function App() {
  const value = {
    ripple: true
  }
  return (
    <PrimeReactProvider value={value}>
      <RouterProvider router={router} />
    </PrimeReactProvider>
  )
}

export default App
