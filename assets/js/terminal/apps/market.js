class MarketApp {
    constructor(terminal, filesystem, windowManager, os) {
        this.terminal = terminal;
        this.filesystem = filesystem;
        this.windowManager = windowManager;
        this.os = os;
    }

    async run(args) {
        const width = this.terminal.cols || 60;
        const command = args[0]?.toLowerCase() || 'crypto';

        this.terminal.write('\r\n' + TerminalUtils.center('\x1b[1;36m>> MARKET ANALYZER <<\x1b[0m', width) + '\r\n\r\n');

        if (command === 'crypto' || command === 'coins') {
            await this.showCryptoData(width);
        } else if (command === 'indices' || command === 'index') {
            await this.showIndicesData(width);
        } else if (command === 'live') {
            await this.fetchLiveData(width);
        } else {
            this.terminal.write('  \x1b[1;33mUsage:\x1b[0m\r\n');
            this.terminal.write('    \x1b[1;32mmarket crypto\x1b[0m  - Show cryptocurrency data\r\n');
            this.terminal.write('    \x1b[1;32mmarket indices\x1b[0m - Show stock indices data\r\n');
            this.terminal.write('    \x1b[1;32mmarket live\x1b[0m   - Fetch live market data\r\n');
            this.terminal.write('\r\n');
        }
    }

    async showCryptoData(width) {
        // Try to get from JEKYLL_DATA first
        let cryptoData = window.JEKYLL_DATA?.market_data?.cryptocurrencies;

        // If not available, fetch live
        if (!cryptoData || cryptoData.length === 0) {
            this.terminal.write('  \x1b[1;33mFetching live cryptocurrency data...\x1b[0m\r\n\r\n');
            cryptoData = await this.fetchLiveCryptoData();
        }

        if (!cryptoData || cryptoData.length === 0) {
            this.terminal.write('  \x1b[1;31mNo cryptocurrency data available\x1b[0m\r\n\r\n');
            return;
        }

        this.terminal.write('  \x1b[1;33mCRYPTOCURRENCY PRICES:\x1b[0m\r\n\r\n');
        
        // Header
        this.terminal.write('  ' + 
            '\x1b[1;36mNAME\x1b[0m'.padEnd(15) + 
            '\x1b[1;36mPRICE (USD)\x1b[0m'.padEnd(15) + 
            '\x1b[1;36m24H CHANGE\x1b[0m'.padEnd(15) + 
            '\x1b[1;36mMARKET CAP\x1b[0m\r\n'
        );
        this.terminal.write('  ' + '-'.repeat(width - 10) + '\r\n');

        cryptoData.slice(0, 10).forEach(coin => {
            const name = (coin.name || coin.id || 'Unknown').substring(0, 14).padEnd(14);
            const price = coin.price_usd ? `$${this.formatNumber(coin.price_usd)}` : 'N/A';
            const change = coin.change_24h !== undefined ? 
                `${coin.change_24h >= 0 ? '+' : ''}${coin.change_24h.toFixed(2)}%` : 'N/A';
            const changeColor = coin.change_24h >= 0 ? '\x1b[1;32m' : '\x1b[1;31m';
            const marketCap = coin.market_cap ? this.formatMarketCap(coin.market_cap) : 'N/A';

            this.terminal.write(`  ${name} ${price.padEnd(14)} ${changeColor}${change.padEnd(14)}\x1b[0m ${marketCap}\r\n`);
        });

        this.terminal.write('\r\n');
    }

    async showIndicesData(width) {
        let indicesData = window.JEKYLL_DATA?.market_data?.indices;

        if (!indicesData || indicesData.length === 0) {
            this.terminal.write('  \x1b[1;33mFetching live indices data...\x1b[0m\r\n\r\n');
            indicesData = await this.fetchLiveIndicesData();
        }

        if (!indicesData || indicesData.length === 0) {
            this.terminal.write('  \x1b[1;31mNo indices data available\x1b[0m\r\n\r\n');
            return;
        }

        this.terminal.write('  \x1b[1;33mSTOCK INDICES:\x1b[0m\r\n\r\n');
        
        // Header
        this.terminal.write('  ' + 
            '\x1b[1;36mINDEX\x1b[0m'.padEnd(20) + 
            '\x1b[1;36mVALUE\x1b[0m'.padEnd(15) + 
            '\x1b[1;36mCHANGE\x1b[0m'.padEnd(15) + 
            '\x1b[1;36mCHANGE %\x1b[0m\r\n'
        );
        this.terminal.write('  ' + '-'.repeat(width - 10) + '\r\n');

        indicesData.forEach(index => {
            const name = (index.name || index.symbol || 'Unknown').substring(0, 19).padEnd(19);
            const value = index.value ? this.formatNumber(index.value) : 'N/A';
            const change = index.change !== undefined ? 
                `${index.change >= 0 ? '+' : ''}${this.formatNumber(index.change)}` : 'N/A';
            const changeColor = index.change >= 0 ? '\x1b[1;32m' : '\x1b[1;31m';
            const changePercent = index.change_percent !== undefined ? 
                `${index.change_percent >= 0 ? '+' : ''}${index.change_percent.toFixed(2)}%` : 'N/A';

            this.terminal.write(`  ${name} ${value.padEnd(14)} ${changeColor}${change.padEnd(14)}\x1b[0m ${changePercent}\r\n`);
        });

        this.terminal.write('\r\n');
    }

    async fetchLiveData(width) {
        this.terminal.write('  \x1b[1;33mFetching live market data...\x1b[0m\r\n\r\n');
        
        const [cryptoData, indicesData] = await Promise.all([
            this.fetchLiveCryptoData(),
            this.fetchLiveIndicesData()
        ]);

        if (cryptoData && cryptoData.length > 0) {
            this.terminal.write('  \x1b[1;32m✓ Cryptocurrency data updated\x1b[0m\r\n');
        }
        
        if (indicesData && indicesData.length > 0) {
            this.terminal.write('  \x1b[1;32m✓ Indices data updated\x1b[0m\r\n');
        }

        this.terminal.write('\r\n');
    }

    async fetchLiveCryptoData() {
        try {
            // Fetch from CoinGecko API
            const coins = ['bitcoin', 'ethereum', 'binancecoin', 'solana', 'cardano', 
                          'polkadot', 'chainlink', 'litecoin', 'avalanche-2', 'polygon'];
            const coinIds = coins.join(',');
            
            const response = await fetch(
                `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`
            );

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();
            const cryptoData = [];

            for (const [coinId, coinData] of Object.entries(data)) {
                cryptoData.push({
                    id: coinId,
                    name: this.formatCoinName(coinId),
                    symbol: coinId.toUpperCase().substring(0, 4),
                    price_usd: coinData.usd,
                    change_24h: coinData.usd_24h_change,
                    market_cap: coinData.usd_market_cap
                });
            }

            return cryptoData;
        } catch (error) {
            this.terminal.write(`  \x1b[1;31mError fetching crypto data: ${error.message}\x1b[0m\r\n`);
            return [];
        }
    }

    async fetchLiveIndicesData() {
        try {
            // For indices, we can use Alpha Vantage or similar
            // For now, return empty array as it requires API key
            // In production, implement with proper API
            
            this.terminal.write('  \x1b[1;33mNote: Indices data requires API key\x1b[0m\r\n');
            return [];
        } catch (error) {
            this.terminal.write(`  \x1b[1;31mError fetching indices data: ${error.message}\x1b[0m\r\n`);
            return [];
        }
    }

    formatCoinName(coinId) {
        return coinId.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    formatNumber(num) {
        if (num === null || num === undefined) return 'N/A';
        if (num >= 1_000_000_000) {
            return (num / 1_000_000_000).toFixed(2) + 'B';
        } else if (num >= 1_000_000) {
            return (num / 1_000_000).toFixed(2) + 'M';
        } else if (num >= 1_000) {
            return (num / 1_000).toFixed(2) + 'K';
        } else {
            return num.toFixed(2);
        }
    }

    formatMarketCap(marketCap) {
        if (!marketCap) return 'N/A';
        if (marketCap >= 1_000_000_000_000) {
            return '$' + (marketCap / 1_000_000_000_000).toFixed(2) + 'T';
        } else if (marketCap >= 1_000_000_000) {
            return '$' + (marketCap / 1_000_000_000).toFixed(2) + 'B';
        } else if (marketCap >= 1_000_000) {
            return '$' + (marketCap / 1_000_000).toFixed(2) + 'M';
        } else {
            return '$' + marketCap.toFixed(0);
        }
    }
}

window.MarketApp = MarketApp;

