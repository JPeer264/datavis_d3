export const jsonData = {
    traveltime: {
        name: "Traveltime to School",
        type: "numeric"
    },
    studytime: {
        name: "Weekly Studytime",
        type: "numeric"
    },
    famrel: {
        name: "Family Relationship Quality",
        type: "numeric"
    },
    freetime: {
        name: "Amount of Freetime",
        type: "numeric"
    },
    goout: {
        name: "Going Out with Friends",
        type: "numeric"
    },
    dalc: {
        name: "Workday Alcohol Consumption",
        type: "numeric"
    },
    walc: {
        name: "Weekend Alcohol Consumption",
        type: "numeric"
    },
    health: {
        name: "Health Status",
        type: "numeric"
    },
    school: {
        name: "Student's School",
        type: "binary"
    },
    sex: {
        name: "Student's Sex",
        type: "binary"
    },
    address: {
        name: "Home Address",
        type: "binary"
    },
    famsize: {
        name: "Family Size",
        type: "binary"
    },
    pstatus: {
        name: "Parents Cohabitation Status",
        type: "binary"
    },
    guardian: {
        name: "Student's Guardian",
        type: "binary"
    },
    schoolsup: {
        name: "Extra Educational Support",
        type: "binary"
    },
    famsup: {
        name: "Family Educational Support",
        type: "binary"
    },
    activities: {
        name: "Extra Curricular Activities",
        type: "binary"
    },
    nursery: {
        name: "Attendance at Nursery School",
        type: "binary"
    },
    higher: {
        name: "Wants to take Higher Education",
        type: "binary"
    },
    internet: {
        name: "Home Internet Access",
        type: "binary"
    },
    romantic: {
        name: "Romantic Relationship",
        type: "binary"
    }
};

export const pieCharts = {
    romantic: {
        dataKey: 'romantic',
        keys: {
            'no': {
                color: '#000FFF',
                name: 'No'
            },
            'yes': {
                color: '#FFF000',
                name: 'Yes'
            }
        }
    },
    pstatus: {
        dataKey: 'pstatus',
        keys: {
            't': {
                color: '#ff7e43',
                name: 'Living together'
            },
            'a': {
                color: '#5ebbd9',
                name: 'Living apart'
            }
        }
    },
    sex: {
        dataKey: 'sex',
        keys: {
            'f': {
                color: '#ff7e43',
                name: 'Female'
            },
            'm': {
                color: '#5ebbd9',
                name: 'Male'
            }
        }
    },
    address: {
        dataKey: 'address',
        keys: {
            'r': {
                color: '#3fb76f',
                name: 'Rural'
            },
            'u': {
                color: '#b386be',
                name: 'Urban'
            }
        }
    }
}
