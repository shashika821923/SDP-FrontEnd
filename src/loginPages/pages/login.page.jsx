import React, { useEffect, useState } from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import _ from 'lodash';
import {
  Form, Input, Button, message,
} from 'antd';
import { ref, onValue } from 'firebase/database';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, database } from '../../configurations/firebase';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LoginComponent.css';

function LoginComponent() {
  const [form] = Form.useForm();
  const [userId, setUserId] = useState(null);
  const [userDataObj, setUserData] = useState('');
  const [isFormVisible, setFormVisible] = useState(false);

  const onFinish = async (values) => {
    const { email, password } = values;
    try {
      const userData = await signInWithEmailAndPassword(auth, email, password);
      setUserId(userData.user.reloadUserInfo.localId);
      message.success('Login successful!');
      window.localStorage.setItem('userId', userData.user.reloadUserInfo.localId);
      window.location.replace('/complainListing');
    } catch (error) {
      message.error('Login failed. Please check your email and password.');
    }
  };

  useEffect(() => {
    if (!_.isNull(userId)) {
      const userIdData = auth.currentUser.uid;
      const userRef = ref(database, `/users/${userIdData}`);

      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        setUserData(data);
      });
    }
  }, [userId, database, auth]);

  useEffect(() => {
    console.log('userData:', userDataObj);
  }, [userDataObj]);

  useEffect(() => {
    // Delay the form visibility to create an animation effect
    const timeout = setTimeout(() => {
      setFormVisible(true);
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  const containerStyle = {
    background: 'url("https://i.ibb.co/q9pmSSm/pexels-creative-vix-9754.jpg") no-repeat center center fixed',
    backgroundSize: 'cover',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const formStyle = {
    maxWidth: '500px',
    width: '130%',
    background: 'rgba(255, 255, 255, 0.7)',
    padding: '25px',
    borderRadius: '15px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.8)',
    opacity: isFormVisible ? 1 : 0,
    transition: 'opacity 0.5s ease', // CSS transition for opacity
  };

  return (
    <div style={containerStyle}>
      <Form form={form} onFinish={onFinish} layout="vertical" style={formStyle}>
        <h1 style={{ color: 'black', textAlign: 'center', marginBottom: '20px' }}>Login</h1>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Please enter a valid email address' },
          ]}
          style={{ marginBottom: '15px' }}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please enter your password' }]}
          style={{ marginBottom: '40px' }} // button gap
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ float: 'right' }}>
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default LoginComponent;
