import React, { useEffect } from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import {
    Form, Input, Button, Upload, message, DatePicker, Select,
 } from 'antd';
 import _ from 'lodash';
import moment from 'moment/moment';
import { InboxOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import apiCalls from '../loginPages/pages/serviceCalls/api.calls';
import { auth } from '../configurations/firebase';
import { departments } from '../enums';

const { Dragger } = Upload;
const { Option } = Select;

const backgroundStyle = {
  backgroundImage: 'url("https://images.unsplash.com/photo-1506452305024-9d3f02d1c9b5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
const formContainerStyle = {
  width: '600px',
  padding: '50px',
  background: 'rgba(255, 255, 255, 0.8)',
  borderRadius: '10px',
};

// Enum for problem types
export const ProblemTypes = {
  WILDLIFE: 'wildlife',
  FORESTRY: 'forestry',
  ENVIRONMENTAL_CRIME: 'environmentalCrime',
};
function AddComplaint({ editMode = false, complaintId = null }) {
    const [form] = Form.useForm();
    const departmentTypeArray = Object.keys(departments)
    .map((key) => ({ key: Number(key), value: departments[key] }));

    useEffect(() => {
      if (editMode) {
        // Fetch complaint details when in edit mode
        // Assuming you have an API call to fetch complaint details by ID
        apiCalls.getComplain({ id: complaintId }).then((complaint) => {
          // Populate form fields with complaint details
          form.setFieldsValue({
            description: complaint.description,
            location: complaint.location,
            timeFrame: moment(complaint.timeFrame), // assuming moment is imported
            problemType: complaint.problemType,
          });
        });
      }
    }, [editMode, complaintId]);

    const onFinish = async (values) => {
      try {
        const formData = new FormData();
        formData.append('image', !_.isUndefined(values.image) ? values.image[0].originFileObj : '');
        formData.append('description', values.description);
        formData.append('location', values.location);
        formData.append('timeFrame', values.timeFrame.format());
        formData.append('problemType', values.problemType);
        formData.append('complainedBy', auth.currentUser.uid);

        if (editMode) {
          formData.append('complaintId', complaintId);
        }

        (!editMode ? apiCalls.createComplain(formData)
        : apiCalls.editComplain(formData)).then(() => {
          message.success(`${editMode ? 'Complaint updated' : 'Complaint added'} successfully`);
          form.resetFields();
        });
      } catch (error) {
        console.error(`Error ${editMode ? 'updating' : 'adding'} complaint:`, error);
        message.error(`Failed to ${editMode ? 'update' : 'add'} complaint`);
      }
    };

    const beforeUpload = (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
      }
      return isImage;
    };

    const handleImageChange = (info) => {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    };

  return (
  <div style={backgroundStyle}>
    <div style={formContainerStyle}>
       <h2>{editMode ? 'Edit Complaint' : 'Add Complaint'}</h2>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Please enter the description' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Location"
          name="location"
          rules={[{ required: true, message: 'Please enter the location' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Time Frame"
          name="timeFrame"
          rules={[{ required: true, message: 'Please select the time frame' }]}
        >
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Problem Type"
          name="problemType"
          rules={[{ required: true, message: 'Please select the problem type' }]}
        >
          <Select>
          {departmentTypeArray.map((data) => (
            <Option value={data.key} key={data.key}>
              {data.value}
            </Option>
          ))}
          </Select>
        </Form.Item>

        {!editMode && (
        <Form.Item
          label="Image"
          name="image"
          valuePropName="fileList"
          getValueFromEvent={(e) => e.fileList}
          rules={[{ required: true, message: 'Please upload an image' }]}
        >
          <Dragger beforeUpload={beforeUpload} onChange={handleImageChange} accept="image/*" showUploadList={false}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag image to this area to upload</p>
          </Dragger>
        </Form.Item>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {editMode ? 'Edit Complain' : 'Add Complaint'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  </div>
  );
}

export default AddComplaint;

AddComplaint.propTypes = {
    editMode: PropTypes.bool,
    complaintId: PropTypes.number,
};

AddComplaint.defaultProps = {
    editMode: false,
    complaintId: null,
};
