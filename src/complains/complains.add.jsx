import React, { useEffect } from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import {
    Form, Input, Button, Upload, message, DatePicker, Select,
 } from 'antd';
import moment from 'moment/moment';
import { InboxOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import apiCalls from '../loginPages/pages/serviceCalls/api.calls';
import { auth } from '../configurations/firebase';

const { Dragger } = Upload;
const { Option } = Select;

// Enum for problem types
export const ProblemTypes = {
  WILDLIFE: 'wildlife',
  FORESTRY: 'forestry',
  ENVIRONMENTAL_CRIME: 'environmentalCrime',
};

function AddComplaint({ editMode = false, complaintId = null }) {
    const [form] = Form.useForm();

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
        formData.append('image', values.image[0].originFileObj);
        formData.append('description', values.description);
        formData.append('location', values.location);
        formData.append('timeFrame', values.timeFrame.format());
        formData.append('problemType', values.problemType);
        formData.append('complainedBy', auth.currentUser.uid);

        if (editMode) {
          // If in edit mode, include the complaint ID
          formData.append('complaintId', complaintId);
        }

        (editMode ? apiCalls.createComplain(formData)
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
    <div>
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
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
        </Form.Item>

        <Form.Item
          label="Problem Type"
          name="problemType"
          rules={[{ required: true, message: 'Please select the problem type' }]}
        >
          <Select>
            <Option value={ProblemTypes.WILDLIFE}> Against Wildlife</Option>
            <Option value={ProblemTypes.FORESTRY}> Against Forestry</Option>
            <Option value={ProblemTypes.ENVIRONMENTAL_CRIME}> Against Environmental Crime</Option>
          </Select>
        </Form.Item>

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

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Complaint
          </Button>
        </Form.Item>
      </Form>
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
