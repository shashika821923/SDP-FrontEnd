import React, { useState, useEffect } from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import {
  Table, Space, message, Form, Select,
} from 'antd';
import { getDatabase, ref, onValue } from 'firebase/database';
import AddComplaint, { ProblemTypes } from './complains.add';

const { Option } = Select;

function ComplaintTable() {
  const [complaints, setComplaints] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [form] = Form.useForm();
  const handleEdit = (complaint) => {
    setEditMode(true);
    setSelectedComplaint(complaint);
  };

  const onFinish = async (values) => {
    console.log(values);
  };

  useEffect(() => {
    const complaintsRef = ref(getDatabase(), 'complaints');
    const fetchData = async () => {
      try {
        onValue(complaintsRef, (snapshot) => {
          const data = snapshot.val();

          if (data) {
            const complaintsArray = Object.keys(data).map((key) => ({
              id: key,
              ...data[key],
            }));

            setComplaints(complaintsArray);
          } else {
            setComplaints([]);
          }
        });
      } catch (error) {
        message.error('Failed to fetch complaints. Please try again.');
      }
    };

    fetchData();
  }, []);

  const columns = [
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Time Frame',
      dataIndex: 'timeFrame',
      key: 'timeFrame',
    },
    {
      title: 'Problem Type',
      dataIndex: 'problemType',
      key: 'problemType',
    },
    {
      title: 'Complained By',
      dataIndex: 'complainedBy',
      key: 'complainedBy',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <a href={record.imageUrl} download>
            Download Image
          </a>
          <span onClick={() => handleEdit(record)} onKeyDown={() => handleEdit(record)} aria-hidden="true">Edit</span>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>Complaint Table</h2>
      <Form form={form} onFinish={onFinish} layout="vertical">
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
      </Form>
      <Table dataSource={complaints} columns={columns} />

      <AddComplaint
        editMode={editMode}
        complaintId={selectedComplaint?.id}
        onCancel={() => {
          setEditMode(false);
          setSelectedComplaint(null);
        }}
      />
    </div>
  );
}

export default ComplaintTable;
