# Logging System Documentation

## Overview

The application uses a comprehensive file-based logging system that safely handles concurrent requests from multiple users. All logging is thread-safe and async-safe.

## Log Files Location

All log files are stored in the `backend/logs/` directory:

- **`app.log`** - All application logs (INFO level and above)
- **`errors.log`** - Only errors and critical issues (ERROR and CRITICAL levels)
- **`access.log`** - API access logs (all HTTP requests/responses)

## How Concurrent Logging Works

### Thread-Safety

Python's `logging` module is **inherently thread-safe**. The `RotatingFileHandler` uses internal locks to ensure:

1. **No data corruption**: Multiple threads/async tasks can write simultaneously without corrupting log entries
2. **Atomic writes**: Each log entry is written completely before the next one starts
3. **No race conditions**: The logging system handles concurrent access automatically

### Async-Safety

FastAPI's async nature works perfectly with Python's logging because:

1. **Logging is synchronous**: Even in async functions, logging operations are synchronous and thread-safe
2. **No blocking**: Logging operations are fast and don't block the event loop significantly
3. **Automatic queuing**: The logging system internally queues log messages if needed

### Example: Multiple Users Logging Simultaneously

When 3 users make requests at the same time:

```
User 1: POST /api/auth/login
User 2: GET /api/jobs
User 3: POST /api/submissions
```

**What happens:**
1. Each request is processed in its own async task
2. Each task logs independently
3. The logging system uses locks to serialize writes to the file
4. All log entries are written correctly, in order (or interleaved safely)

**Log file output:**
```
2024-01-15 14:23:45 - access - INFO - POST /api/auth/login - Client: 192.168.1.10 - Query: {}
2024-01-15 14:23:45 - access - INFO - GET /api/jobs - Client: 192.168.1.11 - Query: {}
2024-01-15 14:23:45 - access - INFO - POST /api/submissions - Client: 192.168.1.12 - Query: {}
2024-01-15 14:23:45 - app.repositories.recruiters - INFO - [recruiters.py:95] - Recruiter successfully inserted...
2024-01-15 14:23:46 - access - INFO - POST /api/auth/login - Status: 200 - Duration: 0.234s - Client: 192.168.1.10
2024-01-15 14:23:46 - access - INFO - GET /api/jobs - Status: 200 - Duration: 0.156s - Client: 192.168.1.11
2024-01-15 14:23:47 - access - INFO - POST /api/submissions - Status: 201 - Duration: 0.445s - Client: 192.168.1.12
```

## Log Rotation

To prevent log files from growing indefinitely:

- **Max file size**: 10MB per log file
- **Backup count**: 5 backup files (app.log.1, app.log.2, etc.)
- **Automatic rotation**: When a file reaches 10MB, it's rotated and a new file starts

## Log Levels

Configured via `LOG_LEVEL` environment variable (default: `INFO`):

- **DEBUG**: Detailed diagnostic information
- **INFO**: General informational messages (default)
- **WARNING**: Warning messages
- **ERROR**: Error messages (also written to errors.log)
- **CRITICAL**: Critical errors (also written to errors.log)

## What Gets Logged

### Application Logs (`app.log`)
- Database operations
- User creation/updates
- Business logic operations
- Configuration changes
- All INFO, WARNING, ERROR, CRITICAL messages

### Error Logs (`errors.log`)
- Only ERROR and CRITICAL level messages
- Database connection failures
- Authentication failures
- Critical system errors

### Access Logs (`access.log`)
- All HTTP requests (method, path, query params)
- Response status codes
- Request duration
- Client IP addresses
- Request/response timing

## Configuration

Logging is configured in `backend/app/logging_config.py` and automatically initialized when the application starts.

To change log level, set environment variable:
```bash
export LOG_LEVEL=DEBUG  # or INFO, WARNING, ERROR, CRITICAL
```

## Viewing Logs

### Real-time monitoring
```bash
# Watch all logs
tail -f backend/logs/app.log

# Watch errors only
tail -f backend/logs/errors.log

# Watch access logs
tail -f backend/logs/access.log
```

### Search logs
```bash
# Find all errors for a specific user
grep "user@example.com" backend/logs/app.log

# Find all failed login attempts
grep "Authentication failed" backend/logs/errors.log

# Find slow requests (>1 second)
grep "Duration: [1-9]\." backend/logs/access.log
```

## Best Practices

1. **Don't log sensitive data**: Passwords, tokens, and personal information should never be logged
2. **Use appropriate log levels**: 
   - DEBUG for development details
   - INFO for normal operations
   - ERROR for problems that need attention
3. **Monitor error logs**: Set up alerts for ERROR and CRITICAL messages
4. **Regular cleanup**: Old rotated log files are kept automatically (5 backups), but you may want to archive older logs

## Performance Impact

Logging has minimal performance impact:
- File writes are buffered
- Rotation happens asynchronously
- Concurrent writes are efficiently handled
- Typical overhead: <1ms per log entry

## Troubleshooting

If logs aren't appearing:
1. Check that `backend/logs/` directory exists and is writable
2. Verify `LOG_LEVEL` is set appropriately
3. Check file permissions on the logs directory
4. Ensure the application has write permissions

