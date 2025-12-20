class Web3OSIntegration {
  constructor() {
    this.initialized = false;
    this.kernel = null;
    this.runtime = null;
  }

  async init() {
    if (this.initialized) return;

    try {
      // Wait for Web3OS to load (check multiple times with timeout)
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds total
      
      while (attempts < maxAttempts) {
        // Check various possible Web3OS API structures
        if (typeof window.web3os !== 'undefined') {
          this.kernel = window.web3os.kernel || window.web3os;
          this.runtime = window.web3os.runtime || window.web3os;
          break;
        }
        
        // Also check for Web3OS in different locations
        if (typeof window.Web3OS !== 'undefined') {
          this.kernel = window.Web3OS.kernel || window.Web3OS;
          this.runtime = window.Web3OS.runtime || window.Web3OS;
          break;
        }
        
        // Check for global web3os object
        if (typeof web3os !== 'undefined' && typeof window !== 'undefined') {
          this.kernel = web3os.kernel || web3os;
          this.runtime = web3os.runtime || web3os;
          break;
        }
        
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }

      if (this.kernel || this.runtime) {
        this.initialized = true;
        console.log('Web3OS initialized successfully');
        return true;
      }

      console.warn('Web3OS runtime not loaded - loader script may not be available');
      return false;
    } catch (error) {
      console.error('Web3OS initialization error:', error);
      return false;
    }
  }

  isAvailable() {
    return this.initialized && this.kernel !== null;
  }

  async installPackage(packageName) {
    if (!this.isAvailable()) {
      throw new Error('Web3OS is not available. Please ensure the Web3OS loader script is loaded.');
    }

    try {
      // Try different Web3OS API patterns
      if (this.runtime && this.runtime.npm && this.runtime.npm.install) {
        return await this.runtime.npm.install(packageName);
      }
      
      // Alternative: direct runtime call
      if (this.runtime && typeof this.runtime.install === 'function') {
        return await this.runtime.install(packageName);
      }
      
      // Fallback: use eval in sandboxed environment (if available)
      if (this.runtime && typeof this.runtime.run === 'function') {
        return await this.runtime.run(`npm install ${packageName}`);
      }
      
      throw new Error('npm runtime not available. Web3OS may not be fully loaded.');
    } catch (error) {
      throw new Error(`Failed to install package: ${error.message}`);
    }
  }

  async executeNode(code) {
    if (!this.isAvailable()) {
      throw new Error('Web3OS is not available. Please ensure the Web3OS loader script is loaded.');
    }

    try {
      // Try different Web3OS API patterns
      if (this.runtime && typeof this.runtime.execute === 'function') {
        return await this.runtime.execute(code);
      }
      
      if (this.runtime && typeof this.runtime.run === 'function') {
        return await this.runtime.run(code);
      }
      
      if (this.runtime && typeof this.runtime.eval === 'function') {
        return await this.runtime.eval(code);
      }
      
      throw new Error('Node.js runtime not available. Web3OS may not be fully loaded.');
    } catch (error) {
      throw new Error(`Execution error: ${error.message}`);
    }
  }

  getStatus() {
    return {
      initialized: this.initialized,
      available: this.isAvailable(),
      kernel: this.kernel !== null,
      runtime: this.runtime !== null
    };
  }

  async connectWallet() {
    if (!this.isAvailable()) {
      throw new Error('Web3OS is not available. Please ensure the Web3OS loader script is loaded.');
    }

    try {
      // Try Web3OS wallet integration
      if (this.kernel && this.kernel.wallet && typeof this.kernel.wallet.connect === 'function') {
        return await this.kernel.wallet.connect();
      }
      
      // Alternative: check for account module
      if (this.kernel && this.kernel.account && typeof this.kernel.account.connect === 'function') {
        return await this.kernel.account.connect();
      }
      
      // Fallback: use standard Web3 wallet (MetaMask, etc.)
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        return { address: accounts[0], provider: 'MetaMask' };
      }
      
      throw new Error('Wallet integration not available. Please install MetaMask or enable Web3OS wallet features.');
    } catch (error) {
      throw new Error(`Wallet connection error: ${error.message}`);
    }
  }
}

window.Web3OSIntegration = Web3OSIntegration;

