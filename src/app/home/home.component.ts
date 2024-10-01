import { Component, ViewChild } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { Product, Products } from '../../types';
import { ProductComponent } from '../components/product/product.component';
import { CommonModule } from '@angular/common';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { EditPopupComponent } from '../components/edit-popup/edit-popup.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ProductComponent,
    CommonModule,
    PaginatorModule,
    EditPopupComponent,
    ButtonModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(private productsService: ProductsService) {}

  @ViewChild('paginator') paginator: Paginator | undefined;

  products: Product[] = [];
  totalRecords: number = 0;
  rows: number = 12;

  displayEditPopup: boolean = false;
  displayAddPopup: boolean = false;

  selectedProduct: Product = {
    id: 0,
    name: '',
    image: '',
    price: '',
    rating: 0,
  };

  ngOnInit() {

    this.initializeTestData();
  }

  initializeTestData() {
    this.products = [
      {
        id: 1,
        name: 'T-shirt',
        image: 'assets/images/products/image7.jpg',
        price: '10',
        rating: 4,
      },
      {
        id: 2,
        name: 'Hoodie',
        image: 'assets/images/products/image1.jpg',
        price: '20',
        rating: 5,
      },
      {
        id: 3,
        name: 'Sneakers',
        image: 'assets/images/products/image2.jpg',
        price: '30',
        rating: 4.5,
      },
      {
        id: 4,
        name: 'dress',
        image: 'assets/images/products/image4.jpg',
        price: '15',
        rating: 4,
      },
      {
        id: 5,
        name: 'Jacket',
        image: 'assets/images/products/image6.jpg',
        price: '50',
        rating: 5,
      },
    ];
    this.totalRecords = this.products.length; // Set total records for pagination
  }

  toggleEditPopup(product: Product) {
    this.selectedProduct = product;
    this.displayEditPopup = true;
  }

  toggleDeletePopup(product: Product) {
    if (!product.id) {
      return;
    }
    this.deleteProduct(product.id);
  }

  toggleAddPopup() {
    this.displayAddPopup = true;
  }

  onConfirmEdit(product: Product) {
    if (!this.selectedProduct.id) {
      return;
    }
    this.editProduct(product, this.selectedProduct.id);
    this.displayEditPopup = false;
  }

  onConfirmAdd(product: Product) {
    this.addProduct(product);
    this.displayAddPopup = false;
  }

  onProductOutput(product: Product) {
    console.log(product, 'Output');
  }

  onPageChange(event: any) {
    // If using Test data, slice the products for pagination
    const start = event.page * event.rows;
    const end = start + event.rows;
    this.products = this.products.slice(start, end);
  }

  resetPaginator() {
    this.paginator?.changePage(0);
  }

 
  editProduct(product: Product, id: number) {
    console.log('Editing product:', product, 'with ID:', id);

  }

  deleteProduct(id: number) {
    console.log('Deleting product with ID:', id);
    // Implement actual delete logic here
    this.products = this.products.filter(product => product.id !== id);
    this.totalRecords = this.products.length; // Update total records after deletion
  }

  addProduct(product: Product) {
    product.id = this.totalRecords + 1; // Assign a new ID
    this.products.push(product);
    this.totalRecords = this.products.length; // Update total records after addition
  }
}
