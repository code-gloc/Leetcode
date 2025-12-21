import axios from "axios";
const axiosClient=axios.create({
    baseURL:"https://codex-rzgk.onrender.com",
    withCredentials:true,
    headers:{
        'Content-Type': 'application/json'
    }
});
export default axiosClient;