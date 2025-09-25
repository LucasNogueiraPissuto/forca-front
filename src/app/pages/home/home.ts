import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Forca } from '../../services/forca-service/forca';
import { ForcaJogoResponse } from '../../interfaces/ForcaJogoReponse';
import { EmailDialogComponent } from '../../components/emaildialog/emaildialog';
import { EstadoJogoService } from '../../services/estado-jogo/estado-jogo';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: 'home.html',
  styleUrls: ['home.css']
})
export class HomeComponent {

  constructor(
    private forcaService: Forca,
    private router: Router,
    private estadoJogoService: EstadoJogoService,
    private dialog: MatDialog
  ) { }

  jogarAnonimamente(): void {
    this.forcaService.iniciarJogo().subscribe({
      next: (respostaCompleta: ForcaJogoResponse) => {
        this.estadoJogoService.setJogo(respostaCompleta);
        this.router.navigate(['/game', 'anonymous', respostaCompleta.gameId], {
          state: { jogoCompleto: respostaCompleta }
        });
      },
      error: (erro) => {
        console.error('Erro ao iniciar jogo:', erro);
        alert('Não foi possível iniciar o jogo. Verifique a API.');
      }
    });
  }

abrirDialogoEmail(): void {
  const dialogRef = this.dialog.open(EmailDialogComponent, {
    width: '400px',
    disableClose: false,
    panelClass: 'email-dialog-container' // Adicione esta linha
  });

  dialogRef.afterClosed().subscribe((email: string) => {
    if (email) {
      this.jogarComEmail(email);
    }
  });
}

  private jogarComEmail(email: string): void {
    this.forcaService.getJogosPorEmail(email).subscribe({
      next: (jogos: ForcaJogoResponse[]) => {
        localStorage.setItem('forcaPlayerEmail', email);
        
        if (jogos.length === 0) {
          this.iniciarNovoJogoComEmail(email);
        } else if (jogos.length === 1) {
          this.router.navigate(['/game', email, jogos[0].gameId], {
            state: { jogoCompleto: jogos[0] }
          });
        } else {
          this.router.navigate(['/selecao-jogos']);
        }
      },
      error: (erro) => {
        console.error('Erro ao buscar jogos:', erro);
        this.iniciarNovoJogoComEmail(email);
      }
    });
  }

  private iniciarNovoJogoComEmail(email: string): void {
    this.forcaService.iniciarJogo(email).subscribe({
      next: (respostaCompleta: ForcaJogoResponse) => {
        this.router.navigate(['/game', email, respostaCompleta.gameId], {
          state: { jogoCompleto: respostaCompleta }
        });
      },
      error: (erro) => {
        console.error('Erro ao iniciar jogo:', erro);
        alert('Não foi possível iniciar um novo jogo. Tente novamente.');
      }
    });
  }
}