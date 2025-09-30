#!/bin/bash

# MongoDB initialization script
# This script creates the initial database and collections

mongo --host mongodb:27017 -u admin -p password123 --authenticationDatabase admin <<EOF
use consultant_tracker;

// Create collections
db.createCollection("consultants");
db.createCollection("submissions");
db.createCollection("status_history");

// Create indexes for consultants
db.consultants.createIndex({"email": 1}, {"unique": true});
db.consultants.createIndex({"tech_stack": 1});
db.consultants.createIndex({"available": 1});
db.consultants.createIndex({"location": 1});
db.consultants.createIndex({"visa_status": 1});
db.consultants.createIndex({"rating": 1});

// Create indexes for submissions
db.submissions.createIndex({"consultant_id": 1});
db.submissions.createIndex({"status": 1});
db.submissions.createIndex({"recruiter": 1});
db.submissions.createIndex({"submitted_on": 1});
db.submissions.createIndex({"client_or_job": 1});

// Create indexes for status_history
db.status_history.createIndex({"submission_id": 1});
db.status_history.createIndex({"changed_at": 1});

print("Database initialization completed successfully!");
EOF
