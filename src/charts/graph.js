import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StatisticsChart = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/statistics", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        const result = await response.json();
        setData(result.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup function
    return () => {
      const charts = ChartJS.instances;
      Object.keys(charts).forEach((key) => {
        charts[key].destroy();
      });
    };
  }, []);

  const chartData = {
    labels: ["الطلبات", "المستخدمين", "الرسائل" ],
    datasets: [
      {
        label: "الإحصائيات",
        data: [
          data?.orders || 0,
          data?.users_count || 0,
          data?.contact_data || 0,
        ],
        borderColor: "#42A5F5",
        backgroundColor: "rgba(66, 165, 245, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14,
            family: "Cairo, sans-serif",
          },
        },
      },
      title: {
        display: true,
        text: "إحصائيات النظام",
        font: {
          size: 16,
          family: "Cairo, sans-serif",
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 12,
            family: "Cairo, sans-serif",
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: 12,
            family: "Cairo, sans-serif",
          },
        },
      },
    },
  };

  if (loading) {
    return <div>جاري التحميل...</div>;
  }

  if (error) {
    return <div>خطأ: {error}</div>;
  }

  return (
    <div style={{ width: "100%", height: "400px", padding: "20px" }}>
      <Line data={chartData} options={chartOptions} hover/>
    </div>
  );
};

export default StatisticsChart;
