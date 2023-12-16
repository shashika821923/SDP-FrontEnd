/* eslint-disable import/no-extraneous-dependencies */
import { getDatabase, onValue, ref } from '@firebase/database';
import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import Chart from 'react-google-charts';

export const options = {
  title: 'My Daily Activities',
};

function DashBoardView() {
    const [complaints, setComplaints] = useState([]);
    const [complainCategories, setComplainCategories] = useState(
      {
      wildLife: 0,
      forest: 0,
      Reported: 0,
      Investigating: 0,
      Investigated: 0,
      Completed: 0,
      Started: 0,
      NotStarted: 0,
      },
      );
    useEffect(() => {
        const complaintsRef = ref(getDatabase(), 'complaints');

        const fetchData = async () => {
          try {
            onValue(complaintsRef, (snapshot) => {
              const data = snapshot.val();

              if (data) {
                // eslint-disable-next-line eqeqeq
                const filteredComplaints = Object.keys(data).map((key) => ({
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
      }, []);

    useEffect(() => {
        const wildLifeCount = complaints.filter((x) => x.problemType == 2).length;
        const forestCount = complaints.filter((x) => x.problemType == 1).length;
        const reported = complaints.filter((x) => x.status == 1).length;
        const investigating = complaints.filter((x) => x.status == 2).length;
        const investigated = complaints.filter((x) => x.status == 3).length;
        const completed = complaints.filter((x) => x.status == 4).length;
        const started = complaints.filter((x) => x.status != 1).length;
        const notStarted = complaints.filter((x) => x.status == 1).length;
        setComplainCategories(
          {
            wildLife: wildLifeCount,
            forest: forestCount,
            Reported: reported,
            Investigating: investigating,
            Investigated: investigated,
            Completed: completed,
            Started: started,
            NotStarted: notStarted,
          },
          );
    }, [complaints]);

    const complainCategoriesChart = [
      ['Task', 'Hours per Day'],
      ['Wild life', complainCategories.wildLife],
      ['Forest', complainCategories.forest],
    ];

    const complainStatus = [
      ['Task', 'Hours per Day'],
      ['Reported', complainCategories.Reported],
      ['Investigating', complainCategories.Investigating],
      ['Investigated', complainCategories.Investigated],
      ['Completed', complainCategories.Completed],
    ];

    const assignedStatus = [
      ['Task', 'Hours per Day'],
      ['Started', complainCategories.Started],
      ['Not Started', complainCategories.NotStarted],
    ];

    console.log(complainCategories);

    return (
      <>
        <Chart
          chartType="PieChart"
          data={complainCategoriesChart}
          options={options}
          width="100%"
          height="400px"
        />

        <Chart
          chartType="PieChart"
          data={complainStatus}
          options={options}
          width="100%"
          height="400px"
        />

        <Chart
          chartType="PieChart"
          data={assignedStatus}
          options={options}
          width="100%"
          height="400px"
        />
            dasdads
      </>
    );
}

export default DashBoardView;
