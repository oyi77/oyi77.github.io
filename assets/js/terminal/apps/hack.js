class HackApp {
    constructor(terminal, filesystem, windowManager, os) {
        this.terminal = terminal;
        this.filesystem = filesystem;
        this.windowManager = windowManager;
        this.os = os;
        this.stage = 0;
        this.hints = 0;
    }

    async run(args) {
        const width = this.terminal.cols || 60;
        
        // Check if already root
        if (this.os.isRoot) {
            this.terminal.write('\r\n\x1b[1;32mYou already have root access!\x1b[0m\r\n');
            this.terminal.write('Type \x1b[1;33mwhoami\x1b[0m to verify your privileges.\r\n\r\n');
            return;
        }

        this.terminal.write('\r\n' + TerminalUtils.center('\x1b[1;31m>> PRIVILEGE ESCALATION CHALLENGE <<\x1b[0m', width) + '\r\n\r\n');
        this.terminal.write('  \x1b[1;33mObjective:\x1b[0m Gain root access through a series of challenges.\r\n');
        this.terminal.write('  \x1b[1;33mType "hint" at any stage for help.\x1b[0m\r\n\r\n');

        await this.wait(1000);
        await this.stage1_PasswordCrack();
    }

    async stage1_PasswordCrack() {
        this.stage = 1;
        this.terminal.write('\r\n\x1b[1;36m[ STAGE 1/3 ] Password Cracking\x1b[0m\r\n');
        this.terminal.write('  You found a password hash in /home/user/.secrets\r\n');
        this.terminal.write('  Hash: \x1b[1;33m5f4dcc3b5aa765d61d8327deb882cf99\x1b[0m\r\n');
        this.terminal.write('  \x1b[1;30mHint: This is MD5. Common passwords: password, admin, root, guest\x1b[0m\r\n\r\n');
        
        this.terminal.write('  \x1b[1;33mType the password as a command (e.g., type "password" and press Enter):\x1b[0m\r\n');
        this.terminal.write('  \x1b[1;30mOr type "hint" for more help.\x1b[0m\r\n\r\n');
        
        // Store callback for hack command
        this.os.hackStage = 1;
        this.os.hackCallback = async (input) => {
            const cmd = input.trim().toLowerCase();
            
            // MD5 of "password" is 5f4dcc3b5aa765d61d8327deb882cf99
            if (cmd === 'password') {
                this.terminal.write('\r\n  \x1b[1;32m✓ Password correct!\x1b[0m\r\n');
                await this.wait(500);
                this.os.hackStage = 2;
                await this.stage2_FileAnalysis();
            } else if (cmd === 'hint') {
                this.hints++;
                this.terminal.write('\r\n  \x1b[1;33mHint: The most common password is "password". Try typing it.\x1b[0m\r\n\r\n');
            } else {
                this.terminal.write('\r\n  \x1b[1;31m✗ Wrong password. Try again.\x1b[0m\r\n');
                this.terminal.write('  \x1b[1;30mHint: MD5 hash of "password" matches this hash.\x1b[0m\r\n\r\n');
            }
        };
    }

    async stage2_FileAnalysis() {
        this.stage = 2;
        this.terminal.write('\r\n\x1b[1;36m[ STAGE 2/3 ] File Analysis\x1b[0m\r\n');
        this.terminal.write('  You gained access to a restricted directory.\r\n');
        this.terminal.write('  Analyze the file: /classified/secret_project.enc\r\n');
        this.terminal.write('  \x1b[1;30mHint: Use "cat" command to read files\x1b[0m\r\n\r\n');
        
        this.terminal.write('  \x1b[1;33mType: cat /classified/secret_project.enc\x1b[0m\r\n\r\n');
        
        // Update callback for stage 2
        this.os.hackCallback = async (input) => {
            const cmd = input.trim().toLowerCase();
            
            if (cmd.includes('cat') && cmd.includes('secret_project')) {
                this.terminal.write('\r\n  \x1b[1;32m✓ File analyzed!\x1b[0m\r\n');
                this.terminal.write('  Found: "XF-77-ALPHA: [ENCRYPTED DATA STREAM]"\r\n');
                this.terminal.write('  Key extracted: \x1b[1;33mALPHA77\x1b[0m\r\n');
                await this.wait(500);
                this.os.hackStage = 3;
                await this.stage3_PrivilegeEscalation();
            } else if (cmd === 'hint') {
                this.hints++;
                this.terminal.write('\r\n  \x1b[1;33mHint: Try: cat /classified/secret_project.enc\x1b[0m\r\n\r\n');
            } else {
                this.terminal.write('\r\n  \x1b[1;31m✗ Try using cat command on the encrypted file.\x1b[0m\r\n');
                this.terminal.write('  \x1b[1;30mExample: cat /classified/secret_project.enc\r\n\r\n');
            }
        };
    }

    async stage3_PrivilegeEscalation() {
        this.stage = 3;
        const width = this.terminal.cols || 60;
        this.terminal.write('\r\n\x1b[1;36m[ STAGE 3/3 ] Privilege Escalation\x1b[0m\r\n');
        this.terminal.write('  Use the extracted key to escalate privileges.\r\n');
        this.terminal.write('  Key: \x1b[1;33mALPHA77\x1b[0m\r\n');
        this.terminal.write('  \x1b[1;30mHint: The key might be used as a command or parameter\x1b[0m\r\n\r\n');
        
        this.terminal.write('  \x1b[1;33mType the key as a command (e.g., type "ALPHA77" and press Enter):\x1b[0m\r\n\r\n');
        
        // Update callback for stage 3
        this.os.hackCallback = async (input) => {
            const cmd = input.trim().toUpperCase();
            
            if (cmd === 'ALPHA77' || cmd.includes('ALPHA77')) {
                this.terminal.write('\r\n  \x1b[1;32m✓ Privilege escalation successful!\x1b[0m\r\n\r\n');
                await this.wait(500);
                
                // Grant root access
                this.os.isRoot = true;
                this.os.currentUser = 'root';
                
                this.terminal.write('\x1b[1;32m' + '='.repeat(width) + '\x1b[0m\r\n');
                this.terminal.write(TerminalUtils.center('\x1b[1;32m>> ROOT ACCESS GRANTED <<\x1b[0m', width) + '\r\n');
                this.terminal.write('\x1b[1;32m' + '='.repeat(width) + '\x1b[0m\r\n\r\n');
                
                this.terminal.write('  \x1b[1;33mCongratulations! You successfully completed the CTF challenge!\x1b[0m\r\n');
                this.terminal.write('  You now have root privileges.\r\n');
                if (this.hints > 0) {
                    this.terminal.write(`  \x1b[1;30m(Used ${this.hints} hint${this.hints > 1 ? 's' : ''})\x1b[0m\r\n`);
                }
                this.terminal.write('\r\n  \x1b[1;36mBonus:\x1b[0m "Oyi" is a slang for "Iyo" (Yes) in Javanese.\r\n');
                this.terminal.write('  Your prompt will now show root access.\r\n\r\n');
                
                // Clear hack callback
                this.os.hackStage = 0;
                this.os.hackCallback = null;
                
                // Trigger matrix rain if available
                if (this.os.effects && this.os.effects.startMatrixRain) {
                    this.os.effects.startMatrixRain();
                }
            } else if (cmd === 'HINT') {
                this.hints++;
                this.terminal.write('\r\n  \x1b[1;33mHint: Try entering the key "ALPHA77" directly as a command...\x1b[0m\r\n\r\n');
            } else {
                this.terminal.write('\r\n  \x1b[1;31m✗ Invalid. Try using the extracted key "ALPHA77".\x1b[0m\r\n\r\n');
            }
        };
    }

    async wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

window.HackApp = HackApp;
