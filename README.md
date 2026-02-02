# 🚀 CareerConnect

A modern job portal platform built with Angular 19, connecting job seekers with recruiters through an intelligent, AI-powered interface.

## ✨ Features

### 👤 For Job Seekers

- **Smart Job Search** - Find jobs with advanced filters (location, type, salary)
- **AI-Powered Recommendations** - Get personalized job suggestions based on your profile
- **AI Career Review** - Instant compatibility analysis between your profile and job requirements
- **Application Management** - Track applications with status filters (Shortlisted, Interview, Hired, etc.)
- **Profile Builder** - Create comprehensive profiles with skills, bio, and resume
- **Saved Jobs** - Bookmark interesting positions for later review
- **Application Dashboard** - View application statistics and recent activities

### 💼 For Recruiters

- **Job Posting** - Create and manage job listings with rich text descriptions
- **Applicant Management** - Review and filter candidates by status
- **Job Analytics** - Track applications, views, and shortlisted candidates
- **Profile Management** - Manage company profile and contact information
- **Job Status Control** - Pause, resume, close, or reopen job postings
- **Dashboard Overview** - Real-time statistics on active jobs and applicants

## 🛠️ Tech Stack

- **Frontend**: Angular 19.2.0 (Standalone Components)
- **Styling**: Tailwind CSS
- **Rich Text**: Quill Editor
- **Charts**: NGX Charts
- **Icons**: Font Awesome
- **Backend API**: Spring Boot (http://localhost:9090)

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Angular CLI (`npm install -g @angular/cli`)
- Backend API running on port 9090

## 🚀 Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   ng serve
   ```

3. **Open browser**
   Navigate to `http://localhost:4200`

## 🎯 Key Features Implemented

### Authentication
- Role-based login (Seeker/Recruiter)
- Secure signup with validation
- Session management

### Job Management
- Advanced search and filtering
- Real-time job recommendations
- Bookmark/save functionality
- Rich job descriptions with HTML support

### AI Integration
- Profile-to-job matching algorithm
- Compatibility scoring (skills, experience, profile)
- AI-powered career insights and recommendations

### User Experience
- Toast notifications for all actions
- Responsive design for all screen sizes
- Loading states and error handling
- Empty states with helpful CTAs
- Status-based filtering and navigation

### Profile Management
- Resume and avatar uploads
- Skills management with auto-deduplication
- Profile completion tracking
- AI feedback on profile strength

## 📁 Project Structure

```
src/
├── app/
│   ├── features/
│   │   ├── auth/              # Login & Signup
│   │   └── dashboard/
│   │       ├── seeker/        # Job seeker features
│   │       └── recruiter/     # Recruiter features
│   ├── shared/
│   │   ├── components/        # Reusable UI components
│   │   ├── services/          # API services
│   │   └── models/            # TypeScript interfaces
│   └── app.routes.ts          # Application routing
└── styles/                    # Global styles
```

## 🎨 Design Highlights

- Clean, modern UI with gradient accents
- Consistent color scheme (Indigo/Purple/Slate)
- Smooth animations and transitions
- Intuitive navigation and user flows
- Professional dashboard layouts

## 🔧 Configuration

Backend API URL: `http://localhost:9090/api`

## 🏗️ Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory.

---

Built with ❤️ using Angular
