// Function to update classification dropdowns
function updateClassificationDropdowns() {
    // Get all current classifications from the classifications table
    const classificationInputs = document.querySelectorAll('#classifications-body .classification-input');
    const classifications = Array.from(classificationInputs).map(input => input.value).filter(value => value);

    // Get all classification select elements
    const classificationSelects = document.querySelectorAll('.classification-select');

    // Update each dropdown
    classificationSelects.forEach(select => {
        // Store current selection
        const currentValue = select.value;
        
        // Clear current options
        select.innerHTML = '';
        
        // Add blank option first
        select.add(new Option('Select Classification', ''));
        
        // Add all classifications
        classifications.forEach(classification => {
            select.add(new Option(classification, classification));
        });

        // Restore previous selection if it still exists
        if (classifications.includes(currentValue)) {
            select.value = currentValue;
        }
    });
}

// Add event listeners for classification changes
function addClassificationChangeListeners() {
    const classificationsTable = document.getElementById('classifications-body');
    
    // Listen for changes to classification names
    classificationsTable.addEventListener('input', (e) => {
        if (e.target.classList.contains('classification-input')) {
            updateClassificationDropdowns();
        }
    });
}

// Modify the existing addClassificationRow function
function addClassificationRow() {
    // ... existing code ...
    
    // After adding the new rows, update the dropdowns
    updateClassificationDropdowns();
}

// Default classifications and rates
const defaultClassifications = [
    {
        name: "Contruction TA",
        payRates: {
            normalTime: 35.04,
            timeHalf: 49.05,
            doubleTime: 63.07,
            shift: 49.05,
            travel: 21.94
        },
        chargeRates: {
            normalTime: 52.15,
            timeHalf: 63.65,
            doubleTime: 79.45,
            shift: 69.65,
            travel: 26.55
        }
    },
    {
        name: "CLAB",
        payRates: {
            normalTime: 33.81,
            timeHalf: 47.34,
            doubleTime: 60.86,
            shift: 47.34,
            travel: 21.94
        },
        chargeRates: {
            normalTime: 49.65,
            timeHalf: 61.00,
            doubleTime: 76.15,
            shift: 66.40,
            travel: 26.55
        }
    },
    {
        name: "C-LF",
        payRates: {
            normalTime: 36.00,
            timeHalf: 50.40,
            doubleTime: 64.80,
            shift: 50.40,
            travel: 21.94
        },
        chargeRates: {
            normalTime: 53.75,
            timeHalf: 65.25,
            doubleTime: 81.35,
            shift: 71.30,
            travel: 26.55
        }
    },
    {
        name: "LF",
        payRates: {
            normalTime: 33.50,
            timeHalf: 45.15,
            doubleTime: 58.05,
            shift: 39.99,
            travel: 0.00
        },
        chargeRates: {
            normalTime: 49.95,
            timeHalf: 60.55,
            doubleTime: 75.00,
            shift: 59.60,
            travel: 0.00
        }
    },
    {
        name: "Labourer",
        payRates: {
            normalTime: 32.00,
            timeHalf: 44.75,
            doubleTime: 57.53,
            shift: 39.63,
            travel: 0.00
        },
        chargeRates: {
            normalTime: 48.50,
            timeHalf: 58.45,
            doubleTime: 72.75,
            shift: 57.65,
            travel: 0.00
        }
    },
    {
        name: "TA",
        payRates: {
            normalTime: 34.00,
            timeHalf: 45.15,
            doubleTime: 58.05,
            shift: 39.99,
            travel: 0.00
        },
        chargeRates: {
            normalTime: 51.20,
            timeHalf: 60.55,
            doubleTime: 75.00,
            shift: 59.60,
            travel: 0.00
        }
    }
];

function getClassificationOptions() {
    const classificationInputs = document.querySelectorAll('#classifications-body .classification-input');
    return Array.from(classificationInputs)
        .map(input => input.value)
        .filter(value => value)
        .map(classification => `<option value="${classification}">${classification}</option>`)
        .join('');
}

// Function to populate classifications table on page load
function populateClassificationsTable() {
    const tbody = document.getElementById('classifications-body');
    tbody.innerHTML = ''; // Clear existing content

    defaultClassifications.forEach(classification => {
        const rows = `
            <tr>
                <td rowspan="2">
                    <input type="text" class="classification-input" value="${classification.name}">
                </td>
                <td>Pay Rate</td>
                <td><input type="number" step="0.01" class="rate-input" value="${classification.payRates.normalTime}"></td>
                <td><input type="number" step="0.01" class="rate-input" value="${classification.payRates.timeHalf}"></td>
                <td><input type="number" step="0.01" class="rate-input" value="${classification.payRates.doubleTime}"></td>
                <td><input type="number" step="0.01" class="rate-input" value="${classification.payRates.shift}"></td>
                <td><input type="number" step="0.01" class="rate-input" value="${classification.payRates.travel}"></td>
            </tr>
            <tr>
                <td>Charge Rate</td>
                <td><input type="number" step="0.01" class="rate-input" value="${classification.chargeRates.normalTime}"></td>
                <td><input type="number" step="0.01" class="rate-input" value="${classification.chargeRates.timeHalf}"></td>
                <td><input type="number" step="0.01" class="rate-input" value="${classification.chargeRates.doubleTime}"></td>
                <td><input type="number" step="0.01" class="rate-input" value="${classification.chargeRates.shift}"></td>
                <td><input type="number" step="0.01" class="rate-input" value="${classification.chargeRates.travel}"></td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', rows);
    });
}

function updateRowTotals(row) {
    const totalCell = row.querySelector('.total-hours');
    const hoursInputs = row.querySelectorAll('.hours-input');
    let total = 0;
    
    hoursInputs.forEach(hourInput => {
        const value = parseFloat(hourInput.value) || 0;
        if (!isNaN(value)) {
            total += value;
        }
    });
    
    totalCell.textContent = total.toFixed(1);
}

function updatePaySheets() {
    const paysheetBody = document.getElementById('paysheet-body');
    paysheetBody.innerHTML = '';
    
    // Group by worker and classification
    const timesheetRows = Array.from(document.getElementById('timesheet-body').children);
    const workerData = new Map();
    
    timesheetRows.forEach(row => {
        const worker = row.querySelector('.worker-input').value;
        if (!worker) return; // Skip empty rows
        
        const classification = row.querySelector('.classification-select').value;
        if (!classification) return; // Skip rows without classification
        
        // Find the classification rates
        const classificationData = defaultClassifications.find(c => c.name === classification);
        if (!classificationData) return; // Skip if classification not found
        
        if (!workerData.has(worker)) {
            workerData.set(worker, {
                classification: classification,
                rates: classificationData.payRates,
                hours: { normal: 0, timeHalf: 0, double: 0 },
                daysWorked: 0 // For travel allowance
            });
        }
        
        const data = workerData.get(worker);
        const dayInputs = row.querySelectorAll('.hours-input');
        dayInputs.forEach((input, index) => {
            const hours = parseFloat(input.value) || 0;
            if (hours > 0) data.daysWorked++; // Count days worked for travel
            
            const isWeekend = index >= 5 ? (index === 6 ? 'sunday' : 'saturday') : false;
            const dayTotals = calculateDayHours(hours, isWeekend);
            
            data.hours.normal += dayTotals.normal;
            data.hours.timeHalf += dayTotals.timeHalf;
            data.hours.double += dayTotals.double;
        });
    });    

    // Create paysheet rows
    workerData.forEach((data, worker) => {
        const row = document.createElement('tr');
        
        // Calculate pays
        const normalPay = data.hours.normal * data.rates.normalTime;
        const timeHalfPay = data.hours.timeHalf * data.rates.timeHalf;
        const doublePay = data.hours.double * data.rates.doubleTime;
        const travelPay = data.rates.travel > 0 ? data.rates.travel * data.daysWorked : 0;
        const totalPay = normalPay + timeHalfPay + doublePay + travelPay;
        
        row.innerHTML = `
            <td>${worker}</td>
            <td>${data.classification}</td>
            <td>${data.hours.normal.toFixed(1)}</td>
            <td>$${data.rates.normalTime.toFixed(2)}</td>
            <td>$${normalPay.toFixed(2)}</td>
            <td>${data.hours.timeHalf.toFixed(1)}</td>
            <td>$${data.rates.timeHalf.toFixed(2)}</td>
            <td>$${timeHalfPay.toFixed(2)}</td>
            <td>${data.hours.double.toFixed(1)}</td>
            <td>$${data.rates.doubleTime.toFixed(2)}</td>
            <td>$${doublePay.toFixed(2)}</td>
            <td>$${travelPay.toFixed(2)}</td>
            <td>$${totalPay.toFixed(2)}</td>
        `;
        paysheetBody.appendChild(row);
    });
}



// Hour calculation functions
function calculateDayHours(hours, isWeekend = false) {
    if (!hours || hours <= 0) return { normal: 0, timeHalf: 0, double: 0 };
    
    if (isWeekend) {
        if (isWeekend === 'sunday') {
            return { normal: 0, timeHalf: 0, double: hours };
        }
        // Saturday
        return {
            normal: 0,
            timeHalf: Math.min(hours, 2),
            double: Math.max(0, hours - 2)
        };
    }

    // Weekday calculations
    return {
        normal: Math.min(hours, 7.6),
        timeHalf: hours > 7.6 ? Math.min(hours - 7.6, 2) : 0,
        double: Math.max(0, hours - 9.6)
    };
}

class TimesheetRow {
    constructor(worker, client, site, classification) {
        this.worker = worker;
        this.client = client;
        this.site = site;
        this.classification = classification;
        this.hours = {
            monday: 0,
            tuesday: 0,
            wednesday: 0,
            thursday: 0,
            friday: 0,
            saturday: 0,
            sunday: 0
        };
    }

    updateHours(day, hours) {
        this.hours[day] = parseFloat(hours) || 0;
        this.calculateTotals();
    }

    calculateTotals() {
        const totals = { normal: 0, timeHalf: 0, double: 0 };
        
        Object.entries(this.hours).forEach(([day, hours]) => {
            const isWeekend = day === 'saturday' ? 'saturday' : 
                            day === 'sunday' ? 'sunday' : false;
            const dayTotals = calculateDayHours(hours, isWeekend);
            
            totals.normal += dayTotals.normal;
            totals.timeHalf += dayTotals.timeHalf;
            totals.double += dayTotals.double;
        });
        
        return totals;
    }

    calculatePay() {
        const rates = classifications[this.classification];
        const hours = this.calculateTotals();
        
        return {
            normal: hours.normal * rates.normalRate,
            timeHalf: hours.timeHalf * rates.timeHalfRate,
            double: hours.double * rates.doubleRate,
            travel: rates.travelAllowance
        };
    }

    calculateCharges() {
        const rates = classifications[this.classification];
        const hours = this.calculateTotals();
        
        return {
            normal: hours.normal * rates.clientNormalRate,
            timeHalf: hours.timeHalf * rates.clientTimeHalfRate,
            double: hours.double * rates.clientDoubleRate,
            travel: rates.travelAllowance * 1.5
        };
    }
}

// UI Management
class BlueFolder {
    constructor() {
        this.timesheetRows = [];
    }    

    addTimesheetRow() {
        const tbody = document.getElementById('timesheet-body');
        const row = document.createElement('tr');
        
        // Create input cells
        row.innerHTML = `
            
            <td><input type="text" class="client-site-input"></td>
            <td><input type="text" class="worker-input"></td>
            <td>
                <select class="classification-select">
                    <option value="">Select Classification</option>
                    ${getClassificationOptions()}
                </select>
            </td>
            <td><input type="number" class="hours-input" step="0.1" min="0" data-day="monday"></td>
            <td><input type="number" class="hours-input" step="0.1" min="0" data-day="tuesday"></td>
            <td><input type="number" class="hours-input" step="0.1" min="0" data-day="wednesday"></td>
            <td><input type="number" class="hours-input" step="0.1" min="0" data-day="thursday"></td>
            <td><input type="number" class="hours-input" step="0.1" min="0" data-day="friday"></td>
            <td><input type="number" class="hours-input" step="0.1" min="0" data-day="saturday"></td>
            <td><input type="number" class="hours-input" step="0.1" min="0" data-day="sunday"></td>
            <td class="total-hours">0.0</td>
        `;


        row.querySelectorAll('.hours-input').forEach(input => {
            input.addEventListener('input', () => {
                updateRowTotals(row);
                updatePaySheets();  // Add this line
            });
        });
        
        
        // Add this new function outside of addTimesheetRow
        function updateRowTotals(row) {
            const totalCell = row.querySelector('.total-hours');
            const hoursInputs = row.querySelectorAll('.hours-input');
            let total = 0;
            
            hoursInputs.forEach(hourInput => {
                const value = parseFloat(hourInput.value) || 0;
                if (!isNaN(value)) {
                    total += value;
                }
            });
            
            totalCell.textContent = total.toFixed(1);
        }
    
        tbody.appendChild(row);
        this.updateSummary();
    }

    updateRowCalculations(row) {
        const hours = {};
        row.querySelectorAll('.hours-input').forEach(input => {
            hours[input.dataset.day] = parseFloat(input.value) || 0;
        });

        const classification = row.querySelector('.classification-select').value;
        const timesheetRow = new TimesheetRow(
            row.querySelector('.worker-input').value,
            row.querySelector('.client-input').value,
            row.querySelector('.site-input').value,
            classification
        );
        Object.entries(hours).forEach(([day, value]) => {
            timesheetRow.updateHours(day, value);
        });

        const totals = timesheetRow.calculateTotals();
        row.querySelector('.normal-hours').textContent = totals.normal.toFixed(1);
        row.querySelector('.time-half-hours').textContent = totals.timeHalf.toFixed(1);
        row.querySelector('.double-hours').textContent = totals.double.toFixed(1);
    }

    updateCharges() {
        const chargesBody = document.getElementById('charges-body');
        chargesBody.innerHTML = '';
        
        // Group by client/site/worker
        const timesheetRows = Array.from(document.getElementById('timesheet-body').children);
        const clientData = new Map();
        
        timesheetRows.forEach(row => {
            const key = `${row.querySelector('.client-input').value}-
                        ${row.querySelector('.site-input').value}-
                        ${row.querySelector('.worker-input').value}`;
            
            if (!clientData.has(key)) {
                clientData.set(key, {
                    client: row.querySelector('.client-input').value,
                    site: row.querySelector('.site-input').value,
                    worker: row.querySelector('.worker-input').value,
                    classification: row.querySelector('.classification-select').value,
                    hours: { normal: 0, timeHalf: 0, double: 0 }
                });
            }
            
            const data = clientData.get(key);
            data.hours.normal += parseFloat(row.querySelector('.normal-hours').textContent);
            data.hours.timeHalf += parseFloat(row.querySelector('.time-half-hours').textContent);
            data.hours.double += parseFloat(row.querySelector('.double-hours').textContent);
        });
        
        // Create charge rows
        clientData.forEach(data => {
            const rates = classifications[data.classification];
            const charges = {
                normal: data.hours.normal * rates.clientNormalRate,
                timeHalf: data.hours.timeHalf * rates.clientTimeHalfRate,
                double: data.hours.double * rates.clientDoubleRate,
                travel: rates.travelAllowance * 1.5
            };
            const total = charges.normal + charges.timeHalf + charges.double + charges.travel;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${data.client}</td>
                <td>${data.site}</td>
                <td>${data.worker}</td>
                <td>${data.classification}</td>
                <td>${data.hours.normal.toFixed(1)}</td>
                <td>$${charges.normal.toFixed(2)}</td>
                <td>${data.hours.timeHalf.toFixed(1)}</td>
                <td>$${charges.timeHalf.toFixed(2)}</td>
                <td>${data.hours.double.toFixed(1)}</td>
                <td>$${charges.double.toFixed(2)}</td>
                <td>$${charges.travel.toFixed(2)}</td>
                <td>$${total.toFixed(2)}</td>
            `;
            chargesBody.appendChild(row);
        });
    }
}

// Classification management
function addClassificationRow() {
    const tbody = document.getElementById('classifications-body');
    const newRows = `
        <tr>
            <td rowspan="2">
                <input type="text" class="classification-input" placeholder="Enter classification">
            </td>
            <td>Pay Rate</td>
            <td><input type="number" step="0.01" class="rate-input"></td>
            <td><input type="number" step="0.01" class="rate-input"></td>
            <td><input type="number" step="0.01" class="rate-input"></td>
            <td><input type="number" step="0.01" class="rate-input"></td>
            <td><input type="number" step="0.01" class="rate-input"></td>
        </tr>
        <tr>
            <td>Charge Rate</td>
            <td><input type="number" step="0.01" class="rate-input"></td>
            <td><input type="number" step="0.01" class="rate-input"></td>
            <td><input type="number" step="0.01" class="rate-input"></td>
            <td><input type="number" step="0.01" class="rate-input"></td>
            <td><input type="number" step="0.01" class="rate-input"></td>
        </tr>
    `;
    tbody.insertAdjacentHTML('beforeend', newRows);
}

// Add event listener for the classification button
document.addEventListener('DOMContentLoaded', function() {
    populateClassificationsTable();
    updateClassificationDropdowns();
    addClassificationChangeListeners();

    const defaultRow = document.querySelector('#timesheet-body tr');
    if (defaultRow) {
        // Add event listeners for hour inputs
        defaultRow.querySelectorAll('.hours-input').forEach(input => {
            input.addEventListener('input', () => {
                updateRowTotals(defaultRow);
                updatePaySheets();
            });
        });
        
        // Add event listener for classification change
        defaultRow.querySelector('.classification-select').addEventListener('change', () => {
            updatePaySheets();
        });
    }

    const addClassificationButton = document.getElementById('add-classification');
            if (addClassificationButton) {
                addClassificationButton.addEventListener('click', () => {
                    addClassificationRow();
                    updateClassificationDropdowns();  // Update dropdowns when new classification is added
                });
            }

    const addRowButton = document.getElementById('add-row');
    if (addRowButton) {
        addRowButton.addEventListener('click', () => {
            const tbody = document.getElementById('timesheet-body');
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td><input type="text" class="client-site-input"></td>
                <td><input type="text" class="worker-input"></td>
                <td>
                    <select class="classification-select">
                        <option value="">Select Classification</option>
                        ${getClassificationOptions()}
                    </select>
                </td>
                <td><input type="number" class="hours-input" step="0.1" min="0" data-day="monday"></td>
                <td><input type="number" class="hours-input" step="0.1" min="0" data-day="tuesday"></td>
                <td><input type="number" class="hours-input" step="0.1" min="0" data-day="wednesday"></td>
                <td><input type="number" class="hours-input" step="0.1" min="0" data-day="thursday"></td>
                <td><input type="number" class="hours-input" step="0.1" min="0" data-day="friday"></td>
                <td><input type="number" class="hours-input" step="0.1" min="0" data-day="saturday"></td>
                <td><input type="number" class="hours-input" step="0.1" min="0" data-day="sunday"></td>
                <td class="total-hours">0.0</td>
            `;

            // Add event listeners to the new row's inputs
            row.querySelectorAll('.hours-input').forEach(input => {
                input.addEventListener('input', () => {
                    updateRowTotals(row);
                    updatePaySheets();
                });
            });
            
            // Add classification change listener to the new row
            row.querySelector('.classification-select').addEventListener('change', () => {
                updatePaySheets();
            });

            
            
            tbody.appendChild(row);
        });
    }

});