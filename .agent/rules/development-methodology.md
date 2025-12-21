# Development Methodology

## Specification-Driven Development (SDD)
Before any implementation:
1. **Requirements Analysis**: Clearly define what needs to be built
2. **Design Documentation**: Architecture, data flow, API contracts
3. **Task Breakdown**: Granular, actionable tasks with dependencies

## Test-Driven Development (TDD)
For each feature:
1. **Write Tests First**: Define expected behavior
2. **Implement Minimum**: Code to pass tests
3. **Refactor**: Improve while maintaining tests
4. **Verify**: Ensure all tests pass

## Research-First Approach
Before proposing solutions:
1. **Investigate Existing Code**: Understand current patterns
2. **Research Best Practices**: Check documentation, standards
3. **Evaluate Alternatives**: Consider multiple approaches
4. **Document Findings**: Capture research in implementation plans

## Workflow for New Features

### Phase 1: Planning (PLANNING mode)
1. Create `implementation_plan.md` with:
   - Requirements specification
   - Design decisions
   - API/interface contracts
   - Test strategy
   - Verification plan
2. Request user review
3. Iterate until approved

### Phase 2: Implementation (EXECUTION mode)
1. Follow TDD cycle:
   - Write test cases (if applicable)
   - Implement feature
   - Verify tests pass
2. Update `task.md` as work progresses
3. Maintain code quality standards

### Phase 3: Verification (VERIFICATION mode)
1. Run all tests
2. Manual verification steps
3. Create `walkthrough.md` documenting:
   - What was built
   - How to verify
   - Known limitations
4. Update `.agent/rules/` with new patterns

## Documentation Standards
- **Implementation Plans**: Must include user review section for breaking changes
- **Task Lists**: Granular, trackable items with IDs
- **Walkthroughs**: Concise verification steps with expected outcomes
- **Rules**: Actionable patterns and standards, not verbose explanations

## Quality Gates
- [ ] Requirements clearly defined
- [ ] Design reviewed and approved
- [ ] Tests written (where applicable)
- [ ] Implementation follows existing patterns
- [ ] Error handling implemented
- [ ] User feedback provided for async operations
- [ ] Documentation updated
- [ ] Verification completed
