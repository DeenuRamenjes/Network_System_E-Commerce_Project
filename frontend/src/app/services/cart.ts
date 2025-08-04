import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Product } from './product';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private storageKey = 'cart';
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  private getStorage(): Storage | null {
    return this.isBrowser ? window.localStorage : null;
  }

  getCart(): Product[] {
    if (!this.isBrowser) return [];
    
    try {
      const storage = this.getStorage();
      const cart = storage?.getItem(this.storageKey);
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.error('Error accessing cart from storage:', error);
      return [];
    }
  }

  addToCart(product: Product): void {
    if (!this.isBrowser) return;
    
    try {
      const cart = this.getCart();
      cart.push(product);
      this.getStorage()?.setItem(this.storageKey, JSON.stringify(cart));
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  }

  removeFromCart(productId: string): void {
    if (!this.isBrowser) return;
    
    try {
      let cart = this.getCart();
      cart = cart.filter(item => item._id !== productId);
      this.getStorage()?.setItem(this.storageKey, JSON.stringify(cart));
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  }

  clearCart(): void {
    if (!this.isBrowser) return;
    
    try {
      this.getStorage()?.removeItem(this.storageKey);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  }
}
