import React from 'react';
import { Grid, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { AreaChart, Area } from 'recharts';

const lineChartData = [
  { name: 'Jan', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Feb', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Mar', uv: 2000, pv: 9800, amt: 2290 },
  // Add more data points as needed
];

const pieChartData = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
];

const barChartData1 = [
  { name: 'A', uv: 300, pv: 456 },
  { name: 'B', uv: 456, pv: 789 },
  { name: 'C', uv: 789, pv: 123 },
  // Add more data points as needed
];

const barChartData2 = [
  { name: 'X', uv: 123, pv: 234 },
  { name: 'Y', uv: 234, pv: 456 },
  { name: 'Z', uv: 456, pv: 789 },
  // Add more data points as needed
];

const userProfile = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'Admin',
};

const registrationCount = {
  total: 2500,
  developers: 1200,
  testingEngineers: 800,
  ngos: 300,
  startups: 200,
};


const percentages = [
  { label: 'Percentage 1', value: 25 },
  { label: 'Percentage 2', value: 75 },
  { label: 'Percentage 3', value: 75 },
  { label: 'Percentage 4', value: 75 },
  { label: 'Percentage 5', value: 75 },
  // Add more percentage values as needed
];

const negativeValues = [
  { label: 'Negative Value 1', value: -30 },
  { label: 'Negative Value 2', value: -50 },
  { label: 'Negative Value 3', value: -50 },
  { label: 'Negative Value 4', value: -50 },
  { label: 'Negative Value 5', value: -50 },
  // Add more negative values as needed
];

const theoryData = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';

function Dashboard() {
  const blackToGreyGradient = ['#000000', '#333333', '#666666', '#999999', '#CCCCCC'];
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>
      </Grid>

      <Grid item xs={12} md={6} lg={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" component="h2">
            User Profile
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary={`Name: ${userProfile.name}`} />
            </ListItem>
            <ListItem>
              <ListItemText primary={`Email: ${userProfile.email}`} />
            </ListItem>
            <ListItem>
              <ListItemText primary={`Role: ${userProfile.role}`} />
            </ListItem>
          </List>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6} lg={4}>
  <Paper sx={{ p: 2 }}>
    <Typography variant="h6" component="h2" >
      Total Number of Registrations
    </Typography>
    <Typography variant="h4" component="h3">
      Total: {registrationCount.total}
    </Typography>
    <Typography>Developers: {registrationCount.developers}</Typography>
    <Typography>Testing Engineers: {registrationCount.testingEngineers}</Typography>
    <Typography>NGOs: {registrationCount.ngos}</Typography>
    <Typography>Startups: {registrationCount.startups}</Typography>
  </Paper>
</Grid>


      <Grid item xs={12} md={6} lg={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" component="h2">
            Pie Chart
          </Typography>
          <PieChart width={300} height={200}>
            <Pie
              data={pieChartData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={blackToGreyGradient[index % blackToGreyGradient.length]} />
              ))}
            
            </Pie>
          </PieChart>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6} lg={4}>
  <Paper sx={{ p: 2 }}>
    <Typography variant="h6" component="h2">
      Area Chart
    </Typography>
    <AreaChart width={300} height={200} data={lineChartData}>
            <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
          </AreaChart>
  </Paper>
</Grid>




      <Grid item xs={12} md={6} lg={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" component="h2">
            Bar Chart 1
          </Typography>
          <BarChart width={300} height={200} data={barChartData1}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="uv" fill={blackToGreyGradient[2]} />
            <Bar dataKey="pv" fill={blackToGreyGradient[3]} />
          </BarChart>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6} lg={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" component="h2">
            Bar Chart 2
          </Typography>
          <BarChart width={300} height={200} data={barChartData2}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="uv" fill="#8884d8" />
            <Bar dataKey="pv" fill="#82ca9d" />
          </BarChart>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6} lg={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" component="h2">
            Percentage Values
          </Typography>
          <List>
            {percentages.map((item, index) => (
              <ListItem key={`percentage-${index}`}>
                <ListItemText primary={`${item.label}: ${item.value}%`} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6} lg={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" component="h2">
            Negative Values
          </Typography>
          <List>
            {negativeValues.map((item, index) => (
              <ListItem key={`negative-${index}`}>
                <ListItemText primary={`${item.label}: ${item.value}`} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" component="h2">
            Bar Chart 2
          </Typography>
          <BarChart width={300} height={200} data={barChartData2}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="uv" fill="#8884d8" />
            <Bar dataKey="pv" fill="#82ca9d" />
          </BarChart>
        </Paper>
      </Grid>
      
      


      
    </Grid>
  );
}

export default Dashboard;
