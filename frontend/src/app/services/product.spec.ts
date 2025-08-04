import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ProductService } from './product';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch products', () => {
    const mockProducts = [
      { _id: '1', name: 'Test Product', price: 100, image: 'test.jpg' }
    ];

    service.getProducts().subscribe(products => {
      expect(products.length).toBe(1);
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne('http://localhost:5000/api/products');
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('should handle error when fetching products', () => {
    const errorMessage = 'Error fetching products';
    
    service.getProducts().subscribe({
      next: () => fail('should have failed with error'),
      error: (error) => {
        expect(error).toContain('Something went wrong');
      }
    });

    const req = httpMock.expectOne('http://localhost:5000/api/products');
    req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
  });
});
