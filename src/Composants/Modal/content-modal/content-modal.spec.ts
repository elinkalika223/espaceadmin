import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentModal } from './content-modal';

describe('ContentModal', () => {
  let component: ContentModal;
  let fixture: ComponentFixture<ContentModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
