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

function debounce(func, delay) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  }

//Currency data type with commas
function formatCurrency(value) {
    return '$' + parseFloat(value).toFixed(2);
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

//Function for Live updates
function setupLiveUpdates() {
    // Listen for changes in worker names and client/site inputs
    document.getElementById('timesheet-body').addEventListener('input', (e) => {
        if (e.target.classList.contains('worker-input') || 
            e.target.classList.contains('client-site-input')) {
            updatePaySheets();
            const blueFolder = new BlueFolder();
            blueFolder.updateCharges();
        }
    });
}

//Count for Totals in each section
function updateCounts() {
    // Update Timesheet count
    const timesheetRows = document.querySelectorAll('#timesheet-body tr').length;
    document.getElementById('timesheet-count').textContent = `Entries: ${timesheetRows}`;

    // Update Pay Sheet count
    const paysheetRows = document.querySelectorAll('#paysheet-body tr').length;
    document.getElementById('paysheet-count').textContent = `Entries: ${paysheetRows}`;

    // Update Client Charges count
    const chargesRows = document.querySelectorAll('#charges-body tr').length;
    document.getElementById('charges-count').textContent = `Entries: ${chargesRows}`;
}

// Default classifications and rates
const defaultClassifications = [
    {
        name: "Construction TA",
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
        // Determine a default industry value.
        // If classification.industry is defined, use it.
        // Otherwise, use a simple rule: if the name is "Construction TA" or "CLAB", default to "Construction"; otherwise, "Non Construction".
        const industry = classification.industry 
            ? classification.industry 
            : (["Construction TA", "CLAB"].includes(classification.name) ? "Construction" : "Non Construction");

        const rows = `
            <tr>
                <td rowspan="2">
                    <input type="text" class="classification-input" value="${classification.name}">
                </td>
                <td rowspan="2">
                    <select class="industry-select">
                        <option value="Construction" ${industry === "Construction" ? "selected" : ""}>Construction</option>
                        <option value="Non Construction" ${industry === "Non Construction" ? "selected" : ""}>Non Construction</option>
                    </select>
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

function getCurrentRates() {
    const classificationRows = document.querySelectorAll('#classifications-body tr');
    const currentRates = new Map();
    
    // Iterate in pairs (two rows per classification)
    for (let i = 0; i < classificationRows.length; i += 2) {
        const payRow = classificationRows[i];
        const chargeRow = classificationRows[i + 1];
        
        if (!payRow || !chargeRow) continue;
        
        // Get classification name
        const nameInput = payRow.querySelector('.classification-input');
        const name = nameInput ? nameInput.value : null;
        if (!name) continue;
        
        // NEW: Get the selected industry from the dropdown
        const industrySelect = payRow.querySelector('.industry-select');
        const industry = industrySelect ? industrySelect.value : "Construction"; // default if not found
        
        // Get the pay rate inputs (from the first row of the pair)
        const payInputs = payRow.querySelectorAll('.rate-input');
        // Get the charge rate inputs (from the second row of the pair)
        const chargeInputs = chargeRow.querySelectorAll('.rate-input');
        
        currentRates.set(name, {
            name: name,
            industry: industry, // NEW field for industry type
            payRates: {
                normalTime: parseFloat(payInputs[0]?.value) || 0,
                timeHalf: parseFloat(payInputs[1]?.value) || 0,
                doubleTime: parseFloat(payInputs[2]?.value) || 0,
                shift: parseFloat(payInputs[3]?.value) || 0,
                travel: parseFloat(payInputs[4]?.value) || 0
            },
            chargeRates: {
                normalTime: parseFloat(chargeInputs[0]?.value) || 0,
                timeHalf: parseFloat(chargeInputs[1]?.value) || 0,
                doubleTime: parseFloat(chargeInputs[2]?.value) || 0,
                shift: parseFloat(chargeInputs[3]?.value) || 0,
                travel: parseFloat(chargeInputs[4]?.value) || 0
            }
        });
    }
    
    return currentRates;
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

    // Get all timesheet rows from the timesheet table body.
    const timesheetRows = Array.from(document.getElementById('timesheet-body').children);

    // Outer grouping: Key = worker name, Value = an object with a 'classifications' Map.
    const groupedData = new Map();

    // Process each timesheet row.
    timesheetRows.forEach(row => {
        // Extract the worker name and trim any whitespace.
        const worker = row.querySelector('.worker-input').value.trim();
        if (!worker) return; // Skip this row if no worker is provided.

        // Extract the classification value.
        const classification = row.querySelector('.classification-select').value.trim();
        if (!classification) return; // Skip if classification is missing.

        // Retrieve the current classification data (e.g., pay rates).
        const classificationData = getCurrentRates().get(classification);
        if (!classificationData) return; // Skip if no classification data is found.

        // Outer grouping: If this worker isn't in our Map yet, add them.
        if (!groupedData.has(worker)) {
            groupedData.set(worker, { classifications: new Map() });
        }
        const workerGroup = groupedData.get(worker);

        // Inner grouping: Within this worker, group by classification.
        if (!workerGroup.classifications.has(classification)) {
            // Initialize aggregation for this classification.
            workerGroup.classifications.set(classification, {
                rates: classificationData.payRates,
                hours: { normal: 0, timeHalf: 0, double: 0 },
                daysWorked: 0  // Count of inputs (or days) where work was recorded.
            });
        }
        const classGroup = workerGroup.classifications.get(classification);

        // Process each hours input in this row.
        const dayInputs = row.querySelectorAll('.hours-input');
        dayInputs.forEach((input, index) => {
            const hours = parseFloat(input.value) || 0;
            if (hours <= 0) return; // Skip if no hours were entered.

            // Determine if this input corresponds to a weekend day.
            // Adjust the logic if your table columns differ.
            const isWeekend = (index >= 5) ? ((index === 6) ? 'sunday' : 'saturday') : false;

            // Calculate the breakdown of hours.
            const dayTotals = calculateDayHours(hours, isWeekend);

            // Aggregate the hours into the appropriate fields.
            classGroup.hours.normal += dayTotals.normal;
            classGroup.hours.timeHalf += dayTotals.timeHalf;
            classGroup.hours.double += dayTotals.double;

            // Count this input as a worked day.
            // (If you prefer to count only one day per row regardless of how many inputs have values,
            //  you may need to adjust this logic.)
            classGroup.daysWorked++;
        });
    });

    // Build the paysheet rows by iterating over the grouped data.
    groupedData.forEach((workerGroup, workerName) => {
        workerGroup.classifications.forEach((classGroup, classification) => {
            // Calculate pay amounts for each classification group.
            const normalPay = classGroup.hours.normal * classGroup.rates.normalTime;
            const timeHalfPay = classGroup.hours.timeHalf * classGroup.rates.timeHalf;
            const doublePay = classGroup.hours.double * classGroup.rates.doubleTime;

            // Calculate travel allowance, for example, per worked day.
            const travelTotal = classGroup.rates.travel * classGroup.daysWorked;
            const totalPay = normalPay + timeHalfPay + doublePay + travelTotal;

            // Create a new table row for this worker/classification grouping.
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${workerName}</td>
                <td>${classification}</td>
                <td>${classGroup.hours.normal.toFixed(1)}</td>
                <td>${formatCurrency(classGroup.rates.normalTime)}</td>
                <td>${formatCurrency(normalPay)}</td>
                <td>${classGroup.hours.timeHalf.toFixed(1)}</td>
                <td>${formatCurrency(classGroup.rates.timeHalf)}</td>
                <td>${formatCurrency(timeHalfPay)}</td>
                <td>${classGroup.hours.double.toFixed(1)}</td>
                <td>${formatCurrency(classGroup.rates.doubleTime)}</td>
                <td>${formatCurrency(doublePay)}</td>
                <td>${formatCurrency(classGroup.rates.travel)}</td>
                <td>${classGroup.daysWorked}</td>
                <td>${formatCurrency(travelTotal)}</td>
                <td>${formatCurrency(totalPay)}</td>
            `;
            paysheetBody.appendChild(row);
        });
    });

    // Update the counts (if this function updates any display counts elsewhere).
    updateCounts();
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
            Monday: 0,
            Tuesday: 0,
            Wednesday: 0,
            Thursday: 0,
            Friday: 0,
            Saturday: 0,
            Sunday: 0
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
        updateCounts();
        
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
            <td><input type="number" class="hours-input" step="0.1" min="0" data-day="Monday"></td>
            <td><input type="number" class="hours-input" step="0.1" min="0" data-day="Tuesday"></td>
            <td><input type="number" class="hours-input" step="0.1" min="0" data-day="Wednesday"></td>
            <td><input type="number" class="hours-input" step="0.1" min="0" data-day="Thursday"></td>
            <td><input type="number" class="hours-input" step="0.1" min="0" data-day="Friday"></td>
            <td><input type="number" class="hours-input" step="0.1" min="0" data-day="Saturday"></td>
            <td><input type="number" class="hours-input" step="0.1" min="0" data-day="Sunday"></td>
            <td class="total-hours">0.0</td>
        `;


        row.querySelectorAll('.hours-input').forEach(input => {
            input.addEventListener('input', () => {
                updateRowTotals(row);
                updatePaySheets();  
            });
        });
    
        tbody.appendChild(row);
    }

    updateRowCalculations(row) {
        const hours = {};
        row.querySelectorAll('.hours-input').forEach(input => {
            hours[input.dataset.day] = parseFloat(input.value) || 0;
        });

        const classification = row.querySelector('.classification-select').value;
        const timesheetRow = new TimesheetRow(
            row.querySelector('.worker-input').value,
            row.querySelector('.client-site-input').value,
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
        
        const timesheetRows = Array.from(document.getElementById('timesheet-body').children);
        const clientData = new Map();
        
        timesheetRows.forEach(row => {
            // Get client/site from combined input
            const clientSiteValue = row.querySelector('.client-site-input').value;
            const worker = row.querySelector('.worker-input').value;
            const classification = row.querySelector('.classification-select').value;
            
            if (!clientSiteValue || !worker || !classification) return;
            
            const key = `${clientSiteValue}-${worker}`;
            
            if (!clientData.has(key)) {
                clientData.set(key, {
                    clientSite: clientSiteValue,
                    worker: worker,
                    classification: classification,
                    hours: { normal: 0, timeHalf: 0, double: 0 }
                });
            }
            
            // Get hours from Pay Sheets calculations
            const data = clientData.get(key);
            const classificationData = getCurrentRates().get(classification);
            if (!classificationData) return;
            
            // Calculate hours breakdown using existing calculateDayHours function
            const dayInputs = row.querySelectorAll('.hours-input');
            dayInputs.forEach((input, index) => {
                const hours = parseFloat(input.value) || 0;
                const isWeekend = index >= 5 ? (index === 6 ? 'sunday' : 'saturday') : false;
                const dayTotals = calculateDayHours(hours, isWeekend);
                
                data.hours.normal += dayTotals.normal;
                data.hours.timeHalf += dayTotals.timeHalf;
                data.hours.double += dayTotals.double;
            });
        });
        
        // Create charge rows
        clientData.forEach(data => {
            const classificationData = defaultClassifications.find(c => c.name === data.classification);
            if (!classificationData) return;
            
            // Calculate days worked from the original timesheet rows
            let daysWorked = Array.from(document.querySelectorAll(`#timesheet-body tr`))
                .filter(row => 
                    row.querySelector('.client-site-input').value === data.clientSite &&
                    row.querySelector('.worker-input').value === data.worker
                )
                .reduce((days, row) => {
                    return days + Array.from(row.querySelectorAll('.hours-input'))
                        .reduce((dayCount, input) => 
                            dayCount + (parseFloat(input.value) > 0 ? 1 : 0), 0);
                }, 0);
                
            const charges = {
                normal: data.hours.normal * classificationData.chargeRates.normalTime,
                timeHalf: data.hours.timeHalf * classificationData.chargeRates.timeHalf,
                double: data.hours.double * classificationData.chargeRates.doubleTime,
                travelRate: classificationData.chargeRates.travel,
                travelTotal: classificationData.chargeRates.travel * daysWorked
            };

            const subtotal = charges.normal + charges.timeHalf + charges.double;
            const total = subtotal + charges.travelTotal;

            const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${data.clientSite}</td>
                    <td>${data.worker}</td>
                    <td>${data.classification}</td>
                    <td>${data.hours.normal.toFixed(1)}</td>
                    <td>${formatCurrency(classificationData.chargeRates.normalTime)}</td>
                    <td>${formatCurrency(charges.normal)}</td>
                    <td>${data.hours.timeHalf.toFixed(1)}</td>
                    <td>${formatCurrency(classificationData.chargeRates.timeHalf)}</td>
                    <td>${formatCurrency(charges.timeHalf)}</td>
                    <td>${data.hours.double.toFixed(1)}</td>
                    <td>${formatCurrency(classificationData.chargeRates.doubleTime)}</td>
                    <td>${formatCurrency(charges.double)}</td>
                    <td>${formatCurrency(charges.travelRate)}</td>
                    <td>${daysWorked}</td>
                    <td>${formatCurrency(charges.travelTotal)}</td>
                    <td>${formatCurrency(total)}</td>
                `;
            chargesBody.appendChild(row);
            updateCounts();
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

// Adjusting delay
function debounce(func, delay) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  }

function updateReports() {
    // 1. Preserve the current Adjustment Figure value (if it exists)
    let adjustmentValue = 0;
    const existingAdjustmentInput = document.querySelector('.adjustment-figure');
    if (existingAdjustmentInput) {
        adjustmentValue = parseFloat(existingAdjustmentInput.value) || 0;
    }
    
    // ----------------------------
    // Calculate "Men Out"
    // ----------------------------
    let totalHours = 0;
    const timesheetRows = document.querySelectorAll('#timesheet-body tr');
    timesheetRows.forEach(row => {
        const hourInputs = row.querySelectorAll('.hours-input');
        hourInputs.forEach(input => {
            totalHours += parseFloat(input.value) || 0;
        });
    });
    const menOut = totalHours / 38; // Assuming a 38-hour workweek

    // ----------------------------
    // Calculate Wages from Pay Sheets with Breakdown
    // ----------------------------
    let normalConstructionWages = 0;
    let normalNonConstructionWages = 0;
    let overtimeWages = 0;

    const currentRates = getCurrentRates();
    const paysheetRows = document.querySelectorAll('#paysheet-body tr');
    paysheetRows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length < 15) return; // Ensure there are enough cells

        const classificationName = cells[1].textContent.trim();
        const classificationData = currentRates.get(classificationName);

        const normalPay = parseFloat(cells[4].textContent.replace('$','')) || 0;
        const timeHalfPay = parseFloat(cells[7].textContent.replace('$','')) || 0;
        const doublePay = parseFloat(cells[10].textContent.replace('$','')) || 0;
        const overtimePay = timeHalfPay + doublePay;

        if (classificationData && classificationData.industry === 'Construction') {
            normalConstructionWages += normalPay;
        } else {
            normalNonConstructionWages += normalPay;
        }

        overtimeWages += overtimePay;
    });

    const wagesTotal = normalConstructionWages + normalNonConstructionWages + overtimeWages;

    // ----------------------------
    // Calculate "Total Sales" from Client Charges
    // ----------------------------
    let totalSales = 0;
    const chargesRows = document.querySelectorAll('#charges-body tr');
    chargesRows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length < 16) return;
        const totalCharge = parseFloat(cells[15].textContent.replace('$','')) || 0;
        totalSales += totalCharge;
    });

    // ----------------------------
    // Calculate GST (as before)
    // ----------------------------
    const gst = totalSales / 11;

    // ----------------------------
    // Calculate Construction vs Non Construction Sales from Client Charges
    // ----------------------------
    let constructionSales = 0;
    let nonConstructionSales = 0;
    chargesRows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length < 16) return;
        const charge = parseFloat(cells[15].textContent.replace('$','')) || 0;
        const classificationName = cells[2].textContent.trim();
        const classificationData = currentRates.get(classificationName);
        if (classificationData && classificationData.industry === 'Construction') {
            constructionSales += charge;
        } else {
            nonConstructionSales += charge;
        }
    });
    let constructionSalesPercentage = 0;
    let nonConstructionSalesPercentage = 0;
    if (totalSales > 0) {
        constructionSalesPercentage = (constructionSales / totalSales) * 100;
        nonConstructionSalesPercentage = (nonConstructionSales / totalSales) * 100;
    }

    // ----------------------------
    // Read current On Cost percentages (if inputs exist), otherwise use defaults
    // ----------------------------
    const defaultConstructionOnCostPercent = 21.15;
    const defaultNonConstructionOnCostPercent = 20.36;
    const defaultOvertimeOnCostPercent = 8.23;

    let currentConstructionOnCostPercent = defaultConstructionOnCostPercent;
    let currentNonConstructionOnCostPercent = defaultNonConstructionOnCostPercent;
    let currentOvertimeOnCostPercent = defaultOvertimeOnCostPercent;

    if (document.querySelector('.construction-oncost')) {
        currentConstructionOnCostPercent = parseFloat(document.querySelector('.construction-oncost').value) || defaultConstructionOnCostPercent;
    }
    if (document.querySelector('.nonconstruction-oncost')) {
        currentNonConstructionOnCostPercent = parseFloat(document.querySelector('.nonconstruction-oncost').value) || defaultNonConstructionOnCostPercent;
    }
    if (document.querySelector('.overtime-oncost')) {
        currentOvertimeOnCostPercent = parseFloat(document.querySelector('.overtime-oncost').value) || defaultOvertimeOnCostPercent;
    }

    // ----------------------------
    // Calculate W&OC values using the current on cost percentages
    // ----------------------------
    let constructionWOC = normalConstructionWages * (1 + currentConstructionOnCostPercent / 100);
    let nonConstructionWOC = normalNonConstructionWages * (1 + currentNonConstructionOnCostPercent / 100);
    let overtimeWOC = overtimeWages * (1 + currentOvertimeOnCostPercent / 100);
    const totalWOC = constructionWOC + nonConstructionWOC + overtimeWOC;

    // ----------------------------
    // Calculate Gross Profit and Gross Profit/Man
    // Gross Profit = Total Sales - (Total WOC + GST) + Adjustment Figure
    // Gross Profit/Man = Gross Profit / Men Out
    // ----------------------------
    let grossProfit = totalSales - (totalWOC + gst) + adjustmentValue;
    let grossProfitPerMan = (menOut > 0) ? grossProfit / menOut : 0;

    // ----------------------------
    // Update the Reports Section HTML with Four Columns:
    // Order: Wages | On Costs | W&OC | Sales & Profit
    // ----------------------------
    const reportsContent = document.getElementById('reports-content');
    reportsContent.innerHTML = `
        <div class="report-columns">
            <!-- Wages Column -->
            <div class="report-column wages">
                <h3>Wages</h3>
                <p><strong>Men Out:</strong> ${menOut.toFixed(1)}</p>
                <p><strong>Total Wages:</strong> ${formatCurrency(wagesTotal)}</p>
                <ul>
                    <li><strong>Normal Construction Wages:</strong> ${formatCurrency(normalConstructionWages)}</li>
                    <li><strong>Normal Non Construction Wages:</strong> ${formatCurrency(normalNonConstructionWages)}</li>
                    <li><strong>Overtime Wages:</strong> ${formatCurrency(overtimeWages)}</li>
                </ul>
            </div>
            <!-- On Costs Column -->
            <div class="report-column on-costs">
                <h3>On Costs</h3>
                <ul>
                    <li><strong>GST:</strong> ${formatCurrency(gst)}</li>
                    <li>
                        <strong>Construction On Cost (%):</strong>
                        <input type="number" step="0.01" class="oncost-input construction-oncost" value="${currentConstructionOnCostPercent}">
                    </li>
                    <li>
                        <strong>Non Construction On Cost (%):</strong>
                        <input type="number" step="0.01" class="oncost-input nonconstruction-oncost" value="${currentNonConstructionOnCostPercent}">
                    </li>
                    <li>
                        <strong>Overtime On Cost (%):</strong>
                        <input type="number" step="0.01" class="oncost-input overtime-oncost" value="${currentOvertimeOnCostPercent}">
                    </li>
                </ul>
            </div>
            <!-- W&OC Column -->
            <div class="report-column woc">
                <h3>W&amp;OC</h3>
                <ul>
                    <li><strong>Construction W&amp;OC:</strong> ${formatCurrency(constructionWOC)}</li>
                    <li><strong>Non Construction W&amp;OC:</strong> ${formatCurrency(nonConstructionWOC)}</li>
                    <li><strong>Overtime W&amp;OC:</strong> ${formatCurrency(overtimeWOC)}</li>
                    <li><strong>Total W&amp;OC:</strong> ${formatCurrency(totalWOC)}</li>
                </ul>
            </div>
            <!-- Sales & Profit Column -->
            <div class="report-column sales-profit">
                <h3>Sales &amp; Profit</h3>
                <p><strong>Total Sales:</strong> ${formatCurrency(totalSales)}</p>
                <ul>
                    <li>
                        <strong>Construction Sales (%):</strong> ${constructionSalesPercentage.toFixed(1)}%
                    </li>
                    <li>
                        <strong>Non Construction Sales (%):</strong> ${nonConstructionSalesPercentage.toFixed(1)}%
                    </li>
                    <li>
                        <strong>Adjustment Figure:</strong>
                        <input type="number" step="0.01" class="adjustment-figure" value="${adjustmentValue}" style="width:70px;">
                    </li>
                    <li>
                        <strong>Gross Profit:</strong> ${formatCurrency(grossProfit)}
                    </li>
                    <li>
                        <strong>Gross Profit/Man:</strong> ${formatCurrency(grossProfitPerMan)}
                    </li>
                </ul>
            </div>
        </div>
    `;
    console.log('Reports updated.');
}

const debouncedUpdateReports = debounce(updateReports, 1000); //Delay 300ms

//Eventlistner for delay after updateReports
document.getElementById('reports-content').addEventListener('input', function(e) {
    if (e.target && e.target.classList.contains('adjustment-figure')) {
        debouncedUpdateReports();
    }
});


// Add event listener for the classification button
document.addEventListener('DOMContentLoaded', function() {
    populateClassificationsTable();
    updateClassificationDropdowns();
    addClassificationChangeListeners();
    setupLiveUpdates();
    updateCounts();
    updateReports()

    const defaultRow = document.querySelector('#timesheet-body tr');
    if (defaultRow) {
        // Add event listeners for hour inputs
        defaultRow.querySelectorAll('.hours-input').forEach(input => {
            input.addEventListener('input', () => {
                updateRowTotals(defaultRow);
                updatePaySheets();
                const blueFolder = new BlueFolder();  
                blueFolder.updateCharges();     
                updateReports()
            });
        });
        
        // Add event listener for classification change
        defaultRow.querySelector('.classification-select').addEventListener('change', () => {
            updatePaySheets();
            updateReports()
        });
    }

    const addClassificationButton = document.getElementById('add-classification');
            if (addClassificationButton) {
                addClassificationButton.addEventListener('click', () => {
                    addClassificationRow();
                    updateClassificationDropdowns();  
                    updateReports()
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
                <td><input type="number" class="hours-input" step="0.1" min="0" data-day="Monday"></td>
                <td><input type="number" class="hours-input" step="0.1" min="0" data-day="Tuesday"></td>
                <td><input type="number" class="hours-input" step="0.1" min="0" data-day="Wednesday"></td>
                <td><input type="number" class="hours-input" step="0.1" min="0" data-day="Thursday"></td>
                <td><input type="number" class="hours-input" step="0.1" min="0" data-day="Friday"></td>
                <td><input type="number" class="hours-input" step="0.1" min="0" data-day="Saturday"></td>
                <td><input type="number" class="hours-input" step="0.1" min="0" data-day="Sunday"></td>
                <td class="total-hours">0.0</td>
            `;

            // Add event listeners to the new row's inputs
            row.querySelectorAll('.hours-input').forEach(input => {
                input.addEventListener('input', () => {
                    updateRowTotals(row);
                    updatePaySheets();
                    const blueFolder = new BlueFolder();  
                    blueFolder.updateCharges();  
                    updateReports()
                });
            });
            
            // Add classification change listener to the new row
            row.querySelector('.classification-select').addEventListener('change', () => {
                updatePaySheets();
                const blueFolder = new BlueFolder();  
                blueFolder.updateCharges();    
                updateReports()
            });

            tbody.appendChild(row);
        });
    }

});