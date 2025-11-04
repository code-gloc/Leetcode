import {Routes, Route } from "react-router";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import AdminPanel from "./pages/AdminPanel";
import ProblemPage from "./pages/ProblemPage";
import { checkAuth } from "./authSlice";
import { useDispatch,useSelector } from "react-redux";
import { useEffect } from "react";
import { Navigate } from "react-router";
import authReducer from "./authSlice";
import AdminCreate from "./components/AdminCreate";
import AdminDelete from "./components/AdminDelete";
import AdminUpdate from "./components/AdminUpdate";
import AdminVideo from "./components/adminVideo";

function App(){

  //code for is authenticated
  const {isAuthenticated,user,loading}=useSelector((state)=>state.auth);
  const dispatch=useDispatch();
  useEffect(()=>{
    dispatch(checkAuth());
  },[dispatch]);

  // console.log(user);
  //console.log(isAuthenticated);
  if(loading)
  {
    return <div className="min-h-screen  flex items-center justify-center">
      <span className="loading loading-spinner loading-lg"></span></div>
  }
  return(
  <>
    <Routes>
      <Route path="/" element={isAuthenticated?<Homepage></Homepage>: <Navigate to="/signup"/>}></Route>
      <Route path="/login" element={isAuthenticated?<Navigate to="/"/>:<Login></Login>}></Route>
      <Route path="/signup" element={isAuthenticated? <Navigate to="/"/>:<Signup></Signup>}></Route>
      {/* <Route path="/admin" element={<AdminPanel></AdminPanel>}></Route> */}
      <Route path="/admin" element={isAuthenticated&&user?.role=="admin" ? <AdminPanel></AdminPanel> : <Navigate to="/"/>}></Route>
      { <Route path="/admin/create" element={isAuthenticated&&user?.role=="admin" ? <AdminCreate></AdminCreate> : <Navigate to="/"/>}></Route>}
      <Route path="/admin/delete" element={isAuthenticated&&user?.role=="admin" ? <AdminDelete></AdminDelete> : <Navigate to="/"/>}></Route>
      <Route path="/admin/update" element={isAuthenticated&&user?.role=="admin" ? <AdminUpdate></AdminUpdate> : <Navigate to="/"/>}></Route>
      <Route path="/admin/video" element={isAuthenticated&&user?.role=="admin" ? <AdminVideo></AdminVideo>:<Navigate to="/"/>}></Route>
      <Route path="/problem/:problemId" element={<ProblemPage></ProblemPage>}></Route>
    </Routes>
    <Toaster position="bottom-center" reverseOrder={false}></Toaster>
  </>
  )
}

export default App;