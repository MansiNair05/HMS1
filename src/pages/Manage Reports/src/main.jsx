import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';







// Rendering both App and BirthdayAlert inside a parent div or fragment
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div>
      <App />
      

    </div>
  </StrictMode>
);
