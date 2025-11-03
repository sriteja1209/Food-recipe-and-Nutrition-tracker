// src/pages/Analytics.js

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

//import AdminNavbar from '../components/Admin/AdminNavbar';
//import AdminSidebar from '../components/Admin/AdminSidebar';

// Register required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const data = {
    labels: ['January', 'February', 'March', 'April'],
    datasets: [
      {
        label: 'User Growth',
        data: [12, 19, 3, 5],
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div>
      
      <div className="analytics" style={{ padding: '1rem' }}>
        <h1>Analytics</h1>
        <Line data={data} />
      </div>
    </div>
  );
};

export default Analytics;
