import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

function Box2() {
    const chartRef = useRef(null);
    const [monthlyData, setMonthlyData] = useState([]);
    const chartInstance = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/v1/dashboard/monthly-total-price');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                setMonthlyData(data);
            } catch (error) {
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (chartRef.current && monthlyData.length > 0) {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            const ctx = chartRef.current.getContext('2d');
            chartInstance.current = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: monthlyData.map(([year, month]) => `${month}`),
                    datasets: [{
                        label: 'Monthly Revenue',
                        data: monthlyData.map(([_, __, monthlyPrice]) => monthlyPrice),
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1,
                        fill: false
                    }]
                },
                options: {
                    scales: {
                        x: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                font: {
                                    size: 10 // Adjust the font size for month labels
                                }
                            }
                        },
                        y: {
                            beginAtZero: true,
                            grid: {
                                display: false
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            enabled: true
                        }
                    }
                }
            });
        }
    }, [monthlyData]);

    return (
        <div className="flex flex-col justify-center items-center bg-green-200 h-1/2 w-full rounded-2xl p-4">
            <h2 className="text-4xl font-bold mb-4">Monthly Revenue</h2>
            <canvas className="w-full" ref={chartRef} />
        </div>
    );
}

export default Box2;
