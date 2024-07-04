// import React from "react";
// import { Box, Typography } from "@mui/material";
// import { PieChart, Pie, Cell } from 'recharts';

// const PieChartsRow = ({ completed, assigned, unassigned ,moduleName,time}) => {
//   // Ensure assigned, completed, and unassigned are within the range of 0 to 3
//   assigned = assigned > 3 ? 3 : assigned < 0 ? 0 : assigned;
//   completed = completed > 3 ? 3 : completed < 0 ? 0 : completed;
//   unassigned = unassigned > 3 ? 3 : unassigned < 0 ? 0 : unassigned;

//   const pieData = [
//     { name: "Completed", value: completed },
//     { name: "Assigned", value: assigned - completed },
//     { name: "Unassigned", value: unassigned }, 
//   ];

//   // Check if all values in pieData are 0
//   const allZero = pieData.every(entry => entry.value === 0);

//   return (
//     <div style={{ margin: "1px -20px" , marginTop:"-0.5vw"}}>
//       <PieChart width={120} height={120}>
//         <Pie
//           data={pieData}
//           cx={60}
//           cy={60}
//           labelLine={false}
//           outerRadius={25}
//           fill="#8884d8"
//           dataKey="value"
//         >
//           <Cell fill="#D5E8D4" stroke="black" strokeWidth={1} />
//           <Cell fill="#000000" stroke="black" strokeWidth={1} />
//           <Cell fill="#FFFFFF" stroke="black" strokeWidth={1} />
//         </Pie>
//         {allZero && (
//           <Pie
//             data={[{ name: "Empty", value: 1 }]}
//             cx={60}
//             cy={60}
//             labelLine={false}
//             outerRadius={0}
//             innerRadius={20}
//             fill="#FFFFFF"
//             dataKey="value"
//           >
//             <Cell fill="#FFFFFF" stroke="black" strokeWidth={1} />
//           </Pie>
//         )}
//       </PieChart>
//       <Typography sx={{ fontSize: '14px', marginTop: "-1vw", marginLeft:"1vw" }}>{moduleName}</Typography>
//       <Typography sx={{ fontSize: '14px',marginTop:"0.6vw" ,marginLeft:"1vw"  }}>{time} Hours</Typography>
//     </div>
//   );
// };

// export default PieChartsRow;



import React from "react";
import { Box, Typography } from "@mui/material";
import { PieChart, Pie, Cell } from 'recharts';

const PieChartsRow = ({ completed, assigned, unassigned, moduleName, time }) => {
  // Convert values to numbers
  completed = Number(completed);
  assigned = Number(assigned);
  unassigned = Number(unassigned);

  // Ensure values are within the expected range (0 to 3)
  assigned = Math.min(Math.max(assigned, 0), 3);
  completed = Math.min(Math.max(completed, 0), 3);
  unassigned = Math.min(Math.max(unassigned, 0), 3);

  // Calculate pie data, making sure no negative values are present
  const pieData = [
    { name: "Completed", value: completed },
    { name: "Assigned", value: Math.max(assigned - completed, 0) },
    { name: "Unassigned", value: unassigned }
  ];

  // Check if all values in pieData are 0
  const allZero = pieData.every(entry => entry.value === 0);

  // Debugging: Log the pieData to check values

  return (
    <div style={{ margin: "1px -20px", marginTop: "-0.5vw" }}>
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
              key={`cell-${index}`}
              fill={
                entry.name === "Completed" && completed === 1 ? "#00FF00" : 
                entry.name === "Completed" ? "#D5E8D4" :
                entry.name === "Assigned" ? "#000000" :
                "#FFFFFF"
              }
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
      <Typography sx={{ fontSize: '14px', marginTop: "-1vw", marginLeft: "1vw" }}>{moduleName}</Typography>
      <Typography sx={{ fontSize: '14px', marginTop: "0.6vw", marginLeft: "1vw" }}>{time} Hours</Typography>
    </div>
  );
};

export default PieChartsRow;

