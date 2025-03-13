# BizzyPerson Checklist Usage Guide (BP06)

## Overview

BizzyPerson uses a dual-checklist system to track project progress at different levels of detail. This document explains how to effectively use and maintain both checklist files.

## Checklist Files

### Master Checklist (`bp00-Project-Checklist.md`)

The Master Checklist provides a comprehensive project plan with:

- Detailed project phases and timelines
- Hierarchical task breakdowns with subtasks
- Dependencies between tasks
- Detailed implementation notes
- Resource requirements

This document serves as the authoritative project planning reference and is typically updated during major planning sessions and milestone reviews.

### Implementation Checklist (`bp04-Project-Checklist.md`)

The Implementation Checklist provides a simplified, actionable view with:

- Current implementation status of tasks
- Clear task IDs for cross-referencing
- Flat structure for easy tracking
- Focus on immediate and upcoming tasks

This document is updated regularly during development and serves as a day-to-day tracking tool.

## Task ID System

Both checklists use a consistent task ID system to enable cross-referencing:

```
[BP-CORE-01] Create project directory structure
```

Where:
- `BP` indicates BizzyPerson project
- `CORE` indicates the component (CORE, INT, EXT, BF, etc.)
- `01` is a sequential number within that component

## When to Use Each Checklist

### Use the Master Checklist (`bp00`) when:

- Planning the overall project structure
- Conducting milestone reviews
- Onboarding new team members who need the full context
- Making significant changes to project scope or direction
- Reporting on overall project progress to stakeholders

### Use the Implementation Checklist (`bp04`) when:

- Tracking daily development progress
- Assigning tasks to team members
- Conducting sprint planning or daily standups
- Reporting on immediate progress
- Determining the next tasks to implement

## Maintaining Consistency

To keep both checklists in sync:

1. **Adding New Tasks**:
   - Add the task to both checklists with the same task ID
   - Include detailed implementation notes in the Master Checklist
   - Keep the Implementation Checklist entry concise

2. **Completing Tasks**:
   - Mark the task as complete in the Implementation Checklist immediately
   - Update the Master Checklist during the next milestone review
   - Include completion notes in the Master Checklist if relevant

3. **Changing Task Scope**:
   - Update the Master Checklist with the new scope details
   - Adjust the Implementation Checklist entry if needed
   - Consider whether task IDs need to be updated or new tasks created

## Referencing Tasks in Other Documents

When referencing tasks in code comments, commit messages, or other documentation, use the task ID:

```
// Implements [BP-CORE-01] Project directory structure
```

For commit messages:

```
git commit -m "[BP-CORE-01] Create project directory structure"
```

## Checklist Review Process

1. **Weekly Synchronization**:
   - Review both checklists weekly to ensure consistency
   - Update completion status in both documents
   - Add new tasks as they are identified

2. **Milestone Reviews**:
   - Conduct a thorough review of both checklists at each milestone
   - Update the Master Checklist with detailed progress notes
   - Adjust timelines and dependencies as needed
   - Ensure all completed tasks are marked in both documents

3. **Phase Transitions**:
   - When moving to a new project phase, review and update both checklists
   - Archive completed phases in the Master Checklist if needed
   - Ensure the Implementation Checklist focuses on current and upcoming tasks

## Example Workflow

1. During planning, create detailed tasks in the Master Checklist
2. Extract actionable items to the Implementation Checklist with consistent IDs
3. Update the Implementation Checklist daily as work progresses
4. During weekly reviews, synchronize completion status between both documents
5. At milestones, update the Master Checklist with detailed progress notes
6. When starting a new phase, review and adjust both documents 