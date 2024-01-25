import React from "react";
import { Box, Typography } from "@mui/material";
import { PieChart, Pie, Cell } from 'recharts';

const greyColor = "#999999";
const skinColor = "#FFE4C4"; // Skin color
const tickColor = "green"; // Color for tick mark

const PieChartsTaskRow = ({ completed, assigned, moduleName, time }) => {

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

  let fillColor = greyColor;

  if (assigned === 0) {
    // If assigned is 0, show skin color
    fillColor = skinColor;
  } else if (assigned === 1 && completed === 1) {
    // If assigned and completed are both 1, show tick mark color
    fillColor = tickColor;
  }

  return (
    <div style={{ margin: "1px -20px", marginTop: "-0.5vw" }}>
      <PieChart width={120} height={120}>
        <Pie
          data={[{ name: "Data", value: 1 }]}
          cx={60}
          cy={60}
          labelLine={false}
          outerRadius={25}
          fill={fillColor}
          dataKey="value"
        />
      </PieChart>
      <Typography sx={{ fontSize: '14px', marginTop: "-1vw", marginLeft: "1vw" }}>{moduleName}</Typography>
      <Typography sx={{ fontSize: '14px', marginTop: "0.6vw", marginLeft: "1vw" }}>{time} Hours</Typography>
    </div>
  );
};

export default PieChartsTaskRow;
