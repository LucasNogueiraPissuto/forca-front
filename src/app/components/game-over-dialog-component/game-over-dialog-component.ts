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
  ) {} 

  ngOnInit() {
    console.log(this.data);
  }

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

  onNovoJogoClick(): void {
    this.dialogRef.close();
    console.log('Email do jogador:', this.data.email);
    console.log('Tem email:', this.data.temEmail);
    if (this.data.temEmail) {
    console.log('Iniciando novo jogo para o email:', this.data.email);
    this.forcaService.iniciarJogo(this.data.email).subscribe({
      next: (novoJogo) => {
        this.router.navigate(['/game', novoJogo.gameId], {
          state: { jogoCompleto: novoJogo }
        });
      },
      error: (erro) => {
        console.error('Erro ao iniciar novo jogo:', erro);
        alert('Não foi possível iniciar um novo jogo. Tente novamente.');
      }
    });
    } else {
      console.log('Iniciando novo jogo como anônimo');
      this.forcaService.iniciarJogo().subscribe({
        next: (novoJogo) => {
          this.router.navigate(['/game', novoJogo.gameId], {
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