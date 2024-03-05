import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAdminLoginMutation } from "../slices/adminApiSlice";
import { setAdminCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";

function AdminLogin() {
  const [email, setEmaiil] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login] = useAdminLoginMutation();

  const { adminInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (adminInfo) {
      navigate("/dashboard");
    }
  }, [navigate, adminInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setAdminCredentials({ ...res }));
      navigate("/dashboard");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="container pt-5 mt-5">
      <div className="row">
        <div className="col-md-7 mx-auto">
          <div style={{ 'backgroundColor': '#e0e0e0', 'padding': '20px', 'margin': '20px' }}>
            <div >
              <div className="d-flex justify-content-center align-items-center mt-5">
                <h1>Admin Login</h1>
              </div>
              <form>
                <div className="form-group pt-3">
                  <label for="email" className="mb-3">Email address</label>
                  <input type="email" onChange={(e) => setEmaiil(e.target.value)} value={email} className="form-control" id="email" placeholder="" />
                </div>
                <div className="form-group my-3">
                  <label for="password" className="mb-3">Password</label>
                  <input onChange={(e) => setPassword(e.target.value)} id='password' value={password} type="password" placeholder="" className="form-control" />
                </div>
                <div className="d-flex justify-content-center ">
                  <button onClick={submitHandler} type="button" className="btn btn-dark mt-3 p-2" style={{ 'width': '200px' }}>Sign in</button>

                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>

  );
}

export default AdminLogin;
