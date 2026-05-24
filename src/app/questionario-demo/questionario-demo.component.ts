import { Component, computed, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LucideAngularModule, ChevronLeft, ChevronRight, CheckCircle, Download, ArrowRight, Loader2 } from 'lucide-angular';
import { QuestionarioDemoStateService } from './services/questionario-demo-state.service';
import { QuestionarioDemoApiService, DemoRelatorioRequest } from './services/questionario-demo-api.service';
import { PerguntaDemoComponent } from './components/pergunta-demo.component';
import { PERGUNTAS_DEMO } from './data/perguntas.data';

type Step = 'questionario' | 'gerando' | 'concluido' | 'erro';

const PERGUNTAS_POR_PAGINA_DESKTOP = 5;
const PERGUNTAS_POR_PAGINA_MOBILE = 1;

@Component({
  selector: 'app-questionario-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule, PerguntaDemoComponent],
  template: `
    <div class="min-h-screen bg-background">
      <!-- Header -->
      <header class="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div class="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-lg font-bold text-secondary">PsicoSafe</span>
            <span class="hidden sm:inline text-muted-foreground text-sm">| Avaliação Gratuita</span>
          </div>
          @if (step() === 'questionario') {
            <span class="text-xs text-muted-foreground">
              {{ totalRespondidas() }}/{{ totalPerguntas }} respondidas
            </span>
          }
        </div>
      </header>

      <main class="max-w-3xl mx-auto px-4 py-8">

        <!-- STEP: Questionário -->
        @if (step() === 'questionario') {
          <div class="space-y-6">
            <div class="space-y-1">
              <h1 class="text-xl font-bold">Avaliação Psicossocial</h1>
              @if (participante()) {
                <p class="text-sm text-muted-foreground">Olá, <strong>{{ participante()!.nome }}</strong> — {{ participante()!.empresa }}</p>
              }
            </div>

            <!-- Progress bar -->
            <div class="space-y-1">
              <div class="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  class="h-full bg-secondary rounded-full transition-all duration-300"
                  [style.width.%]="progressoPct()"
                ></div>
              </div>
              <p class="text-xs text-muted-foreground text-right">Página {{ paginaAtual() + 1 }} de {{ totalPaginas() }}</p>
            </div>

            <!-- Perguntas da página -->
            <div class="space-y-4">
              @for (pergunta of perguntasDaPagina(); track pergunta.id) {
                <app-pergunta-demo
                  [pergunta]="pergunta"
                  [respostas]="respostasPossiveis"
                  [respostaSelecionada]="getRespostaValor(pergunta.id)"
                  (respondeu)="setResposta(pergunta.id, $event)"
                />
              }
            </div>

            <!-- Navegação -->
            <div class="flex items-center justify-between pt-2">
              <button
                type="button"
                (click)="prevPagina()"
                [disabled]="paginaAtual() === 0"
                class="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <lucide-icon [img]="ChevronLeft" class="h-4 w-4" />
                Anterior
              </button>

              @if (!isUltimaPagina()) {
                <button
                  type="button"
                  (click)="nextPagina()"
                  [disabled]="!paginaDaPageRespondida()"
                  class="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-secondary text-white text-sm font-medium hover:bg-secondary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Próxima
                  <lucide-icon [img]="ChevronRight" class="h-4 w-4" />
                </button>
              } @else {
                <button
                  type="button"
                  (click)="finalizar()"
                  [disabled]="!todasRespondidas()"
                  class="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-secondary text-white text-sm font-medium hover:bg-secondary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <lucide-icon [img]="CheckCircle" class="h-4 w-4" />
                  Finalizar e Gerar Relatório
                </button>
              }
            </div>
          </div>
        }

        <!-- STEP: Gerando relatório -->
        @if (step() === 'gerando') {
          <div class="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
            <div class="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center">
              <lucide-icon [img]="Loader2" class="h-8 w-8 text-secondary animate-spin" />
            </div>
            <div class="space-y-2">
              <h2 class="text-xl font-bold">Gerando seu relatório…</h2>
              <p class="text-sm text-muted-foreground max-w-sm">
                Estamos analisando suas respostas e preparando um relatório personalizado com a avaliação psicossocial.
              </p>
            </div>
          </div>
        }

        <!-- STEP: Concluído -->
        @if (step() === 'concluido') {
          <div class="flex flex-col items-center justify-center min-h-[60vh] space-y-8 text-center">
            <div class="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <lucide-icon [img]="CheckCircle" class="h-8 w-8 text-green-600" />
            </div>
            <div class="space-y-2">
              <h2 class="text-xl font-bold">Relatório pronto!</h2>
              <p class="text-sm text-muted-foreground max-w-sm">
                Seu relatório de avaliação psicossocial foi gerado com sucesso.
              </p>
            </div>

            <div class="flex flex-col sm:flex-row gap-3">
              <a
                [href]="pdfUrl()"
                [download]="nomeArquivoPdf()"
                class="flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary text-white font-semibold hover:bg-secondary/90 transition-colors"
              >
                <lucide-icon [img]="Download" class="h-4 w-4" />
                Baixar Relatório PDF
              </a>
              <a
                href="https://psicosafe.com.br"
                target="_blank"
                class="flex items-center gap-2 px-6 py-3 rounded-xl border border-secondary text-secondary font-semibold hover:bg-secondary/5 transition-colors"
              >
                Conhecer o PsicoSafe
                <lucide-icon [img]="ArrowRight" class="h-4 w-4" />
              </a>
            </div>
          </div>
        }

        <!-- STEP: Erro -->
        @if (step() === 'erro') {
          <div class="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
            <div class="space-y-2">
              <h2 class="text-xl font-bold text-destructive">Erro ao gerar relatório</h2>
              <p class="text-sm text-muted-foreground max-w-sm">{{ erroMsg() }}</p>
            </div>
            <button
              type="button"
              (click)="step.set('questionario')"
              class="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        }

      </main>
    </div>
  `
})
export class QuestionarioDemoComponent implements OnInit {
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;
  readonly CheckCircle = CheckCircle;
  readonly Download = Download;
  readonly ArrowRight = ArrowRight;
  readonly Loader2 = Loader2;

  private stateService = inject(QuestionarioDemoStateService);
  private apiService = inject(QuestionarioDemoApiService);
  private route = inject(ActivatedRoute);

  step = signal<Step>('questionario');
  pdfUrl = signal<string>('');
  erroMsg = signal<string>('');

  readonly respostasPossiveis = this.stateService.respostasPossiveis;
  readonly totalPerguntas = this.stateService.totalPerguntas;
  readonly todasRespondidas = computed(() => this.stateService.todasRespondidas());
  readonly totalRespondidas = computed(() => this.stateService.totalRespondidas());
  readonly participante = computed(() => this.stateService.participante());

  // Paginação
  private _paginaAtual = signal(0);
  private _isMobile = signal(window.innerWidth < 768);

  readonly paginaAtual = computed(() => this._paginaAtual());

  readonly perguntasPorPagina = computed(() =>
    this._isMobile() ? PERGUNTAS_POR_PAGINA_MOBILE : PERGUNTAS_POR_PAGINA_DESKTOP
  );

  readonly totalPaginas = computed(() =>
    Math.ceil(PERGUNTAS_DEMO.length / this.perguntasPorPagina())
  );

  readonly isUltimaPagina = computed(() =>
    this._paginaAtual() >= this.totalPaginas() - 1
  );

  readonly perguntasDaPagina = computed(() => {
    const inicio = this._paginaAtual() * this.perguntasPorPagina();
    return PERGUNTAS_DEMO.slice(inicio, inicio + this.perguntasPorPagina());
  });

  readonly paginaDaPageRespondida = computed(() => {
    const perguntas = this.perguntasDaPagina();
    const r = this.stateService.respostas();
    return perguntas.every(p => r[p.id] !== undefined);
  });

  readonly progressoPct = computed(() =>
    Math.round((this.totalRespondidas() / this.totalPerguntas) * 100)
  );

  ngOnInit(): void {
    const params = this.route.snapshot.queryParams;
    const nome = params['nome'] || '';
    const email = params['email'] || '';
    const empresa = params['empresa'] || '';

    if (nome || email || empresa) {
      this.stateService.setParticipante({ nome, email, empresa });
    }

    window.addEventListener('resize', () => {
      this._isMobile.set(window.innerWidth < 768);
    });
  }

  getRespostaValor(perguntaId: string): number | null {
    return this.stateService.getRespostaValor(perguntaId);
  }

  setResposta(perguntaId: string, valor: number): void {
    this.stateService.setResposta(perguntaId, valor);

    // No mobile, avança automaticamente após responder
    if (this._isMobile() && !this.isUltimaPagina() && this.paginaDaPageRespondida()) {
      setTimeout(() => this.nextPagina(), 300);
    }
  }

  nextPagina(): void {
    if (!this.isUltimaPagina()) {
      this._paginaAtual.update(p => p + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  prevPagina(): void {
    if (this._paginaAtual() > 0) {
      this._paginaAtual.update(p => p - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  finalizar(): void {
    if (!this.stateService.todasRespondidas()) return;

    const participante = this.stateService.participante();
    const respostas = this.stateService.buildPayload();

    const request: DemoRelatorioRequest = {
      nome: participante?.nome || '',
      email: participante?.email || '',
      empresa: participante?.empresa || '',
      respostas: respostas.map(r => {
        const pergunta = PERGUNTAS_DEMO.find(p => p.id === r.perguntaId)!;
        return { perguntaOrdem: pergunta.ordem, valor: r.valor };
      })
    };

    this.step.set('gerando');

    this.apiService.gerarRelatorio(request).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        this.pdfUrl.set(url);
        this.step.set('concluido');
      },
      error: (err) => {
        console.error('Erro ao gerar relatório:', err);
        this.erroMsg.set('Não foi possível gerar o relatório. Por favor, tente novamente.');
        this.step.set('erro');
      }
    });
  }

  nomeArquivoPdf(): string {
    const nome = this.stateService.participante()?.nome || 'avaliacao';
    return `relatorio-psicossocial-${nome.toLowerCase().replace(/\s+/g, '-')}.pdf`;
  }
}
