import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from "chart.js"

Chart.register(...registerables);

const BarChart = (props) => {
    if (!props.chartData) {
        return <div>No Data </div>
    }
    
    return (
        <div className="bar-chart" style={{height: "300px",  width: "500px", padding: "10px"}} >
            <Bar data={props.chartData} option={props.options}/>
        </div>
    )
}

export default BarChart;