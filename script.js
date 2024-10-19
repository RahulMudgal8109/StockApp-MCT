const apiKey = 'PTO8Q1BhCGwhabCPedqLnE8n0hCOx3vz'; // Replace with your actual API key
const stockDropdown = document.getElementById('stockDropdown');
const stockInput = document.getElementById('stockInput');
const searchButton = document.getElementById('searchButton');
const stockInfoDiv = document.getElementById('stockInfo');
const stockChartCtx = document.getElementById('stockChart').getContext('2d');

let stockChart;

// Fetch trending stocks (example static list)
async function fetchTrendingStocks() {
    const trendingStocks = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'];
    trendingStocks.forEach(stock => {
        const option = document.createElement('option');
        option.value = stock;
        option.textContent = stock;
        stockDropdown.appendChild(option);
    });
}

// Fetch stock data from Alpha Vantage API
async function fetchStockData(symbol) {
    const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`);
    const data = await response.json();
    console.log(data)
    
    // Check for errors in API response
    if (data['Note'] || data['Error Message']) {
        stockInfoDiv.innerHTML = '<p>Error fetching data. Please check the stock symbol.</p>';
        return;
    }

    displayStockData(data);
    displayStockChart(data);
}

// Display stock information
function displayStockData(data) {
    console.log(data)
    console.log(data['Meta Data']['2. Symbol'])
    const latestDate = Object.keys(data['Time Series (Daily)'])[0];
    console.log(latestDate)
    const stockData = data['Time Series (Daily)'][latestDate];
    
    stockInfoDiv.innerHTML = `
        <h2>${data['Meta Data']['2. Symbol'].toUpperCase()} - ${latestDate}</h2>
        <p>Open: ${stockData['1. open']}</p>
        <p>Close: ${stockData['4. close']}</p>
        <p>High: ${stockData['2. high']}</p>
        <p>Low: ${stockData['3. low']}</p>
        <p>Volume: ${stockData['5. volume']}</p>
    `;
}

// Display stock price trend in a chart
function displayStockChart(data) {
    const dates = Object.keys(data['Time Series (Daily)']).slice(0, 40);
    console.log(typeof (data['Time Series (Daily)']))
    console.log(dates)
    const closingPrices = dates.map(date => parseFloat(data['Time Series (Daily)'][date]['4. close']));
    console.log(closingPrices)

    // Destroy the existing chart if it exists
    if (stockChart) {
        stockChart.destroy();
    }

    stockChart = new Chart(stockChartCtx, {
        type: 'line',
        data: {
            labels: dates.reverse(),
            datasets: [{
                label: 'Closing Price',
                data: closingPrices.reverse(),
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

// Event listeners for button and dropdown
searchButton.addEventListener('click', () => {
    const stockSymbol = stockInput.value.toUpperCase();
    if (stockSymbol) {
        fetchStockData(stockSymbol);
    }
});

stockDropdown.addEventListener('change', () => {
    const selectedStock = stockDropdown.value;
    fetchStockData(selectedStock);
});

// Initialize the dashboard
fetchTrendingStocks();
fetchStockData("aapl")