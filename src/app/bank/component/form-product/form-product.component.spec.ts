import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormProductComponent } from './form-product.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing'; // Asegúrate de importar RouterTestingModule
import { CommonModule } from '@angular/common';
import { provideAnimations } from '@angular/platform-browser/animations';
import { BankService } from '../service/bank.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FormProductComponent', () => {
  let component: FormProductComponent;
  let fixture: ComponentFixture<FormProductComponent>;
  let bankService: jasmine.SpyObj<BankService>;
  beforeEach(async () => {
    const bankServiceSpy = jasmine.createSpyObj('BankService', [
      'saveProduct',
      'updateProduct',
      'getProduct',
      'verifyProduct',
      'deleteProduct'
    ]);

    bankServiceSpy.getProduct.and.returnValue(of({ id: 'uno', name: 'Test Product' }));
    bankServiceSpy.updateProduct.and.returnValue(of({ message: 'Product updated successfully' }));
    bankServiceSpy.saveProduct.and.returnValue(of({ message: 'Product saved successfully' }));
    bankServiceSpy.verifyProduct.and.returnValue(of({ message: 'Product verified successfully' }));
    bankServiceSpy.deleteProduct.and.returnValue(of({ message: 'Product deleted successfully' }));

    await TestBed.configureTestingModule({
      imports: [FormProductComponent, // Importa RouterTestingModule para proporcionar ActivatedRoute
        HttpClientModule,
        HttpClientTestingModule,
        RouterTestingModule, // Importa RouterTestingModule
      ],    providers: [
        provideAnimations(),
        { provide: BankService, useValue: bankServiceSpy },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormProductComponent);
    component = fixture.componentInstance;
    bankService = TestBed.inject(BankService) as jasmine.SpyObj<BankService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getProduct and update form values', () => {
    const mockProduct =  {
      id: 'dos',
      name: 'Tarjeta de Crédito',
      description: 'Tarjeta de crédito con recompensas por cada compra.',
      logo: 'https://example.com/logos/tarjeta_credito.png',
      date_release: new Date('2023-01-31'),
      date_revision: new Date('2024-02-01'),
    };
    bankService.getProduct.and.returnValue(of(mockProduct));

    component.getProduct('dos');

    expect(component.formProduct.get('idProduct')?.value).toBe('dos');
    expect(component.formProduct.get('name')?.value).toBe('Tarjeta de Crédito');
    expect(component.formProduct.get('description')?.value).toBe('Tarjeta de crédito con recompensas por cada compra.');
    expect(component.formProduct.get('logo')?.value).toBe('https://example.com/logos/tarjeta_credito.png');
    expect(component.formProduct.get('date_release')?.value).toBe('2023-01-30');
    expect(component.formProduct.get('date_revision')?.value).toBe('2024-01-31');
  });
  it('should display error messages when fields are invalid', () => {
    component.formProduct.get('idProduct')?.setValue('');
    component.formProduct.get('name')?.setValue('');
    component.formProduct.get('description')?.setValue('');
    component.formProduct.get('logo')?.setValue('');

    fixture.detectChanges();

    console.log(fixture.nativeElement.innerHTML); // Verifica el HTML del componente

    const nameError = fixture.nativeElement.querySelector('#name + .error');
    const descriptionError = fixture.nativeElement.querySelector('#description + .error');
    const logoError = fixture.nativeElement.querySelector('#logo + .error');

    // console.log('idProductError:', idProductError);
    console.log('nameError:', nameError);
    console.log('descriptionError:', descriptionError);
    console.log('logoError:', logoError);

    // expect(idProductError).toBeTruthy();
    expect(nameError).toBeTruthy();
    expect(descriptionError).toBeTruthy();
    expect(logoError).toBeTruthy();
  });
});
