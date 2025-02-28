'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import Chart from 'chart.js/auto';
import { storage } from '../lib/storage';
import { AnalyticsData } from '../lib/types';
import { Card } from './ui/card';

const AnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const eventChartRef = useRef<HTMLCanvasElement | null>(null);
  const completionChartRef = useRef<HTMLCanvasElement | null>(null);
  const statsChartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstances = useRef<Chart[]>([]);

  useEffect(() => {
    // Cleanup function to destroy chart instances
    return () => {
      chartInstances.current.forEach(chart => chart.destroy());
    };
  }, []);

  useEffect(() => {
    const data = storage.getAnalytics();
    setAnalyticsData(data);

    // Destroy existing charts
    chartInstances.current.forEach(chart => chart.destroy());
    chartInstances.current = [];

    if (!data) return;

    // Event Distribution Chart
    if (eventChartRef.current) {
      const ctx = eventChartRef.current.getContext('2d');
      if (ctx) {
        const eventTypes = Object.keys(data.eventCounts);
        const eventCounts = Object.values(data.eventCounts);
        
        const chart = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: eventTypes,
            datasets: [{
              data: eventCounts,
              backgroundColor: [
                'rgba(255, 99, 132, 0.8)',
                'rgba(54, 162, 235, 0.8)',
                'rgba(255, 206, 86, 0.8)',
                'rgba(75, 192, 192, 0.8)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
              ],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'right'
              },
              title: {
                display: true,
                text: 'Event Distribution'
              }
            }
          }
        });
        chartInstances.current.push(chart);
      }
    }

    // Task Completion Rate Chart
    if (completionChartRef.current) {
      const ctx = completionChartRef.current.getContext('2d');
      if (ctx) {
        const chart = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: ['Completed', 'Remaining'],
            datasets: [{
              data: [data.taskCompletionRate * 100, (1 - data.taskCompletionRate) * 100],
              backgroundColor: ['rgba(75, 192, 192, 0.8)', 'rgba(200, 200, 200, 0.2)'],
              borderColor: ['rgba(75, 192, 192, 1)', 'rgba(200, 200, 200, 1)'],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Task Completion Rate'
              }
            }
          }
        });
        chartInstances.current.push(chart);
      }
    }

    // Templates and Assets Chart
    if (statsChartRef.current) {
      const ctx = statsChartRef.current.getContext('2d');
      if (ctx) {
        const chart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Active Templates', 'Total Assets'],
            datasets: [{
              label: 'Count',
              data: [data.activeTemplates, data.totalAssets],
              backgroundColor: [
                'rgba(54, 162, 235, 0.8)',
                'rgba(255, 206, 86, 0.8)'
              ],
              borderColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)'
              ],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: false
              },
              title: {
                display: true,
                text: 'System Overview'
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1
                }
              }
            }
          }
        });
        chartInstances.current.push(chart);
      }
    }
  }, []);

  const memoizedAnalyticsData = useMemo(() => analyticsData, [analyticsData]);

  if (!memoizedAnalyticsData) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      <Card className="p-4">
        <canvas ref={eventChartRef} />
      </Card>
      <Card className="p-4">
        <canvas ref={completionChartRef} />
      </Card>
      <Card className="p-4">
        <canvas ref={statsChartRef} />
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
