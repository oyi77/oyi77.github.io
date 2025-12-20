class WalletApp {
    constructor(terminal, filesystem, windowManager, os) {
        this.terminal = terminal;
        this.filesystem = filesystem;
        this.windowManager = windowManager;
        this.os = os;
    }

    async run(args) {
        const width = this.terminal.cols || 60;

        this.terminal.write('\r\n' + TerminalUtils.center('\x1b[1;36m[ METAL WALLET IDENTIFIER ]\x1b[0m', width) + '\r\n');
        this.terminal.write(' Authenticating via Web3 Provider...\r\n');

        await new Promise(r => setTimeout(r, 1200));

        // Try Web3OS wallet integration first
        if (this.os.web3os && this.os.web3os.isAvailable()) {
            try {
                const result = await this.os.web3os.connectWallet();
                if (result && result.address) {
                    this.terminal.write(' \x1b[1;32m[ CONNECTED ]\x1b[0m Web3OS Wallet\r\n');
                    this.terminal.write(` Address: \x1b[1;33m${result.address}\x1b[0m\r\n`);
                    this.terminal.write(' Identity verified via Web3OS.\r\n');
                    return;
                }
            } catch (e) {
                this.terminal.write(` \x1b[1;33m[ WARNING ]\x1b[0m Web3OS wallet: ${e.message}\r\n`);
            }
        }

        // Check for real provider if user has one
        const hasProvider = typeof window.ethereum !== 'undefined';

        if (hasProvider) {
            this.terminal.write(' \x1b[1;32m[ FOUND ]\x1b[0m Web3 Provider detected.\r\n');
            try {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    this.terminal.write(` \x1b[1;32m[ LINKED ]\x1b[0m Address: \x1b[1;33m${accounts[0]}\x1b[0m\r\n`);
                    this.terminal.write(' Identity verified on the Ethereum blockchain.\r\n');
                } else {
                    this.terminal.write(' \x1b[1;33m[ PENDING ]\x1b[0m Please connect your wallet to authorize access.\r\n');
                }
            } catch (e) {
                this.terminal.write(' \x1b[1;31m[ DENIED ]\x1b[0m Connection refused by user.\r\n');
            }
        } else {
            this.terminal.write(' \x1b[1;31m[ FAIL ]\x1b[0m No Web3 Provider found.\r\n');
            this.terminal.write(' \x1b[1;30mProceeding in Anonymous Mode (Guest).\x1b[0m\r\n');
            this.terminal.write(' Tip: Install MetaMask or a Web3 browser for full OS privileges.\r\n');
        }
    }
}

window.WalletApp = WalletApp;
