import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-20 right-8 z-50 space-y-3">
      <div
        *ngFor="let toast of toasts"
        class="animate-fade-in px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px] max-w-md backdrop-blur-sm"
        [ngClass]="{
          'bg-green-600 text-white': toast.type === 'success',
          'bg-red-600 text-white': toast.type === 'error',
          'bg-yellow-600 text-white': toast.type === 'warning',
          'bg-blue-600 text-white': toast.type === 'info',
        }"
      >
        <i
          class="text-xl"
          [ngClass]="{
            'fas fa-check-circle': toast.type === 'success',
            'fas fa-times-circle': toast.type === 'error',
            'fas fa-exclamation-triangle': toast.type === 'warning',
            'fas fa-info-circle': toast.type === 'info',
          }"
        ></i>
        <span class="font-semibold flex-1">{{ toast.message }}</span>
      </div>
    </div>
  `,
  styles: [
    `
      @keyframes fade-in {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .animate-fade-in {
        animation: fade-in 0.3s ease-out;
      }
    `,
  ],
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: (Toast & { id: number })[] = [];
  private subscription?: Subscription;
  private nextId = 0;

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.subscription = this.toastService.toast$.subscribe((toast) => {
      const id = this.nextId++;
      const toastWithId = { ...toast, id };
      this.toasts.push(toastWithId);

      setTimeout(() => {
        this.removeToast(id);
      }, toast.duration || 3000);
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  private removeToast(id: number) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
  }
}
