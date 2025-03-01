async function loadCSV() {
    const response = await fetch('dump.csv'); // Load CSV file
    const data = await response.text();
    console.log("CSV Data Loaded:", data); // Debugging

    const rows = data.trim().split('\n').map(row => row.split(',').map(item => item.trim()));
    rows.shift(); // Remove header row

    const companies = {};
    rows.forEach(row => {
        if (row.length < 3) return; // Skip incomplete rows
        const [company, date, price] = row;
        if (!companies[company]) companies[company] = [];
        companies[company].push({ date, price: parseFloat(price) });
    });

    console.log("Parsed Data:", companies); // Debugging

    const companyList = document.getElementById('companyList');
    companyList.innerHTML = ''; // Clear list before adding items
    Object.keys(companies).forEach(company => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = company;
        li.onclick = () => {
            console.log("Company clicked:", company); // Debugging
            drawChart(company, companies[company]);
            showChat(company, companies[company]);
        };
        companyList.appendChild(li);
    });
}

function drawChart(company, data) {
    console.log("Drawing chart for:", company, data); // Debugging

    const ctx = document.getElementById('stockChart').getContext('2d');
    // Ensure Chart.js is correctly initialized and has a destroy method
    if (window.stockChart && typeof window.stockChart.destroy === 'function') {
        window.stockChart.destroy();
    }

    window.stockChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(d => d.date),
            datasets: [{
                label: `${company} Stock Prices`,
                data: data.map(d => d.price),
                borderColor: 'blue',
                borderWidth: 2,
                fill: false,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { title: { display: true, text: 'Date' } },
                y: { title: { display: true, text: 'Price (USD)' } }
            }
        }
    });
}

function showChat(company, data) {
    const chatBox = document.getElementById('chatBox');
    chatBox.innerHTML = `<strong>${company} Stock Updates:</strong><br>`;
    data.slice(-5).forEach(d => {
        chatBox.innerHTML += `<div>${d.date}: Price - $${d.price.toFixed(2)}</div>`;
    });
}

// Load data when page loads
loadCSV();



