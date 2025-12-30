import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './reducer/combinedReducers.js'
import { Provider } from 'react-redux'

const store = configureStore({
  reducer: rootReducer,
  middleware:(getDefaultMiddleware)=>(
    getDefaultMiddleware({
      serializableCheck:{
        ignoredPaths:["socket.socket"]
      }
    })
  )
  
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
)
