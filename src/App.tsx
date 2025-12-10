import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import './App.css';
import AppRoutes from './routes/appRoutes';


function App() {
  return (
    <>            
    <Toaster position="top-center" richColors />
      <BrowserRouter >
      <AppRoutes/>
    </BrowserRouter>
    </>
  )
}

export default App
