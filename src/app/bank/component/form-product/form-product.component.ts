import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from '../../model/bank-model';
import { catchError, debounceTime, filter, Observable, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { BankService } from '../service/bank.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-form-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-product.component.html',
  styleUrl: './form-product.component.scss'
})
export class FormProductComponent implements OnInit, OnDestroy {
  formProduct!: FormGroup;
  productId: any;
  fileName!: string;
  minDate!: Date;
  maxDate!: Date;
  registerDate: Date = new Date();
  fileType!: string;
  title: string = 'Registrar';
  private readonly _unsubscribe$ = new Subject<void>();
  product: Product = {
    id: '',
    name: '',
    description: '',
    logo: '',
    date_release: new Date(),
    date_revision: new Date(),
  };

  constructor(
    private _banService: BankService,
    private _formBuilder: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.productId = this._activatedRoute.snapshot.paramMap.get('id');

    this.formProduct = this._formBuilder.group({
      idProduct: new FormControl({ value: null, disabled: false },  [Validators.required,Validators.minLength(3),Validators.maxLength(10)]),
      name: new FormControl(null, [Validators.required,Validators.minLength(5),Validators.maxLength(100)]),
      description: new FormControl(null, [Validators.required,Validators.minLength(10),Validators.maxLength(200)]),
      date_release: new FormControl(null, Validators.required),
      date_revision: new FormControl({ value: null, disabled: true }, Validators.required),
      logo: new FormControl(null, Validators.required),
    });
    this.formProduct.get('idProduct')?.valueChanges.pipe(
      debounceTime(300), // Espera para evitar múltiples llamadas
      filter(value => value && value.trim().length > 0), // Filtrar valores vacíos
      switchMap(value => this.verifyData(value)),
      tap(isInvalid => {

        const currentErrors = this.formProduct.get('idProduct')?.errors || {};

        if (isInvalid) {
          this.formProduct.get('idProduct')?.setErrors({ ...currentErrors, idExists: true });
        } else {
          const updatedErrors = { ...currentErrors };

          if (currentErrors['minLength']) {
            updatedErrors['minLength'] = true;
          } else {
            delete updatedErrors['minLength'];
          }

          this.formProduct.get('idProduct')?.setErrors(updatedErrors);        }
      })
    ).subscribe();
    if (this.productId !== '0') {
      this.title = 'Actualizar';
      this.getProduct(this.productId);

    }
  }

  back() {
    debugger
    this._router.navigateByUrl("/bancos");
  }
  resetForm(): void {
    this.formProduct.reset();
  }
  saveOrUpdateProduct() {
    debugger
    // if (this.formProduct.invalid) {
    //   return;
    // }
    this.product = {
      id: this.product.id != '' ? this.product.id : this.formProduct.value.idProduct,
      logo: this.formProduct.value.logo,
      name: this.formProduct.value.name,
      description: this.formProduct.value.description,
      date_release: this.formProduct.value.date_release,
      date_revision: this.formProduct.value.date_revision,
    };
    debugger
    if (this.productId === '0') {
      this.saveProduct();
    } else {
      this.updateProduct();
    }
  }

  private saveProduct() {
    this._banService.saveProduct(this.product)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((resp) => {
        debugger
        this.formProduct.reset();
        this.alert(resp.message);
        this.back();
      });
  }


  dateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const date = new Date(input.value);
    date.setFullYear(date.getFullYear() + 1);
    this.minDate = date;
    this.maxDate = date;
    this.maxDate.setDate(date.getDate() + 1);

    this.formProduct.get('date_revision')?.enable();
  }

  formatDate(date: Date): string {
    if(date != null){
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2); // Mes en dos dígitos
      const day = ('0' + date.getDate()).slice(-2); // Día en dos dígitos
      return `${year}-${month}-${day}`;
    }
    return '';
  }
  private updateProduct() {
    this._banService.updateProduct(this.product)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((resp) => {
        this.alert(resp.message);
        this.back();
      });
  }

  getProduct(id: string) {
    this._banService.getProduct(id)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((response) => {
        if (response.date_revision != null) {
          this.formProduct.get('date_revision')?.enable();
        }
        this.formProduct.get('idProduct')?.disable();
        this.product = response;
        this.formProduct.patchValue({
          idProduct: response.id,
          name: response.name,
          logo: response.logo,
          description: response.description,
          date_release: this.formatDate(new Date(response.date_release)),
          date_revision: response.date_revision ? this.formatDate(new Date(response.date_revision)) : null
        });
      });
  }

  verifyData(verifyId: string): Observable<boolean> {
    return this._banService.verifyProduct(verifyId).pipe(
      switchMap(response => {
        return of(response);
      }),
      catchError(() => of(false))
    );
  }
  private alert(message: string) {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: '',
      html: message,
      showConfirmButton: false,
      timer: 1500
    });
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

}
