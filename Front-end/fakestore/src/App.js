// src/App.js
import Main from './components/pages/main/Main.js';
import Login from './components/pages/auth/conta/login.js';
import Register from './components/pages/auth/register/register.js';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext.js';
import ProtectedRoute from './components/ProtectedRoute';

// Importações do Toast
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/register" element={<Register/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/" element={
              <ProtectedRoute>
                <Main/>
              </ProtectedRoute>
            }/>
          </Routes>
          
          {/* Container das notificações */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
