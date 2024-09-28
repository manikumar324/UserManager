import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Table } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const DashBoard = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    designation: '',
    gender: '',
    course: '',
    image: null,
  });
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); 
  const [filteredEmployee, setFilteredEmployee] = useState([]);

  const handleCreateEmployeeClick = () => {
    setShowModal(true);
    setFormData({
      name: '',
      email: '',
      mobile: '',
      designation: '',
      gender: '',
      course: '',
      image: null,
    });
    setSelectedUser(null); 
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("https://dealsdrayclient.onrender.com/users");
      setUsers(response.data.data);
      setFilteredEmployee(response.data.data); 
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers(); 
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
    }
  };

  const handleCourseChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, course: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, mobile, designation, gender, course, image } = formData;

    const formDataToSend = new FormData();
    formDataToSend.append('name', name);
    formDataToSend.append('email', email);
    formDataToSend.append('mobile', mobile);
    formDataToSend.append('designation', designation);
    formDataToSend.append('gender', gender);
    formDataToSend.append('course', course);
    if (image) {
      formDataToSend.append('image', image);
    }

    try {
      if (selectedUser) {
        const response = await axios.put(`https://dealsdrayclient.onrender.com/employee/${selectedUser._id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success("Employee Updated")
        console.log(response.data);
      } else {
        const response = await axios.post('https://dealsdrayclient.onrender.com/employee', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success("Employee Added")
        console.log(response.data);
      }
      fetchUsers();
      setShowModal(false);
    } catch (error) {
      console.error('Error submitting form:', error.response?.data || error.message);
    }
  };

  const updateUser = (user) => {
    setSelectedUser(user); 
    setFormData({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      designation: user.designation,
      gender: user.gender,
      course: user.course,
      image: user.image,
    });
    setShowModal(true); 
  };

  const deleteUser = async (selectedUser) => {
    try {
      await axios.delete(`https://dealsdrayclient.onrender.com/employee/${selectedUser._id}`);
      toast.success("Employee Removed")
      fetchUsers(); 
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      render: (text, record) => (
        record.image ? (
          <img 
            src={record.image} 
            alt={record.name} 
            className='w-16 h-16 object-cover rounded' 
          />
        ) : null
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Mobile',
      dataIndex: 'mobile',
    },
    {
      title: 'Designation',
      dataIndex: 'designation',
    },
    {
      title: 'Course',
      dataIndex: 'course',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
    },
    {
      title: 'Actions',
      render: (text, record) => (
        <>
          <Button className='bg-gray-600 text-white' onClick={() => updateUser(record)}>
            Edit
          </Button>
          <Button className='bg-red-500 text-white' onClick={() => deleteUser(record)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  const navigate = useNavigate();

  const logout = () => {
    toast.success("Logged Out");
    navigate("/");
  };

  const userName = localStorage.getItem("userName");

  const filterEmployees = (e) => {
    const value = e.target.value.toLowerCase();
    if (!value) {
      setFilteredEmployee(users); 
      return;
    }

    const filtered = users.filter((user) => {
      return (
        user.name.toLowerCase().includes(value) ||
        user.email.toLowerCase().includes(value) ||
        user.mobile.toLowerCase().includes(value) ||
        user.designation.toLowerCase().includes(value) ||
        user.course.toLowerCase().includes(value) ||
        user.gender.toLowerCase().includes(value)
      );
    });

    setFilteredEmployee(filtered); 
  };

  return (
    <>
      
      <Toaster />
      <nav className='h-[10vh] flex w-[100vw] items-center bg-black'>
        <ul className='flex w-[100vw] justify-around items-center text-white'>
          <li>Home</li>
          <li className='text-green-500 font-bold'>{userName}</li>
          <button className='bg-orange-500 p-2' onClick={logout}>Logout</button>
        </ul>
      </nav>

      
      <div className='flex flex-col justify-center items-center h-[50vh]'>
        <Link to="/Dashboard"><h1>Welcome To Admin Panel</h1></Link>
        <Button
          type='primary'
          className='mt-3'
          onClick={handleCreateEmployeeClick}
        >
          Create Employee
        </Button>
      </div>
<div className='flex flex-col justify-center items-center'>
      <h2 className='text-2xl font-bold text-center'>Users List</h2>

      <input 
        type='text' 
        id="filter" 
        placeholder='Search' 
        onChange={filterEmployees} 

        className='mb-4 p-2 border  border-gray-300 rounded-lg'
      />
      </div>

      <div className='overflow-x-auto flex justify-center items-center'>
        <Table 
          columns={columns} 
          dataSource={filteredEmployee} 
          rowKey="_id" 
          pagination={{ pageSize: 3 }} 
        />
      </div>

     
      <Modal
        title={selectedUser ? 'Edit Employee' : 'Create Employee'}
        visible={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
      >
        <form className='bg-gray-200 p-4 rounded-lg shadow-md' onSubmit={handleSubmit}>
        <div className='mb-4'>
            <label className='block text-gray-700'>Name</label>
            <input
              type='text'
              name='name'
              className='w-full p-2 border border-gray-300 rounded-lg'
              placeholder='Enter Name'
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>

         
          <div className='mb-4'>
            <label className='block text-gray-700'>Email</label>
            <input
              type='email'
              name='email'
              className='w-full p-2 border border-gray-300 rounded-lg'
              placeholder='Enter Email'
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          
          <div className='mb-4'>
            <label className='block text-gray-700'>Mobile Number</label>
            <input
              type='tel'
              name='mobile'
              className='w-full p-2 border border-gray-300 rounded-lg'
              placeholder='Enter Mobile Number'
              value={formData.mobile}
              onChange={handleInputChange}
            />
          </div>

          
          <div className='mb-4'>
            <label className='block text-gray-700'>Designation</label>
            <select
              name='designation'
              className='w-full p-2 border border-gray-300 rounded-lg'
              value={formData.designation}
              onChange={handleInputChange}
            >
              <option value=''>Select Designation</option>
              <option value='hr'>HR</option>
              <option value='manager'>Manager</option>
              <option value='sales'>Sales</option>
            </select>
          </div>

          
          <div className='mb-4'>
            <label className='block text-gray-700'>Gender</label>
            <div>
              <input
                type='radio'
                name='gender'
                value='male'
                checked={formData.gender === 'male'}
                onChange={handleInputChange}
              /> Male
              <input
                type='radio'
                name='gender'
                value='female'
                checked={formData.gender === 'female'}
                onChange={handleInputChange}
              /> Female
            </div>
          </div>

          
          <div className='mb-4 '>
            <label className='block text-gray-700'>Course</label>
            <div className=''>
              <input
                type='checkbox'
                value='BCA'
                onChange={handleCourseChange}
              /> BCA
              <input
                type='checkbox'
                value='BSC'
                className='ml-4'
                onChange={handleCourseChange}
              /> BSC
              <input
                type='checkbox'
                value='MCA'
                className='ml-4'
                onChange={handleCourseChange}
              />MCA
            </div>
          </div>

          <div className='mb-4'>
            <label className='block text-gray-700'>Image</label>
            <input
              type='file'
              accept='image/*'
              onChange={handleFileChange}
            />
          </div>

          
          <Button type='primary' htmlType='submit' className='w-full'>
            {selectedUser ? 'Update Employee' : 'Create Employee'}
          </Button>
        </form>
      </Modal>
    </>
  );
};

export default DashBoard;