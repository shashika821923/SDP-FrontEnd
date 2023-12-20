/* eslint-disable import/no-extraneous-dependencies */
import { getDatabase, onValue, ref } from '@firebase/database';
import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import Chart from 'react-google-charts';
import { Container, Row, Col } from 'react-bootstrap';
import styled from 'styled-components';

const Wrapper = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  height: 100vh; /* Adjusted height to fill the viewport */

  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  color: #fff;
`;

const ChartForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AnimatedChartContainer = styled.div`
  width: 1000px;
  height: 300px; /* Set the desired height */
  margin-bottom: 40px;
  background: rgba(255, 255, 255, 1);
  padding: 50px;
  border-radius: 10px;
  opacity: 0;
  transform: translateY(10px);
  animation: fadeInUp 0.8s ease-out forwards;
  animation-delay: ${(props) => props.delay || 0}s;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);

  @keyframes fadeInUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const options1 = {
  title: 'Wildlife and Forest Complaints',
};
export const options2 = {
  title: 'Distribution of Wildlife and Forest Complaints',
};
export const options3 = {
  title: 'Complaint Status',
};

function DashBoardView() {
  const [complaints, setComplaints] = useState([]);
  const [complainCategories, setComplainCategories] = useState({
    wildLife: 0,
    forest: 0,
    Reported: 0,
    Investigating: 0,
    Investigated: 0,
    Completed: 0,
    Started: 0,
    NotStarted: 0,
  });

  useEffect(() => {
    const complaintsRef = ref(getDatabase(), 'complaints');

    const fetchData = async () => {
      try {
        onValue(complaintsRef, (snapshot) => {
          const data = snapshot.val();

          if (data) {
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
    setComplainCategories({
      wildLife: wildLifeCount,
      forest: forestCount,
      Reported: reported,
      Investigating: investigating,
      Investigated: investigated,
      Completed: completed,
      Started: started,
      NotStarted: notStarted,
    });
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

  return (
    <Wrapper>
      <ChartForm>
        <h1 style={{ color: 'black', textAlign: 'center', marginBottom: '20px' }}>Dashboard</h1>
        <Row>
          <Col md={12}>
            <AnimatedChartContainer delay={0.2}>
              <Chart chartType="PieChart" data={complainCategoriesChart} options={options1} />
            </AnimatedChartContainer>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <AnimatedChartContainer delay={0.4}>
              <Chart chartType="PieChart" data={complainStatus} options={options2} />
            </AnimatedChartContainer>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <AnimatedChartContainer delay={0.6}>
              <Chart chartType="PieChart" data={assignedStatus} options={options3} />
            </AnimatedChartContainer>
          </Col>
        </Row>
      </ChartForm>
      <div className="mt-4">dasdads</div>
    </Wrapper>
  );
}

export default DashBoardView;
