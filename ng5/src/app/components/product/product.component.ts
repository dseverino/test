import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { DataTable } from 'primeng/components/datatable/datatable';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  private products: Product[] = [];
  rows = 10;
  totalRecords: number;

  constructor(private _productService: ProductService) { }

  ngOnInit() {
    this._productService.getProducts().subscribe(data => {
      this.products = data['products'];
      this.totalRecords = data['count']
    });
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

  loadProducts(event){
    console.log(event)
  }

  onDeleteRow(product){
    console.log(product)
  }

  onEditRow(product){
    console.log(product)
  }

}
