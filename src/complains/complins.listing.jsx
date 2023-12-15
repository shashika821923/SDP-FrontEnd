import React, { useState, useEffect, Fragment } from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import {
  Table, Space, message, Form, Select, Button, Modal,
} from 'antd';
import { getDatabase, ref, onValue } from 'firebase/database';
import AddComplaint, { ProblemTypes } from './complains.add';
import apiCalls from '../loginPages/pages/serviceCalls/api.calls';
import AddHistoryForComplain from '../History/add.history.form';
import ComplainHistoryListing from '../History/complains.listing';

const { Option } = Select;

function ComplaintTable() {
  const [complaints, setComplaints] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({ problemType: 0 });
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [usersInfo, setUsersInfo] = useState([]);
  const [isAddHistoryPopupOpen, setIsAddHistoryPopupOpen] = useState(false);
  const [isHistoryLisingOpen, setIsHistoryListingOpen] = useState(false);

  const handleEdit = (complaint) => {
    setEditMode(true);
    setSelectedComplaint(complaint);
  };

  const onChange = async (values) => {
    setFilters(values);
  };

  const getUserInformation = (userid) => {
    apiCalls.getUserInformation(userid).then((userInfo) => setUsersInfo(userInfo));
  };

  useEffect(() => {
    getUserInformation();
  }, []);

  useEffect(() => {
    const complaintsRef = ref(getDatabase(), 'complaints');

    const fetchData = async () => {
      try {
        onValue(complaintsRef, (snapshot) => {
          const data = snapshot.val();

          if (data) {
            const filteredComplaints = (filters.problemType !== 0) ? Object.keys(data)
              .filter((key) => data[key].problemType === filters.problemType)
              .map((key) => ({
                id: key,
                ...data[key],
              })) : Object.keys(data).map((key) => ({
                id: key,
                ...data[key],
              }));
            setComplaints(filteredComplaints);
          } else {
            setComplaints([]);
          }
        });
      } catch (error) {
        message.error('Failed to fetch complaints. Please try again.');
      }
    };

     fetchData();
  }, [filters]);

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
      key: 'complainedBy',
      render: (text, record) => (
          <span aria-hidden="true">{usersInfo.find((x) => x.id === record.complainedBy)?.fullName || ''}</span>
      ),
    },
    {
      title: 'Assigned To',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
    },
    {
      title: 'Open image in new tab',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <a href={record.imageUrl} target="_blank" rel="noopener noreferrer">
            Open Image
          </a>
        </Space>
      ),
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (text, record) => (
        <>
          <Space size="middle">
            <Button onClick={() => { handleEdit(record); setIsModelOpen(true); }} type="primary" danger>
              Edit
            </Button>
          </Space>
          <Space size="left" style={{ marginLeft: '10px' }}>
            <Button onClick={() => { handleEdit(record); setIsAddHistoryPopupOpen(true); }} type="primary" danger>
              Add progress
            </Button>
          </Space>
          <Space size="left" style={{ marginLeft: '10px' }}>
            <Button onClick={() => { handleEdit(record); setIsHistoryListingOpen(true); }} type="primary" danger>
              View progress
            </Button>
          </Space>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2>Complaint Table</h2>
      <Form form={form} onFinish={onChange} layout="vertical">
        <Form.Item
          label="Filter by department"
          name="problemType"
        >
          <Select>
            <Option value={0}> All </Option>
            <Option value={ProblemTypes.WILDLIFE}> Wildlife</Option>
            <Option value={ProblemTypes.FORESTRY}> Forestry</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Filter
          </Button>
        </Form.Item>
      </Form>
      <Table dataSource={complaints} columns={columns} />

      {isModelOpen
      && (
      <Modal footer={null} title="Add Complain" open={isModelOpen} okButtonProps={{ disabled: true }} onCancel={() => { setIsModelOpen(!isModelOpen); setEditMode(false); setSelectedComplaint(null); }}>
        <AddComplaint
          editMode={editMode}
          complaintId={selectedComplaint?.id}
        />
      </Modal>
      )}

      {isAddHistoryPopupOpen
      && (
      <Modal footer={null} title="Add Progress for complains" open={isAddHistoryPopupOpen} okButtonProps={{ disabled: true }} onCancel={() => { setIsAddHistoryPopupOpen(false); setEditMode(false); setSelectedComplaint(null); }}>
        <AddHistoryForComplain
          complainId={selectedComplaint?.id}
        />
      </Modal>
      )}

{
  isHistoryLisingOpen && (
    <Modal
      footer={null}
      style={{ width: '1000px' }} // Set the width here
      title="Add Progress for complains"
      open={isHistoryLisingOpen}
      okButtonProps={{ disabled: true }}
      onCancel={() => {
        setIsAddHistoryPopupOpen(false); setEditMode(false);
         setSelectedComplaint(null);
        }}
    >
      <ComplainHistoryListing
        complainId={selectedComplaint?.id}
      />
    </Modal>
  )
}

    </div>
  );
}

export default ComplaintTable;
