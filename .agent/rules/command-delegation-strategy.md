# Command Delegation Strategy

## Principle
When a command exists natively in EcmaOS kernel, prefer delegating to it rather than implementing locally.

## Local vs Native Decision Matrix

### Implement Locally When:
- Command needs custom UI/UX for portfolio context
- Command requires Jekyll data integration
- Command has portfolio-specific behavior
- Examples: `whoami`, `companies`, `repos`, `sysmon`, `opm`

### Delegate to EcmaOS When:
- Standard Unix/Linux command behavior expected
- File system operations
- System utilities
- Games/entertainment
- Examples: `cat`, `ls`, `cd`, `mkdir`, `rm`, `snake`, `video`

## Current Local Commands
- `help` - Custom help for portfolio commands
- `whoami` - Portfolio identity
- `companies` - Work history from Jekyll data
- `achievements` - Portfolio achievements
- `repos` - GitHub integration
- `sysmon` - Custom system monitor
- `netmap` - Network visualization
- `neofetch` - System info
- `skills` - Skills matrix
- `wallet` - Web3 integration
- `cv` - Interactive CV
- `hack` - Privilege escalation game
- `install` - Limited EcmaOS package listing
- `opm` - Advanced package manager
- `github` - GitHub explorer
- `stats` - Repository stats
- `analytics` - Analytics dashboard
- `github-stats` - GitHub profile stats
- `market` - Market data
- `share` - Social sharing

## Delegated to EcmaOS
- File operations: `cat`, `touch`, `mkdir`, `rm`, `cp`, `mv`
- Directory: `ls`, `cd`, `pwd`
- System: `ps`, `kill`, `df`, `du`, `free`, `env`
- Network: `fetch`, `download`
- Utilities: `edit`, `load`
- Disk: `mount`, `umount`, `chkdisk`, `format`
- Entertainment: `snake`, `video`, `play`, `screensaver`

## Implementation Notes
- Remove switch case for delegated commands
- Remove from appMap
- Keep in help.js with proper descriptions
- EcmaOS handles via default case fallthrough
