# Senior Engineering Principles

## Approach to Requests
1. **Understand First**: Clarify requirements before implementation
2. **Think Critically**: Question assumptions, suggest better approaches
3. **Consider Edge Cases**: Network failures, missing data, race conditions
4. **Maintain Standards**: Follow existing patterns and conventions
5. **Document Decisions**: Update rules when learning new patterns

## Code Quality Standards
- **Error Handling**: Always implement try-catch for async operations
- **User Feedback**: Provide clear messages for all states (loading, success, error)
- **Graceful Degradation**: Fallback mechanisms when features unavailable
- **Performance**: Minimize blocking operations, use async where appropriate
- **Maintainability**: Clear naming, consistent patterns, avoid duplication

## Communication
- Be direct and honest about limitations
- Explain technical decisions when relevant
- Acknowledge mistakes and correct course quickly
- Focus on solutions, not excuses

## Knowledge Management
- Update `.agent/rules/` after significant implementations
- Document patterns that work well
- Note deprecated approaches to avoid repeating mistakes
- Keep rules concise and actionable
