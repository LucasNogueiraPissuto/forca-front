import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelecaoJogosComponent } from './selecao-jogos-component';

describe('SelecaoJogosComponent', () => {
  let component: SelecaoJogosComponent;
  let fixture: ComponentFixture<SelecaoJogosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelecaoJogosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelecaoJogosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
