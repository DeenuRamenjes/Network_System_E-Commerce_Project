import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Product } from '../../services/product';
import { CartService } from '../../services/cart';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface DialogData {
  product: Product;
}

@Component({
  selector: 'app-product-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule
  ],
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.scss']
})
export class ProductDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  getImageUrl(image: string): string {
    if (!image) return 'https://via.placeholder.com/150';
    if (image.startsWith('http')) return image;
    return 'http://localhost:5000' + image;
  }

  addToCart(): void {
    this.cartService.addToCart(this.data.product);
    this.snackBar.open('Added to cart!', 'Dismiss', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
