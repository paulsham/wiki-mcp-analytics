# User Properties

Custom properties set on user profiles via `identify()` or `setUserProperties()`.
These persist across sessions and are used for segmentation and analysis.

Note: This does not include automatic properties provided by analytics platforms
(geo-location, device info, etc.) - only custom properties you explicitly set.

## Identity Properties

| Property Name | Type | Constraints | Set Once | Description |
|---------------|------|-------------|----------|-------------|
| user_id | string | regex: ^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$ | yes | Unique identifier for the user. Used for identify() calls. |
| email | string | regex: ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ | no | User's email address. May change if user updates email. |
| account_created_at | timestamp | - | yes | Timestamp when the user account was created. Track account age for cohort analysis. |
| account_type | string | enum: personal, team, enterprise | no | Type of account. Segment by account structure. |
| role | string | enum: owner, admin, member, viewer | no | User's role in their organization. Analyze feature usage by role. |
| industry | string | enum: technology, finance, healthcare, education, retail, other | no | User's industry vertical. B2B segmentation and content targeting. |
| company_size | string | enum: 1-10, 11-50, 51-200, 201-1000, 1000+ | no | Size range of user's company. Enterprise vs SMB analysis. |
| signup_source | string | enum: organic, referral, paid, partner | yes | How user discovered the product. Attribution analysis. |
| initial_utm_source | string | - | yes | UTM source at registration. Marketing attribution. |
| initial_utm_campaign | string | - | yes | UTM campaign at registration. Campaign performance analysis. |
| referral_code_used | string | regex: ^[A-Z0-9]{6}$ | yes | Referral code used at signup. Track referral program effectiveness. |
| registration_method | string | enum: email, google, facebook, apple, github | yes | Method used to register. Track registration source for conversion analysis. |
| verification_method | string | enum: link, code | yes | How the user verified their email. Analyze verification preferences. |
| time_to_verify | number | - | yes | Seconds between registration and email verification. Measure verification funnel speed. |

## Subscription Properties

| Property Name | Type | Constraints | Set Once | Description |
|---------------|------|-------------|----------|-------------|
| plan | string | enum: free, pro, enterprise | no | Current subscription tier. Segmentation by plan. |
| user_tier | string | enum: free, basic, premium, enterprise | no | Current subscription tier of the user. Segment analysis by subscription level. |
| initial_plan | string | enum: free, pro, enterprise | yes | Plan at registration. Track upgrade patterns. |
| billing_interval | string | enum: monthly, annual | no | Current billing cycle. Revenue analysis. |

## Activation Milestone Properties

| Property Name | Type | Constraints | Set Once | Description |
|---------------|------|-------------|----------|-------------|
| has_completed_onboarding | boolean | - | yes | User finished onboarding flow. Activation funnel analysis. |
| has_created_project | boolean | - | yes | User created their first project. Core activation metric. |
| has_invited_teammate | boolean | - | yes | User invited at least one collaborator. Viral growth tracking. |
| has_connected_integration | boolean | - | yes | User connected an external integration. Stickiness indicator. |
| first_project_at | timestamp | - | yes | When user created first project. Time-to-value analysis. |
| first_invite_at | timestamp | - | yes | When user sent first invitation. Collaboration adoption speed. |
| activated_at | timestamp | - | yes | When user reached activation criteria. Cohort analysis by activation date. |
| days_to_activation | number | - | yes | Days from signup to activation. Onboarding efficiency metric. |
