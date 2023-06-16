import { useState } from 'react'
import { ToastContainer } from 'react-toastify';
import './App.css'
import AppLayout from './components/layouts/AppLayout'
import BasicFrom from './components/Form/BasicFrom'
import 'react-toastify/dist/ReactToastify.css';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <AppLayout>
        <ToastContainer />
        <BasicFrom />
      </AppLayout>
    </>
  )
}

export default App
