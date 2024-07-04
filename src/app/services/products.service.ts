import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  products: any;
  constructor(private http: HttpService) {}

  listProducts(page:string): Observable<any> {
    return this.http.get('products?',page);
  }
  /**
   * Funcion para listar las categorias de todos los productos
   */
  listCategories(page:string): Observable<any> {
    return this.http.get('products/categories?',page);
  }

  /**
   * Funcion para listar productos por su categoria
   * @param id {String} - Recibe el id de la categoria
   */
  listProductsByCat(id: string, page: string): Observable<any> {
    return this.http.get(`products?category=${id}&`,page);
  }

  /**
   * Funcion para listar detalles del producto seleccionado
   * @param id {String} - Recibe id del producto
   */
  // listProductId(id: string): Observable<any> {
  //   return this.http.get(`products/${id}?`);
  // }

  /**
   * Funcion para buscar el producto por su nombre
   * @param name {String} - Recibe el nombre del producto a buscar
   */
  searchProducts(name: string) {
    return this.http.get(`products?search=${name}&`,"1");
  }
}
