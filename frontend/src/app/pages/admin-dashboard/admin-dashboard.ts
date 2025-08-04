import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss'
})
export class AdminDashboardComponent implements OnInit {
  user: any = null;
  isAdmin = false;
  product = { name: '', price: 0, summary: '' };
  imageFile: File | null = null;
  message = '';
  private isBrowser: boolean;

  constructor(
    private productService: ProductService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      const userStr = localStorage.getItem('user');
      this.user = userStr ? JSON.parse(userStr) : null;
      this.isAdmin = this.user && this.user.role === 'admin';
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imageFile = input.files[0];
    }
  }

  addProduct() {
    if (!this.product.name || !this.product.price || !this.product.summary) {
      this.message = 'Name, price, and summary are required.';
      return;
    }
    const formData = new FormData();
    formData.append('name', this.product.name);
    formData.append('price', this.product.price.toString());
    formData.append('summary', this.product.summary);
    if (this.imageFile) {
      formData.append('image', this.imageFile);
    }
    this.productService.addProduct(formData).subscribe({
      next: () => {
        this.message = 'Product added!';
        this.product = { name: '', price: 0, summary: '' };
        this.imageFile = null;
      },
      error: () => {
        this.message = 'Failed to add product.';
      }
    });
  }
} 