import React, { useEffect, useState } from 'react';
import {
  Form, Input, Button, Select, message,
} from 'antd';
import apiCalls from './pages/serviceCalls/api.calls';
import { departments, userTypes } from '../enums';

const { Option } = Select;

function CreateAccountPage() {
  const [form] = Form.useForm();
  const [urlLink, setUrlLink] = useState();

  useEffect(() => {
    const currentPathname = window.location.pathname;
    const lastRoute = currentPathname.split('/').filter(Boolean).pop();
    setUrlLink(lastRoute);
  }, []);

  const userTypesArray = Object.keys(userTypes).map((key) => ({
    key: Number(key),
    value: userTypes[key],
  }));
  const departmentTypeArray = Object.keys(departments).map((key) => ({
    key: Number(key),
    value: departments[key],
  }));

  const onFinish = async (values) => {
    apiCalls.createAccount(values)
      .then((userId) => {
        message.success('Account created successfully!');
        window.localStorage.setItem('loggedInUser', userId);
      })
      .catch(() => message.error('Failed to create account.'));
  };

  return (
    <div
      style={{
        backgroundImage: 'url("https://i.ibb.co/q9pmSSm/pexels-creative-vix-9754.jpg")',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundSize: '120%',
      }}
    >
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        style={{
          width: '500px',
          padding: '10px',
          background: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
          margin: '0px',
          marginTop: '10px',
        }}
      >
        <Form.Item label="Full Name" name="fullName" rules={[{ required: true, message: 'Please enter your full name' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Please enter a valid email address' }]}>
          <Input style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please enter your password' }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item label="Address" name="address" rules={[{ required: true, message: 'Please enter your address' }]}>
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
        <Form.Item label="User Type" name="userType" rules={[{ required: true, message: 'Please select a user type' }]}>
          <Select>
            {userTypesArray.map((data) => (
              <Option key={data.key} value={data.key}>
                {data.value}
              </Option>
            ))}
          </Select>
        </Form.Item>
        {urlLink === 'addOfficers' && (
          <Form.Item label="Department" name="department" rules={[{ required: true, message: 'Please select the department' }]}>
            <Select>
              {departmentTypeArray.map((data) => (
                <Option key={data.key} value={data.key}>
                  {data.value}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default CreateAccountPage;
