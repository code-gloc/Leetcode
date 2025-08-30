import axiosClient from "./utils/axiosclient";
import {createAsyncThunk,createSlice} from '@reduxjs/toolkit';
export const registerUser=createAsyncThunk(
    'auth/register',
    async(userData,{rejectWithValue})=>{
        try{
            const responce=await axiosClient.post('/user/register',userData);
            return responce.data.user;
        }
        catch(error){
            const message=
            error.response ? error.response.data.message : "Something went wrong";
            return rejectWithValue(message);
        }
    }
);
export const loginUser=createAsyncThunk(
    'auth/login',
    async(credentials,{rejectWithValue})=>{
        try{
            const response=await axiosClient.post('/user/login',credentials);
            return response.data.user;
        }
        catch(error){
            const message=
            error.response ? error.response.data.message : "Something went wrong";
            return rejectWithValue(message);
        }
    }
);

export const checkAuth=createAsyncThunk(
    'auth/check',
    async(_,{rejectWithValue})=>{
        try{
            const response=await axiosClient.get('/user/check');
            return response.data.user;
        }
        catch(error){
            const message=
            error.response ? error.response.data.message : "Something went wrong";
            return rejectWithValue(message);
        }
    }
);

export const logoutUser=createAsyncThunk(
    'auth/logout',
    async(_,{rejectWithValue})=>{
        try{
            const responce=await axiosClient.post('/logout');
            return responce.data.message;
        }
        catch(error){
          const message=
            error.response ? error.response.data.message : "Something went wrong";
            return rejectWithValue(message);
        }
    }
);


const authSlice=createSlice({
    name:'auth',
    initialState:{
        user:null,
        isAuthenticated:false,
        loading:false,
        error:null
    },
    reducers:{

    },
    extraReducers:(builder)=>{
        builder
        .addCase(registerUser.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(registerUser.fulfilled,(state,action)=>{
            state.loading=false;
            state.user=action.payload;
            state.isAuthenticated=!!action.payload;
        })
        .addCase(registerUser.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message||"Something went wrong";
            state.user=null;
            state.isAuthenticated=false;
        })
        //login usercases
        .addCase(loginUser.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(loginUser.fulfilled,(state,action)=>{
            state.loading=false;
            state.user=action.payload;
            state.isAuthenticated=!!action.payload;
        })
        .addCase(loginUser.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message||"Something went wrong";
            state.user=null;
            state.isAuthenticated=false;
        })

        //check for authcases
        .addCase(checkAuth.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(checkAuth.fulfilled,(state,action)=>{
            state.loading=false;
            state.user=action.payload;
            state.isAuthenticated=!!action.payload;
        })
        .addCase(checkAuth.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message||"Something went wrong";
            state.user=null;
            state.isAuthenticated=false;
        })

        //here add cases for logout
        .addCase(logoutUser.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(logoutUser.fulfilled,(state,action)=>{
            state.loading=false;
            state.user=null;
            state.isAuthenticated=false;
            state.error=null;
        })
        .addCase(logoutUser.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message||"Something went wrong";
            state.isAuthenticated=false;
            state.user=null;
        })
    }
})

export default authSlice.reducer;
