import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Emaildialog } from './emaildialog';

describe('Emaildialog', () => {
  let component: Emaildialog;
  let fixture: ComponentFixture<Emaildialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Emaildialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Emaildialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
