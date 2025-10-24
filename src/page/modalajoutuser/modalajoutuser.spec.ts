import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Modalajoutuser } from './modalajoutuser';

describe('Modalajoutuser', () => {
  let component: Modalajoutuser;
  let fixture: ComponentFixture<Modalajoutuser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Modalajoutuser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Modalajoutuser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
