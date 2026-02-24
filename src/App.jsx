import React from "react";
import { Routes, Route } from "react-router-dom";
import Form from "./components/Form";
import Newaccount from "./components/Newaccount";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // ✅ Don't forget this

import VerifyEmailCode from "./components/Verifyemail";
import Userdashboard from "./components/UserDashboard";
import ProtectedRoute from "./Protection/Protectroute";
import ForgotPassword from "./components/ForgetPassword";
import SuccessMessage from "./components/SubmissionSuccess";
import UserProfile from "./components/Userprofiledetail";
// import ProfileDetail from "./components/Userprofiledetail";



function App() {
  return (
    <div>
      <ToastContainer
  position="top-center"
  autoClose={1000}
  closeOnClick
  draggable
  pauseOnHover
  pauseOnFocusLoss={false}
  theme="light"
  toastClassName="bg-white text-black border border-gray-300 rounded shadow-md p-4"
  bodyClassName="text-sm"
  progressClassName="bg-blue-500"
/>

      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/create" element={<Newaccount />} />
        
        <Route path="/success" element={<SuccessMessage />} />
<Route path="/profile/:id" element={<UserProfile/>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />


       <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Userdashboard />
            </ProtectedRoute>
          }
        />


    
{/* <Route path="/profile/:id" element={<ProfileDetail />} /> */}
        
        <Route path="/verify-email" element={<VerifyEmailCode />} /> {/* Add this line */}
       
      

        
        
      


      </Routes>
    </div>
  );
}

export default App;