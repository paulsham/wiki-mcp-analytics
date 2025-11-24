# Events

Analytics events organized by category.

## Registration Events

| Event Name | Event Description | Property Groups | Additional Properties | Notes |
|------------|-------------------|-----------------|----------------------|-------|
| user_registration_started | User began the registration process | device_info<br>page_context | registration_method | Fire when registration form is displayed. Track abandonment by comparing with completion. |
| user_registration_completed | User completed the registration process | user_context<br>device_info | registration_method<br>referral_code<br>account_type | Fire immediately after successful registration. Ensure registration_method matches OAuth provider. |
| email_verified | User verified their email address | user_context | verification_method<br>time_to_verify | Track time between registration and verification for funnel analysis. |

## Onboarding Events

| Event Name | Event Description | Property Groups | Additional Properties | Notes |
|------------|-------------------|-----------------|----------------------|-------|
| onboarding_started | User began the onboarding process | user_context<br>session_context | onboarding_version<br>total_steps | Fire when first onboarding screen is shown. |
| onboarding_step_completed | User completed an onboarding step | user_context<br>session_context | step_name<br>step_number<br>completion_time<br>skipped | Fire after each step. Include skipped=true if user skipped the step. |
| onboarding_completed | User finished the entire onboarding flow | user_context<br>session_context | onboarding_version<br>total_steps<br>completed_steps | Fire when user completes or exits onboarding. Calculate completion rate from completed_steps/total_steps. |

## Project Events

| Event Name | Event Description | Property Groups | Additional Properties | Notes |
|------------|-------------------|-----------------|----------------------|-------|
| project_created | User created a new project | user_context<br>session_context | project_id<br>project_name<br>project_template | Fire after project is successfully created. Track template usage for product decisions. |
| collaborator_invited | User invited a collaborator to a project | user_context<br>session_context | project_id<br>invitee_email<br>permission_level | Fire when invitation is sent. Track collaboration adoption and permission patterns. |
| file_uploaded | User uploaded a file to a project | user_context<br>session_context | project_id<br>file_type<br>file_size_bytes | Fire after successful upload. Monitor file type distribution and storage usage. |
