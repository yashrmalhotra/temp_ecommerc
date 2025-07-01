import React, { useEffect, useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import Loader from "../../Loader";
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
  scales: {
    y: {
      ticks: {
        callback: function (value: any) {
          return value.toLocaleString("en-IN", { style: "currency", currency: "INR" });
        },
      },
    },
  },
};

const ChartContainer: React.FC<{ chartData: any[]; isLoading: boolean }> = ({ chartData, isLoading }) => {
  const [labels, setLabels] = useState<string[]>([]);
  const [sales, setSales] = useState<number[]>();
  const cd: Date = new Date();
  cd.setDate(cd.getDate());
  useEffect(() => {
    if (chartData.length > 0) {
      const dataLabels = chartData?.map((item: any) => item.label);
      const salesDayWise = chartData?.map((item: any) => item.totalSales);
      setLabels(dataLabels);
      setSales(salesDayWise);
    }
    console.log("chart", chartData);
  }, [chartData]);

  const data = {
    labels,
    datasets: [
      {
        label: "Sales",
        data: sales,
        backgroundColor: "blue",
        maxBarThickness: 30,
      },
    ],
  };
  return (
    <div className="w-full h-full">
      {isLoading ? (
        <div className="w-full h-full flex justify-center items-center">
          <Loader width="w-10" height="h-10" />
        </div>
      ) : (
        <Bar options={options} data={data} />
      )}
    </div>
  );
};

export default ChartContainer;
