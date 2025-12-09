# Test Cases - Consultant Tracker Application

**Version:** 2.0  
**Date:** Updated - December 2025  
**Environment:** Development  
**Last Updated:** Includes enhanced profile features, recruiter profiles, and database restructuring  
**URLs:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## Prerequisites

### Test Data Required
- **Test Emails:** Use unique emails for each test user
- **Test Resume:** Prepare PDF, DOC, and DOCX files (< 10MB for profile, < 5MB for applications)
- **Test Skills:** "React, Python, AWS, Docker, Node.js"
- **Test URLs:** Valid LinkedIn, GitHub, and Portfolio URLs

### How to Start
1. Start Backend: `cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`
2. Start Frontend: `cd frontend && npm start`
3. Clear browser cache before testing
4. Ensure MongoDB is running and database is initialized

---

## Application Features Overview

### Consultant Features
1. **Enhanced Profile Management:**
   - Basic profile (Tech Stack, Experience, Location, Visa Status, Availability)
   - Professional Summary (up to 2000 characters)
   - Contact Links (LinkedIn, GitHub, Portfolio URLs)
   - Education Details (Degree, University, Graduation Year)
   - Certifications (multiple, add/remove)
   - Phone Number (editable)
   - Resume Upload/Download (PDF, DOC, DOCX, max 10MB)
   - Skill Proficiency Levels (Beginner, Intermediate, Advanced, Expert)
   - Profile Completeness Indicator
   - Application Statistics Dashboard

2. **Job Management:**
   - Browse Open Jobs
   - Search and Filter Jobs
   - Apply to Jobs with Resume Upload
   - View Application Status

3. **Application Tracking:**
   - View All Applications
   - Filter by Status
   - Search Applications
   - View Application Statistics

### Recruiter Features
1. **Profile Management:**
   - Company/Organization Name
   - Phone Number
   - Location
   - LinkedIn Profile URL
   - Bio/About Section (up to 1000 characters)
   - Profile Completeness Indicator

2. **Job Management:**
   - Create Job Descriptions
   - Edit Jobs
   - Close/Open Jobs
   - View All Jobs

3. **Consultant Management:**
   - View All Consultants
   - View Enhanced Consultant Profiles:
     - Professional Summary
     - Contact Links (clickable)
     - Education Details
     - Certifications
     - Skill Proficiency Levels
     - Resume Download
   - Search and Filter Consultants

4. **Submission Management:**
   - View All Submissions
   - Filter by Status
   - Update Submission Status
   - Download Resumes
   - View Submission Details

### Database Structure
- **Collections:**
  - `recruiters` - Recruiter user accounts
  - `consultants` - Consultant user accounts
  - `admins` - Admin user accounts
  - `consultant_profiles` - Consultant professional profiles
  - `job_descriptions` - Job postings
  - `submissions` - Job applications (with embedded status_history)
  - `users` - Unified view of all users

### Security Features
- JWT-based Authentication
- Role-based Access Control
- Protected API Endpoints
- Password Hashing
- File Upload Validation

### Additional Features
- Application Statistics (for consultants)
- Profile Completeness Tracking
- Real-time Status Updates
- File Upload/Download
- Responsive UI Design

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

## TC-11A: Add Professional Summary to Profile

**Priority:** High  
**Type:** Functional

### Steps:
1. Login as consultant
2. Go to "My Profile" tab
3. Scroll to "Professional Summary" section
4. Enter summary: "Experienced full-stack developer with 5+ years..."
5. Verify character counter shows "X/2000 characters"
6. Click "Save Profile"

### Expected Results:
- [ ] Professional summary saved successfully
- [ ] Character counter updates in real-time
- [ ] Summary displayed in profile
- [ ] Summary visible to recruiters when viewing profile
- [ ] Profile completeness increases

---

## TC-11B: Add Contact Links to Profile

**Priority:** High  
**Type:** Functional

### Steps:
1. Login as consultant
2. Go to "My Profile" tab
3. Scroll to "Contact Links" section
4. Enter:
   - LinkedIn: "https://linkedin.com/in/johndoe"
   - GitHub: "https://github.com/johndoe"
   - Portfolio: "https://johndoe.dev"
5. Click "Save Profile"

### Expected Results:
- [ ] All links saved successfully
- [ ] Links validated (URL format)
- [ ] Links visible in profile
- [ ] Links clickable in recruiter view (open in new tab)
- [ ] Profile completeness increases

---

## TC-11C: Add Education Details to Profile

**Priority:** High  
**Type:** Functional

### Steps:
1. Login as consultant
2. Go to "My Profile" tab
3. Scroll to "Education" section
4. Fill in:
   - Degree: "Master's"
   - University: "MIT"
   - Graduation Year: "2020"
5. Click "Save Profile"

### Expected Results:
- [ ] Education details saved successfully
- [ ] All fields saved correctly
- [ ] Education visible in profile
- [ ] Education visible to recruiters in profile view
- [ ] Profile completeness increases

---

## TC-11D: Add Certifications to Profile

**Priority:** Medium  
**Type:** Functional

### Steps:
1. Login as consultant
2. Go to "My Profile" tab
3. Scroll to "Certifications" section
4. Enter certification: "AWS Certified Solutions Architect"
5. Click "+" button to add
6. Add another: "Google Cloud Professional"
7. Click "Save Profile"

### Expected Results:
- [ ] Certifications added as badges
- [ ] Can add multiple certifications
- [ ] Can remove certifications (X button)
- [ ] Certifications saved to database
- [ ] Certifications visible to recruiters
- [ ] Profile completeness increases

---

## TC-11E: Update Phone Number in Profile

**Priority:** High  
**Type:** Functional

### Steps:
1. Login as consultant
2. Go to "My Profile" tab
3. Scroll to "Phone Number" section
4. Enter phone: "+1 (555) 123-4567"
5. Click "Save Profile"

### Expected Results:
- [ ] Phone number saved successfully
- [ ] Phone number displayed in profile info card
- [ ] Phone number visible to recruiters
- [ ] Phone number updated in user collection
- [ ] Profile completeness increases

---

## TC-11F: Upload Resume to Profile

**Priority:** High  
**Type:** Functional

### Steps:
1. Login as consultant
2. Go to "My Profile" tab
3. Scroll to "Resume" section
4. Click "Choose File" and select a PDF resume (< 10MB)
5. Click "Upload" button
6. Wait for upload to complete

### Expected Results:
- [ ] Resume uploaded successfully
- [ ] Success message displayed
- [ ] Resume filename displayed
- [ ] "Download" button appears
- [ ] Resume saved in backend/uploads/resumes/
- [ ] Profile completeness increases
- [ ] Resume path stored in database

---

## TC-11G: Download Resume from Profile

**Priority:** Medium  
**Type:** Functional

### Prerequisites:
- Consultant has uploaded a resume

### Steps:
1. Login as consultant
2. Go to "My Profile" tab
3. Scroll to "Resume" section
4. Click "Download" button

### Expected Results:
- [ ] Resume file downloads
- [ ] Correct filename
- [ ] File opens successfully
- [ ] File content matches uploaded file

---

## TC-11H: Replace Existing Resume

**Priority:** Medium  
**Type:** Functional

### Prerequisites:
- Consultant has an existing resume uploaded

### Steps:
1. Login as consultant
2. Go to "My Profile" tab
3. Scroll to "Resume" section
4. Upload a new resume file
5. Click "Upload"

### Expected Results:
- [ ] New resume uploaded successfully
- [ ] Old resume replaced
- [ ] New filename displayed
- [ ] Old file deleted from server (optional)
- [ ] Database updated with new resume path

---

## TC-11I: View Application Statistics

**Priority:** High  
**Type:** Functional

### Prerequisites:
- Consultant has submitted at least 3 applications with different statuses

### Steps:
1. Login as consultant
2. Go to "My Profile" tab
3. View "Application Statistics" section at the top

### Expected Results:
- [ ] Statistics cards displayed:
  - Total Applications
  - Pending (SUBMITTED + ON_HOLD)
  - Interviews
  - Offers
  - Joined
  - Rejected
  - Success Rate (%)
- [ ] All counts are accurate
- [ ] Success rate calculated correctly: (JOINED + OFFER) / Total * 100
- [ ] Statistics update when applications change

---

## TC-11J: Add Skill Proficiency Levels

**Priority:** High  
**Type:** Functional

### Steps:
1. Login as consultant
2. Go to "My Profile" tab
3. Scroll to "Technical Skills" section
4. Enter skill: "React"
5. Select proficiency: "Advanced" from dropdown
6. Click "+" button
7. Add another skill: "Python" with "Expert" proficiency
8. Click "Save Profile"

### Expected Results:
- [ ] Skills added with proficiency levels
- [ ] Proficiency dropdown works for each skill
- [ ] Skills displayed with proficiency badges (color-coded)
- [ ] Can update proficiency for existing skills
- [ ] Proficiency saved to database
- [ ] Proficiency visible to recruiters
- [ ] Profile completeness increases when all skills have proficiency

---

## TC-11K: Profile Completeness Calculation

**Priority:** Medium  
**Type:** Functional

### Steps:
1. Login as consultant
2. Go to "My Profile" tab
3. Observe profile completeness percentage
4. Fill in different fields and observe completeness change

### Expected Results:
- [ ] Completeness calculated correctly:
  - Tech Stack: 10%
  - Experience: 10%
  - Location: 5%
  - Visa Status: 5%
  - Professional Summary: 10%
  - Contact Links (at least one): 10%
  - Education: 10%
  - Certifications: 5%
  - Phone: 5%
  - Resume: 10%
  - Skill Proficiency (all skills): 10%
- [ ] Completeness bar updates in real-time
- [ ] Percentage displayed correctly
- [ ] Maximum 100%

---

## TC-11L: Resume Upload - Invalid File Type

**Priority:** Medium  
**Type:** Negative

### Steps:
1. Login as consultant
2. Go to "My Profile" tab
3. Scroll to "Resume" section
4. Try to upload .txt file

### Expected Results:
- [ ] File rejected
- [ ] Error message: "Only PDF, DOC, or DOCX files are allowed"
- [ ] Upload prevented
- [ ] No file saved

---

## TC-11M: Resume Upload - File Size Limit

**Priority:** Medium  
**Type:** Negative

### Steps:
1. Login as consultant
2. Go to "My Profile" tab
3. Scroll to "Resume" section
4. Try to upload file > 10MB

### Expected Results:
- [ ] File rejected
- [ ] Error message: "File size must be less than 10MB"
- [ ] Upload prevented

---

## TC-11N: Professional Summary Character Limit

**Priority:** Low  
**Type:** Functional

### Steps:
1. Login as consultant
2. Go to "My Profile" tab
3. Scroll to "Professional Summary"
4. Enter text exceeding 2000 characters

### Expected Results:
- [ ] Character counter shows "2000/2000"
- [ ] Input prevented after 2000 characters
- [ ] Warning message (if applicable)

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

## TC-29A: Create Recruiter Profile - First Time

**Priority:** High  
**Type:** Functional

### Steps:
1. Login as recruiter
2. Go to "My Profile" tab
3. Fill in the form:
   - Company Name: "Tech Recruiters Inc"
   - Phone: "+1 (555) 987-6543"
   - Location: "San Francisco, CA"
   - LinkedIn: "https://linkedin.com/in/recruiter"
   - Bio: "Experienced recruiter specializing in tech roles..."
4. Click "Save Profile"

### Expected Results:
- [ ] Success message displayed (green)
- [ ] Profile saved to database
- [ ] All fields displayed in profile info card
- [ ] Profile completeness indicator updated
- [ ] Page refreshes with saved data

---

## TC-29B: Update Recruiter Profile

**Priority:** High  
**Type:** Functional

### Steps:
1. Login as recruiter with existing profile
2. Go to "My Profile" tab
3. Modify:
   - Change Company Name to "New Company Name"
   - Update Bio
   - Add Location
4. Click "Save Profile"

### Expected Results:
- [ ] Success message displayed
- [ ] Updated data shown immediately
- [ ] Database updated with new values
- [ ] Profile completeness updated

---

## TC-29C: Recruiter Profile - Company Name

**Priority:** High  
**Type:** Functional

### Steps:
1. Login as recruiter
2. Go to "My Profile" tab
3. Enter company name: "ABC Technologies"
4. Click "Save Profile"
5. Check profile info card

### Expected Results:
- [ ] Company name saved
- [ ] Company name displayed with building icon
- [ ] Company name visible in profile info card

---

## TC-29D: Recruiter Profile - Phone Number

**Priority:** High  
**Type:** Functional

### Steps:
1. Login as recruiter
2. Go to "My Profile" tab
3. Enter phone: "+1 (555) 123-4567"
4. Click "Save Profile"

### Expected Results:
- [ ] Phone number saved
- [ ] Phone number displayed with phone icon
- [ ] Phone number visible in profile info card
- [ ] Phone number updated in user collection

---

## TC-29E: Recruiter Profile - Location

**Priority:** Medium  
**Type:** Functional

### Steps:
1. Login as recruiter
2. Go to "My Profile" tab
3. Enter location: "New York, NY"
4. Click "Save Profile"

### Expected Results:
- [ ] Location saved
- [ ] Location displayed with map pin icon
- [ ] Location visible in profile info card

---

## TC-29F: Recruiter Profile - LinkedIn URL

**Priority:** Medium  
**Type:** Functional

### Steps:
1. Login as recruiter
2. Go to "My Profile" tab
3. Enter LinkedIn URL: "https://linkedin.com/in/recruiterprofile"
4. Click "Save Profile"

### Expected Results:
- [ ] LinkedIn URL saved
- [ ] URL validated (must be valid URL format)
- [ ] LinkedIn link visible in profile

---

## TC-29G: Recruiter Profile - Bio/About

**Priority:** Medium  
**Type:** Functional

### Steps:
1. Login as recruiter
2. Go to "My Profile" tab
3. Scroll to "Bio/About" section
4. Enter bio: "I am an experienced recruiter with 10+ years..."
5. Verify character counter shows "X/1000 characters"
6. Click "Save Profile"

### Expected Results:
- [ ] Bio saved successfully
- [ ] Character counter updates in real-time
- [ ] Bio displayed in profile
- [ ] Maximum 1000 characters

---

## TC-29H: Recruiter Profile Completeness

**Priority:** Low  
**Type:** Functional

### Steps:
1. Login as recruiter
2. Go to "My Profile" tab
3. Observe profile completeness percentage
4. Fill in different fields and observe completeness change

### Expected Results:
- [ ] Completeness calculated correctly:
  - Company Name: 25%
  - Phone: 20%
  - LinkedIn: 15%
  - Bio: 20%
  - Location: 20%
- [ ] Completeness bar updates in real-time
- [ ] Percentage displayed correctly
- [ ] Maximum 100%

---

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

## TC-34A: View Consultant Profile - Professional Summary

**Priority:** High  
**Type:** Functional

### Prerequisites:
- Consultant has added professional summary

### Steps:
1. Login as recruiter
2. Go to "Consultants" tab
3. Click "View Profile" on consultant with summary
4. Check for professional summary section

### Expected Results:
- [ ] Professional summary displayed in dialog
- [ ] Summary text readable and formatted
- [ ] Summary appears at top of profile details

---

## TC-34B: View Consultant Profile - Contact Links

**Priority:** High  
**Type:** Functional

### Prerequisites:
- Consultant has added LinkedIn, GitHub, or Portfolio links

### Steps:
1. Login as recruiter
2. Go to "Consultants" tab
3. Click "View Profile" on consultant with links
4. Check contact links section

### Expected Results:
- [ ] Contact links displayed
- [ ] Links are clickable
- [ ] Links open in new tab (external link icon)
- [ ] LinkedIn, GitHub, Portfolio links shown if available

---

## TC-34C: View Consultant Profile - Education

**Priority:** Medium  
**Type:** Functional

### Prerequisites:
- Consultant has added education details

### Steps:
1. Login as recruiter
2. Go to "Consultants" tab
3. Click "View Profile" on consultant with education
4. Check education section

### Expected Results:
- [ ] Education section displayed
- [ ] Degree shown
- [ ] University name shown
- [ ] Graduation year shown
- [ ] All fields formatted nicely

---

## TC-34D: View Consultant Profile - Certifications

**Priority:** Medium  
**Type:** Functional

### Prerequisites:
- Consultant has added certifications

### Steps:
1. Login as recruiter
2. Go to "Consultants" tab
3. Click "View Profile" on consultant with certifications
4. Check certifications section

### Expected Results:
- [ ] Certifications section displayed
- [ ] All certifications shown as badges
- [ ] Multiple certifications displayed correctly

---

## TC-34E: View Consultant Profile - Skill Proficiency

**Priority:** High  
**Type:** Functional

### Prerequisites:
- Consultant has added skills with proficiency levels

### Steps:
1. Login as recruiter
2. Go to "Consultants" tab
3. Click "View Profile" on consultant with skill proficiency
4. Check technical skills section

### Expected Results:
- [ ] Skills displayed with proficiency badges
- [ ] Proficiency levels color-coded:
  - Expert: Purple
  - Advanced: Blue
  - Intermediate: Green
  - Beginner: Yellow
- [ ] Each skill shows its proficiency level

---

## TC-34F: Download Consultant Resume from Profile

**Priority:** High  
**Type:** Functional

### Prerequisites:
- Consultant has uploaded a resume

### Steps:
1. Login as recruiter
2. Go to "Consultants" tab
3. Click "View Profile" on consultant with resume
4. Click "Download Resume" button

### Expected Results:
- [ ] Resume section displayed in profile
- [ ] "Download Resume" button visible
- [ ] Resume file downloads when clicked
- [ ] Correct filename
- [ ] File opens successfully

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
2. Check MongoDB `consultant_profiles` collection

### Expected Results:
- [ ] Consultant profile document created
- [ ] consultant_id references correct consultant user
- [ ] tech_stack is array
- [ ] experience_years is number
- [ ] All fields match input
- [ ] professional_summary stored (if provided)
- [ ] linkedin_url, github_url, portfolio_url stored (if provided)
- [ ] education object stored (if provided)
- [ ] certifications array stored (if provided)
- [ ] tech_stack_proficiency object stored (if provided)
- [ ] resume_path stored (if resume uploaded)

---

## TC-65A: Recruiter Profile Data Stored

**Priority:** High  
**Type:** Data Integrity

### Steps:
1. Recruiter creates profile
2. Check MongoDB `recruiters` collection

### Expected Results:
- [ ] Recruiter document updated with profile fields
- [ ] company_name stored (if provided)
- [ ] phone stored (if provided)
- [ ] linkedin_url stored (if provided)
- [ ] bio stored (if provided)
- [ ] location stored (if provided)
- [ ] All fields match input

---

## TC-65B: Database Structure - Separate Collections

**Priority:** High  
**Type:** Data Integrity

### Steps:
1. Check MongoDB collections
2. Verify collection structure

### Expected Results:
- [ ] `recruiters` collection exists
- [ ] `consultants` collection exists (for consultant users)
- [ ] `admins` collection exists
- [ ] `consultant_profiles` collection exists
- [ ] `users` collection exists (unified view)
- [ ] All collections have proper indexes
- [ ] No `applications`, `interviews`, `status_updates` collections (removed)

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
3. TC-11 - Create Consultant Profile (Basic)
4. TC-11A - Professional Summary
5. TC-11E - Phone Number
6. TC-11F - Resume Upload
7. TC-11I - Application Statistics
8. TC-11J - Skill Proficiency
9. TC-15 - View Jobs
10. TC-18 - Apply to Job
11. TC-29A - Create Recruiter Profile
12. TC-30 - Create Job
13. TC-34A-F - View Enhanced Consultant Profile (Recruiter)
14. TC-36 - View Submissions
15. TC-41 - Update Status
16. TC-50 - Application Lifecycle

## Priority Levels
- **High Priority:** 55 test cases
- **Medium Priority:** 28 test cases
- **Low Priority:** 7 test cases

## Coverage
- Authentication: 10 tests
- Consultant Features: 32 tests (19 original + 13 new)
- Recruiter Features: 25 tests (16 original + 9 new)
- Multi-User: 5 tests
- Security: 5 tests
- UI/UX: 5 tests
- Performance: 3 tests
- Database: 5 tests
- **Total: 90 test cases**

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
- [ ] Test all new profile features (consultant and recruiter)
- [ ] Verify application statistics accuracy
- [ ] Test resume upload/download functionality
- [ ] Verify skill proficiency display
- [ ] Check profile completeness calculations

### After Testing:
- [ ] Report pass/fail for each test
- [ ] Log all bugs with steps to reproduce
- [ ] Note performance issues
- [ ] Suggest improvements

---

**End of Test Cases Document**
