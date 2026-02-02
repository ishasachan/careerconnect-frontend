import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { JobService } from '../../../../shared/services/job.service';
import { AuthService } from '../../../../shared/services/auth.service';
import Quill from 'quill';

@Component({
  selector: 'app-post-job',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './post-job.component.html',
  styleUrl: './post-job.component.css',
})
export class PostJobComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('editor') editorElement!: ElementRef;
  @ViewChild('requirementsEditor') requirementsEditorElement!: ElementRef;
  private quill: Quill | null = null;
  private requirementsQuill: Quill | null = null;

  editJobId: number | null = null;
  isEditMode = false;
  isLoadingJob = false;
  job = {
    title: '',
    company: '',
    location: '',
    salary: '',
    currency: 'USD',
    type: 'FULL-TIME',
    description: '',
    requirements: '',
    department: '',
  };

  isPosting = false;
  successMessage = '';
  errorMessage = '';

  jobTypes = ['FULL-TIME', 'PART-TIME', 'CONTRACT', 'INTERNSHIP'];
  currencies = [
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private jobService: JobService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    // Check if editing existing job
    this.route.queryParams.subscribe((params) => {
      if (params['id']) {
        this.editJobId = +params['id'];
        this.isEditMode = true;
        this.loadJobData(this.editJobId);
      }
    });
  }

  loadJobData(jobId: number) {
    this.isLoadingJob = true;
    this.jobService.getJobById(jobId).subscribe({
      next: (response) => {
        this.isLoadingJob = false;
        if (response.success && response.data) {
          const jobData = response.data;

          // Extract currency from salary
          let salaryValue = jobData.salary || '';
          let currency = 'USD';

          if (salaryValue.startsWith('₹')) {
            currency = 'INR';
            salaryValue = salaryValue.substring(1);
          } else if (salaryValue.startsWith('A$')) {
            currency = 'AUD';
            salaryValue = salaryValue.substring(2);
          } else if (salaryValue.startsWith('$')) {
            currency = 'USD';
            salaryValue = salaryValue.substring(1);
          }

          this.job = {
            title: jobData.title || '',
            company: jobData.company || '',
            location: jobData.location || '',
            salary: salaryValue,
            currency: currency,
            type: jobData.type || 'FULL-TIME',
            description: jobData.description || '',
            requirements: jobData.requirements || '',
            department: jobData.department || '',
          };

          // Initialize Quill editors after data is loaded
          setTimeout(() => {
            this.initializeQuillEditors();
          }, 200);
        }
      },
      error: (error) => {
        this.isLoadingJob = false;
        console.error('Error loading job:', error);
        this.errorMessage = 'Failed to load job data. Please try again.';
      },
    });
  }

  ngAfterViewInit() {
    // Check if editors are available in the DOM before initializing
    if (!this.editorElement || !this.requirementsEditorElement) {
      // If not available (e.g., loading state), try again after a short delay
      setTimeout(() => this.initializeQuillEditors(), 100);
      return;
    }

    this.initializeQuillEditors();
  }

  initializeQuillEditors() {
    // Check again if elements exist
    if (!this.editorElement || !this.requirementsEditorElement) {
      return;
    }

    // Initialize Quill editor for description
    if (!this.quill) {
      this.quill = new Quill(this.editorElement.nativeElement, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            ['link', 'blockquote', 'code-block'],
            [{ color: [] }, { background: [] }],
            ['clean'],
          ],
        },
        placeholder:
          'Describe the role, team, and what makes this opportunity great...',
      });

      // Set initial content if exists
      if (this.job.description) {
        this.quill.root.innerHTML = this.job.description;
      }

      // Update description on text change
      this.quill.on('text-change', () => {
        this.job.description = this.quill!.root.innerHTML;
      });
    }

    // Initialize Quill editor for requirements
    if (!this.requirementsQuill) {
      this.requirementsQuill = new Quill(
        this.requirementsEditorElement.nativeElement,
        {
          theme: 'snow',
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['link', 'code-block'],
              ['clean'],
            ],
          },
          placeholder: 'List the requirements for this position...',
        },
      );

      // Set initial content if exists
      if (this.job.requirements) {
        this.requirementsQuill.root.innerHTML = this.job.requirements;
      }

      // Update requirements on text change
      this.requirementsQuill.on('text-change', () => {
        this.job.requirements = this.requirementsQuill!.root.innerHTML;
      });
    }
  }

  ngOnDestroy() {
    if (this.quill) {
      this.quill = null;
    }
    if (this.requirementsQuill) {
      this.requirementsQuill = null;
    }
  }

  postJob() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.errorMessage = 'User not authenticated. Please log in again.';
      return;
    }

    // Validate required fields
    if (
      !this.job.title ||
      !this.job.company ||
      !this.job.location ||
      !this.job.salary
    ) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    this.isPosting = true;
    this.errorMessage = '';
    this.successMessage = '';

    console.log(
      this.isEditMode ? 'Updating job' : 'Posting job for recruiter:',
      currentUser.id,
    );

    // Prepare job data with currency-formatted salary
    const selectedCurrency = this.currencies.find(
      (c) => c.code === this.job.currency,
    );
    const jobData = {
      ...this.job,
      salary: `${selectedCurrency?.symbol}${this.job.salary}`,
    };

    console.log('Job data:', jobData);

    const apiCall =
      this.isEditMode && this.editJobId
        ? this.jobService.updateJob(this.editJobId, jobData)
        : this.jobService.postJob(currentUser.id, jobData);

    apiCall.subscribe({
      next: (response) => {
        this.isPosting = false;
        console.log(
          this.isEditMode
            ? 'Job updated successfully:'
            : 'Job posted successfully:',
          response,
        );

        if (response.success) {
          this.successMessage = this.isEditMode
            ? 'Job updated successfully!'
            : 'Job posted successfully!';
          setTimeout(() => {
            this.router.navigate(['/dashboard/recruiter/listings']);
          }, 1500);
        } else {
          this.errorMessage =
            response.message ||
            (this.isEditMode ? 'Failed to update job' : 'Failed to post job');
        }
      },
      error: (error) => {
        this.isPosting = false;
        console.error(
          this.isEditMode ? 'Error updating job:' : 'Error posting job:',
          error,
        );
        this.errorMessage = `${this.isEditMode ? 'Failed to update job' : 'Failed to post job'}: ${error.error?.message || error.message || 'Please try again.'}`;
      },
    });
  }

  cancel() {
    this.router.navigate(['/dashboard/recruiter/listings']);
  }
}
