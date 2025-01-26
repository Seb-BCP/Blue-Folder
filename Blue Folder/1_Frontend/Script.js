// Data structures
const classifications = {
    CLAB: {
        normalRate: 33.61,
        timeHalfRate: 47.24,
        doubleRate: 60.86,
        shiftRate: 47.34,
        travelAllowance: 21.94,
        clientRate: 49.65,
        category: 'Construction'
    },
    // Add more classifications here
};

// Time calculations
function calculateHours(dayHours, isWeekend = false) {
    if (!dayHours) return { normal: 0, timeHalf: 0, double: 0 };
    
    if (isWeekend) {
        if (dayHours <= 2) {
            return { normal: 0, timeHalf: dayHours, double: 0 };
        }
        return { normal: 0, timeHalf: 2, double: dayHours - 2 };
    }

    // Weekday calculations
    if (dayHours <= 7.6) {
        return { normal: dayHours, timeHalf: 0, double: 0 };
    } else if (dayHours <= 9.6) {
        return { normal: 7.6, timeHalf: dayHours - 7.6, double: 0 };
    } else {
        return { normal: 7.6, timeHalf: 2, double: dayHours - 9.6 };
    }
}

// Worker assignment and timesheet management
class WorkerAssignment {
    constructor(worker, client, site, classification) {
        this.worker = worker;
        this.client = client;
        this.site = site;
        this.classification = classification;
        this.timesheet = {
            monday: 0, tuesday: 0, wednesday: 0, thursday: 0,
            friday: 0, saturday: 0, sunday: 0,
            isShift: false
        };
    }

    updateHours(day, hours) {
        this.timesheet[day] = hours;
    }

    calculateTotalHours() {
        let totals = { normal: 0, timeHalf: 0, double: 0 };
        
        for (const [day, hours] of Object.entries(this.timesheet)) {
            if (day === 'isShift') continue;
            
            const isWeekend = day === 'saturday' || day === 'sunday';
            const dayTotals = calculateHours(hours, isWeekend);
            
            totals.normal += dayTotals.normal;
            totals.timeHalf += dayTotals.timeHalf;
            totals.double += dayTotals.double;
        }
        
        return totals;
    }

    calculatePay() {
        const rates = classifications[this.classification];
        const hours = this.calculateTotalHours();
        
        return {
            normal: hours.normal * rates.normalRate,
            timeHalf: hours.timeHalf * rates.timeHalfRate,
            double: hours.double * rates.doubleRate,
            travel: rates.travelAllowance
        };
    }

    calculateCharges() {
        const rates = classifications[this.classification];
        const hours = this.calculateTotalHours();
        
        return {
            normal: hours.normal * rates.clientRate,
            timeHalf: hours.timeHalf * (rates.clientRate * 1.5),
            double: hours.double * (rates.clientRate * 2),
            travel: rates.travelAllowance * 1.5
        };
    }
}

// Export functionality
function generatePayrollExport(assignments) {
    return assignments.map(assignment => {
        const hours = assignment.calculateTotalHours();
        const pay = assignment.calculatePay();
        
        return {
            worker: assignment.worker,
            classification: assignment.classification,
            normalHours: hours.normal,
            timeHalfHours: hours.timeHalf,
            doubleHours: hours.double,
            normalPay: pay.normal,
            timeHalfPay: pay.timeHalf,
            doublePay: pay.double,
            travelAllowance: pay.travel
        };
    });
}

// Event handlers for UI
document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners for timesheet inputs
    const timesheetInputs = document.querySelectorAll('.timesheet-input');
    timesheetInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            // Update calculations when hours are entered
            const hours = parseFloat(e.target.value) || 0;
            // Update corresponding worker assignment
            // Refresh totals display
        });
    });
});

// create and populate a sample timesheet row for testing.
function createTimesheetRow(worker = 'Test Worker', client = 'Test Client', site = 'Test Site') {
    const tbody = document.getElementById('timesheet-body');
    const row = document.createElement('tr');
    
    // Add cells for worker, client, site info
    row.innerHTML = `
        <td>${client}</td>
        <td>${site}</td>
        <td>${worker}</td>
        <td><select class="classification-select">
            <option value="CLAB">CLAB</option>
            <option value="FORKLIFT">Forklift</option>
        </select></td>
        ${Array(7).fill(0).map(() => 
            `<td><input type="number" class="timesheet-input" step="0.1" min="0" max="24"></td>`
        ).join('')}
        <td class="normal-hours">0</td>
        <td class="time-half-hours">0</td>
        <td class="double-hours">0</td>
    `;

    tbody.appendChild(row);
}

// Call the function when the document is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log("Document ready");
    createTimesheetRow();
});