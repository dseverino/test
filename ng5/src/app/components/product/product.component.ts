import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { DataTable } from "primeng/components/datatable/datatable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {
  @ViewChild('dt') input: DataTable;

  private products: Product[] = []

  constructor(private _productService: ProductService) { }

  ngOnInit() {
    this._productService.getProducts().subscribe(data => {      
      this.products = data['products'];
    });    
  }

  addProduct(name: HTMLInputElement, price: HTMLInputElement) {    
    const product = new Product(name.value, price.value);
    this._productService.saveProduct(product).subscribe(resp => {
      name.value = "";
      price.value = "";      
      this.products.push(resp["createdProduct"])      
      this.input.updateDataToRender(this.products)
    });

    
  }

  handleRowSelect(product){
    
  }

}
