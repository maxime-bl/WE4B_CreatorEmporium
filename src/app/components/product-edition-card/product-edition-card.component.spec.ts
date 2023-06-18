import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductEditionCardComponent } from './product-edition-card.component';

describe('ProductEditionCardComponent', () => {
  let component: ProductEditionCardComponent;
  let fixture: ComponentFixture<ProductEditionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductEditionCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductEditionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
