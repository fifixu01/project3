let drivers = [];
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function addDriver() {
    const name = document.getElementById('driverName').value;
    const basePay = parseFloat(document.getElementById('basePay').value);
    const threshold = parseInt(document.getElementById('packageThreshold').value);

    const newDriver = { name, basePay, threshold };
    drivers.push(newDriver);
    updateDriverDropdown();
    clearInputs();
    alert('Driver added successfully!');
}

function updateDriverDropdown() {
    const select = document.getElementById('driverSelect');
    select.innerHTML = '<option value="">Select a driver</option>'; // Clear existing options
    drivers.forEach((driver, index) => {
        const option = new Option(driver.name, index);
        select.add(option);
    });
}

function calculateWeeklyPay() {
    const driverIndex = document.getElementById('driverSelect').value;
    if (driverIndex === '') {
        document.getElementById('weeklyPayResult').innerText = "Please select a driver.";
        return;
    }
    const driver = drivers[driverIndex];
    let totalPay = 0, totalHours = 0;

    daysOfWeek.forEach(day => {
        const packages = parseInt(document.getElementById(`packages-${day}`).value) || 0;
        const hours = parseFloat(document.getElementById(`hours-${day}`).value) || 0;
        const dailyPay = packages > driver.threshold ? driver.basePay + (packages - driver.threshold) : driver.basePay;
        totalPay += dailyPay;
        totalHours += hours;
    });

    const averagePayPerHour = totalHours ? (totalPay / totalHours).toFixed(2) : 0;
    document.getElementById('weeklyPayResult').innerText = "Weekly Pay: $" + totalPay;
    document.getElementById('averagePayPerHourResult').innerText = "Average Pay per Hour: $" + averagePayPerHour;
}

function clearInputs() {
    document.getElementById('driverName').value = '';
    document.getElementById('basePay').value = '';
    document.getElementById('packageThreshold').value = '';
}

function generateDailyInputs() {
    const container = document.getElementById('dailyInputs');
    container.innerHTML = ''; // Clear previous inputs
    daysOfWeek.forEach(day => {
        const packageInput = `<label>${day} Packages: <input type='number' id='packages-${day}' required></label>`;
        const hoursInput = `<label>${day} Hours: <input type='number' step='0.1' id='hours-${day}' required></label>`;
        const div = document.createElement('div');
        div.innerHTML = `${packageInput} ${hoursInput}`;
        container.appendChild(div);
    });
}

window.onload = generateDailyInputs;
