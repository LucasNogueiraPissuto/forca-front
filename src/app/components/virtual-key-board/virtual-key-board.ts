import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-virtual-key-board',
  imports: [CommonModule],
  templateUrl: './virtual-key-board.html',
  styleUrl: './virtual-key-board.css'
})
export class VirtualKeyBoard implements OnChanges {
  // Layout QWERTY dividido por linhas
  linhasTeclado: string[][] = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  @Input() letrasTentadas: string[] = [];
  @Output() letraClicada = new EventEmitter<string>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['letrasTentadas']) {
      console.log('Letras tentadas atualizadas:', this.letrasTentadas);
    }
  }

  onLetraClick(letra: string): void {
    if (!this.isLetraDesabilitada(letra)) {
      this.letraClicada.emit(letra);
    }
  }

  isLetraDesabilitada(letra: string): boolean {
    const tentadas = this.letrasTentadas || [];
    return tentadas.map(l => l.toUpperCase()).includes(letra.toUpperCase());
  }
}