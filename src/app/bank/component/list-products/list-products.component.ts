import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import {  Router } from '@angular/router';
import { BankService } from '../service/bank.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { Product } from '../../model/bank-model';


@Component({
  selector: 'app-list-banks',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './list-products.component.html',
  styleUrl: './list-products.component.scss'
})
export class ListProductsComponent implements OnInit, OnDestroy {
  private readonly _unsubscribe$ = new Subject<void>();
  @ViewChild(MatTable) table!: MatTable<any>;
  dataSource = new MatTableDataSource<any>([]);
  showcontracts: boolean = false;
  displayedColumns: string[] = ['logo', 'name', 'description', 'date_release',  'date_revision', 'action'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  filteredProductos: Product[] = []; // Filtered list of products for display
  pageOfItems: Array<any> = this.filteredProductos;
  pageSize = 5;
  productos: any[] = [];
  paginatedData: any[] = [];
  pageSizeOptions = [5, 10, 20, 50, 100];
  totalRecords = 0;
  totalPages = 0;
  currentPage = 0;
  selectedId: any = null;
  pageNumber: number = 1;

  constructor(private bankService: BankService,    private _router: Router,  ) { }

  ngOnInit(): void {
    this.getProducts();

  }

  toggleMenu(id: number) {
    this.selectedId = this.selectedId === id ? null : id;
  }
  getProducts() {
    this.bankService.getProducts().subscribe(response => {

      if(response && response.data && response.data.length > 0){
        this.productos = response.data;
        this.filteredProductos = [...this.productos];
        this.totalRecords = this.productos.length;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        this.updatePage();
      }


    }, (response) => {
      this.productos = [];
      this.filteredProductos = [];
      this.paginatedData = [];
  });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

    if (filterValue) {
      this.filteredProductos = this.productos.filter(product =>
        Object.values(product).some((val: any) =>
          val.toString().toLowerCase().includes(filterValue)
        )
      );
    } else {
      this.filteredProductos = [...this.productos];
    }

    this.totalRecords = this.filteredProductos.length;
    this.calculateTotalPages();
    this.updatePage(); // Update the page data after filtering
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
  }

  updatePage() {
    const startIndex = (this.pageNumber - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.filteredProductos.slice(startIndex, endIndex);
  }
  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updatePage();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.updatePage();
    }
  }

  onPageSizeChange(event: any) {
    this.pageSize = +event.target.value;
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    this.currentPage = 0; // Reset to first page when page size changes
    this.updatePage();
  }

  showMenu(id: any) {
    this.selectedId = this.selectedId === id ? null : id;
  }




  columnas = [
    { title: 'Logo', name: 'logo' },
    { title: 'Name', name: 'name' },
    { title: 'Description', name: 'description' },
    { title: 'Date Release ', name: 'date_release' },
    { title: 'Date Revision Revision', name: 'date_revision' },
    { title: 'Acciones', name: 'action' },
  ]

  // private getProducts() {
  //   this.bankService.getProducts()
  //     .pipe(takeUntil(this._unsubscribe$))
  //     .subscribe(response => {
  //       this.productsList = response.data;
  //       this.dataSource.data = response.data;
  //       this.dataSource = new MatTableDataSource(
  //         response.data
  //       );
  //       let events = {
  //         length: this.productsList.length,
  //         pageIndex: 0,
  //         pageSize: 5,
  //         previousPageIndex: 1
  //     }
  //     this.onPageChange(events);

  //     });

  // }

  saveOptions(data:any) {
    this._router.navigateByUrl("/bancos/form/" + data);
  }

  confirmDelete(id: any) {
    Swal.fire({
      html: '¿Estás seguro de que deseas eliminar este elemento?',
      icon: 'warning', // Puedes usar 'warning' o 'question' como icono
      imageWidth: 600,
      imageHeight: 150,
      imageAlt: 'Imagen personalizada',
      allowOutsideClick: false,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      width: 600,
      color: '#716add',
      focusCancel: false, // Enfoca el botón de cancelar por defecto

    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteProduct(id);
        // Lógica para eliminar el archivo o elemento
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.close();
      }
    });
  }


  private deleteProduct(id: any) {
    this.bankService.deleteProduct(id)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((response) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: '',
          html: response.message,
          showConfirmButton: false,
          timer: 1500
        });
        this.getProducts();
      });
  }

  //metodo de filtrar los datos de las columnas
  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();

  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }



  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }


  onPageChange(event: any) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.dataSource.data = this.productos.slice(startIndex, endIndex);
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

}
