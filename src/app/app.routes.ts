import { Routes } from '@angular/router';
import { SignupComponent } from './features/auth/signup/signup.component';
import { LoginComponent } from './features/auth/login/login.component';
import { SeekerDashboardComponent } from './features/dashboard/seeker/seeker-dashboard.component';
import { RecruiterDashboardComponent } from './features/dashboard/recruiter/recruiter-dashboard.component';
import { SeekerProfileComponent } from './features/dashboard/seeker/profile/seeker-profile.component';
import { SeekerLayoutComponent } from './features/dashboard/seeker/layout/seeker-layout.component';
import { FindJobsComponent } from './features/dashboard/seeker/find-jobs/find-jobs.component';
import { JobDetailsComponent } from './features/dashboard/seeker/job-details/job-details.component';
import { ApplicationsComponent } from './features/dashboard/seeker/applications/applications.component';
import { SavedJobsComponent } from './features/dashboard/seeker/saved-jobs/saved-jobs.component';
import { RecruiterLayoutComponent } from './features/dashboard/recruiter/layout/recruiter-layout.component';
import { RecruiterProfileComponent } from './features/dashboard/recruiter/profile/recruiter-profile.component';
import { RecruiterListingsComponent } from './features/dashboard/recruiter/listings/recruiter-listings.component';
import { PostJobComponent } from './features/dashboard/recruiter/post-job/post-job.component';
import { ManageApplicantsComponent } from './features/dashboard/recruiter/manage-applicants/manage-applicants.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'signup',
    pathMatch: 'full'
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'dashboard/seeker',
    component: SeekerLayoutComponent,
    children: [
      {
        path: '',
        component: SeekerDashboardComponent
      },
      {
        path: 'profile',
        component: SeekerProfileComponent
      },
      {
        path: 'find-jobs',
        component: FindJobsComponent
      },
      {
        path: 'find-jobs/:id',
        component: JobDetailsComponent
      },
      {
        path: 'applications',
        component: ApplicationsComponent
      },
      {
        path: 'saved-jobs',
        component: SavedJobsComponent
      }
    ]
  },
  {
    path: 'dashboard/recruiter',
    component: RecruiterLayoutComponent,
    children: [
      {
        path: '',
        component: RecruiterDashboardComponent
      },
      {
        path: 'profile',
        component: RecruiterProfileComponent
      },
      {
        path: 'listings',
        component: RecruiterListingsComponent
      },
      {
        path: 'post-job',
        component: PostJobComponent
      },
      {
        path: 'applicants',
        component: ManageApplicantsComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'signup'
  }
];

