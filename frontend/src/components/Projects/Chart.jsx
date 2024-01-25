
import React from "react";
import { Box, Typography } from "@mui/material";
import { PieChart, Pie, Cell } from 'recharts';

const greyscaleColors = [
"#999999",
"#B3B3B3",
"#CCCCCC",
"#E6E6E6",
"#FFFFFF"
];

const PieChartsRow = ({ completed, assigned, unassigned ,moduleName,time}) => {
   console.log(moduleName,time);
  if (!moduleName) {
    // Show a completely white pie chart if data doesn't have moduleName property
    return (
      <div style={{ margin: "0 5px" }}>
        <PieChart width={120} height={120}>
          <Pie
            data={[{ name: "No data", value: 100 }]}
            cx={60}
            cy={60}
            labelLine={false}
            outerRadius={20}
            fill="#FFFFFF"
            dataKey="value"
          >
            <Cell fill="#FFFFFF" stroke="black" strokeWidth={1} />
          </Pie>
        </PieChart>
        <Typography sx={{ fontSize: '12px', marginTop: "-25px" }}>NA</Typography>
      </div>
    );
  }

  const pieData = [
    { name: "Completed", value: completed ? completed : 0 },
    { name: "Assigned", value: assigned ? assigned - (completed ? completed : 0) : 0 },
    { name: "Unassigned", value: unassigned ? unassigned : 0 },
  ];
  
  // Check if all values in pieData are 0
  const allZero = pieData.every(entry => entry.value === 0);

  return (
    <div style={{ margin: "1px -20px" , marginTop:"-0.5vw",}}>
      <PieChart width={120} height={120}>
        <Pie
          data={pieData}
          cx={60}
          cy={60}
          labelLine={false}
          outerRadius={25}
          fill="#8884d8"
          dataKey="value"
        >
          {pieData.map((entry, index) => (
            <Cell
              key={entry.name}
              fill={greyscaleColors[index % greyscaleColors.length]}
              stroke="black"
              strokeWidth={1}
            />
          ))}
        </Pie>
        {allZero && (
          <Pie
            data={[{ name: "Empty", value: 1 }]}
            cx={60}
            cy={60}
            labelLine={false}
            outerRadius={0}
            innerRadius={20}
            fill="#FFFFFF"
            dataKey="value"
          >
            <Cell fill="#FFFFFF" stroke="black" strokeWidth={1} />
          </Pie>
        )}
      </PieChart>
      <Typography sx={{ fontSize: '14px', marginTop: "-1vw", marginLeft:"1vw" }}>{moduleName}</Typography>
      <Typography sx={{ fontSize: '14px',marginTop:"0.6vw" ,marginLeft:"1vw"  }}>{time} Hours</Typography>
    </div>
  );
};

export default PieChartsRow;

