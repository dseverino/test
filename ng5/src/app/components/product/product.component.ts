import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { DataTable } from 'primeng/components/datatable/datatable';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  products: Product[] = [];
  rows = 10;
  totalRecords: number;
  displayDialog: boolean = false;
  loading: boolean = false;

  constructor(private _productService: ProductService, private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.loading = true;
    this.loadProducts()
  }


  addProduct(name: HTMLInputElement, price: HTMLInputElement) {
    const product = new Product(name.value, price.value);
    this.loading = true;
    this._productService.saveProduct(product).subscribe(resp => {
      name.value = '';
      price.value = '';
      this.loadProducts();
    });

  }

  handleRowSelect(event) {
    console.log(event)
  }

  loadProducts() {    
    this._productService.getProducts().subscribe(data => {
      this.loading = false;
      this.products = data['products'];
      this.totalRecords = data['count']
    });
  }

  onDeleteRow(product: Product) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        console.log('here in accept')
        this.deleteRecord(product);
      },
      reject: () => {
        console.log('here in reject')
      }
    })

  }
  deleteRecord(product) {
    this.loading = true;
    this._productService.deleteProduct(product).subscribe(resp => {      
      this.loadProducts();
    })
  }

  onEditRow(product) {
    console.log(product)
  }

}
