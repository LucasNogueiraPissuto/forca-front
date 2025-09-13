import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VirtualKeyBoard } from '../../components/virtual-key-board/virtual-key-board';
import { CommonModule } from '@angular/common';
import { Forca } from '../../services/forca-service/forca';
import { ForcaJogoResponse } from '../../interfaces/ForcaJogoReponse';
import { MatDialog } from '@angular/material/dialog';
import { GameOverDialogComponent } from '../../components/game-over-dialog-component/game-over-dialog-component';
import { EstadoJogoService } from '../../services/estado-jogo/estado-jogo';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [VirtualKeyBoard, CommonModule],
  templateUrl: 'game.html',
  styleUrl: 'game.css'
})
export class Game implements OnInit {
  jogo: ForcaJogoResponse | null = null;
  emailDoJogador: string = '';
  carregando: boolean = true;
  jogoIdDaUrl: string | null = null;

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private forcaService: Forca,
    public dialog: MatDialog,
    private estadoJogoService: EstadoJogoService
  ) {}

  ngOnInit(): void {
    // Escuta mudanças no parâmetro 'id'
    this.activateRoute.paramMap.subscribe(params => {
      this.jogoIdDaUrl = this.activateRoute.snapshot.paramMap.get('id');
      this.carregarJogo();
    });
  }

  private carregarJogo(): void {
    const navigation = this.router.getCurrentNavigation();
    
    if (navigation?.extras.state && navigation.extras.state['jogoCompleto']) {
      // Jogo recebido via navegação
      const respostaApiCompleta: ForcaJogoResponse = navigation.extras.state['jogoCompleto'];
      this.processarJogoCarregado(respostaApiCompleta);
    } else if (this.jogoIdDaUrl) {
      // Jogo com URL dinâmica - carrega do backend
      this.carregarJogoPorId(this.jogoIdDaUrl);
    } else {
      // Jogo sem email - tenta carregar do serviço
      this.carregarJogoSemEmail();
    }
  }

    private carregarJogoPorId(jogoId: string): void {
    const emailSalvo = localStorage.getItem('forcaPlayerEmail');
    
    if (emailSalvo) {
      this.emailDoJogador = emailSalvo;
      
      this.forcaService.getJogoById(jogoId, emailSalvo).subscribe({
        next: (jogoCarregado: ForcaJogoResponse) => {
          this.processarJogoCarregado(jogoCarregado);
        },
        error: (erro) => {
          console.error('Erro ao carregar jogo pelo ID:', erro);
          this.limparERedirecionar();
        }
      });
    } else {
      // Se não tem email salvo, redireciona para home
      this.router.navigate(['/']);
    }
  }

    private carregarJogoSemEmail(): void {
    const jogoDoServico = this.estadoJogoService.getJogo();
    
    if (jogoDoServico) {
      this.processarJogoCarregado(jogoDoServico);
      this.estadoJogoService.clearJogo();
    } else {
      // Se não tem jogo no serviço, redireciona
      this.router.navigate(['/']);
    }
  }

  private processarJogoCarregado(jogo: ForcaJogoResponse): void {
    this.jogo = jogo;
    this.emailDoJogador = jogo.email || '';
    
    // Atualiza a URL se necessário (para jogos com email)
    if (this.jogoIdDaUrl === null && jogo.gameId && jogo.email) {
      this.router.navigate(['/game', jogo.gameId], { 
        replaceUrl: true,
        state: { jogoCompleto: jogo }
      });
    }
    
    console.log("Dados do jogo carregados:", this.jogo);
    console.log("Email do jogador:", this.emailDoJogador);
    
    this.carregando = false;
    
    setTimeout(() => {
      this.cdr.detectChanges();
      this.verificarFimDeJogo();
    });
  }

  private verificarFimDeJogo(): void {
    if (!this.jogo) return;
    
    // Verificar se o jogo terminou com base na mensagem ou status
    const jogoFinalizado = this.jogo.mensagem === 'Vitória' || 
                          this.jogo.mensagem === 'Derrota' ||
                          this.jogo.status === 'Vitória' || 
                          this.jogo.status === 'Derrota';
    
    if (jogoFinalizado) {
      // Pequeno delay para garantir que a view foi renderizada
      setTimeout(() => {
        this.mostrarDialogoFimDeJogo();
      }, 500);
    }
  }

  private mostrarDialogoFimDeJogo(): void {
    if (!this.jogo) return;
    
    const vitoria = this.jogo.mensagem === 'Vitória' || this.jogo.status === 'Vitória';
    const dialogRef = this.dialog.open(GameOverDialogComponent, {
      width: '400px',
      disableClose: true,
      data: {
        titulo: vitoria ? 'Parabéns! Você Venceu!' : 'Game Over!',
        mensagem: vitoria 
          ? 'Você descobriu a palavra corretamente!' 
          : 'Suas tentativas acabaram.',
        palavraCorreta: this.jogo.palavraSecreta,
        temEmail: !!this.emailDoJogador,
        email: this.emailDoJogador || null 
      }
    });

    // Limpar localStorage ao final do jogo
    dialogRef.afterClosed().subscribe(() => {
      localStorage.removeItem('forcaGameId');
      // Mantém o email para futuros jogos
    });
  }

  private limparERedirecionar(): void {
    localStorage.removeItem('forcaGameId');
    this.router.navigate(['/']);
  }

  handleLetraDoTeclado(letra: string): void {
    console.log('Letra clicada recebida no GameComponent:', letra);

    if (!this.jogo || !this.jogo.gameId) {
      console.error('Erro: Jogo, ID do jogo ou email do jogador ausente.');
      alert('O jogo não está pronto ou o email não foi carregado. Tente iniciar um novo jogo.');
      return;
    }

    this.forcaService.enviarPalpiteLetra(this.jogo.gameId, letra, this.emailDoJogador).subscribe({
      next: (jogoAtualizado: ForcaJogoResponse) => {
        this.jogo = {...jogoAtualizado, palpites: [...jogoAtualizado.palpites]};
        console.log('Estado do jogo atualizado após palpite:', this.jogo);
        
        // Usamos setTimeout para garantir que a detecção de mudanças aconteça após a atualização
        setTimeout(() => {
          this.cdr.detectChanges();
          this.verificarFimDeJogo();
        });
      },
      error: (erro) => {
        console.error('Erro ao enviar palpite:', erro);
        
        // Se o jogo não for encontrado (possivelmente finalizado), redireciona
        if (erro.status === 404) {
          alert('Este jogo não foi encontrado. Iniciando um novo jogo.');
          this.limparERedirecionar();
          return;
        }
        
        if (erro.status === 400 && erro.error && erro.error.message) {
          alert(`Erro no palpite: ${erro.error.message}`);
        } else {
          alert('Ocorreu um erro ao enviar seu palpite. Tente novamente.');
        }
      }
    });
  }

  // Método para voltar à seleção de jogos (se aplicável)
  voltarParaSelecao(): void {
    if (this.emailDoJogador) {
      this.router.navigate(['/selecao-jogos']);
    } else {
      this.router.navigate(['/']);
    }
  }

  voltarParaHome(): void {
    this.router.navigate(['/']);
  }

  get currentUrl(): string {
    return window.location.href;
  }

  // Adicionar este método no GameComponent
// O método pedirDica() permanece o mesmo, mas vamos adicionar uma melhoria
pedirDica(): void {
  if (!this.jogo || !this.jogo.gameId) {
    console.error('Erro: Jogo não carregado');
    return;
  }

  // Verificar se o jogo ainda está em andamento
  if (this.jogo.status !== 'Em andamento...') {
    alert('O jogo já foi finalizado!');
    return;
  }

  // Verificar se ainda há tentativas disponíveis
  if (this.jogo.maxErrors <= 1) {
    alert('Você não tem tentativas suficientes para pedir uma dica!');
    return;
  }

  // Verificar se já foi usada uma dica
  if (this.jogo.dicas && this.jogo.dicas.length > 0) {
    alert('Você já usou sua dica neste jogo!');
    return;
  }

  this.forcaService.pedirDica(this.jogo.gameId, this.emailDoJogador).subscribe({
    next: (jogoAtualizado: ForcaJogoResponse) => {
      this.jogo = jogoAtualizado;
      console.log('Dica recebida:', jogoAtualizado.dicas);
      
      // Feedback visual
      setTimeout(() => {
        this.cdr.detectChanges();
        // Scroll suave para a dica se necessário
        const dicaElement = document.querySelector('.dicas-header');
        if (dicaElement) {
          dicaElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    },
    error: (erro) => {
      console.error('Erro ao pedir dica:', erro);
      if (erro.status === 400 && erro.error && erro.error.message) {
        alert(`Erro: ${erro.error.message}`);
      } else {
        alert('Não foi possível obter uma dica. Tente novamente.');
      }
    }
  });
}
}