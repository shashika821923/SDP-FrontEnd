import React, { Fragment } from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
    Button,
    DatePicker, Form, Input, Select, message,
} from 'antd';
import Dragger from 'antd/es/upload/Dragger';
import { InboxOutlined } from '@ant-design/icons';
import apiCalls from '../loginPages/pages/serviceCalls/api.calls';
import { auth } from '../configurations/firebase';
import { statuses } from '../enums';

const { Option } = Select;
function AddHistoryForComplain({ complainId }) {
    const [form] = Form.useForm();
    const complainsStatuses = [...Object.keys(statuses)
    .map((key) => ({ key: Number(key), value: statuses[key] }))];
    const onFinish = async (values) => {
        try {
            const formData = new FormData();
            formData.append('image', !_.isUndefined(values.image) ? values.image[0].originFileObj : '');
            formData.append('complainId', complainId);
            formData.append('description', values.description);
            formData.append('updatedBy', auth.currentUser.uid);
            formData.append('timeFrame', values.timeFrame.format());
            formData.append('status', values.status);

            apiCalls.addComplainHistory(formData).then(() => {
                    message.success('successfully');
                    form.resetFields();
            });
        } catch (error) {
            console.error('Error complaint:', error);
            message.error('Failed to complaint');
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
        <>
            <Form form={form} onFinish={onFinish} layout="vertical">
                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: 'Please enter the description' }]}
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
                <Form.Item
                    label="Select current status"
                    name="status"
                    rules={[{ required: true, message: 'Please select the status' }]}
                >
                    <Select>
                        {complainsStatuses.map((data) => (
                            <Option value={data.key} key={data.key}>
                                {data.value}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Add History
                    </Button>
                </Form.Item>
            </Form>
            {complainId}
        </>

    );
}

AddHistoryForComplain.propTypes = {
    complainId: PropTypes.number,
};

AddHistoryForComplain.defaultProps = {
    complainId: 0,
};

export default AddHistoryForComplain;
