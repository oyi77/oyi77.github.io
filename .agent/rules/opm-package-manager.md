# OPM Package Manager Rules

## Design Philosophy
- **Separation of Concerns**: `install` is basic (list only), `opm` is advanced (full features)
- **Progressive Enhancement**: Users discover `opm` when they need more than listing
- **EcmaOS Integration**: Delegate to kernel when available, simulate when not

## Command Structure

### install (Limited)
- `install -l/--list/ls`: List EcmaOS packages from registry
- `install <package>`: Show message directing to `opm`
- **No installation capability** - this is intentional

### opm (Full-Featured)
- `opm install <pkg>[@ver] [--registry <url>]`: Install package
- `opm uninstall <pkg>`: Remove package
- `opm list`: List installed packages
- `opm search <query>`: Search npm registry
- `opm update [pkg]`: Update packages
- `opm registry add/remove/list`: Manage registries

## Implementation Patterns

### EcmaOS Kernel Delegation
```javascript
if (this.os.ecmaKernel && typeof this.os.ecmaKernel.execute === 'function') {
    await this.os.ecmaKernel.execute(command, this.terminal);
} else {
    // Fallback or simulation
}
```

### Registry Management
- Stored in localStorage as `opm_registries`
- Default registries: npm, ecmaos-apps, ecmaos-devices
- Custom registries can be added/removed

### Error Handling
- Network failures: Show clear error message with fallback
- Missing kernel: Simulation mode with user notification
- Invalid commands: Helpful error with usage hint

## User Experience
- **Clear Messaging**: Use emojis and colors for visual feedback
- **Progressive Disclosure**: Basic command shows path to advanced
- **Graceful Degradation**: Works even without kernel (limited)
