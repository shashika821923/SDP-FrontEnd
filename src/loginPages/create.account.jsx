import React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import {
  Form, Input, Button,
} from 'antd';
/* eslint-enable import/no-extraneous-dependencies */
import apiCalls from './pages/serviceCalls/api.calls';

function CreateAccountPage() {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    apiCalls.createAccount(values).then((userId) => window.localStorage.setItem('loggedInUser', userId));
  };
  return (
    <Form form={form} onFinish={onFinish} layout="vertical">

      <Form.Item
        label="Full Name"
        name="fullName"
        rules={[{ required: true, message: 'Please enter your full name' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: 'Please enter your email' },
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
      <Form.Item
        label="Address"
        name="address"
        rules={[{ required: true, message: 'Please enter your address' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Mobile Number"
        name="mobileNumber"
        rules={[
          { required: true, message: 'Please enter your mobile number' },
          { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit mobile number' },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Register
        </Button>
      </Form.Item>
    </Form>
  );
}
export default CreateAccountPage;
