# Property Groups

Reusable sets of properties that can be included in multiple events.

## User Property Groups

| Group Name | Description | Properties |
|------------|-------------|------------|
| user_context | Common user identification properties used across most events | user_id<br>email<br>account_created_at<br>user_tier |

## Event Property Groups

| Group Name | Description | Properties |
|------------|-------------|------------|
| device_info | Information about the device and platform | device_type<br>platform<br>os_version<br>app_version |
| session_context | Session-level tracking information | session_id<br>session_start_time<br>session_count |
| page_context | Information about the current page | page_url<br>page_title<br>referrer |
