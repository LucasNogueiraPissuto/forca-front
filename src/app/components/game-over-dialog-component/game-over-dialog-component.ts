import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Forca } from '../../services/forca-service/forca';

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
    private router: Router,
    private forcaService: Forca
  ) { }

  ngOnInit() {
    console.log(this.data);
  }

  onVoltarClick(): void {
    this.dialogRef.close();

    if (this.data.temEmail) {
      this.router.navigate(['/selecao-jogos']);
    } else {
      this.router.navigate(['/']);
    }
  }

  onNovoJogoClick(): void {
    this.dialogRef.close();

    if (this.data.temEmail) {
      this.forcaService.iniciarJogo(this.data.email).subscribe({
        next: (novoJogo) => {
          // Navegar para rota com email e id
          this.router.navigate(['/game', this.data.email, novoJogo.gameId], {
            state: { jogoCompleto: novoJogo }
          });
        },
        error: (erro) => {
          console.error('Erro ao iniciar novo jogo:', erro);
          alert('Não foi possível iniciar um novo jogo. Tente novamente.');
        }
      });
    } else {
      this.forcaService.iniciarJogo().subscribe({
        next: (novoJogo) => {
          // Navegar para rota anônima
          this.router.navigate(['/game', 'anonymous', novoJogo.gameId], {
            state: { jogoCompleto: novoJogo }
          });
        },
        error: (erro) => {
          console.error('Erro ao iniciar jogo anônimo:', erro);
          alert('Não foi possível iniciar um novo jogo. Tente novamente.');
        }
      });
    }
  }
}