import { CommonModule, NgFor } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-virtual-key-board',
  imports: [NgFor],
  templateUrl: './virtual-key-board.html',
  styleUrl: './virtual-key-board.css'
})
export class VirtualKeyBoard {
  letras: string[] = [];
  letrasClicadas: string[] = []; // Nova propriedade para rastrear cliques

  @Input() letrasTentadas: string[] = [];
  @Output() letraClicada = new EventEmitter<string>();

  ngOnInit(): void {
    this.gerarAlfabeto();
  }

  private gerarAlfabeto(): void {
    for (let i = 0; i < 26; i++) {
      this.letras.push(String.fromCharCode(97 + i).toUpperCase());
    }
  }

  onLetraClick(letra: string): void {
    if (!this.isLetraDesabilitada(letra)) {
      this.letrasClicadas.push(letra); // Registra o clique localmente
      this.letraClicada.emit(letra);
    }
  }

  isLetraDesabilitada(letra: string): boolean {
    letra = letra.toLocaleLowerCase();
    return this.letrasTentadas.includes(letra)
  }
}
