import React, { useState, useEffect } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";

function Box3() {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/v1/dashboard/average-last-7-days');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                // Convert fetched data to the format expected by Recharts
                const formattedData = data.map(([date, waitTime]) => ({
                    name: date,
                    waitTime: waitTime
                }));
                setChartData(formattedData);
            } catch (error) {
                console.error('Error fetching chart data:', error);
            }
        };

        fetchData();
    }, []);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const { name, value } = payload[0];
            return (
                <div className="custom-tooltip">
                    <p>{`${name} : ${value}`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-blue-200 h-1/2 w-full rounded-2xl p-4 flex flex-col justify-center items-center">
            <h2 className="text-4xl font-bold mb-4">Customer Waiting Time</h2>
            <div className="flex justify-between w-full">
                <div className="flex flex-col justify-center items-center">
                    {chartData.length > 0 && (
                        <>
                            <h1 className="text-4xl font-bold">{chartData[chartData.length - 1].waitTime}</h1>
                            <p className="text-lg">Lastday</p>
                        </>
                    )}
                </div>
                <div className="w-4/5 h-40">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <Line
                                type="monotone"
                                dataKey="waitTime"
                                stroke="teal"
                                strokeWidth={2}
                                dot={false}
                            />
                            <Tooltip content={<CustomTooltip />} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

export default Box3;
