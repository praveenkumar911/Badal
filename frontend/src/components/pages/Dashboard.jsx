// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Grid, Typography, Paper, CircularProgress, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,ResponsiveContainer } from 'recharts';
// import Map from './mapchart';
// import PieChartsRow from '../Sub-Pages/Chart';
// import Vector from "../icons/Vector.svg";
// import gitlab from "../icons/gitlab.svg";
// import { useNavigate } from 'react-router-dom';
// import './project.css'
// function Dashboard() {
//   const permissionString = localStorage.getItem('permissions');
//   const permissions = permissionString ? permissionString.split(',') : [];
//   const [orgData, setOrgData] = useState(null);
//   const [organizations, setOrganizations] = useState([]);
//   const [selectedOrgId, setSelectedOrgId] = useState('');
//   const [developerCount, setDeveloperCount] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const[mcount,setManagerCount]=useState();
//   const OrgId = localStorage.getItem('orgId');
//   const isP001Allowed = permissions.includes('P001');
//   const isP005Allowed= permissions.includes('P005')
//   const [projectModuleCounts, setProjectModuleCounts] = useState([]);
//   const [moduleDetails, setModuleDetails] = useState([]);
//   const [projectdata, setProjectData] = useState([]);
//   const[review,setReview]=useState()

//   const [filteredProjectData, setFilteredProjectData] = useState([]);
//   const navigate = useNavigate();
//   const getCompletedCount = async () => {
//     try {
//         const response = await axios.get('http://10.8.0.14:5000/count-completed');
//         const count = response.data.count;
//         setReview(count)
//         console.log('Count of completed workspaces:', count);
//     } catch (error) {
//         console.error('Error getting count of completed workspaces:', error);
//     }
// };

// getCompletedCount();

//   React.useEffect(() => {
//     axios
//       .get("http://10.8.0.14:5000/get-allmodules")
//       .then((res) => {
//         setModuleDetails(res.data.data);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }, []);

//   useEffect(() => {
//      let needid=selectedOrgId
//     if (selectedOrgId===''){
//         needid=localStorage.getItem('orgId')
//     }
//     axios.get(`http://10.8.0.14:5000/get-org/${needid}`)
//     .then(orgResponse => {
//       const isNgo = orgResponse.data.isNgo;

//       // Fetch project data
//       axios.get("http://10.8.0.14:5000/get-project-DB")
//         .then(projectResponse => {
//           setProjectData(projectResponse.data);

//           // Filter project data based on isNgo value
//           const filteredData = projectResponse.data.filter(project => {
           
//             if (isNgo==='true') {
//               return project.projectOwner === selectedOrgId;
            

//             } else {
//               return project.assignedTo === selectedOrgId;
            
//             }
//           });

//           setFilteredProjectData(filteredData);
         
//         })
//         .catch(error => {
//           console.error("Error fetching project data:", error);
//         });
//     })
//     .catch(error => {
//       console.error("Error fetching organization data:", error);
//     });

//   }, [selectedOrgId]); // Add selectedOrgId as a dependency
  
//   const [orgImgUrls, setOrgImgUrls] = useState({});
//   useEffect(() => {
//     if (projectdata.length > 0) { 
//       // Fetch image URLs and org names based on orgIds
//       axios.get('http://10.8.0.14:5000/get-img-url', { params: { orgIds: projectdata.map(project => project.projectOwner) } })
//         .then(response => {
//           const orgDetails = response.data.orgDetails.reduce((acc, orgDetail,index) => {
//             acc.orgImgUrls[projectdata[index].projectOwner] = orgDetail.imgUrl;
//             acc.orgNames[projectdata[index].projectOwner] = orgDetail.orgName;
//            // acc.orgNames.push({ projectOwner: orgDetail.orgName, orgName: orgDetail.orgName });
//             return acc;
//           }, { orgImgUrls: {}, orgNames: [] });
  
//           setOrgImgUrls(orgDetails.orgImgUrls);
//         }) 
//         .catch(error => {
//           console.error('Error fetching org details:', error);
//         });
//     }
//   }, [projectdata]);
//   useEffect(() => {
//     async function fetchProjectModuleCounts() {
//       try {
//         // Fetch project-module counts data
//         const response = await axios.get(`http://10.8.0.14:5000/org/${selectedOrgId}/project-module-counts`);
//         setProjectModuleCounts(response.data);
//       } catch (error) {
//         console.error('Error fetching project-module counts:', error);
//       }
//     }

//     if (selectedOrgId) {
//       fetchProjectModuleCounts();
//     }
//   }, [selectedOrgId]);
//   useEffect(() => {
//     async function fetchData() {
//       try {
//         if (OrgId !='undefined') {
//           console.log(`Fetching organization data for OrgId: ${OrgId}`);
//           let needid=selectedOrgId;
//           if (selectedOrgId==''){
//             needid=localStorage.getItem('orgId')
//           }
//           const orgResponse = await axios.get(`http://10.8.0.14:5000/organization/${needid}`);
//           setOrgData(orgResponse.data);
//           setSelectedOrgId(OrgId);
//         } else {
//           console.log('Fetching all organizations with roleId R002-B');
//           const orgsResponse = await axios.get('http://10.8.0.14:5000/org/role2');
//           setOrganizations(orgsResponse.data);
//           setSelectedOrgId(orgsResponse.data[0]?.orgId || '');
//           if (orgsResponse.data.length > 0) {
//             const firstOrgId = orgsResponse.data[0].orgId;
//             const orgResponse = await axios.get(`http://10.8.0.14:5000/organization/${firstOrgId}`);
//             setOrgData(orgResponse.data);
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//       setLoading(false);
//     }

//     fetchData();
//   }, [OrgId]);
//   useEffect(() => {
//     async function fetchUsers(orgId) {
//       try {
//         setLoading(true);
//         console.log(`Fetching users for organization: ${orgId}`);
//         // Fetch users data
//         const usersResponse = await axios.get(`http://10.8.0.14:5000/get-users-by-org/${orgId}`);
//         const users = usersResponse.data;

//         // Count developers (roleId === 'R003')
//         const devCount = users.filter(user => user.roleId === 'R003').length;
//         setDeveloperCount(devCount);
//         const manager=users.filter(user=>user.roleId === 'R002-B').length;
//         setManagerCount(manager)

//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching users:', error);
//         setLoading(false);
//       }
//     }

//     if (selectedOrgId) {
//       fetchUsers(selectedOrgId);
//     }
//   }, [selectedOrgId]);

//   const handleOrgChange = async (event) => {
//     const orgId = event.target.value;
//     setSelectedOrgId(orgId);
//     setLoading(true);
//     try {
//       console.log(`Organization selected: ${orgId}`);
//       // Fetch organization data by selected OrgId
//       const orgResponse = await axios.get(`http://10.8.0.14:5000/organization/${orgId}`);
//       setOrgData(orgResponse.data);
//       // Save selected organization and its ID in localStorage
//       localStorage.setItem('selectedOrg', orgResponse.data.orgName);
//       localStorage.setItem('selectedOrgId', orgId);
//     } catch (error) {
//       console.error('Error fetching organization data:', error);
//     }
//     setLoading(false);
//   };
//   console.log(filteredProjectData);
  

//   if (loading) {
//     return <CircularProgress />;
//   }

//   if (!orgData) {
//     return <Typography variant="h6" color="error">No organizations Available</Typography>;
//   }
  

// // Map project-module counts data to projectData format
// const projectData = Object.keys(projectModuleCounts).map(projectId => ({
//   name: projectId,
//   modules: projectModuleCounts[projectId].moduleCount,
//   teamsAssigned: projectModuleCounts[projectId].totalTeamsAssigned,
//   developers:projectModuleCounts[projectId].totalUsersAssigned
// }));
//  const total=mcount+developerCount


//   return (
//     <div style={{ marginTop: '30px', marginLeft: '30px' }}>
//       <Grid container spacing={2}>
//         {/* Organization section */}
//         <div style={{ display: "flex", flexDirection: "column", gap: "20px" ,width:"800px"}}>
//           {OrgId !='undefined' ? (
//             <Grid item xs={12} md={10}>
//               <Paper style={{ padding: '30px', display: 'flex', alignItems: 'center', marginTop: "14px", width:"120%",gap: "80px"}}>
//               <img src={orgData.imgUrl} alt="Organization Logo" style={{ maxWidth: '30%', height: 'auto', }} />
//                 <Typography variant="h4" gutterBottom style={{ fontWeight:"bold" }}>
//                   {orgData.orgName}
//                 </Typography>
               
//               </Paper>
//             </Grid>
//           ) : (
//             <FormControl variant="outlined" style={{ minWidth: 240, marginBottom: '20px' }}>
//               <InputLabel id="org-select-label">Select Organization</InputLabel>
//               <Select
//                 labelId="org-select-label"
//                 value={selectedOrgId}
//                 onChange={handleOrgChange}
//                 label="Select Organization"
//               >
//                 {organizations.map(org => (
//                   <MenuItem key={org.orgId} value={org.orgId}>
//                     {org.orgName}
//                   </MenuItem>
//                 ))}
//               </Select>
//               <Grid item xs={12} md={10}>
//               <Paper style={{ padding: '1.04vw', display: 'flex', alignItems: 'center', marginTop: "0.75vw", width:"123%", gap: "4.17vw" }}>
//                 <img src={orgData.imgUrl} alt="Organization Logo" style={{ width: '6.77vw', height: '7.8vh' }} />
//                 <Typography variant="h4" gutterBottom style={{ fontWeight:"bold" }}>
//                     {orgData.orgName}
//                 </Typography>
//               </Paper>

//             </Grid>
//             </FormControl>
//           )}

//           {/* Total Number of Registrations section */}
//           <Grid item xs={12} md={10}>
//             <Paper style={{ padding: '20px', width:"123%",marginTop:"-10px" }}>
//               <Typography variant="h6" component="h2">
//                 Total Number of Registrations
//               </Typography>
//               <Typography variant="h4" component="h3">
//                 Total:{total}
//               </Typography>
              
//               <Typography>Developers: {developerCount}</Typography>
//               <Typography>Org Managers : {mcount || 0}</Typography>
//               <Typography>Pending Reviews : {review || 0}</Typography>
//             </Paper>
//           </Grid>
//         </div>

//         {/* Stacked bar chart section */}
//         <Grid item xs={12} md={4}>
//         <Paper style={{  width: '990px', marginTop:"-0.5vw",height:"103%", marginLeft:"4.17vw" }}>
//           <Typography variant="h6" component="h2" style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>
//             Project Distribution
//           </Typography>
//           <ResponsiveContainer width="100%" height="70%">
//           <BarChart  data={projectData} margin={{ top: 20, right: 30, left: 5, bottom: 5 }}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" minTickGap={0} />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="modules" stackId="a" fill="#8884d8" />
//               <Bar dataKey="teamsAssigned" stackId="a" fill="#82ca9d" />
//               <Bar dataKey="developers" stackId="a" fill="#ffc658" />
//           </BarChart> 
//           </ResponsiveContainer>
//         </Paper>
//         </Grid>
//       </Grid>
//       {/* DummyComponent and Map section */}
//       <Grid container spacing={2} style={{ marginTop: '-1px', marginLeft: "-100px" }}>
//         <Grid item xs={8}>
//         <Paper style={{ padding: '20px', marginLeft: "70px" }}>
//     <div style={{ height: '480px', overflowY: 'auto', marginLeft: "-100px" }}>
//             <div>
//             {filteredProjectData &&
//   filteredProjectData
//     .filter((project) => {
//       // Condition for isP001Allowed or isP005Allowed
//       if (isP001Allowed || isP005Allowed) {
//         return true; // Include all projects
//       } else {
        
//         return project.projectOwner || project.assignedTo === (OrgId || selectedOrgId); // Use selectedOrgId if orgId is null
//       }
//     })
//     .map((project) => (
//               <Grid
//                 container
//                 spacing={0}
//                 key={project.projectCreatedBy}
//                 sx={{
//                   width: "90%",
//                   maxWidth: "79.17vw",
//                   marginLeft: "5vw",
//                   marginTop: "1vw",
//                   border: "2px dotted #000", // add dotted border 
//                   borderRadius: "8px",
//                   marginRight: "1vw", // add border radius
//                   '@media (max-width: 800px)': {
//                     minWidth: '1200px',
//                     overflowX: 'auto',
//                     overflowY:"hidden" 
//                   },
//                 }}
//               >
            
//                 <Grid
//                   item
//                   xs={12}
//                   sm={3.5}
//                   sx={{
//                     // borderLeft: "1px dashed #000",
//                     borderRight: ["none", "1px dashed #000"],
//                     padding: ["8px", "10px", "12px"],
//                     display: "flex",
//                     justifyContent: "flex-start",
//                     alignItems: "flex-start", // Align items to the top
                    
//                   }}
//                 >
//                   <div sx={{ textAlign: "left" }}>
//                     <h4
//                       style={{  margin: "-10px 8px 12px -10px" ,
//                       cursor: 'pointer',
//                       textDecoration: 'none',
//                       // fontSize:"20px",
//                       transition: 'text-decoration 0.3s ease-in-out',
//                       marginLeft:'0.2vw' // Optional for smooth transition
//                     }}
//                     onMouseEnter={(e) => (e.target.style.textDecoration = 'underline')}
//                     onMouseLeave={(e) => (e.target.style.textDecoration = 'none')}
//                     // onClick={() => {
//                     //   navigate("/module/" + project.projectName);
//                     // }}
//                     >
//                       {project.projectName}
//                     </h4>

//                     <p
//                       sx={{
//                       //   margin: "6px 4px 0 4px",
//                       cursor:'pointer',
//                         width: "5px",
//                       }}
//                       onClick={() => {
//                         navigate("/module/" + project.projectName);
//                       }}
//                     >
//                       {project &&
//                       project.projectDescription &&
//                       project.projectDescription.length > 33
//                         ? project.projectDescription.substring(0, 33) + "..."
//                         : project.projectDescription}
//                     </p>
//                     <img
//                       src={gitlab}
//                       alt="GitLab"
//                       style={{ width: "30px", height: "30px", marginTop: "5vw" ,cursor:'pointer',}}
//                       onClick={() => {
//                         window.open(project.gitWebUrl, "_blank");
//                       }}
//                     />
//                   </div>
                
//                 </Grid>
//                 <Grid
//                   item
//                   xs={12}
//                   sm={5}
//                   sx={{
//                     borderRight: ["none", "1px dashed #000"],
//                     position: "relative",
//                     textAlign: ["left", "center"],
//                     display: "flex",
//                     flexDirection: "column", // add flex direction
//                     justifyContent: "space-between", // add justify content
//                   }}
//                 >
//                   <div
//                     style={{
//                       height: "40%",
//                       borderBottom: "1px dashed #000",
//                       display: "flex",
//                       flexDirection: "column",
//                       margin: "0 0 4px 0",
//                       alignItems: "flex-start", // align text to left
//                       justifyContent: "flex-start",
//                       cursor:'pointer' // align text to top
//                     }}
//                     onClick={() => {
//                       navigate("/module/" + project.projectName);
//                     }}
//                   >
//                     <p
//                       style={{ 
//                         paddingLeft: "10px",
//                         paddingTop: "10px",
//                         marginTop: "-6px", // move "Skills Required" text up
//                         marginBottom: "4px",
//                         fontWeight: "500",
//                       }}
//                     >
//                       Skills Required
//                     </p>
//                     <div
//                      className="scrollable"
//                       style=
//                       {{
//                         display: "flex",
//                         height: "40px",
//                         width: "91%",
//                        // overflow:"auto",
//                         marginTop: "10px",
//                         marginLeft: "20px",
//                       }}
//                     >
//                       {project.skillsRequired.map((item) => (
//                         <p
//                           key={item._id}
//                           style={{
//                             display: "inline-block",
//                             padding: "4px 12px",
//                             backgroundColor: "#FFF",
//                             color: "#000",
//                             border: "1px solid #000",
//                             borderRadius: "20px",
//                             marginRight: "5px",
//                             fontSize: "10px",
//                             textAlign: "center",
//                             fontWeight: 400,
//                             lineHeight: "1",
//                           }}
//                         >
//                           {item.name}
//                         </p>
//                       ))}
//                     </div>
//                   </div>
//                   <div style={{ height: "60%" }}>
//                     <div
//                       style={{
//                         width: "25%",
//                         height: "100%",
//                         float: "left",
//                         borderRight: "1px dashed #000",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         flexDirection: "column",
//                         textAlign: ["left", "center"],
//                         cursor:'pointer'
//                       }}
//                       onClick={() => {
//                         navigate("/module/" + project.projectName);
//                       }}
//                     >
//                       <span
//                         style={{
//                           fontSize: ["16px", "20px"],
//                           marginTop: "0.5vh",
//                           marginBottom: "0",
//                           marginRight: ["-4px", "-10px", "-16px"],
//                           cursor:'pointer'
//                         }}
//                         onClick={() => {
//                           navigate("/module/" + project.projectName);
//                         }}
//                       >
//                         Total Dev time Required{" "}
//                       </span>
//                       <span
//                         style={{
//                           fontSize: ["32px"],
//                           marginTop: ["-8px", "-16px"],
//                           marginLeft: ["-8px", "-12px"],
//                           fontWeight: "500",
//                         }}
//                       >
//                         {project.totalDevTimeRequired}
//                       </span>
//                       <span
//                         style={{
//                           fontSize: ["16px", "20px"],
//                           marginTop: ["-8px", "-16px"],
//                           marginLeft: ["-8px", "-12px"],
//                         }}
//                       >
//                         hours
//                       </span>
//                     </div>

//                     <div
//                       style={{
//                         width: "10%",
//                         height: "103%",
//                         float: "left",
//                         borderRight: "1px dashed #000",
//                         backgroundColor:"#f2fffe",
//                         display: "flex",
//                         flexDirection: "column",
//                         justifyContent: "flex-end",
//                         alignItems: "center",
//                         marginTop: "-4px",
//                       }}
//                     >
//                       <span
//                         style={{
//                           transform: "translateY(-60%) rotate(270deg)",
//                           fontSize: ["21px"],
//                           marginBottom: "1.6vh",
//                           marginRight: "0.4vw",
//                         }}
//                       >
//                         Status
//                       </span>
//                       <img
//                         src={Vector}
//                         style={{
//                           marginBottom: "0.5vh",
//                           // width: "1.25vw",
//                           // height: "2.06vh",
//                           height: "25px",
//                           width: "25px"
//                         }}
//                       />
//                     </div>

//                     <div
//                     className="scrollable"
//                       style={{
//                          display: "flex",
//                         flexWrap: "nowrap",
//                         whiteSpace: "nowrap",
//                         marginTop:"-1vw",
//                         cursor:'pointer'

//                       }}
//                     >
//                    {moduleDetails  
//                         .filter((details) => details.projectId === project.projectId)
//                         .map((details, index) => (
//                           <PieChartsRow  moduleName={"Module" +(index + 1)}  time={details.totalDevTimeRequired} completed={details.completed} assigned={details.teamsAssigned.length} unassigned={3-(details.teamsAssigned.length)} />
//                         ))}
//                         </div>  
                      
//                 </div>
//                 </Grid>

//                 <Grid
//                   item
//                   xs={12}
//                   sm={2}
//                   sx={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     // backgroundColor: "#f2fffe",
//                     borderRadius: "0 8px 8px 0",
//                     cursor:'pointer',
//                     marginRight:"-5px",
//                   }}
//                   onClick={() => {
//                     navigate("/module/" + project.projectName);
//                   }}
//                 >
//                   <img
//      src={orgImgUrls[project.projectOwner] || ''}
//     style={{
//       width: '20vw',
//      height:"15vh",
//       maxWidth: '100%',
//       maxHeight: '100%',
//       paddingLeft:'10vw',
//     }}
//   />
//                 </Grid>
//               </Grid>
//             ))}
//         </div>

//             </div>
//           </Paper>
//         </Grid>
//         <Grid item xs={4}>
//         <Paper style={{ padding: '20px', marginLeft: '30px', width: 'calc(100% - 1px)', height: '480px' }}>
//             <Map selectedOrg={filteredProjectData}  />
//           </Paper>
//         </Grid>
//       </Grid>
    
//     </div>
//   );
// }

// export default Dashboard;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Typography, Paper, CircularProgress, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,ResponsiveContainer } from 'recharts';
import Map from './mapchart';
import PieChartsRow from '../Sub-Pages/Chart';
import Vector from "../icons/Vector.svg";
import gitlab from "../icons/gitlab.svg";
import { useNavigate } from 'react-router-dom';
import './project.css'
function Dashboard() {
  const permissionString = localStorage.getItem('permissions');
  const permissions = permissionString ? permissionString.split(',') : [];
  const [orgData, setOrgData] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrgId, setSelectedOrgId] = useState('');
  const [developerCount, setDeveloperCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const[mcount,setManagerCount]=useState();
  const OrgId = localStorage.getItem('orgId');
  const isP001Allowed = permissions.includes('P001');
  const isP005Allowed= permissions.includes('P005')
  const [projectModuleCounts, setProjectModuleCounts] = useState([]);
  const [moduleDetails, setModuleDetails] = useState([]);
  const [projectdata, setProjectData] = useState([]);
  const[review,setReview]=useState()

  const [filteredProjectData, setFilteredProjectData] = useState([]);
  const navigate = useNavigate();
  const getCompletedCount = async () => {
    try {
        const response = await axios.get('https://pl-api.iiit.ac.in/badalapi/count-completed');
        const count = response.data.count;
        setReview(count)
        console.log('Count of completed workspaces:', count);
    } catch (error) {
        console.error('Error getting count of completed workspaces:', error);
    }
};

getCompletedCount();

  React.useEffect(() => {
    axios
      .get("https://pl-api.iiit.ac.in/badalapi/get-allmodules")
      .then((res) => {
        setModuleDetails(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
     let needid=selectedOrgId
    if (selectedOrgId===''){
        needid=localStorage.getItem('orgId')
    }
    axios.get(`https://pl-api.iiit.ac.in/badalapi/get-org/${needid}`)
    .then(orgResponse => {
      const isNgo = orgResponse.data.isNgo;

      // Fetch project data
      axios.get("https://pl-api.iiit.ac.in/badalapi/get-project-DB")
        .then(projectResponse => {
          setProjectData(projectResponse.data);

          // Filter project data based on isNgo value
          const filteredData = projectResponse.data.filter(project => {
           
            if (isNgo==='true') {
              return project.projectOwner === selectedOrgId;
            

            } else {
              return project.assignedTo === selectedOrgId;
            
            }
          });

          setFilteredProjectData(filteredData);
         
        })
        .catch(error => {
          console.error("Error fetching project data:", error);
        });
    })
    .catch(error => {
      console.error("Error fetching organization data:", error);
    });

  }, [selectedOrgId]); // Add selectedOrgId as a dependency
  
  const [orgImgUrls, setOrgImgUrls] = useState({});
  useEffect(() => {
    if (projectdata.length > 0) { 
      // Fetch image URLs and org names based on orgIds
      axios.get('https://pl-api.iiit.ac.in/badalapi/get-img-url', { params: { orgIds: projectdata.map(project => project.projectOwner) } })
        .then(response => {
          const orgDetails = response.data.orgDetails.reduce((acc, orgDetail,index) => {
            acc.orgImgUrls[projectdata[index].projectOwner] = orgDetail.imgUrl;
            acc.orgNames[projectdata[index].projectOwner] = orgDetail.orgName;
           // acc.orgNames.push({ projectOwner: orgDetail.orgName, orgName: orgDetail.orgName });
            return acc;
          }, { orgImgUrls: {}, orgNames: [] });
  
          setOrgImgUrls(orgDetails.orgImgUrls);
        }) 
        .catch(error => {
          console.error('Error fetching org details:', error);
        });
    }
  }, [projectdata]);
  useEffect(() => {
    async function fetchProjectModuleCounts() {
      try {
        // Fetch project-module counts data
        const response = await axios.get(`https://pl-api.iiit.ac.in/badalapi/org/${selectedOrgId}/project-module-counts`);
        setProjectModuleCounts(response.data);
      } catch (error) {
        console.error('Error fetching project-module counts:', error);
      }
    }

    if (selectedOrgId) {
      fetchProjectModuleCounts();
    }
  }, [selectedOrgId]);
  useEffect(() => {
    async function fetchData() {
      try {
        if (OrgId !='undefined') {
          console.log(`Fetching organization data for OrgId: ${OrgId}`);
          let needid=selectedOrgId;
          if (selectedOrgId==''){
            needid=localStorage.getItem('orgId')
          }
          const orgResponse = await axios.get(`https://pl-api.iiit.ac.in/badalapi/organization/${needid}`);
          setOrgData(orgResponse.data);
          setSelectedOrgId(OrgId);
        } else {
          console.log('Fetching all organizations with roleId R002-B');
          const orgsResponse = await axios.get('https://pl-api.iiit.ac.in/badalapi/org/role2');
          setOrganizations(orgsResponse.data);
          setSelectedOrgId(orgsResponse.data[0]?.orgId || '');
          if (orgsResponse.data.length > 0) {
            const firstOrgId = orgsResponse.data[0].orgId;
            const orgResponse = await axios.get(`https://pl-api.iiit.ac.in/badalapi/organization/${firstOrgId}`);
            setOrgData(orgResponse.data);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoading(false);
    }

    fetchData();
  }, [OrgId]);
  useEffect(() => {
    async function fetchUsers(orgId) {
      try {
        setLoading(true);
        console.log(`Fetching users for organization: ${orgId}`);
        // Fetch users data
        const usersResponse = await axios.get(`https://pl-api.iiit.ac.in/badalapi/get-users-by-org/${orgId}`);
        const users = usersResponse.data;

        // Count developers (roleId === 'R003')
        const devCount = users.filter(user => user.roleId === 'R003').length;
        setDeveloperCount(devCount);
        const manager=users.filter(user=>user.roleId === 'R002-B').length;
        setManagerCount(manager)

        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    }

    if (selectedOrgId) {
      fetchUsers(selectedOrgId);
    }
  }, [selectedOrgId]);

  const handleOrgChange = async (event) => {
    const orgId = event.target.value;
    setSelectedOrgId(orgId);
    setLoading(true);
    try {
      console.log(`Organization selected: ${orgId}`);
      // Fetch organization data by selected OrgId
      const orgResponse = await axios.get(`https://pl-api.iiit.ac.in/badalapi/organization/${orgId}`);
      setOrgData(orgResponse.data);
      // Save selected organization and its ID in localStorage
      localStorage.setItem('selectedOrg', orgResponse.data.orgName);
      localStorage.setItem('selectedOrgId', orgId);
    } catch (error) {
      console.error('Error fetching organization data:', error);
    }
    setLoading(false);
  };
  console.log(filteredProjectData);
  

  if (loading) {
    return <CircularProgress />;
  }

  if (!orgData) {
    return <Typography variant="h6" color="error">No organizations Available</Typography>;
  }
  

// Map project-module counts data to projectData format
const projectData = Object.keys(projectModuleCounts).map(projectId => ({
  name: projectId,
  modules: projectModuleCounts[projectId].moduleCount,
  teamsAssigned: projectModuleCounts[projectId].totalTeamsAssigned,
  developers:projectModuleCounts[projectId].totalUsersAssigned
}));
 const total=mcount+developerCount


  return (
    <div style={{ marginTop: '30px', marginLeft: '30px' }}>
      <Grid container spacing={2}>
        {/* Organization section */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" ,width:"800px"}}>
          {OrgId !='undefined' ? (
            <Grid item xs={12} md={10}>
              <Paper style={{ padding: '30px', display: 'flex', alignItems: 'center', marginTop: "14px", width:"120%",gap: "80px"}}>
              <img src={orgData.imgUrl} alt="Organization Logo" style={{ maxWidth: '30%', height: 'auto', }} />
                <Typography variant="h4" gutterBottom style={{ fontWeight:"bold" }}>
                  {orgData.orgName}
                </Typography>
               
              </Paper>
            </Grid>
          ) : (
            <FormControl variant="outlined" style={{ minWidth: 240, marginBottom: '20px' }}>
              <InputLabel id="org-select-label">Select Organization</InputLabel>
              <Select
                labelId="org-select-label"
                value={selectedOrgId}
                onChange={handleOrgChange}
                label="Select Organization"
              >
                {organizations.map(org => (
                  <MenuItem key={org.orgId} value={org.orgId}>
                    {org.orgName}
                  </MenuItem>
                ))}
              </Select>
              <Grid item xs={12} md={10}>
              <Paper style={{ padding: '1.04vw', display: 'flex', alignItems: 'center', marginTop: "0.75vw", width:"123%", gap: "4.17vw" }}>
                <img src={orgData.imgUrl} alt="Organization Logo" style={{ width: '6.77vw', height: '7.8vh' }} />
                <Typography variant="h4" gutterBottom style={{ fontWeight:"bold" }}>
                    {orgData.orgName}
                </Typography>
              </Paper>

            </Grid>
            </FormControl>
          )}

          {/* Total Number of Registrations section */}
          <Grid item xs={12} md={10}>
            <Paper style={{ padding: '20px', width:"123%",marginTop:"-10px" }}>
              <Typography variant="h6" component="h2">
                Total Number of Registrations
              </Typography>
              <Typography variant="h4" component="h3">
                Total:{total}
              </Typography>
              
              <Typography>Developers: {developerCount}</Typography>
              <Typography>Org Managers : {mcount || 0}</Typography>
              <Typography>Pending Reviews : {review || 0}</Typography>
            </Paper>
          </Grid>
        </div>

        {/* Stacked bar chart section */}
        <Grid item xs={12} md={4}>
        <Paper style={{  width: '990px', marginTop:"-0.5vw",height:"103%", marginLeft:"4.17vw" }}>
          <Typography variant="h6" component="h2" style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>
            Project Distribution
          </Typography>
          <ResponsiveContainer width="100%" height="70%">
          <BarChart  data={projectData} margin={{ top: 20, right: 30, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" minTickGap={0} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="modules" stackId="a" fill="#8884d8" />
              <Bar dataKey="teamsAssigned" stackId="a" fill="#82ca9d" />
              <Bar dataKey="developers" stackId="a" fill="#ffc658" />
          </BarChart> 
          </ResponsiveContainer>
        </Paper>
        </Grid>
      </Grid>
      {/* DummyComponent and Map section */}
      <Grid container spacing={2} style={{ marginTop: '-1px', marginLeft: "-100px" }}>
        <Grid item xs={8}>
        <Paper style={{ padding: '20px', marginLeft: "70px" }}>
    <div style={{ height: '480px', overflowY: 'auto', marginLeft: "-100px" }}>
            <div>
            {filteredProjectData &&
  filteredProjectData
    .filter((project) => {
      // Condition for isP001Allowed or isP005Allowed
      if (isP001Allowed || isP005Allowed) {
        return true; // Include all projects
      } else {
        
        return project.projectOwner || project.assignedTo === (OrgId || selectedOrgId); // Use selectedOrgId if orgId is null
      }
    })
    .map((project) => (
              <Grid
                container
                spacing={0}
                key={project.projectCreatedBy}
                sx={{
                  width: "90%",
                  maxWidth: "79.17vw",
                  marginLeft: "5vw",
                  marginTop: "1vw",
                  border: "2px dotted #000", // add dotted border 
                  borderRadius: "8px",
                  marginRight: "1vw", // add border radius
                  '@media (max-width: 800px)': {
                    minWidth: '1200px',
                    overflowX: 'auto',
                    overflowY:"hidden" 
                  },
                }}
              >
            
                <Grid
                  item
                  xs={12}
                  sm={3.5}
                  sx={{
                    // borderLeft: "1px dashed #000",
                    borderRight: ["none", "1px dashed #000"],
                    padding: ["8px", "10px", "12px"],
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "flex-start", // Align items to the top
                    
                  }}
                >
                  <div sx={{ textAlign: "left" }}>
                    <h4
                      style={{  margin: "-10px 8px 12px -10px" ,
                      cursor: 'pointer',
                      textDecoration: 'none',
                      // fontSize:"20px",
                      transition: 'text-decoration 0.3s ease-in-out',
                      marginLeft:'0.2vw' // Optional for smooth transition
                    }}
                    onMouseEnter={(e) => (e.target.style.textDecoration = 'underline')}
                    onMouseLeave={(e) => (e.target.style.textDecoration = 'none')}
                    // onClick={() => {
                    //   navigate("/module/" + project.projectName);
                    // }}
                    >
                      {project.projectName}
                    </h4>

                    <p
                      sx={{
                      //   margin: "6px 4px 0 4px",
                      cursor:'pointer',
                        width: "5px",
                      }}
                      onClick={() => {
                        navigate("/module/" + project.projectName);
                      }}
                    >
                      {project &&
                      project.projectDescription &&
                      project.projectDescription.length > 33
                        ? project.projectDescription.substring(0, 33) + "..."
                        : project.projectDescription}
                    </p>
                    <img
                      src={gitlab}
                      alt="GitLab"
                      style={{ width: "30px", height: "30px", marginTop: "5vw" ,cursor:'pointer',}}
                      onClick={() => {
                        window.open(project.gitWebUrl, "_blank");
                      }}
                    />
                  </div>
                
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={5}
                  sx={{
                    borderRight: ["none", "1px dashed #000"],
                    position: "relative",
                    textAlign: ["left", "center"],
                    display: "flex",
                    flexDirection: "column", // add flex direction
                    justifyContent: "space-between", // add justify content
                  }}
                >
                  <div
                    style={{
                      height: "40%",
                      borderBottom: "1px dashed #000",
                      display: "flex",
                      flexDirection: "column",
                      margin: "0 0 4px 0",
                      alignItems: "flex-start", // align text to left
                      justifyContent: "flex-start",
                      cursor:'pointer' // align text to top
                    }}
                    onClick={() => {
                      navigate("/module/" + project.projectName);
                    }}
                  >
                    <p
                      style={{ 
                        paddingLeft: "10px",
                        paddingTop: "10px",
                        marginTop: "-6px", // move "Skills Required" text up
                        marginBottom: "4px",
                        fontWeight: "500",
                      }}
                    >
                      Skills Required
                    </p>
                    <div
                     className="scrollable"
                      style=
                      {{
                        display: "flex",
                        height: "40px",
                        width: "91%",
                       // overflow:"auto",
                        marginTop: "10px",
                        marginLeft: "20px",
                      }}
                    >
                      {project.skillsRequired.map((item) => (
                        <p
                          key={item._id}
                          style={{
                            display: "inline-block",
                            padding: "4px 12px",
                            backgroundColor: "#FFF",
                            color: "#000",
                            border: "1px solid #000",
                            borderRadius: "20px",
                            marginRight: "5px",
                            fontSize: "10px",
                            textAlign: "center",
                            fontWeight: 400,
                            lineHeight: "1",
                          }}
                        >
                          {item.name}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div style={{ height: "60%" }}>
                    <div
                      style={{
                        width: "25%",
                        height: "100%",
                        float: "left",
                        borderRight: "1px dashed #000",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        textAlign: ["left", "center"],
                        cursor:'pointer'
                      }}
                      onClick={() => {
                        navigate("/module/" + project.projectName);
                      }}
                    >
                      <span
                        style={{
                          fontSize: ["16px", "20px"],
                          marginTop: "0.5vh",
                          marginBottom: "0",
                          marginRight: ["-4px", "-10px", "-16px"],
                          cursor:'pointer'
                        }}
                        onClick={() => {
                          navigate("/module/" + project.projectName);
                        }}
                      >
                        Total Dev time Required{" "}
                      </span>
                      <span
                        style={{
                          fontSize: ["32px"],
                          marginTop: ["-8px", "-16px"],
                          marginLeft: ["-8px", "-12px"],
                          fontWeight: "500",
                        }}
                      >
                        {project.totalDevTimeRequired}
                      </span>
                      <span
                        style={{
                          fontSize: ["16px", "20px"],
                          marginTop: ["-8px", "-16px"],
                          marginLeft: ["-8px", "-12px"],
                        }}
                      >
                        hours
                      </span>
                    </div>

                    <div
                      style={{
                        width: "10%",
                        height: "103%",
                        float: "left",
                        borderRight: "1px dashed #000",
                        backgroundColor:"#f2fffe",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        marginTop: "-4px",
                      }}
                    >
                      <span
                        style={{
                          transform: "translateY(-60%) rotate(270deg)",
                          fontSize: ["21px"],
                          marginBottom: "1.6vh",
                          marginRight: "0.4vw",
                        }}
                      >
                        Status
                      </span>
                      <img
                        src={Vector}
                        style={{
                          marginBottom: "0.5vh",
                          // width: "1.25vw",
                          // height: "2.06vh",
                          height: "25px",
                          width: "25px"
                        }}
                      />
                    </div>

                    <div
                    className="scrollable"
                      style={{
                         display: "flex",
                        flexWrap: "nowrap",
                        whiteSpace: "nowrap",
                        marginTop:"-1vw",
                        cursor:'pointer'

                      }}
                    >
                   {moduleDetails  
                        .filter((details) => details.projectId === project.projectId)
                        .map((details, index) => (
                          <PieChartsRow  moduleName={"Module" +(index + 1)}  time={details.totalDevTimeRequired} completed={details.completed} assigned={details.teamsAssigned.length} unassigned={3-(details.teamsAssigned.length)} />
                        ))}
                        </div>  
                      
                </div>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={2}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    // backgroundColor: "#f2fffe",
                    borderRadius: "0 8px 8px 0",
                    cursor:'pointer',
                    marginRight:"-5px",
                  }}
                  onClick={() => {
                    navigate("/module/" + project.projectName);
                  }}
                >
                  <img
     src={orgImgUrls[project.projectOwner] || ''}
    style={{
      width: '20vw',
     height:"15vh",
      maxWidth: '100%',
      maxHeight: '100%',
      paddingLeft:'10vw',
    }}
  />
                </Grid>
              </Grid>
            ))}
        </div>

            </div>
          </Paper>
        </Grid>
        <Grid item xs={4}>
        <Paper style={{ padding: '20px', marginLeft: '30px', width: 'calc(100% - 1px)', height: '480px' }}>
            <Map selectedOrg={filteredProjectData}  />
          </Paper>
        </Grid>
      </Grid>
    
    </div>
  );
}

export default Dashboard;