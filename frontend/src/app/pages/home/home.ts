import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../../services/product';
import { CartService } from '../../services/cart';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { ProductDialogComponent } from '../../components/product-dialog/product-dialog';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  recommendedProducts: Product[] = [];
  isLoading = true;
  error: string | null = null;
  currentSlideIndex = 0;
  timeLeft = 3; // 3 seconds per slide
  private timer: any;
  sliderImages = [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1630269470859-f950f36b54ce?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  ];
  private sliderInterval: any;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.startSlider();
  }

  ngOnDestroy() {
    if (this.sliderInterval) {
      clearInterval(this.sliderInterval);
    }
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  private clearTimers() {
    if (this.sliderInterval) {
      clearInterval(this.sliderInterval);
      this.sliderInterval = null;
    }
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  startSlider() {
    // Clear any existing timers
    this.clearTimers();
    
    // Reset timer
    this.timeLeft = 3;
    
    // Single timer for both countdown and slide transition
    this.sliderInterval = setInterval(() => {
      this.timeLeft--;
      
      if (this.timeLeft <= 0) {
        this.currentSlideIndex = (this.currentSlideIndex + 1) % this.sliderImages.length;
        this.timeLeft = 3;
      }
    }, 1000);
  }

  nextSlide() {
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.sliderImages.length;
    this.timeLeft = 3;
    this.resetSliderTimer();
  }

  prevSlide() {
    this.currentSlideIndex = (this.currentSlideIndex - 1 + this.sliderImages.length) % this.sliderImages.length;
    this.timeLeft = 3;
    this.resetSliderTimer();
  }

  goToSlide(index: number) {
    if (index === this.currentSlideIndex) return;
    
    this.currentSlideIndex = index;
    this.timeLeft = 3;
    this.resetSliderTimer();
  }

  private resetSliderTimer() {
    this.clearTimers();
    this.startSlider();
  }

  loadProducts() {
    this.isLoading = true;
    this.error = null;
    
    console.log('Fetching products from:', this.productService);
    
    this.productService.getProducts().subscribe({
      next: (products) => {
        console.log('Products loaded successfully:', products);
        this.products = products;
        console.log('Before getRandomProducts - products length:', this.products.length);
        this.getRandomProducts(4); // Get 4 random products for the "You Might Also Like" section
        console.log('After getRandomProducts - recommendedProducts:', this.recommendedProducts);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.error = 'Failed to load products. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  // Get random products for "You Might Also Like" section
  getRandomProducts(count: number) {
    console.log('getRandomProducts called with count:', count);
    console.log('Total products available:', this.products.length);
    
    if (this.products.length <= count) {
      console.log('Not enough products, returning all');
      this.recommendedProducts = [...this.products];
    } else {
      console.log('Selecting random products');
      const shuffled = [...this.products].sort(() => 0.5 - Math.random());
      this.recommendedProducts = shuffled.slice(0, count);
    }
    
    console.log('Selected recommended products:', this.recommendedProducts);
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
    
    // Show a more subtle notification instead of an alert
    const notification = document.createElement('div');
    notification.textContent = `${product.name} added to cart!`;
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#4CAF50';
    notification.style.color = 'white';
    notification.style.padding = '12px 24px';
    notification.style.borderRadius = '4px';
    notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    notification.style.zIndex = '1000';
    notification.style.animation = 'slideIn 0.3s ease-out';
    
    document.body.appendChild(notification);
    
    // Remove the notification after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  getImageUrl(image: string): string {
    if (!image) return 'https://via.placeholder.com/150';
    if (image.startsWith('http')) return image;
    return 'http://localhost:5000' + image;
  }

  viewProduct(event: Event, product: Product): void {
    event.stopPropagation();
    this.dialog.open(ProductDialogComponent, {
      width: '800px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      data: { product },
      panelClass: 'product-dialog-container'
    });
  }
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

