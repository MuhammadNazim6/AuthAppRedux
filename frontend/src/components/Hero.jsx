import { Container , Card , Button } from "react-bootstrap";
import { LinkContainer } from 'react-router-bootstrap';


const Hero = ()=>{
  return(
    <div className="py-5">
      <Container className="d-flex justify-content-center">
        <Card className="p-5 d-flex flex-column align-items-center hero-card bg-light w-75">
          <h1 className="text-center mb-4">Welcome to the Homepage</h1>
          <p className="text-center mb-4">
          This attribute indicates that the Navbar should automatically collapse 
          its content when an item is selected. This is commonly used in responsive 
          navigation bars for better user experience on smaller screens.
          </p>
          {/* <div className="d-flex">
            <LinkContainer to='/login'>
            <Button variant="dark" className="me-3">
              Sign In
            </Button>
            </LinkContainer>

            <LinkContainer to='/register'>
              <Button variant="secondary" className="me-3">
              Register       
              </Button>
            </LinkContainer>
            
          </div> */}
        </Card>
      </Container>
    </div>
  )
}

export default Hero