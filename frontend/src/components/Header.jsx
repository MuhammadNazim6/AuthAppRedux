import { Navbar, Nav, Container ,NavDropdown , Badge } from 'react-bootstrap';
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa'
import {useSelector ,useDispatch} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap';
import {useLogoutMutation} from '../slices/userApiSlice';
import { useAdminLogoutMutation } from '../slices/adminApiSlice';
import { logout , adminLogout} from '../slices/authSlice'

function Header() {
  const {userInfo ,adminInfo} = useSelector((state)=> state.auth)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [logoutApiCall ] = useLogoutMutation();
  const [logoutAdminApiCall] = useAdminLogoutMutation();


  const logoutHandler = async ()=>{
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login')
    } catch (err) {
      console.log(err);
    }
  }
  const adminLogoutHandler = async ()=>{
    try {
      await logoutAdminApiCall().unwrap();
      dispatch(adminLogout());
      navigate('/')
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <header>
      <Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect>
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand >Mern Auth </Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls='basic-controls' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ms-auto'>
              {userInfo ? (
             <>
             <NavDropdown title={userInfo.name} id='username'>
              <LinkContainer to='/profile'>
                <NavDropdown.Item>Profile</NavDropdown.Item>
              </LinkContainer>
              <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
             </NavDropdown>
             </>
              ) : ( adminInfo ? (
                <>
                <NavDropdown title='Welcome Admin' id='username'>
                 {/* <LinkContainer to='/profile'>
                   <NavDropdown.Item>Profile</NavDropdown.Item>
                 </LinkContainer> */}
                 <NavDropdown.Item onClick={adminLogoutHandler}>Logout</NavDropdown.Item>
                </NavDropdown>
                </>
                 ) :
                <>
                <LinkContainer to='/login'>
                  <Nav.Link>
                    <FaSignInAlt /> Sign In
                  </Nav.Link>
                </LinkContainer>
  
                <LinkContainer to='/register'>
                <Nav.Link>
                  <FaSignOutAlt /> Sign Up
                </Nav.Link>
                </LinkContainer>
                </> 
              )}

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header