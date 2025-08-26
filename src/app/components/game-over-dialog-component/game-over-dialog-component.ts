import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-over-dialog-component',
  imports: [CommonModule],
  templateUrl: './game-over-dialog-component.html',
  styleUrl: './game-over-dialog-component.css'
})
export class GameOverDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<GameOverDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router
  ) {}

  onVoltarClick(): void {
    this.dialogRef.close();
    
    // Verifica se há email para decidir o redirecionamento
    if (this.data.temEmail) {
      // Jogo com email: redireciona para a tela de seleção de jogos
      this.router.navigate(['/selecao-jogos']);
    } else {
      // Jogo sem email: redireciona para a tela inicial
      this.router.navigate(['/']);
    }
  }
}