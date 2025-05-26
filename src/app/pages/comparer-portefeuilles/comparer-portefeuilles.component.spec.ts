import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparerPortefeuillesComponent } from './comparer-portefeuilles.component';

describe('ComparerPortefeuillesComponent', () => {
  let component: ComparerPortefeuillesComponent;
  let fixture: ComponentFixture<ComparerPortefeuillesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComparerPortefeuillesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComparerPortefeuillesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
