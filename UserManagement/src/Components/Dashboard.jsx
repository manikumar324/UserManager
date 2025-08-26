import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Table } from "antd";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const DashBoard = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    designation: "",
    gender: "",
    course: "",
    image: null,
  });
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filteredEmployee, setFilteredEmployee] = useState([]);

  const handleCreateEmployeeClick = () => {
    setShowModal(true);
    setFormData({
      name: "",
      email: "",
      mobile: "",
      designation: "",
      gender: "",
      course: "",
      image: null,
    });
    setSelectedUser(null);
  };
//here we are fetching the server api
  const fetchUsers = async () => {
    try {
      const response = await axios.get("https://usermanagerserver.onrender.com/users");
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
    const { name, email, mobile, designation, gender, course, image } =
      formData;

    const formDataToSend = new FormData();
    formDataToSend.append("name", name);
    formDataToSend.append("email", email);
    formDataToSend.append("mobile", mobile);
    formDataToSend.append("designation", designation);
    formDataToSend.append("gender", gender);
    formDataToSend.append("course", course);
    if (image) {
      formDataToSend.append("image", image);
    }

    try {
      if (selectedUser) {
        const response = await axios.put(
          `https://usermanagerserver.onrender.com/employee/${selectedUser._id}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Employee Updated");
        console.log(response.data);
      } else {
        const response = await axios.post(
          "https://usermanagerserver.onrender.com/employee",
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Employee Added");
        console.log(response.data);
      }
      fetchUsers();
      setShowModal(false);
    } catch (error) {
      console.error(
        "Error submitting form:",
        error.response?.data || error.message
      );
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
      await axios.delete(`https://usermanagerserver.onrender.com/employee/${selectedUser._id}`);
      toast.success("Employee Removed");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const navigate = useNavigate();

  const logout = () => {
    toast.success("Logged Out");
    navigate("/");
  };

  const home=()=>{
    navigate("/Dashboard")
  }

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
      <nav className="h-[10vh] flex w-[100vw] items-center bg-gray-200">
        <ul className="flex w-[100vw] justify-around items-center text-white">
          <li onClick={home} className="font-bold lg:text-xl text-yellow-500 cursor-pointer">Home</li>
          <li className="text-violet-500 font-bold lg:text-xl italic">{userName}</li>
          <button className="bg-orange-500 p-2 lg:text-xl font-bold text-sm rounded-full" onClick={logout}>
            Logout
          </button>
        </ul>
      </nav>

      <div className="flex flex-col justify-center items-center h-[50vh]">
        <Link to="/Dashboard">
          <h1 className="font-bold text-xl lg:text-5xl">Welcome To Admin Panel</h1>
        </Link>
        <Button
          type=""
          className="mt-3 bg-green-500 text-[#ffffff] font-semibold"
          onClick={handleCreateEmployeeClick}
        >
          Create Employee
        </Button>
      </div>
      <div className="flex flex-col justify-center items-center space-y-2 mb-3">
        <h2 className="text-xl font-bold text-center ">Users List</h2>
        <h3 className="font-semibold italic">No.of Employees : <span className="font-bold text-orange-500">{users.length}</span></h3>
        <input
          type="text"
          id="filter"
          placeholder="Search"
          onChange={filterEmployees}
          className="mb-4 p-2 border  border-gray-300 rounded-lg"
        />
      </div>

      <div className="flex flex-wrap justify-center items-center">
  {users && users.length === 0 ? (
    <p className="text-2xl font-bold text-red-500">No Users Yet 😞</p>
  ) : (
    users && users.map((user) => (
      <div
        key={user._id}
        className="bg-white shadow-md p-4 m-4 rounded-lg w-[300px]"
      >
        
        {user.image && (
          <div className="flex justify-center">
            <img
            src={user.image}
            alt={user.name}
            className="w-[100px] h-[100px] text-center object-cover rounded-full mb-4"
          />
          </div>
        )}
       
        <h3 className="text-md font-semibold">Name : <span className="font-normal">{user.name}</span></h3>
        <p className="text-md font-semibold">Email : <span className="font-normal">{user.email}</span></p>
        <p className="text-md font-semibold">Mobile : <span className="font-normal">{user.mobile}</span></p>
        <p className="text-md font-semibold">Designation : <span className="font-normal">{user.designation}</span></p>
        <p className="text-md font-semibold">Course : <span className="font-normal">{user.course}</span></p>
        <p className="text-md font-semibold">Gender : <span className="font-normal">{user.gender}</span></p>
        <div className="flex justify-between mt-4">
          <Button
            className="bg-gray-600 text-white font-bold"
            onClick={() => updateUser(user)}
          >
            Edit
          </Button>
          <Button
            className="bg-red-500 text-white font-bold"
            onClick={() => deleteUser(user)}
          >
            Delete
          </Button>
        </div>
      </div>
    ))
  )}
</div>


      <Modal
        title={selectedUser ? "Edit Employee" : "Create Employee"}
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
      >
        <form
          className="bg-gray-200 p-4 rounded-lg shadow-md"
          onSubmit={handleSubmit}
        >
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Enter Name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Mobile Number</label>
            <input
              type="tel"
              name="mobile"
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Enter Mobile Number"
              value={formData.mobile}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Designation</label>
            <select
              name="designation"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={formData.designation}
              onChange={handleInputChange}
            >
              <option value="">Select Designation</option>
              <option value="hr">HR</option>
              <option value="manager">Manager</option>
              <option value="sales">Sales</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Gender</label>
            <div>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === "male"}
                onChange={handleInputChange}
              />{" "}
              Male
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === "female"}
                onChange={handleInputChange}
              />{" "}
              Female
            </div>
          </div>

          <div className="mb-4 ">
            <label className="block text-gray-700">Course</label>
            <div className="">
              <input
                type="checkbox"
                value="BCA"
                onChange={handleCourseChange}
              />{" "}
              BCA
              <input
                type="checkbox"
                value="BSC"
                className="ml-4"
                onChange={handleCourseChange}
              />{" "}
              BSC
              <input
                type="checkbox"
                value="MCA"
                className="ml-4"
                onChange={handleCourseChange}
              />
              MCA
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Image</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          <Button type="primary" htmlType="submit" className="w-full">
            {selectedUser ? "Update Employee" : "Create Employee"}
          </Button>
        </form>
      </Modal>
    </>
  );
};

export default DashBoard;
