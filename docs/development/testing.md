# Testing Guide

## Testing Strategy

### Manual Testing

Primary testing method for this project:

1. **Command Testing**: Test each command with various inputs
2. **Error Cases**: Test error handling and edge cases
3. **Integration**: Test command interactions
4. **Browser Testing**: Test across different browsers
5. **Responsive**: Test on different screen sizes

## Test Checklist

### Core Functionality

- [ ] All commands execute correctly
- [ ] Command history works (arrow keys)
- [ ] Tab completion works
- [ ] Filesystem navigation works
- [ ] Theme switching works
- [ ] Boot sequence works (and skip)

### Commands

- [ ] `help` - Shows all commands
- [ ] `whoami` - Displays profile
- [ ] `companies` - Lists and shows company details
- [ ] `achievements` - Shows achievements
- [ ] `repos` - Fetches GitHub repos
- [ ] `sysmon` - Shows system monitor
- [ ] `cv` - Opens CV (all modes)
- [ ] `hack` - Hack game works
- [ ] `opm` - Package manager works
- [ ] `cat` - Reads files with syntax highlighting
- [ ] `ls`, `cd`, `pwd` - Navigation works
- [ ] EcmaOS commands delegate correctly

### Error Handling

- [ ] Invalid commands show error
- [ ] Missing files show error
- [ ] Invalid paths show error
- [ ] API failures handled gracefully
- [ ] Missing data handled gracefully

### Browser Compatibility

- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers

### Responsive Design

- [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

## Testing Commands

### Test Command Execution

```bash
# Start Jekyll server
bundle exec jekyll serve

# Open browser
open http://localhost:4000/terminal/
```

### Test Specific Commands

1. Open browser console (F12)
2. Execute commands in terminal
3. Check console for errors
4. Verify output format

### Test Error Cases

- Invalid command: `invalid-command`
- Missing file: `cat /nonexistent.txt`
- Invalid path: `cd /invalid/path`
- Missing data: Disable Jekyll data loading

## Debugging

### Browser Console

Check for:
- JavaScript errors
- Network errors
- Data loading issues

### Jekyll Build

Check for:
- Plugin errors
- Data file generation
- Build warnings

### Common Issues

**Command not found**
- Check registration in core.js
- Verify script loaded in layout
- Check appMap entry

**Data not loading**
- Verify `window.JEKYLL_DATA` exists
- Check filesystem-loader.js
- Verify data files in `_data/`

**EcmaOS not working**
- Check kernel.js loaded
- Verify import path
- Check console for errors

## Performance Testing

- Page load time
- Command execution speed
- Terminal rendering performance
- Memory usage

## Accessibility Testing

- Keyboard navigation
- Screen reader compatibility
- High contrast themes
- Focus indicators

