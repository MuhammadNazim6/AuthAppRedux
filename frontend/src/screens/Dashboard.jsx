import { MdDelete } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa";
import { Button } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

import {
  useGetUsersDataMutation,
  useBlockUserMutation,
  useDeleteUserMutation,
  useUpdateUserAdminMutation,
  useAdminLogoutMutation
} from '../slices/adminApiSlice.js'

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { logout, adminLogout } from '../slices/authSlice'
import { NavLink } from "react-router-dom";
import { staticPath } from "../../constants.js";


// Modal.setAppElement('#root')

function DashBoard() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [userId, setUserId] = useState(null)
  const [data, setData] = useState(true)
  const [updateModalOpen, setUpdateModalOpen] = useState(false)
  const [filteredUsers, setFilteredUsers] = useState([])

  const [showEditModal, setEditModal] = useState(false);
  const [userDataForEdit, setUserDataForEdit ] = useState()

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [getUsersData] = useGetUsersDataMutation();
  const [blockUser] = useBlockUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserAdminMutation();
  const [logoutAdminApiCall] = useAdminLogoutMutation();

  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchUser() {
      const res = await getUsersData().unwrap("");
      setUsers(res.users);
    }
    fetchUser();
  }, [data, getUsersData, updateModalOpen]);

// FILTER USER 
  useEffect(() => {
    const filterUsers = () => {
      const filtered = users.filter((user) => {
        const userName = user.name.toLowerCase();
        const userEmail = user.email.toLowerCase();
        const searchValue = search.toLowerCase();
        return (
          userName.includes(searchValue) || userEmail.includes(searchValue)
        );
      });
      setFilteredUsers(filtered);
    };
    if (users) {
      filterUsers();
    }
  }, [users, search]);


  // ---------------------FOR USER DELETE--------------------------------------
  const handleDelete = async (userId) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete !",
      cancelButtonText: "Cancel!",
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {

        if (userId) {
          await deleteUser(userId).unwrap("");

          setData((prevData) => !prevData);
          setUserId(null);
          setIsOpen(false);
          if (userInfo && userInfo._id === userId) {
            dispatch(logout());
          }
        }
        swalWithBootstrapButtons.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "User was not deleted",
          icon: "error"
        });
      }
    });
  };


  // -----------------------------BLOCK - UNBLOCK USER-----------------------------------
  const handleBlockUnblockUser = async (userId) => {
    const response = await blockUser(userId).unwrap("");
    if (userInfo && userInfo._id === userId) {
      dispatch(logout());
    }
    toast(`User ${response} successfully`)
    const updatedUsers = users.map((user) => {
      if (user._id === userId) {
        return {
          ...user,
          isBlocked: !user.isBlocked,
        };
      }
      return user;
    });
    setUsers(updatedUsers);
  };



  // ------------------------ EDIT USER INFO --------------------------------------
  const handleClose = () => setEditModal(false);
  const handleShow = (userData) =>{
    setEditModal(true);
    console.log(userData);
    // setUserId(userData._id)
    setUserDataForEdit(userData)
  }

  const handleUpdate = async () => {
   
    const emailRegex = /^\S+@\S+\.\S+$/;
    const mobileRegex = /^(?![0-5])\d{10}$/;
    const nameRegex = /^[^\s]+(\s[^\s]+)*$/;
    console.log(userDataForEdit);
    const name = userDataForEdit.name
    const email = userDataForEdit.email
    const mobile = userDataForEdit.mobile.toString()
    const _id = userDataForEdit._id

    if (!name || !mobile || !email) {
      toast.error("All fields should be filled");
    } else if (!name.match(nameRegex)) {
      toast.error("Name cannot contain consecutive spaces");
    } else if (!mobile.match(mobileRegex)) {
      toast.error("Enter a valid mobile number");
    } else if (!email.match(emailRegex)) {
      toast.error("Invalid email address");
    } else if (password && !password.match(passwordRegex)) {
      toast.error(
        "Password must be at least 6 characters and contain at least one special character"
      );
    } else {
      try {
      
        const res = await updateUser({
          _id,
          name,
          email,
          mobile
        }).unwrap("");
        console.log(res);
        // setUpdateModalOpen(false);
        toast.success("Profile updated successfully");
      }catch(err){
        toast.error(err?.data?.message || err.error);
      }
    setUpdateModalOpen(true);
    handleClose()
    }
  };



  // -------------------------log out handling----------------------------------

  const handleLogout = async () => {
    try {
      await logoutAdminApiCall().unwrap();
      dispatch(adminLogout());
      navigate("/admin");
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <div className=" jusify-content-center">
      {/* <div className="w-full flex justify-end">
          <button onClick={handleLogout} className="h-10 w-20 hover:bg-red-700 bg-black rounded-lg text-white hover:scale-105 mr-10 mt-5">Log Out</button>
      </div> */}

      <h1 className="mb-5 text-light">
        Users List
      </h1>

      <form className="form-inline">
        <input className="form-control mr-sm-2 bg-light text-dark border-dark" onChange={(e) => setSearch(e.target.value)} type="search" value={search} placeholder="Search Users" aria-label="Search" />
      </form>
{/* 
      <NavLink to={'/addNewUser'}>
        <button
          type="button"
          className="btn btn-secondary mt-3"
        >
          Add User
        </button>
      </NavLink> */}

      <table className="table table-dark mt-5">
        <thead>
          <tr>
            <th className='p-5' scope="col" >Profile</th>
            <th className='p-5' scope="col">Name</th>
            <th className='p-5' scope="col">Email</th>
            <th className='p-5' scope="col">Mobile</th>
            <th className='p-5' scope="col">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.map((obj, index) => (
            <tr key={index} >
              <td className='p-4'>
                <img src={`${staticPath + obj.profile}`} style={{ 'height': '60px', 'width': '60px', 'borderRadius': '40px' }} alt="dd" />
              </td>
              <td className='p-4'>{obj.name}</td>
              <td className='p-4'>{obj.email}</td>
              <td className='p-4' >{obj.mobile}</td>
              <td>
                <button className="m-2 btn btn-light">
                  <FaUserEdit
                  onClick={()=>handleShow(obj)}
                    size={25}
                    style={{ color: "black", transition: "color 0.3s ease" }}
                  />
                </button>

                <button onClick={() => handleDelete(obj._id)} className="m-2 btn btn-danger" >
                  <MdDelete
                    size={25}
                    style={{ color: "black", transition: "color 0.3s ease" }}
                  />
                </button>

                {obj.isBlocked ? (
                  <button className="btn btn-success m-3" style={{ 'width': '90px' }}
                    onClick={() => handleBlockUnblockUser(obj._id)}
                  >
                    Unblock
                  </button>
                ) : (
                  <button className="btn btn-danger m-3" style={{ 'width': '90px' }}
                    onClick={() => handleBlockUnblockUser(obj._id)}
                  >
                    BLock
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    
      <Modal show={showEditModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit user details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>

              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="name"
                  value={userDataForEdit?.name}
                  placeholder="Enter a name here"
                  onChange={(e)=>{setUserDataForEdit({...userDataForEdit , name:e.target.value})}}
                  autoFocus
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  value={userDataForEdit?.email}
                  placeholder="Enter an email here"
                  onChange={(e)=>{setUserDataForEdit({...userDataForEdit , email:e.target.value})}}
                  autoFocus
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Mobile Number</Form.Label>
                <Form.Control
                  type="text"
                  value={userDataForEdit?.mobile}
                  placeholder="Enter mobile"
                  onChange={(e)=>{setUserDataForEdit({...userDataForEdit , mobile:e.target.value})}}
                  autoFocus
                />
              </Form.Group>

            </Form>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleUpdate}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

    </div>


  );
}


export default DashBoard;



