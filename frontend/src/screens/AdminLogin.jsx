import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {Form , Button , Row ,Col} from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { useAdminLoginMutation } from "../slices/adminApiSlice";
import { setAdminCredentials } from "../slices/authSlice";
import { toast } from 'react-toastify';



function AdminLogin() {
    const [email, setEmaiil] = useState('')
    const [password, setPassword] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [login] = useAdminLoginMutation();

    
    const {adminInfo} = useSelector((state)=>state.auth)
    
    useEffect(()=>{
        if(adminInfo){
            navigate('/dashboard')
        }
    },[navigate, adminInfo])

    const submitHandler = async(e)=>{
        e.preventDefault();
        try {
            const res = await login({email, password}).unwrap();
            dispatch(setAdminCredentials({...res}))
            navigate('/dashboard')
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    }


    return (
        <div >
        <div >
         
            <h2>
              Admin Sign In
            </h2>
          </div>

              <input onChange={(e)=> setEmaiil(e.target.value)}
              value={email}
                placeholder=""
              />
              <label
              >
                Email
              </label>
            

            <div>
              <input onChange={(e)=> setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder=""
              />
              <label
              >
                Password
              </label>
            </div>


            <button onClick={submitHandler}
             
              type="button"
            >
              Sign In
            </button>
          
      </div>
    );
}

export default AdminLogin