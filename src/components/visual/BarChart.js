import React from 'react';
import { Bar } from 'react-chartjs-2';
import {Chart as ChartJS} from 'chart.js/auto';

const BarChart = (props) => {
    if (!props.chartData) {
        return <div>No Data </div>
    }
    
    return (
        <div clasName="bar-chart" style={{width: '400px', height: '400px'}} >
            <Bar data={props.chartData}/>
        </div>
    )
}

export default BarChart;