import React, { useState, useEffect, Fragment } from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import {
  Table, Space, message, Form, Select, Button, Modal,
} from 'antd';
import _ from 'lodash';
import { getDatabase, ref, onValue } from 'firebase/database';
import AddComplaint from './complains.add';
import apiCalls from '../loginPages/pages/serviceCalls/api.calls';
import AddHistoryForComplain from '../History/add.history.form';
import ComplainHistoryListing from '../History/complains.listing';
import { departments, statuses } from '../enums';

const { Option } = Select;

function ComplaintTable() {
  const [forms] = Form.useForm();
  const [complaints, setComplaints] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({ problemType: 0 });
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [usersInfo, setUsersInfo] = useState([]);
  // const [userInfoAsKeyValues, setUserInfoAsKeyValues] = useState([]);
  const [isAddHistoryPopupOpen, setIsAddHistoryPopupOpen] = useState(false);
  const [isHistoryLisingOpen, setIsHistoryListingOpen] = useState(false);
  const [isAssigneEmpPopupOpen, setIsAssignEmpPopupOpen] = useState(false);
  const [complianAssignees, setCompplainAssignees] = useState([]);

  const complainsStatuses = [...Object.keys(statuses)
    .map((key) => ({ key: Number(key), value: statuses[key] }))];

  const departmentTypeArray = [{ key: 0, value: 'All' }, ...Object.keys(departments)
    .map((key) => ({ key: Number(key), value: departments[key] }))];

  // console.log('shas', forms.getFieldsValue());

  const handleEdit = (complaint) => {
    setEditMode(true);
    setSelectedComplaint(complaint);
  };

  const handleOnAssign = (complaint) => {
    const employeeInfo = complianAssignees.find((x) => x.complainId === complaint.id);
    if (!_.isUndefined(employeeInfo)) {
      setEditMode(true);
      forms.setFieldsValue({
        employeeId: employeeInfo.employeeId,
      });
    }
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
            // eslint-disable-next-line eqeqeq
            const filteredComplaints = (filters.problemType !== 0)
            // eslint-disable-next-line eqeqeq
             ? Object.keys(data)
              .filter((key) => data[key].problemType == filters.problemType)
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

  useEffect(() => {
    const complaintsRef = ref(getDatabase(), 'complainsAssignees');

    const fetchAssigneeInfo = async () => {
      try {
        onValue(complaintsRef, (snapshot) => {
          const data = snapshot.val();

          if (data) {
            // eslint-disable-next-line eqeqeq
            const filteredComplaints = Object.keys(data).map((key) => ({
                id: key,
                ...data[key],
              }));
              setCompplainAssignees(filteredComplaints);
          } else {
            setCompplainAssignees([]);
          }
        });
      } catch (error) {
        message.error('Failed to fetch complaints. Please try again.');
      }
    };

    fetchAssigneeInfo();
  }, []);

  const onFinish = async (values) => {
    try {
        const formData = new FormData();
        formData.append('complainId', selectedComplaint?.id);
        formData.append('employeeId', values.employeeId);
        if (editMode) {
          formData.append('assigneeId', complianAssignees.find((x) => x.complainId === selectedComplaint.id).id);
        }

        (editMode ? apiCalls.updateAssignee(formData)
        : apiCalls.addComplainAssignee(formData)).then(() => {
                message.success('successfully');
                form.resetFields();
        });
    } catch (error) {
        console.error('Error complaint:', error);
        message.error('Failed to complaint');
    }
};

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
      key: 'problemType',
      render: (text, record) => (
        <Space size="middle">
          {// eslint-disable-next-line eqeqeq
          departmentTypeArray.filter((x) => x.key == record.problemType)[0].value || ''
          }
        </Space>
      ),
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
      key: 'assignedTo',
      render: (text, record) => {
        const emp = complianAssignees.find((x) => x.complainId === record.id);
        return <span aria-hidden="true">{!_.isEmpty(emp) ? usersInfo.find((x) => x.id === emp.employeeId)?.fullName : ''}</span>;
    },
    },
    {
      title: 'Current Status',
      key: 'status',
      render: (text, record) => (
        <Space size="middle">
          {// eslint-disable-next-line eqeqeq
          complainsStatuses.find((x) => x.key == record.status)?.value || ''
          }
        </Space>
      ),
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
            <Button onClick={() => { handleOnAssign(record); setIsAssignEmpPopupOpen(true); }} type="primary" danger>
              Assign employee
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
          {departmentTypeArray.map((data) => (
            <Option value={data.key} key={data.key}>
              {data.value}
            </Option>
          ))}
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
      {isAssigneEmpPopupOpen
        && (
          <Modal footer={null} title="Add Progress for complains" open={isAssigneEmpPopupOpen} okButtonProps={{ disabled: true }} onCancel={() => { setIsAssignEmpPopupOpen(false); setEditMode(false); setSelectedComplaint(null); }}>
            <Form form={forms} onFinish={onFinish} layout="vertical">
                <Form.Item
                    label="Employee"
                    name="employeeId"
                    rules={[{ required: true, message: 'Please enter the employee' }]}
                >
              <Select>
                {usersInfo.filter((x) => x.department == selectedComplaint.problemType)
                .map((user) => ({ key: user.id, value: user.fullName }))
                .map((data) => (
                  <Option value={data.key} key={data.key}>
                    {data.value}
                  </Option>
                ))}
              </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Add Complaint
                    </Button>
                </Form.Item>
            </Form>
          </Modal>
        )}

      {
        isHistoryLisingOpen
        && (
          <Modal footer={null} title="Add Progress for complains" open={isHistoryLisingOpen} okButtonProps={{ disabled: true }} onCancel={() => { setIsHistoryListingOpen(false); setEditMode(false); setSelectedComplaint(null); }}>
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
