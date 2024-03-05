import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import FormContainer from '../components/FormContainer.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify'
import Loader from '../components/Loader.jsx'
import { useRegisterMutation } from '../slices/userApiSlice.js';
import { setCredentials } from '../slices/authSlice.js';


const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mobile, setMobile] = useState('')
  const [image, setImage] = useState(null)
  const [photo, setPhoto] = useState(null)

  const inputRef = useRef()

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth)

  useEffect(() => {
    if (userInfo) {
      navigate('/')
    }
  }, [navigate, userInfo])

  const handleImageChange = (e)=>{
    setPhoto(e.target.files[0])
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    } 
  }

  const handleImgClick = ()=>{
    inputRef.current.click()
  } 

  const submitHandler = async (e) => {
    e.preventDefault();


    const emailRegex = /^\S+@\S+\.\S+$/;
    const passwordRegex = /^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=.*[a-zA-Z0-9]).{6,}$/;
    const mobileRegex = /^(?![0-5])\d{10}$/;
    const nameRegex = /^[^\s]+(\s[^\s]+)*$/;

    // Check if any field is empty
    if (!name || !mobile || !email || !password ) {
      toast.error("All fields should be filled");
    } else if (!name.match(nameRegex)) {
      toast.error("Name cannot contain consecutive spaces");
    } else if (!mobile.match(mobileRegex)) {
      toast.error(
        "Enter a valid mobile number"
      );
    } else if (!email.match(emailRegex)) {
      toast.error("Invalid email address");
    } else if (!password.match(passwordRegex)) {
      toast.error(
        "Password must be at least 6 characters and contain at least one special character"
      );
    } else if (password !== confirmPassword) {
      toast.error("Password do not match");
    } else if(!image){
      toast.error(
        "Add a profile image"
      )
    }else{ 

      const formData = new FormData();
      formData.append('name',name)
      formData.append('email', email);
      formData.append('password', password);
      formData.append('mobile', mobile);
      formData.append('photo', photo);

      console.log(formData.get('photo'));

      handleRegistration(formData);
      // try {
      //   const res = await register({ name, email, password, mobile }).unwrap();
      //   dispatch(setCredentials({ ...res }))
      //   navigate('/')

      // } catch (error) {
      //   toast.error(err?.data?.message || err.error);
      // }
    }
  }

  const handleRegistration = async (formData)=>{
   try {
    console.log('In handle Registration');
    const res = await register(formData).unwrap();
    console.log(res);
    console.log('DONE');
    dispatch(setCredentials({ ...res }))
    navigate('/')
    console.log('Registration successful:', res);
   } catch (error) {
    console.error('Registration failed:', error);
   }

  }

  return (

    <FormContainer>
      <h1> Sign Up</h1>
      <Form onSubmit={submitHandler}>
        {/* NAME */}
        <Form.Group className='my-2' controlId='name'>
          <Form.Label>Name</Form.Label>
          <Form.Control type='text'
            placeholder='Enter your Name'
            value={name}
            onChange={(e) => setName(e.target.value)}>
          </Form.Control>
        </Form.Group>

        {/* EMAIL */}
        <Form.Group className='my-2' controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control type='email'
            placeholder='Enter Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}>
          </Form.Control>
        </Form.Group>

        {/* Mobile */}
        <Form.Group className='my-2' controlId='mobile'>
          <Form.Label>Mobile</Form.Label>
          <Form.Control type='number'
            placeholder='Enter mobile'
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}>
          </Form.Control>
        </Form.Group>


        <div className="w-1/2 grid items-center justify-center">
          <div className="flex">
          <input
              type="file"
              id="fileInput"
              accept="image/*"
              ref={inputRef}
              style={{ 
              'display':'none'
            }}
              onChange={handleImageChange}
            />
          
            <img
              onClick={handleImgClick}
              className="h-1 w-1 rounded-full max-md:ml-20 mt-3"
              style={{'height':'100px','width':'100px','cursor':'pointer'}}
              src={image}
              alt="."
            />
              {image ? null : (
              <label className='my-4' htmlFor="fileInput">
            <strong className='m-4' style={{'cursor':'pointer'}}>Choose a profile image</strong>
              </label>
              )}
          </div>
          {/* <button onClick={saveimage}  className="h-10 ml-20 w-20 hover:bg-green-500 bg-black rounded-lg text-white hover:scale-105">
                save
              </button> */}
        </div>


        {/* password */}
        <Form.Group className='my-2' controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control type='password'
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}>
          </Form.Control>
        </Form.Group>

        {/* confirm password */}
        <Form.Group className='my-2' controlId='confirmPassword'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control type='password'
            placeholder='Confirm Password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}>
          </Form.Control>
        </Form.Group>
        {isLoading && <Loader />}

        <Button type='submit' variant='primary' className='mt-3'>
          Sign Up
        </Button>

        <Row className='py-3'>
          <Col>
            Already a user ? <Link to='/login'>Login</Link>
          </Col>
        </Row>

      </Form>
    </FormContainer>
  )
}

export default RegisterScreen