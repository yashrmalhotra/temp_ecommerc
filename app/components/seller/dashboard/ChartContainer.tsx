import React from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      text: "Sales Data",
    },
    title: {
      display: true,
      text: "Sales Data",
    },
  },
};

const ChartContainer = () => {
  const labels = ["1/1", "1/2", "1/3", "1/4", "1/5", "1/7", "1/8", "1/11", "1/2"];
  const cd: Date = new Date();
  cd.setDate(cd.getDate());

  const data = {
    labels,
    datasets: [
      {
        label: "Dataset 1",
        data: [125, 235, 237, 289, 500, 400, 800, 100, 50],
        backgroundColor: "blue",
      },
    ],
  };
  return (
    <div className="w-full h-full">
      <Bar options={options} data={data} />
    </div>
  );
};

export default ChartContainer;
