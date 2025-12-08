#!/bin/bash

# MongoDB initialization script
# This script creates the initial database and collections
# Note: Collections are created automatically when first document is inserted
# This script is mainly for reference. Indexes are created by the application schemas.

mongo --host mongodb:27017 -u admin -p password123 --authenticationDatabase admin <<EOF
use consultant_tracker;

// Note: Collections will be created automatically by the application when data is inserted
// Indexes are created by the application's schema system on startup

// Remove any unwanted collections if they exist
db.applications.drop();
db.interviews.drop();
db.status_updates.drop();
db.status_history.drop();  // status_history is now embedded in submissions

print("Database cleanup completed successfully!");
print("Collections will be created automatically when data is inserted.");
print("Indexes will be created by the application on startup.");
EOF
