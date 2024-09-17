const tokens = [
    { symbol: 'BTCUSDT', name: 'Bitcoin (BTC)' },
    { symbol: 'ETHUSDT', name: 'Ethereum (ETH)' },
    { symbol: 'SOLUSDT', name: 'Solana (SOL)' },
    { symbol: 'TONUSDT', name: 'Toncoin (TON)' },
    { symbol: 'DOGEUSDT', name: 'Dogecoin (DOGE)' },
    { symbol: 'BNBUSDT', name: 'Binance Coin (BNB)' },
    { symbol: 'XRPUSDT', name: 'XRP (XRP)' },
    { symbol: 'ADAUSDT', name: 'Cardano (ADA)' },
    { symbol: 'DOTUSDT', name: 'Polkadot (DOT)' },
    { symbol: 'MATICUSDT', name: 'Polygon (MATIC)' },
    { symbol: 'LTCUSDT', name: 'Litecoin (LTC)' },
    { symbol: 'LINKUSDT', name: 'Chainlink (LINK)' },
    { symbol: 'ATOMUSDT', name: 'Cosmos (ATOM)' },
    { symbol: 'AVAXUSDT', name: 'Avalanche (AVAX)' },
    { symbol: 'SHIBUSDT', name: 'Shiba Inu (SHIB)' },
    { symbol: 'TRXUSDT', name: 'Tron (TRX)' },
    { symbol: 'UNIUSDT', name: 'Uniswap (UNI)' },
    { symbol: 'FTMUSDT', name: 'Fantom (FTM)' },
    { symbol: 'NEARUSDT', name: 'Near (NEAR)' },
    { symbol: 'XLMUSDT', name: 'Stellar (XLM)' },
    { symbol: 'VETUSDT', name: 'VeChain (VET)' },
    { symbol: 'AAVEUSDT', name: 'Aave (AAVE)' },
    { symbol: 'FILUSDT', name: 'Filecoin (FIL)' },
    { symbol: 'SANDUSDT', name: 'The Sandbox (SAND)' },
    { symbol: 'AXSUSDT', name: 'Axie Infinity (AXS)' },
    { symbol: 'THETAUSDT', name: 'Theta (THETA)' },
    { symbol: 'RUNEUSDT', name: 'THORChain (RUNE)' },
    { symbol: 'FTTUSDT', name: 'FTX Token (FTT)' },
    { symbol: 'ALGOUSDT', name: 'Algorand (ALGO)' },
    { symbol: 'ICPUSDT', name: 'Internet Computer (ICP)' },
    { symbol: 'HBARUSDT', name: 'Hedera (HBAR)' },
    { symbol: 'EOSUSDT', name: 'EOS (EOS)' },
    { symbol: 'ENJUSDT', name: 'Enjin Coin (ENJ)' },
    { symbol: 'ZILUSDT', name: 'Zilliqa (ZIL)' },
    { symbol: 'KSMUSDT', name: 'Kusama (KSM)' },
    { symbol: 'MANAUSDT', name: 'Decentraland (MANA)' },
    { symbol: 'ZRXUSDT', name: '0x (ZRX)' },
    { symbol: 'GRTUSDT', name: 'The Graph (GRT)' },
    { symbol: 'CRVUSDT', name: 'Curve DAO Token (CRV)' },
    { symbol: 'BATUSDT', name: 'Basic Attention Token (BAT)' },
    { symbol: 'DYDXUSDT', name: 'dYdX (DYDX)' },
    { symbol: 'CHZUSDT', name: 'Chiliz (CHZ)' },
    { symbol: 'BTTUSDT', name: 'BitTorrent (BTT)' },
    { symbol: 'SUSHIUSDT', name: 'SushiSwap (SUSHI)' },
    { symbol: 'ONEUSDT', name: 'Harmony (ONE)' },
    { symbol: 'OMGUSDT', name: 'OMG Network (OMG)' },
    { symbol: 'QNTUSDT', name: 'Quant (QNT)' },
    { symbol: 'FLOWUSDT', name: 'Flow (FLOW)' },
    { symbol: 'XECUSDT', name: 'eCash (XEC)' },
    { symbol: 'ANKRUSDT', name: 'Ankr (ANKR)' }
];

async function fetchPrice(cryptoSymbol, elementId, chart) {
    const apiUrl = `https://api.binance.com/api/v3/ticker/price?symbol=${cryptoSymbol}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const price = parseFloat(data.price).toFixed(2);

        document.querySelector(`#${elementId} .price`).textContent = `$${price}`;

        if (chart) {
            updateChart(chart, price);
        }
    } catch (error) {
        console.error('Error fetching price:', error);
    }
}

function updateChart(chart, newPrice) {
    const now = new Date();
    chart.data.labels.push(now.toLocaleTimeString());
    chart.data.datasets[0].data.push(newPrice);

    if (chart.data.labels.length > 10) {
        chart.data.labels.shift(); 
        chart.data.datasets[0].data.shift(); 
    }

    chart.update(); 
}

function createChart(chartId) {
    const ctx = document.getElementById(chartId).getContext('2d');
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: [], 
            datasets: [{
                label: 'Price (USD)',
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Time',
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Price (USD)',
                    }
                }
            }
        }
    });
}

function generateCryptoCards() {
    const container = document.querySelector('.crypto-grid');
    tokens.forEach(token => {
        const cardHTML = `
            <div class="crypto-card" id="${token.symbol.toLowerCase()}">
                <h2>${token.name}</h2>
                <p class="price">Loading...</p>
                <canvas id="${token.symbol.toLowerCase()}Chart"></canvas>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', cardHTML);
    });
}

function startLivePriceTracking() {
    const charts = {};
    
    tokens.forEach(token => {
        charts[token.symbol] = createChart(`${token.symbol.toLowerCase()}Chart`);
        
        setInterval(() => {
            fetchPrice(token.symbol, token.symbol.toLowerCase(), charts[token.symbol]);
        }, 10000); 
    });
}

generateCryptoCards(); 
startLivePriceTracking(); 

// JavaScript for Light/Dark Mode Toggle
const themeToggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme');

if (currentTheme) {
	document.body.classList.add(currentTheme);
	themeToggle.checked = currentTheme === 'dark-mode';
}

themeToggle.addEventListener('change', function () {
	if (this.checked) {
		document.body.classList.add('dark-mode');
		localStorage.setItem('theme', 'dark-mode');
	} else {
		document.body.classList.remove('dark-mode');
		localStorage.setItem('theme', 'light-mode');
	}
});