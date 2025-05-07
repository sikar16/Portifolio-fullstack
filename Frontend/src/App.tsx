import './App.css'
import { router } from "./routes/index";
import { RouterProvider } from "react-router-dom";
import { store } from './app/store'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast';

function App() {


  return (
    <>
      <div className="bg-[hsl(var(--primary))] ">
        <Toaster
          position="top-right"
          containerStyle={{
            position: 'fixed',
            top: '10px',
            left: '0',
            right: '0',
            margin: '0 auto',
            zIndex: '9999',
          }}
          toastOptions={{
            style: {
              background: '#ffffff',
              color: '#000000',
              padding: '10px 14px',
              borderRadius: '8px',
            },
          }}
        />
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
      </div>
    </>
  )
}

export default App
