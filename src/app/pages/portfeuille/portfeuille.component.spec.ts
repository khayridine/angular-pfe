import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfeuilleComponent } from './portfeuille.component';

describe('PortfeuilleComponent', () => {
  let component: PortfeuilleComponent;
  let fixture: ComponentFixture<PortfeuilleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfeuilleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortfeuilleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
