import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProModal } from './pro-modal';

describe('ProModal', () => {
  let component: ProModal;
  let fixture: ComponentFixture<ProModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
