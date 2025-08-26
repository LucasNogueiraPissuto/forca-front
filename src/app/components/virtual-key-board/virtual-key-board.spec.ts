import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualKeyBoard } from './virtual-key-board';

describe('VirtualKeyBoard', () => {
  let component: VirtualKeyBoard;
  let fixture: ComponentFixture<VirtualKeyBoard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VirtualKeyBoard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VirtualKeyBoard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
