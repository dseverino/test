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

  private products: Product[] = [];
  rows = 10;
  totalRecords: number;
  displayDialog: boolean = false;

  constructor(private _productService: ProductService, private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.loadData()
  }


  addProduct(name: HTMLInputElement, price: HTMLInputElement) {
    const product = new Product(name.value, price.value);
    this._productService.saveProduct(product).subscribe(resp => {
      name.value = '';
      price.value = '';
      this.products.push(resp['createdProduct'])
    });

  }

  handleRowSelect(event) {
    console.log(event)
  }

  loadData() {
    this._productService.getProducts().subscribe(data => {
      this.products = data['products'];
      this.totalRecords = data['count']
    });
  }

  loadProducts() {

  }

  onDeleteRow(product: Product) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.deleteRecord(product);
      },
      reject: () => {

      }
    })

  }
  deleteRecord(product) {
    this._productService.deleteProduct(product).subscribe(resp => {      
      this.loadData();
    })
  }

  onEditRow(product) {
    console.log(product)
  }

}
