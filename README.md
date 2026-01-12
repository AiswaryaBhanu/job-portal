# Job Portal (MVP)

A role-based Job Portal web application where Recruiters can post/delete job openings and view applicants list and Job Seekers can browse/apply/withdraw applications.

## Live Demo
https://job-portal-xi-taupe.vercel.app

## Features

### Job Seeker
- Signup/Login
- Browse jobs with filters (search, location, type, category)
- View Job Details
- Easy Apply
- Withdraw application
- Job Seeker Profile page
- Job Seeker Dashboard (My Applications)

### Recruiter
- Signup/Login as Recruiter
- Recruiter Profile
- Post job openings
- Recruiter Dashboard (My Jobs)
- Delete jobs (only jobs posted by the recruiter)
- View Applicants list for each job

## Security
- Firebase Authentication (Email/Password)
- Firestore Rules with role-based access:
  - Only recruiters can post jobs
  - Only job seekers can apply
  - Recruiters can delete only their own jobs
  - Users can read/write only their own profile data

## Tech Stack
- **Frontend:** React (Vite), React Router DOM
- **Styling:** Tailwind CSS
- **Backend / Database:** Firebase Firestore
- **Auth:** Firebase Authentication
- **Hosting:** Vercel

## Firestore Collections
- `users/{uid}` → user profile + role
- `jobs/{jobId}` → job postings
- `applications/{jobId_uid}` → job applications

## Setup Locally
```bash
git clone https://github.com/AiswaryaBhanu/job-portal.git
cd job-portal
npm install
npm run dev
