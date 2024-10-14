"use client";
import { getDashboard } from "@/services/dashboard";
import React, { useEffect, useState } from "react";

const Dashboard = ({ session }: { session: any }) => {
  const organization = session.userWithRole.organization.id;
  const [logs, setLogs] = useState([]);
  useEffect(() => {
    const fetchDashboardData = async () => {
      const res = await getDashboard({ organization });
      setLogs(res);
    };
    fetchDashboardData();
    return () => {};
  }, []);

  return <PerformanceCard logs={logs} />;
};

export default Dashboard;
// Helper function to format numbers with commas
const formatNumberWithCommas = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Helper function to format date to mm/yyyy
const formatDate = (month: number, year: number): string => {
  return `${month.toString().padStart(2, "0")}/${year}`;
};

// Component to display performance logs
const PerformanceCard: React.FC<PerformanceCardProps> = ({ logs }) => {
  // Group logs by user and month
  const userLogs: { [key: number]: { [key: string]: number } } = logs.reduce(
    (acc, log) => {
      const monthKey = `${log.year}-${log.month.toString().padStart(2, "0")}`;
      if (!acc[log.user]) {
        acc[log.user] = {};
      }
      if (!acc[log.user][monthKey]) {
        acc[log.user][monthKey] = 0;
      }
      acc[log.user][monthKey] += log.total_logs;
      return acc;
    },
    {} as { [key: number]: { [key: string]: number } }
  );

  // Convert to an array and calculate latest month logs
  const sortedUsers = Object.entries(userLogs)
    .map(([user, monthlyLogs]) => {
      const latestMonthKey = Object.keys(monthlyLogs).sort().pop(); // Get the latest month key
      const latestLogs = latestMonthKey ? monthlyLogs[latestMonthKey] : 0;
      return { user: Number(user), latestLogs, monthlyLogs };
    })
    .sort((a, b) => b.latestLogs - a.latestLogs);

  return (
    <div className="overflow-x-auto">
      {/* heading */}
      <h2 className="text-lg font-semibold">Performance</h2>
      {/* note update every 15 mins */}
      <p className="text-sm text-gray-500 mb-4">
        Note: Data is updated every 15 minutes
      </p>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200 ">
            <th className="py-2 px-4 border-b text-left">Rank</th>
            <th className="py-2 px-4 border-b text-left">Pack ID</th>
            <th className="py-2 px-4 border-b text-left">This month </th>
            <th className="py-2 px-4 border-b text-left">History</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map((user, index) => (
            <tr key={user.user} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">{index + 1}</td>
              <td className="py-2 px-4 border-b">{user.user}</td>
              <td className="py-2 px-4 border-b">
                {formatNumberWithCommas(user.latestLogs)}
              </td>
              <td className="py-2 px-4 border-b">
                {Object.entries(user.monthlyLogs).map(([month, total]) => (
                  <div key={month}>
                    {month}: {formatNumberWithCommas(total)}
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

interface LogEntry {
  user: number;
  year: number;
  month: number;
  total_logs: number;
  organization_id: number;
}

// Define the type for the props of PerformanceCard
interface PerformanceCardProps {
  logs: LogEntry[];
}
