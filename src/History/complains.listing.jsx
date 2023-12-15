import React, { useEffect, useState } from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import PropTypes from 'prop-types';
import { getDatabase, onValue, ref } from 'firebase/database';
import { Space, Table, message } from 'antd';
import apiCalls from '../loginPages/pages/serviceCalls/api.calls';

function ComplainHistoryListing({ complainId = '0' }) {
    const [complaints, setComplaints] = useState([]);
    const [usersInfo, setUsersInfo] = useState([]);

    const getUserInformation = (userid) => {
        apiCalls.getUserInformation(userid).then((userInfo) => setUsersInfo(userInfo));
    };
      useEffect(() => {
        getUserInformation();
      }, []);

    useEffect(() => {
        const complaintsRef = ref(getDatabase(), 'history');

        const fetchData = async () => {
          try {
            onValue(complaintsRef, (snapshot) => {
              const data = snapshot.val();

              if (data) {
                const filteredComplaints = Object.keys(data)
                .filter((key) => data[key].complainId === complainId)
                .map((key) => ({
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
      }, [complainId]);

    const columns = [
        {
          title: 'Description',
          dataIndex: 'description',
          key: 'description',
        },
        {
          title: 'Time Frame',
          dataIndex: 'timeFrame',
          key: 'timeFrame',
        },
        {
          title: 'Updated By',
          key: 'updatedBy',
          render: (text, record) => (
              <span aria-hidden="true">{usersInfo.find((x) => x.id === record.updatedBy)?.fullName || ''}</span>
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
      ];

    return (
        <>
            <Table dataSource={complaints} columns={columns} />
            {complainId}
        </>
    );
}

ComplainHistoryListing.propTypes = {
    complainId: PropTypes.string,
};

ComplainHistoryListing.defaultProps = {
    complainId: '0',
};

export default ComplainHistoryListing;
