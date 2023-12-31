import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from "chart.js"

Chart.register(...registerables);

const LineChart = (props) => {
    if (!props.data) {
        return <div>No Data </div>
    }
    
    return (
        <div className="line-chart" style={{height: "300px",  width: "600px", padding: "1px"}}>
            <Line data={props.data} options={props.options}/>
        </div>
    )
}

export default LineChart;
