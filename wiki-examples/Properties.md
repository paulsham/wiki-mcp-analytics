# Properties

Event property definitions. Property groups and events reference these by name.

Note: User properties (user_id, email, plan, etc.) are defined in User-Properties.md. Property groups can reference properties from either file.

## Device Properties

| Property Name | Type | Constraints | Description | Usage |
|---------------|------|-------------|-------------|-------|
| device_type | string | enum: mobile, tablet, desktop, tv, watch | Type of device being used. | Include in device_info group for platform-specific analysis. |
| platform | string | enum: web, ios, android, windows, macos, linux | Platform or operating system. | Critical for cross-platform analysis. |
| os_version | string | - | Operating system version string. | Track OS-specific issues and feature adoption. |
| app_version | string | regex: ^\d+\.\d+\.\d+$ | Application version in semver format. | Track feature rollout and bug reports by version. |

## Session Properties

| Property Name | Type | Constraints | Description | Usage |
|---------------|------|-------------|-------------|-------|
| session_id | string | regex: ^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$ | Unique identifier for the user session. | Group events within a single user session. |
| session_start_time | timestamp | - | Timestamp when the session began. | Calculate session duration and time-based analysis. |
| session_count | number | - | Total number of sessions for this user. | Track user engagement over time. |

## Page Properties

| Property Name | Type | Constraints | Description | Usage |
|---------------|------|-------------|-------------|-------|
| page_url | string | - | Full URL of the current page. | Track page-level engagement and navigation paths. |
| page_title | string | - | Title of the current page. | Human-readable page identification. |
| referrer | string | - | URL of the referring page. | Track traffic sources and user journeys. |

## Onboarding Properties

| Property Name | Type | Constraints | Description | Usage |
|---------------|------|-------------|-------------|-------|
| onboarding_version | string | - | Version identifier for the onboarding flow. | A/B test different onboarding experiences. |
| step_name | string | - | Name of the onboarding step completed. | Track onboarding funnel progression. |
| step_number | number | - | Numeric position of the step in the flow. | Order steps for funnel analysis. |
| skipped | boolean | - | Whether the user skipped this step. | Identify commonly skipped steps. |
| completion_time | number | - | Seconds spent on this step. | Identify slow or confusing steps. |
| total_steps | number | - | Total number of steps in the onboarding flow. | Calculate completion percentage. |
| completed_steps | number | - | Number of steps the user completed. | Track partial completions. |

## Project Properties

| Property Name | Type | Constraints | Description | Usage |
|---------------|------|-------------|-------------|-------|
| project_id | string | regex: ^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$ | Unique identifier for the project. | Track project-level analytics and cross-reference events. |
| project_name | string | - | Name of the project. | Human-readable project identification. |
| project_template | string | enum: blank, starter, advanced, import | Template used to create the project. | Analyze template popularity and user preferences. |
| invitee_email | string | regex: ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ | Email address of the invited collaborator. | Track invitation patterns and collaboration growth. |
| permission_level | string | enum: viewer, editor, admin | Permission level granted to the collaborator. | Analyze permission distribution and security patterns. |
| file_type | string | - | MIME type or extension of the uploaded file. | Track file type distribution for storage optimization. |
| file_size_bytes | number | - | Size of the uploaded file in bytes. | Monitor storage usage and identify large uploads. |
