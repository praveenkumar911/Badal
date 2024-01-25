
const endpoints = {
    // baseUrl: 'http://localhost:3000',
    baseUrl: window.location.origin,
    dashboardPOSTBaseUrl: '',
    drives: {
        getAllDrives: '/jsons/driveInfo.json',
        getDriveDetails: '/jsons/driveDetails.json',
        getAllForms: '/jsons/allForms.json',
        getAllAssistants: '/jsons/allAssistants.json',
        getAllMedicalAssistants: '/jsons/allMedicalAssistants.json',
        getAllFields: '/jsons/allFields.json',
        saveFormData: '/jsons/saveFormData.json',
    },
    screeningAPIs: {
        getScreeningAPIs: '/jsons/screeningApis.json',
    },
    user: {
        login: '/jsons/login.json',
    },
    dashboard: {
        getDrivesPerYear: '/get_drives_per_year',
        getPatientsPerYear: '/get_patients_per_year',
        getPatientsPerDay: '/get_patients_per_day'
    }

};

export default endpoints;