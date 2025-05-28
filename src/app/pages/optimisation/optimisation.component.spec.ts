import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortefeuilleOptimisationComponent } from './optimisation.component';

describe('OptimisationComponent', () => {
  let component: PortefeuilleOptimisationComponent;
  let fixture: ComponentFixture<PortefeuilleOptimisationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortefeuilleOptimisationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortefeuilleOptimisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
