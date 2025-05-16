import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePortefeuilleComponent } from './create-portefeuille.component';

describe('CreatePortefeuilleComponent', () => {
  let component: CreatePortefeuilleComponent;
  let fixture: ComponentFixture<CreatePortefeuilleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePortefeuilleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePortefeuilleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
