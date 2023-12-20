import React, { useEffect, useState } from 'react';
import {
    getDatabase, ref, onValue, remove,
 } from 'firebase/database';
import {
    Table, Space, Button, message,
 } from 'antd';
import {
    deleteUserById,
 } from '../configurations/firebase'; // Import the deleteUser method
 import 'bootstrap/dist/css/bootstrap.min.css';
 import './UsersList.css';

 function UsersList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const usersRef = ref(getDatabase(), 'users');

    const fetchData = async () => {
      try {
        onValue(usersRef, (snapshot) => {
          const data = snapshot.val();

          if (data) {
            const userList = Object.keys(data).map((userId) => ({
              userId,
              ...data[userId],
            }));
            setUsers(userList);
          } else {
            setUsers([]);
          }
        });
      } catch (error) {
        message.error('Failed to fetch users. Please try again.');
      }
    };

    fetchData();
  }, []);

  const handleDeleteUser = async (userId) => {
    const userRef = ref(getDatabase(), `users/${userId}`);

    try {
      // Delete user from Firebase Authentication
      await deleteUserById(userId);

      // Delete user from Firebase Realtime Database
      remove(userRef);

      message.success('User deleted successfully.');
    } catch (error) {
      console.error(error);
      message.error('Failed to delete user. Please try again.');
    }
  };

  const columns = [
    {
      title: 'User ID',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleDeleteUser(record.userId)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="users-list-container">
      <div className="overlay" />
      <img src="https://i.ibb.co/3RQ1WPP/pexels-mali-maeder-142497.jpg" alt="UsersList Background" className="users-list-background" />
      <Table dataSource={users} columns={columns} className="custom-ant-table" />
    </div>
  );
}

export default UsersList;
