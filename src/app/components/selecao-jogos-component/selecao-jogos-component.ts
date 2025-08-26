import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ForcaJogoResponse } from '../../interfaces/ForcaJogoReponse';
import { Forca } from '../../services/forca';

@Component({
  selector: 'app-selecao-jogos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: 'selecao-jogos-component.html',
  styleUrls: ['selecao-jogos-component.css']
})
export class SelecaoJogosComponent implements OnInit {
  jogos: ForcaJogoResponse[] = [];
  email: string = '';
  carregando: boolean = true;
    erro: string = '';

  constructor(
    private forcaService: Forca,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    console.log('SelecaoJogosComponent inicializado');
    this.email = localStorage.getItem('forcaPlayerEmail') || '';
    
    if (!this.email) {
      console.log('Nenhum email encontrado, redirecionando para home');
      this.router.navigate(['/']);
      return;
    }

    this.carregarJogos();
  }

  carregarJogos(): void {
    this.forcaService.getJogosPorEmail(this.email).subscribe({
      next: (jogos) => {
        this.jogos = jogos;
        this.carregando = false;
        
        if (jogos.length === 0) {
          // Email existe mas não tem jogos - mostra mensagem apropriada
          this.erro = 'Nenhum jogo encontrado para este email.';
        }
        
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.error('Erro ao carregar jogos:', erro);
        this.carregando = false;
        
        if (erro.status === 404 || erro.status === 400) {
          // Email não encontrado no sistema
          this.erro = 'Email não encontrado. Por favor, verifique o email digitado.';
        } else {
          this.erro = 'Não foi possível carregar seus jogos. Tente novamente.';
        }
        
        this.cdr.detectChanges();
      }
    });
  }

  selecionarJogo(jogo: ForcaJogoResponse): void {
    // Navega para a URL dinâmica com o ID do jogo selecionado
    this.router.navigate(['/game', jogo.gameId], { 
      state: { jogoCompleto: jogo } 
    });
  }

  novoJogo(): void {
    this.forcaService.iniciarJogo(this.email).subscribe({
      next: (novoJogo) => {
        // Navega para a URL dinâmica com o ID do novo jogo
        this.router.navigate(['/game', novoJogo.gameId], { 
          state: { jogoCompleto: novoJogo } 
        });
      },
      error: (erro) => {
        console.error('Erro ao iniciar novo jogo:', erro);
        alert('Não foi possível iniciar um novo jogo. Tente novamente.');
      }
    });
  }

  iniciarNovoJogo(): void {
    this.forcaService.iniciarJogo(this.email).subscribe({
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
  }

  voltarParaHome(): void {
    this.router.navigate(['/']);
  }
}