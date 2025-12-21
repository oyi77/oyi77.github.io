class SysMonApp {
    constructor(terminal, filesystem, windowManager, os) {
        this.terminal = terminal;
        this.filesystem = filesystem;
        this.windowManager = windowManager;
        this.os = os;
        this.isRunning = false;
        this.exitHandler = null;
    }

    async run(args) {
        this.isRunning = true;
        const width = this.terminal.cols || 80;

        // Hide cursor and clear for full-screen feel
        this.terminal.write('\x1b[?25l\x1b[2J\x1b[H');

        // Stats initialization
        const cores = navigator.hardwareConcurrency || 'N/A';
        const totalMem = navigator.deviceMemory ? `${navigator.deviceMemory}GB` : 'Unknown';
        const browser = this.getBrowserInfo();

        // Exit listener
        this.exitHandler = this.terminal.onData(() => {
            this.isRunning = false;
        });

        try {
            while (this.isRunning) {
                this.terminal.write('\x1b[H'); // Reset to top

                // Header
                const header = `\x1b[1;37m  OYI-OS / METAL KERNEL MONITOR                     SESSIONS: 1  \x1b[0m`;
                this.terminal.write('\x1b[1;44;37m' + header.padEnd(width) + '\x1b[0m\r\n\r\n');

                // CPU Per Core (Simulated but based on concurrency)
                const totalCores = typeof cores === 'number' ? cores : 4;
                for (let c = 0; c < Math.min(totalCores, 8); c++) {
                    const load = 5 + Math.random() * 25;
                    this.terminal.write(`  \x1b[1;32m[${c + 1}]\x1b[0m [${this.getHtopBar(load, 25)}] ${load.toFixed(1)}%\r\n`);
                }

                this.terminal.write('\r\n');

                // Real Stats Overlay
                const memInfo = window.performance && window.performance.memory;
                const usedMem = memInfo ? (memInfo.usedJSHeapSize / 1024 / 1024).toFixed(1) : (35 + Math.random() * 10).toFixed(1);
                const memPercent = memInfo ? (memInfo.usedJSHeapSize / memInfo.jsHeapSizeLimit * 100) : 15;

                this.terminal.write(`  \x1b[1;36mMEM \x1b[0m [${this.getHtopBar(memPercent, 40)}] ${usedMem}MB / ${totalMem}\r\n`);

                const netSpeed = navigator.connection ? navigator.connection.downlink : 'N/A';
                this.terminal.write(`  \x1b[1;36mNET \x1b[0m [${this.getHtopBar(Math.min(netSpeed * 10, 100), 40)}] ${netSpeed} Mbps\r\n\r\n`);

                // Process List - Personal Activities
                this.terminal.write('\x1b[1;30;47m  PID  USER     PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND      \x1b[0m\r\n');
                
                // Personal activity processes
                const activities = [
                    { pid: 1001, user: 'oyi77', cpu: 25.5, mem: 8.2, time: '2:15:30', cmd: 'thinking', status: 'R' },
                    { pid: 1002, user: 'oyi77', cpu: 18.3, mem: 6.5, time: '1:45:12', cmd: 'problem-solving', status: 'R' },
                    { pid: 1003, user: 'oyi77', cpu: 35.7, mem: 12.8, time: '3:22:45', cmd: 'coding', status: 'R' },
                    { pid: 1004, user: 'oyi77', cpu: 12.1, mem: 4.3, time: '1:10:20', cmd: 'leadership', status: 'S' },
                    { pid: 1005, user: 'oyi77', cpu: 8.9, mem: 3.1, time: '0:45:33', cmd: 'architecting', status: 'S' },
                    { pid: 1006, user: 'oyi77', cpu: 5.2, mem: 2.4, time: '0:30:15', cmd: 'debugging', status: 'S' }
                ];
                
                activities.forEach(proc => {
                    const virt = `${Math.floor(Math.random() * 200 + 100)}M`;
                    const res = `${Math.floor(proc.mem * 10)}M`;
                    const shr = `${Math.floor(proc.mem * 3)}M`;
                    this.renderProcess(proc.pid, proc.user, 20, 0, virt, res, shr, proc.status, proc.cpu, proc.mem, proc.time, proc.cmd);
                });

                this.terminal.write('\r\n\r\n' + TerminalUtils.center('\x1b[1;30m[ PRESS ANY KEY TO EXIT ]\x1b[0m', width));

                await new Promise(r => setTimeout(r, 800));
            }
        } catch (e) { }

        // Cleanup
        if (this.exitHandler) {
            this.exitHandler.dispose();
        }
        this.terminal.write('\x1b[?25h\x1b[2J\x1b[H'); // Show cursor and clear
        this.terminal.write('\x1b[1;32mMonitor deactivated.\x1b[0m\r\n');
    }

    getHtopBar(val, size) {
        const filled = Math.floor((val / 100) * size);
        let bar = '';
        for (let i = 0; i < size; i++) {
            if (i < filled) {
                if (i < size * 0.5) bar += '\x1b[1;32m|'; // Green
                else if (i < size * 0.8) bar += '\x1b[1;33m|'; // Yellow
                else bar += '\x1b[1;31m|'; // Red
            } else {
                bar += '\x1b[1;30m.';
            }
        }
        return bar + '\x1b[0m';
    }

    renderProcess(pid, user, pr, ni, virt, res, shr, s, cpu, mem, time, cmd) {
        const line = ` ${pid.toString().padEnd(5)} ${user.padEnd(8)} ${pr}  ${ni}  ${virt.padEnd(7)} ${res.padEnd(6)} ${shr.padEnd(6)} ${s}  ${cpu.toFixed(1).padStart(4)}  ${mem.toFixed(1).padStart(4)}   ${time.padStart(9)} ${cmd}`;
        this.terminal.write(line + '\r\n');
    }

    getBrowserInfo() {
        return navigator.userAgent.split(' ').pop();
    }
}

window.SysMonApp = SysMonApp;
