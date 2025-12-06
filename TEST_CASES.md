# Test Cases - Consultant Tracker Application

**Version:** 1.0  
**Date:** December 6, 2025  
**Environment:** Development  
**URLs:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## Prerequisites

### Test Data Required
- **Test Emails:** Use unique emails for each test user
- **Test Resume:** Prepare PDF, DOC, and DOCX files (< 5MB)
- **Test Skills:** "React, Python, AWS, Docker, Node.js"

### How to Start
1. Start Backend: `cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`
2. Start Frontend: `cd frontend && npm start`
3. Clear browser cache before testing

---

# 1. AUTHENTICATION MODULE

## TC-01: User Registration - Consultant

**Priority:** High  
**Type:** Functional

### Steps:
1. Navigate to http://localhost:3000/register
2. Fill in the form:
   - Name: "John Consultant"
   - Email: "john.consultant@test.com"
   - Password: "password123"
   - Role: Select "CONSULTANT"
3. Click "Register" button

### Expected Results:
- [ ] Registration successful
- [ ] Redirected to login page (/login)
- [ ] Success message displayed
- [ ] User created in database with hashed password
- [ ] No errors in console

---

## TC-02: User Registration - Recruiter

**Priority:** High  
**Type:** Functional

### Steps:
1. Navigate to http://localhost:3000/register
2. Fill in the form:
   - Name: "Sarah Recruiter"
   - Email: "sarah.recruiter@test.com"
   - Password: "password123"
   - Role: Select "RECRUITER"
3. Click "Register" button

### Expected Results:
- [ ] Registration successful
- [ ] Redirected to login page
- [ ] User created with role "RECRUITER"
- [ ] No errors in console

---

## TC-03: Registration - Duplicate Email

**Priority:** High  
**Type:** Negative

### Steps:
1. Register a user with email "duplicate@test.com"
2. Try to register another user with same email "duplicate@test.com"

### Expected Results:
- [ ] Error message: "Email already registered" or similar
- [ ] Registration fails
- [ ] User remains on registration page
- [ ] First user account unchanged

---

## TC-04: Registration - Weak Password

**Priority:** Medium  
**Type:** Negative

### Steps:
1. Navigate to registration page
2. Enter password: "123" (less than 6 characters)
3. Try to submit

### Expected Results:
- [ ] Validation error shown
- [ ] Registration prevented
- [ ] Error message about password requirements

---

## TC-05: Registration - Invalid Email Format

**Priority:** Medium  
**Type:** Negative

### Steps:
1. Navigate to registration page
2. Enter email: "invalidemail" (no @ symbol)
3. Try to submit

### Expected Results:
- [ ] Validation error for email format
- [ ] Registration prevented
- [ ] Error message displayed

---

## TC-06: User Login - Valid Credentials

**Priority:** High  
**Type:** Functional

### Steps:
1. Navigate to http://localhost:3000/login
2. Enter credentials:
   - Email: "john.consultant@test.com"
   - Password: "password123"
3. Click "Login"

### Expected Results:
- [ ] Login successful
- [ ] Redirected to /consultant-dashboard
- [ ] JWT token stored in localStorage
- [ ] User name displayed in header
- [ ] No errors in console

---

## TC-07: Login - Invalid Password

**Priority:** High  
**Type:** Negative

### Steps:
1. Navigate to login page
2. Enter email: "john.consultant@test.com"
3. Enter wrong password: "wrongpassword"
4. Click "Login"

### Expected Results:
- [ ] Login fails
- [ ] Error message: "Invalid credentials" or similar
- [ ] User remains on login page
- [ ] No token stored

---

## TC-08: Login - Non-existent User

**Priority:** Medium  
**Type:** Negative

### Steps:
1. Navigate to login page
2. Enter email: "nonexistent@test.com"
3. Enter any password
4. Click "Login"

### Expected Results:
- [ ] Login fails
- [ ] Error message displayed
- [ ] No token stored

---

## TC-09: Logout

**Priority:** High  
**Type:** Functional

### Steps:
1. Login as any user
2. Click on user menu (top-right)
3. Click "Logout"

### Expected Results:
- [ ] User logged out
- [ ] Redirected to /login
- [ ] Token removed from localStorage
- [ ] Cannot access dashboard without login

---

## TC-10: Protected Routes - Unauthorized Access

**Priority:** High  
**Type:** Security

### Steps:
1. WITHOUT logging in, try to access:
   - http://localhost:3000/consultant-dashboard
   - http://localhost:3000/recruiter-dashboard

### Expected Results:
- [ ] Redirected to /login for both URLs
- [ ] Error message (optional)
- [ ] No dashboard content visible

---

# 2. CONSULTANT MODULE

## TC-11: Create Consultant Profile - First Time

**Priority:** High  
**Type:** Functional

### Steps:
1. Login as consultant (john.consultant@test.com)
2. Go to "My Profile" tab
3. Fill in the form:
   - Tech Stack: "React, Python, AWS, Docker"
   - Experience: "5.5"
   - Location: "New York, NY"
   - Visa Status: "H1B"
   - Check "Available for opportunities"
4. Click "Save Profile"

### Expected Results:
- [ ] Success message displayed (green)
- [ ] Profile saved to database
- [ ] Skills shown as badges
- [ ] Profile completeness indicator updated
- [ ] Consultant appears in Recruiter's consultant list
- [ ] Page refreshes with saved data

---

## TC-12: Update Existing Profile

**Priority:** High  
**Type:** Functional

### Steps:
1. Login as consultant with existing profile
2. Go to "My Profile" tab
3. Modify:
   - Change Experience to "6"
   - Add new skill: ", TypeScript"
   - Change Location to "San Francisco, CA"
4. Click "Save Profile"

### Expected Results:
- [ ] Success message displayed
- [ ] Updated data shown immediately
- [ ] New skill badge appears
- [ ] Database updated with new values

---

## TC-13: Profile Validation - Empty Skills

**Priority:** Medium  
**Type:** Negative

### Steps:
1. Login as consultant
2. Go to "My Profile" tab
3. Leave Tech Stack empty
4. Fill other fields
5. Click "Save Profile"

### Expected Results:
- [ ] Validation error displayed
- [ ] Save operation prevented
- [ ] Error message: "Tech stack required" or similar

---

## TC-14: Profile Validation - Zero Experience

**Priority:** Medium  
**Type:** Negative

### Steps:
1. Login as consultant
2. Go to "My Profile" tab
3. Enter Experience: "0"
4. Fill other fields
5. Click "Save Profile"

### Expected Results:
- [ ] Validation error or warning
- [ ] Save prevented or warning shown

---

## TC-15: View Open Jobs List

**Priority:** High  
**Type:** Functional

### Prerequisites:
- Recruiter should have created at least 2 jobs

### Steps:
1. Login as consultant
2. Go to "Open Jobs" tab

### Expected Results:
- [ ] List of OPEN jobs displayed
- [ ] Each job shows:
  - Job title
  - "Posted by [Recruiter Name]"
  - Location
  - Experience required
  - Tech stack badges
  - Description preview
- [ ] Grid layout (responsive)
- [ ] Jobs count displayed

---

## TC-16: Search Jobs by Title

**Priority:** High  
**Type:** Functional

### Prerequisites:
- At least 3 jobs with different titles exist

### Steps:
1. Login as consultant
2. Go to "Open Jobs" tab
3. Type "developer" in search box

### Expected Results:
- [ ] Jobs filtered in real-time
- [ ] Only jobs with "developer" in title/description/tech shown
- [ ] Job count updated
- [ ] Clear filter button appears

---

## TC-17: Filter Jobs by Experience

**Priority:** Medium  
**Type:** Functional

### Steps:
1. Login as consultant
2. Go to "Open Jobs" tab
3. Select "0-5 years" from experience dropdown

### Expected Results:
- [ ] Only jobs requiring ≤5 years shown
- [ ] Filter applied immediately
- [ ] Job count updated

---

## TC-18: Apply to Job - First Time

**Priority:** High  
**Type:** Functional

### Steps:
1. Login as consultant
2. Go to "Open Jobs" tab
3. Click "Apply Now" on any job
4. Upload resume (PDF file < 5MB)
5. Add cover letter: "I am interested in this position..."
6. Click "Submit Application"

### Expected Results:
- [ ] Application submitted successfully
- [ ] Success message displayed
- [ ] Dialog closes after 2 seconds
- [ ] "Applied" badge appears on job card
- [ ] Resume uploaded to backend/uploads/
- [ ] Submission created in database
- [ ] Application visible in "My Applications" tab

---

## TC-19: Apply to Job - PDF Resume

**Priority:** High  
**Type:** Functional

### Steps:
1. Apply to a job
2. Upload PDF resume

### Expected Results:
- [ ] PDF accepted
- [ ] File upload success
- [ ] Application submitted

---

## TC-20: Apply to Job - DOC Resume

**Priority:** Medium  
**Type:** Functional

### Steps:
1. Apply to a job
2. Upload .doc resume

### Expected Results:
- [ ] DOC accepted
- [ ] File upload success

---

## TC-21: Apply to Job - DOCX Resume

**Priority:** Medium  
**Type:** Functional

### Steps:
1. Apply to a job
2. Upload .docx resume

### Expected Results:
- [ ] DOCX accepted
- [ ] File upload success

---

## TC-22: Apply - Invalid File Type

**Priority:** Medium  
**Type:** Negative

### Steps:
1. Click "Apply Now" on a job
2. Try to upload .txt file

### Expected Results:
- [ ] File rejected
- [ ] Error message: "Please upload PDF, DOC, or DOCX file"
- [ ] Upload prevented

---

## TC-23: Apply - File Size Limit

**Priority:** Medium  
**Type:** Negative

### Steps:
1. Click "Apply Now" on a job
2. Try to upload file > 5MB

### Expected Results:
- [ ] File rejected
- [ ] Error message: "File size must be less than 5MB"
- [ ] Upload prevented

---

## TC-24: Apply to Same Job Twice

**Priority:** Low  
**Type:** Functional

### Steps:
1. Apply to a job successfully
2. Click "Apply Again" on same job
3. Upload new resume
4. Submit

### Expected Results:
- [ ] Application allowed
- [ ] Info message: "You have already applied..."
- [ ] New submission created
- [ ] New resume replaces old one

---

## TC-25: View My Applications - With Applications

**Priority:** High  
**Type:** Functional

### Prerequisites:
- Consultant has submitted at least 2 applications

### Steps:
1. Login as consultant
2. Go to "My Applications" tab

### Expected Results:
- [ ] All applications displayed
- [ ] Summary cards show correct counts:
  - Total
  - Pending (SUBMITTED + ON_HOLD)
  - Interviews
  - Offers
  - Joined
- [ ] Each application shows:
  - Job title
  - Submission date
  - Last update date
  - Status badge (color-coded)
  - Status message
  - Cover letter/comments
- [ ] Sorted by most recent first

---

## TC-26: View Applications - Empty State

**Priority:** Medium  
**Type:** Functional

### Steps:
1. Login as NEW consultant (no applications)
2. Go to "My Applications" tab

### Expected Results:
- [ ] Empty state message displayed
- [ ] Helpful tips shown:
  - Complete profile
  - Upload resume
  - Write cover letter
  - Apply to matching positions
- [ ] No errors

---

## TC-27: Search Applications by Job Title

**Priority:** Medium  
**Type:** Functional

### Prerequisites:
- Consultant has applications to different jobs

### Steps:
1. Go to "My Applications" tab
2. Type job title in search box

### Expected Results:
- [ ] Applications filtered in real-time
- [ ] Only matching applications shown
- [ ] Clear filter button appears

---

## TC-28: Filter Applications by Status

**Priority:** High  
**Type:** Functional

### Steps:
1. Go to "My Applications" tab
2. Select "INTERVIEW" from status dropdown

### Expected Results:
- [ ] Only INTERVIEW status applications shown
- [ ] Filter applied immediately
- [ ] Other statuses hidden

---

## TC-29: Application Status Colors

**Priority:** Low  
**Type:** Visual

### Steps:
1. View applications with different statuses

### Expected Results:
- [ ] SUBMITTED - Blue
- [ ] INTERVIEW - Yellow/Orange
- [ ] OFFER - Green
- [ ] JOINED - Green
- [ ] REJECTED - Red
- [ ] ON_HOLD - Gray
- [ ] WITHDRAWN - Gray

---

# 3. RECRUITER MODULE

## TC-30: Create Job Description

**Priority:** High  
**Type:** Functional

### Steps:
1. Login as recruiter
2. Go to "Jobs" tab
3. Click "Create New Job"
4. Fill form:
   - Title: "Senior React Developer"
   - Description: "We are looking for an experienced React developer..."
   - Tech Required: "React, TypeScript, Node.js"
   - Experience Required: "5"
   - Location: "Remote"
   - Visa: "Any"
5. Click "Create Job"

### Expected Results:
- [ ] Job created successfully
- [ ] Success message displayed
- [ ] Job appears in recruiter's job list
- [ ] Job visible to consultants (in Open Jobs)
- [ ] Status = "OPEN"
- [ ] Recruiter name attached to job
- [ ] Job shows "Posted by [Recruiter Name]" in consultant view

---

## TC-31: Edit Job Description

**Priority:** Medium  
**Type:** Functional

### Steps:
1. Login as recruiter
2. Go to "Jobs" tab
3. Click "Edit" on an existing job
4. Modify title or description
5. Click "Save"

### Expected Results:
- [ ] Job updated successfully
- [ ] Changes reflected immediately
- [ ] Updated in database
- [ ] Consultants see updated job

---

## TC-32: Close Job

**Priority:** Medium  
**Type:** Functional

### Steps:
1. Login as recruiter
2. Go to "Jobs" tab
3. Change job status to "CLOSED"
4. Save

### Expected Results:
- [ ] Job status changed to CLOSED
- [ ] Job no longer visible to consultants
- [ ] Still visible to recruiter (as CLOSED)
- [ ] Cannot receive new applications

---

## TC-33: View All Consultants

**Priority:** High  
**Type:** Functional

### Prerequisites:
- At least 2 consultants have created profiles

### Steps:
1. Login as recruiter
2. Go to "Consultants" tab

### Expected Results:
- [ ] List of ALL consultants displayed
- [ ] Table shows:
  - Name
  - Experience (years)
  - Tech Stack (badges)
  - Location
  - Availability badge
  - "View Profile" button
- [ ] Consultant count displayed
- [ ] All consultants visible (regardless of who posted jobs)

---

## TC-34: View Consultant Profile Details

**Priority:** Medium  
**Type:** Functional

### Steps:
1. Login as recruiter
2. Go to "Consultants" tab
3. Click "View Profile" on any consultant

### Expected Results:
- [ ] Dialog/modal opens
- [ ] Full profile displayed:
  - Name
  - Email
  - Phone (if available)
  - Experience years
  - All technical skills
  - Location
  - Visa status
  - Availability
  - Rating (if set)
- [ ] Can close dialog

---

## TC-35: View Submissions - Empty State

**Priority:** Medium  
**Type:** Functional

### Steps:
1. Login as NEW recruiter (no jobs/submissions)
2. Go to "Submissions" tab

### Expected Results:
- [ ] Empty state message shown
- [ ] "No submissions yet" message
- [ ] Helpful message about submissions appearing when consultants apply
- [ ] No errors

---

## TC-36: View All Submissions

**Priority:** High  
**Type:** Functional

### Prerequisites:
- Multiple consultants have applied to multiple recruiter's jobs

### Steps:
1. Login as recruiter
2. Go to "Submissions" tab

### Expected Results:
- [ ] All submissions displayed
- [ ] Summary cards show counts:
  - Total
  - New (unread)
  - Interview
  - Offer
  - Joined
- [ ] Table with columns:
  - **Consultant** (name + email)
  - **Job Details** (title + location + tech badges)
  - **Posted By** (recruiter name + email)
  - **Date** (date + time)
  - **Status** (badge)
  - **Resume** (download button)
  - **Actions** (dropdown)
- [ ] New/unread submissions highlighted (blue background)

---

## TC-37: Submission Details - Consultant Info

**Priority:** High  
**Type:** Functional

### Steps:
1. View submissions table
2. Check consultant column

### Expected Results:
- [ ] Consultant full name displayed
- [ ] Consultant email shown below name
- [ ] User icon displayed

---

## TC-38: Submission Details - Job Info

**Priority:** High  
**Type:** Functional

### Steps:
1. View submissions table
2. Check job details column

### Expected Results:
- [ ] Job title displayed
- [ ] Location shown with 📍 icon
- [ ] Tech stack shown as badges (first 3 + count)
- [ ] File icon shown

---

## TC-39: Submission Details - Posted By

**Priority:** High  
**Type:** Functional

### Steps:
1. Have Recruiter A create a job
2. Consultant applies to that job
3. Login as Recruiter B
4. View submissions

### Expected Results:
- [ ] "Posted By" column shows Recruiter A's name
- [ ] Shows Recruiter A's email
- [ ] NOT Recruiter B's name
- [ ] Correctly identifies job owner

---

## TC-40: Download Resume

**Priority:** High  
**Type:** Functional

### Steps:
1. Login as recruiter
2. Go to "Submissions" tab
3. Click "Download" button in Resume column

### Expected Results:
- [ ] Resume file downloads
- [ ] Correct filename
- [ ] File opens successfully
- [ ] Correct consultant's resume

---

## TC-41: Update Submission Status - Interview

**Priority:** High  
**Type:** Functional

### Steps:
1. Login as recruiter
2. Go to "Submissions" tab
3. Find submission with status "SUBMITTED"
4. Click Actions dropdown (⋮)
5. Select "Interview"

### Expected Results:
- [ ] Status updated to INTERVIEW
- [ ] Status badge changes color (yellow/orange)
- [ ] Table refreshes immediately
- [ ] Consultant sees updated status in their applications
- [ ] updated_at timestamp changed
- [ ] recruiter_read set to true

---

## TC-42: Update Status - Offer

**Priority:** High  
**Type:** Functional

### Steps:
1. Update submission status to "OFFER"

### Expected Results:
- [ ] Status = OFFER
- [ ] Badge color green
- [ ] Consultant notified

---

## TC-43: Update Status - Joined

**Priority:** Medium  
**Type:** Functional

### Steps:
1. Update submission status to "JOINED"

### Expected Results:
- [ ] Status = JOINED
- [ ] Badge color green
- [ ] Indicates successful hire

---

## TC-44: Update Status - Rejected

**Priority:** Medium  
**Type:** Functional

### Steps:
1. Update submission status to "REJECTED"

### Expected Results:
- [ ] Status = REJECTED
- [ ] Badge color red
- [ ] Consultant sees rejection status

---

## TC-45: Update Status - On Hold

**Priority:** Low  
**Type:** Functional

### Steps:
1. Update submission status to "ON_HOLD"

### Expected Results:
- [ ] Status = ON_HOLD
- [ ] Badge color gray

---

# 4. MULTI-USER SCENARIOS

## TC-46: Multiple Recruiters - Independent Jobs

**Priority:** High  
**Type:** Integration

### Steps:
1. Register Recruiter A (sarah.rec1@test.com)
2. Register Recruiter B (john.rec2@test.com)
3. Recruiter A creates "React Developer" job
4. Recruiter B creates "Python Developer" job
5. Consultant views jobs

### Expected Results:
- [ ] Consultant sees both jobs
- [ ] React job shows "Posted by Sarah"
- [ ] Python job shows "Posted by John"
- [ ] Each recruiter sees their own jobs in Jobs tab
- [ ] Both jobs are independent

---

## TC-47: Multiple Recruiters - Shared Consultant View

**Priority:** High  
**Type:** Integration

### Steps:
1. Consultant creates profile
2. Login as Recruiter A
3. View Consultants tab
4. Login as Recruiter B
5. View Consultants tab

### Expected Results:
- [ ] Both recruiters see the same consultant
- [ ] Profile details identical
- [ ] Both can view full profile
- [ ] Consultant count same for both

---

## TC-48: Multiple Recruiters - Submission Visibility

**Priority:** High  
**Type:** Integration

### Steps:
1. Recruiter A creates job
2. Recruiter B creates job
3. Consultant applies to both jobs
4. Login as Recruiter A - View submissions
5. Login as Recruiter B - View submissions

### Expected Results:
- [ ] Recruiter A sees submission to their job
- [ ] Shows "Posted by [A's name]"
- [ ] Recruiter B sees submission to their job
- [ ] Shows "Posted by [B's name]"
- [ ] Each sees correct "Posted By" name

---

## TC-49: Multiple Consultants

**Priority:** Medium  
**Type:** Integration

### Steps:
1. Register Consultant A
2. Register Consultant B
3. Register Consultant C
4. All create profiles
5. Login as recruiter

### Expected Results:
- [ ] Recruiter sees all 3 consultants
- [ ] Each profile distinct
- [ ] Can view each profile separately
- [ ] Count = 3 consultants

---

## TC-50: Application Lifecycle

**Priority:** High  
**Type:** End-to-End

### Steps:
1. Recruiter creates job
2. Consultant applies (status = SUBMITTED)
3. Consultant views application (sees SUBMITTED)
4. Recruiter updates to INTERVIEW
5. Consultant refreshes applications
6. Consultant sees INTERVIEW status
7. Recruiter updates to OFFER
8. Consultant sees OFFER status
9. Recruiter updates to JOINED
10. Consultant sees JOINED status

### Expected Results:
- [ ] Each status change reflected immediately
- [ ] Consultant always sees current status
- [ ] Status colors correct at each stage
- [ ] Timestamps updated
- [ ] No data loss

---

# 5. SECURITY & PERMISSIONS

## TC-51: Consultant Cannot Access Recruiter Dashboard

**Priority:** High  
**Type:** Security

### Steps:
1. Login as CONSULTANT
2. Try to access http://localhost:3000/recruiter-dashboard

### Expected Results:
- [ ] Access denied
- [ ] Redirected or error shown
- [ ] Dashboard not visible

---

## TC-52: Recruiter Cannot Access Consultant Dashboard

**Priority:** High  
**Type:** Security

### Steps:
1. Login as RECRUITER
2. Try to access http://localhost:3000/consultant-dashboard

### Expected Results:
- [ ] Access denied
- [ ] Redirected or error shown
- [ ] Dashboard not visible

---

## TC-53: API Endpoints Require Authentication

**Priority:** High  
**Type:** Security

### Steps:
1. WITHOUT logging in, try to access:
   - http://localhost:8000/api/consultants/me
   - http://localhost:8000/api/jobs

### Expected Results:
- [ ] 401 Unauthorized response
- [ ] Error message
- [ ] No data returned

---

## TC-54: Consultant Cannot Edit Other Profiles

**Priority:** High  
**Type:** Security

### Steps:
1. Login as Consultant A
2. Try to send PUT request to update Consultant B's profile (using API)

### Expected Results:
- [ ] Request rejected
- [ ] Error: Unauthorized
- [ ] Consultant B's profile unchanged

---

## TC-55: Recruiter Can Only Edit Own Jobs

**Priority:** Medium  
**Type:** Security

### Steps:
1. Recruiter A creates job
2. Login as Recruiter B
3. Try to edit Recruiter A's job

### Expected Results:
- [ ] Edit prevented
- [ ] Error message
- [ ] Job unchanged

---

# 6. UI/UX & RESPONSIVENESS

## TC-56: Mobile Responsiveness

**Priority:** Medium  
**Type:** Visual

### Steps:
1. Open application on mobile viewport (375px width)
2. Navigate through all pages

### Expected Results:
- [ ] Layout adjusts to mobile
- [ ] Content readable
- [ ] Buttons accessible
- [ ] Tables scrollable or stacked
- [ ] No horizontal overflow

---

## TC-57: Tablet Responsiveness

**Priority:** Low  
**Type:** Visual

### Steps:
1. Open application on tablet viewport (768px width)
2. Navigate through all pages

### Expected Results:
- [ ] Layout optimized for tablet
- [ ] Content properly sized
- [ ] Grid layouts adjust (2 columns)

---

## TC-58: Loading States

**Priority:** Medium  
**Type:** Visual

### Steps:
1. Navigate to pages with data loading:
   - Jobs list
   - Profile
   - Applications
   - Submissions

### Expected Results:
- [ ] Loading spinner visible
- [ ] "Loading..." or similar message
- [ ] No blank screens
- [ ] Spinner disappears when data loads

---

## TC-59: Error Messages Display

**Priority:** Medium  
**Type:** Visual

### Steps:
1. Trigger various errors:
   - Invalid login
   - Failed file upload
   - Network error

### Expected Results:
- [ ] Error messages visible
- [ ] Red color or error styling
- [ ] Clear, helpful message
- [ ] Error icon (if applicable)

---

## TC-60: Success Messages

**Priority:** Low  
**Type:** Visual

### Steps:
1. Perform successful actions:
   - Save profile
   - Submit application
   - Create job

### Expected Results:
- [ ] Success message visible
- [ ] Green color
- [ ] Check icon
- [ ] Auto-dismiss after 3 seconds (if applicable)

---

# 7. PERFORMANCE

## TC-61: Page Load Time

**Priority:** Medium  
**Type:** Performance

### Steps:
1. Clear cache
2. Load home page
3. Measure load time

### Expected Results:
- [ ] Page loads < 2 seconds
- [ ] No console errors
- [ ] All resources load

---

## TC-62: Large Data Set - Jobs

**Priority:** Low  
**Type:** Performance

### Prerequisites:
- Create 50+ jobs

### Steps:
1. Login as consultant
2. Go to Open Jobs tab
3. Scroll through all jobs

### Expected Results:
- [ ] List loads quickly (< 3 seconds)
- [ ] Scrolling smooth
- [ ] Search filters work fast
- [ ] No lag

---

## TC-63: Large Data Set - Submissions

**Priority:** Low  
**Type:** Performance

### Prerequisites:
- Create 30+ submissions

### Steps:
1. Login as recruiter
2. Go to Submissions tab
3. Scroll through table

### Expected Results:
- [ ] Table loads quickly
- [ ] Scrolling smooth
- [ ] All data visible
- [ ] No performance issues

---

# 8. DATABASE VERIFICATION

## TC-64: User Data Stored Correctly

**Priority:** High  
**Type:** Data Integrity

### Steps:
1. Register a new user
2. Check MongoDB `users` collection

### Expected Results:
- [ ] User document created
- [ ] Password is hashed (not plain text)
- [ ] Email stored lowercase
- [ ] Role field correct
- [ ] Timestamps present (created_at, updated_at)

---

## TC-65: Profile Data Stored

**Priority:** High  
**Type:** Data Integrity

### Steps:
1. Consultant creates profile
2. Check MongoDB `consultants` collection

### Expected Results:
- [ ] Consultant document created
- [ ] user_id references correct user
- [ ] tech_stack is array
- [ ] experience_years is number
- [ ] All fields match input

---

## TC-66: Job Data Stored

**Priority:** High  
**Type:** Data Integrity

### Steps:
1. Recruiter creates job
2. Check MongoDB `job_descriptions` collection

### Expected Results:
- [ ] Job document created
- [ ] recruiter_id references correct recruiter
- [ ] tech_required is array
- [ ] status = "OPEN"
- [ ] Timestamps present

---

## TC-67: Submission Data Stored

**Priority:** High  
**Type:** Data Integrity

### Steps:
1. Consultant applies to job
2. Check MongoDB `submissions` collection

### Expected Results:
- [ ] Submission document created
- [ ] consultant_id correct
- [ ] recruiter_id correct
- [ ] jd_id correct
- [ ] resume_path points to uploaded file
- [ ] status = "SUBMITTED"
- [ ] File exists at resume_path

---

## TC-68: File Upload Storage

**Priority:** High  
**Type:** Data Integrity

### Steps:
1. Upload resume
2. Check backend/uploads/ folder

### Expected Results:
- [ ] File saved in uploads folder
- [ ] Filename unique (no overwrites)
- [ ] File size matches uploaded
- [ ] File is readable

---

# TEST SUMMARY

## Critical Path (Must Pass)
1. TC-01, TC-02 - User Registration
2. TC-06 - User Login
3. TC-11 - Create Profile
4. TC-15 - View Jobs
5. TC-18 - Apply to Job
6. TC-30 - Create Job
7. TC-36 - View Submissions
8. TC-41 - Update Status
9. TC-50 - Application Lifecycle

## Priority Levels
- **High Priority:** 42 test cases
- **Medium Priority:** 19 test cases
- **Low Priority:** 7 test cases

## Coverage
- Authentication: 10 tests
- Consultant Features: 19 tests
- Recruiter Features: 16 tests
- Multi-User: 5 tests
- Security: 5 tests
- UI/UX: 5 tests
- Performance: 3 tests
- Database: 5 tests

---

## Test Execution Notes

### Before Testing:
- [ ] Install all dependencies
- [ ] Start MongoDB
- [ ] Start backend server
- [ ] Start frontend server
- [ ] Clear browser cache
- [ ] Prepare test files (resumes)

### During Testing:
- [ ] Note any bugs in separate document
- [ ] Take screenshots of failures
- [ ] Check browser console for errors
- [ ] Monitor network tab for API errors

### After Testing:
- [ ] Report pass/fail for each test
- [ ] Log all bugs with steps to reproduce
- [ ] Note performance issues
- [ ] Suggest improvements

---

**End of Test Cases Document**
