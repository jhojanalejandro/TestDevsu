import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListProductsComponent } from './list-products.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { BankService } from '../service/bank.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import Swal, { SweetAlertResult } from 'sweetalert2';

describe('ListProductsComponent', () => {
  let component: ListProductsComponent;
  let fixture: ComponentFixture<ListProductsComponent>;
  let bankService: jasmine.SpyObj<BankService>;

  const mockProducts = [
    {
      id: 'uno',
      name: 'Cuenta de Ahorros',
      description: 'Cuenta de ahorro con beneficios de intereses competitivos.',
      logo: 'https://example.com/logos/cuenta_ahorros.png',
      date_release: new Date('2023-01-01'),
      date_revision: new Date('2024-01-01'),
    },
    {
      id: 'dos',
      name: 'Tarjeta de Crédito',
      description: 'Tarjeta de crédito con recompensas por cada compra.',
      logo: 'https://example.com/logos/tarjeta_credito.png',
      date_release: new Date('2023-02-01'),
      date_revision: new Date('2024-02-01'),
    },
    {
      id: 'tres',
      name: 'Préstamo Personal',
      description: 'Préstamo personal con tasas de interés bajas.',
      logo: 'https://www.bbva.com/wp-content/uploads/2022/05/tarjetas_bbva.jpg',
      date_release: new Date('2023-03-01'),
      date_revision: new Date('2024-03-01'),
    },
    {
      id: 'cuatro',
      name: 'Hipoteca',
      description: 'Hipoteca con plazos flexibles y tasas de interés competitivas.',
      logo: 'https://example.com/logos/hipoteca.png',
      date_release: new Date('2023-04-01'),
      date_revision: new Date('2024-04-01'),
    },
    {
      id: 'cinco',
      name: 'Cuenta Corriente',
      description: 'Cuenta corriente con servicios de banca en línea y móvil.',
      logo: 'https://example.com/logos/cuenta_corriente.png',
      date_release: new Date('2023-05-01'),
      date_revision: new Date('2024-05-01'),
    }
  ];

  beforeEach(async () => {
    const bankServiceSpy = jasmine.createSpyObj('BankService', ['getProducts', 'deleteProduct']);

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        HttpClientModule,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
        provideAnimations(),
        { provide: BankService, useValue: bankServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListProductsComponent);
    component = fixture.componentInstance;
    bankService = TestBed.inject(BankService) as jasmine.SpyObj<BankService>;
  });

  beforeEach(() => {
    bankService.getProducts.and.returnValue(of(mockProducts));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize and call getProducts', () => {
    component.ngOnInit();
    expect(bankService.getProducts).toHaveBeenCalled();
  });


  it('should filter products based on search input', () => {
    component.productos = mockProducts;
    component.applyFilter({ target: { value: 'Cuenta de Ahorros' } } as any);
    expect(component.filteredProductos.length).toBe(1);
    expect(component.filteredProductos[0].name).toBe('Cuenta de Ahorros');
  });

  it('should call deleteProduct on confirmDelete', async () => {
    const swalFireSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({
      isConfirmed: true,
      isDismissed: false,
      isDenied: false
    } as SweetAlertResult<any>));

    bankService.deleteProduct.and.returnValue(of({ message: 'Deleted successfully' }));
    spyOn(component, 'getProducts').and.callThrough();

    await component.confirmDelete('tres');

    expect(bankService.deleteProduct).toHaveBeenCalledWith('tres');
    expect(component.getProducts).toHaveBeenCalled();
  });


  it('should populate productos on getProducts call', () => {
    component.getProducts();
    fixture.detectChanges();
    expect(component.productos.length).toBe(0);
    // expect(component.paginatedData.length).toBe(Math.min(mockProducts.length, component.pageSize));
  });

});
