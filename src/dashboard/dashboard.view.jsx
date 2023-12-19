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
  padding: 200px;
  height: 200vh;
  background-image: url('https://i.ibb.co/VYnyNhF/pexels-rachel-claire-4992805.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  color: #fff;
`;
const ChartContainer = styled.div`
  width: 100%;
  height: 100%;
  margin-bottom: 10px;
  background: rgba(255, 255, 255, 1);
  padding: 30px;
  border-radius: 10px;
`;

export const options = {
  title: 'My Daily Activities',
};
const AnimatedChartContainer = styled(ChartContainer)`
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.8s ease-out forwards;
  animation-delay: ${(props) => props.delay || 0}s;

  @keyframes fadeInUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

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
      <Row>
        <Col md={4}>
          <AnimatedChartContainer delay={0.2}>
            <Chart chartType="PieChart" data={complainCategoriesChart} options={options} />
          </AnimatedChartContainer>
        </Col>
        <Col md={4}>
          <AnimatedChartContainer delay={0.4}>
            <Chart chartType="PieChart" data={complainStatus} options={options} />
          </AnimatedChartContainer>
        </Col>
        <Col md={4}>
          <AnimatedChartContainer delay={0.6}>
            <Chart chartType="PieChart" data={assignedStatus} options={options} />
          </AnimatedChartContainer>
        </Col>
      </Row>
      <div className="mt-4">dasdads</div>
    </Wrapper>
  );
}

export default DashBoardView;
