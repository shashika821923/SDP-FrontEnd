import React, { useEffect, useState } from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import _ from 'lodash';
import {
  Form, Input, Button, message,
} from 'antd';
import { ref, onValue } from 'firebase/database';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, database } from '../../configurations/firebase';

function LoginComponent() {
  const [form] = Form.useForm();
  const [userId, setUserId] = useState(null);
  const [userDataObj, setUserData] = useState('');

  const onFinish = async (values) => {
    const { email, password } = values;
    try {
      const userData = await signInWithEmailAndPassword(auth, email, password);
      setUserId(userData.user.reloadUserInfo.localId);
      message.success('Login successful!');
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

  return (
    <div>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Please enter a valid email address' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please enter your password' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default LoginComponent;
