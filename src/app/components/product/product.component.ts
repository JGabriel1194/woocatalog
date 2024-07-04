import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/products.service';
import * as html2pdf from 'html2pdf.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent {
  products: any[] = [];
  categories: any[] = [];
  selectCat: string = 'Todos los productos';
  pages: any[] = [];
  selectPage: string = '1';
  sheets: any[] = [];
  loader = true;
  pNormal = true;
  pMayorista = true;
  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts() {
    this.loader = true;
    this.pages = [];
    this.productService.listProducts(this.selectPage).subscribe((res: any) => {
      this.products = res.body;
      console.log(this.products);
      if (this.products.length > 0) {
        this.loader = false;
      }
      for (let i = 1; i <= res.headers.get('x-wp-totalpages'); i++) {
        this.pages.push({ id: i.toString() });
      }
      for (let i = 1; i <= Math.ceil(this.products.length / 9); i++) {
        this.sheets.push({ id: i.toString() });
      }

      console.log(this.sheets);
    });
  }

  loadCategories() {
    this.productService
      .listCategories(this.selectPage)
      .subscribe((res: any) => {
        this.categories = res.body;
        //console.log(this.categories);
      });
  }

  getProductCat(event: any) {
    this.loader = true;
    this.pages = [];
    if (event.target.value == 'Todos los productos') {
      this.selectCat = event.target.value;
      this.selectPage = '1';
      this.loadProducts();
      return;
    }
    console.log(event.target.value);
    this.productService
      .listProductsByCat(event.target.value, this.selectPage)
      .subscribe((res: any) => {
        this.products = res.body;
        if (this.products.length > 0) {
          this.loader = false;
        }
        for (let i = 1; i <= res.headers.get('x-wp-totalpages'); i++) {
          this.pages.push({ id: i.toString() });
        }
      });
  }

  pageChange(event: any) {
    if (this.selectCat == 'Todos los productos') {
      this.selectPage = event.target.value;
      this.loadProducts();
      return;
    }
    this.productService
      .listProductsByCat(this.selectCat, event.target.value)
      .subscribe((res: any) => {
        this.products = res.body;
        console.log(this.products);
      });
  }

  downloadPDF() {
    var element = document.getElementById('page');
    var opt = {
      filename: 'Catálogo.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { dpi: 300, letterRendering: true, useCORS: true, scale: 2 },
      jsPDF: {
        unit: 'in',
        format: 'A4',
        orientation: 'portrait',
        compressPDF: true,
        margins: {
          top: 40,
          bottom: 60,
          left: 40,
          width: 522,
        },
      },
      pagebreak: { mode: 'avoid-all', before: '#page2el' },
    };

    // // New Promise-based usage:
    // html2pdf().from(element).set(opt).save();

    // Old monolithic-style usage:
    html2pdf(element, opt).catch((err) => console.log(err));
  }

  public convetToPDF() {
    var data = document.getElementById('page') as HTMLElement;
    html2canvas(data).then((canvas) => {
      // Few necessary setting options
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
      var position = 0;
      pdf.html(contentDataURL, {
        callback: function (pdf) {
          pdf.save('catalogo.pdf');
        },
      });
      // pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      // pdf.save('new-file.pdf'); // Generated PDF
    });
  }

  public activeNormal() {
    this.pNormal = !this.pNormal;
  }

  public activeMayorista() {
    this.pMayorista = !this.pMayorista;
  }

  getWholesalePrice(product: any): string | null {
    const wholesalePriceObj = product.meta_data.find(
      (meta: any) => meta.key === '_whols_price_type_1_properties'
    );
    return wholesalePriceObj ? wholesalePriceObj.value.split(':')[0] : null;
  }
}
