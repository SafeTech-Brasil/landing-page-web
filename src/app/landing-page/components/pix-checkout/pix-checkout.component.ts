import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  signal,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LucideAngularModule, Copy, Check, RefreshCw, Clock } from 'lucide-angular';
import { PropostaModalService } from '../../../services/proposta-modal.service';

@Component({
  selector: 'app-pix-checkout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule],
  template: `
    <div class="space-y-6">
      <div class="text-center">
        <h3 class="text-lg font-bold mb-1">Pague com PIX</h3>
        <p class="text-sm text-muted-foreground">Escaneie o QR Code ou copie o código</p>
      </div>

      <!-- QR Code -->
      <div class="flex justify-center">
        <div class="rounded-2xl border-2 border-primary/20 bg-white p-4 shadow-inner">
          <img
            [src]="'data:image/png;base64,' + qrCodeBase64"
            alt="QR Code PIX"
            class="w-52 h-52 block"
          />
        </div>
      </div>

      <!-- Countdown -->
      <div class="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <lucide-icon [img]="Clock" class="h-4 w-4" />
        <span>Expira em <strong class="text-foreground font-mono">{{ tempoRestante() }}</strong></span>
      </div>

      <!-- Código copia-e-cola -->
      <div class="space-y-2">
        <p class="text-xs font-medium text-muted-foreground uppercase tracking-wider">Código PIX copia e cola</p>
        <div class="flex gap-2">
          <div class="flex-1 rounded-lg border bg-muted/40 px-3 py-2 text-xs font-mono break-all text-muted-foreground select-all leading-relaxed">
            {{ codigoCopia }}
          </div>
          <button
            type="button"
            (click)="copiarCodigo()"
            class="flex-shrink-0 flex items-center gap-1.5 px-4 rounded-lg border-2 transition-all font-medium text-sm"
            [class]="copiado() ? 'border-green-500 text-green-600 bg-green-50 dark:bg-green-900/20' : 'border-primary text-primary hover:bg-primary/5'"
          >
            @if (copiado()) {
              <lucide-icon [img]="Check" class="h-4 w-4" />
              Copiado!
            } @else {
              <lucide-icon [img]="Copy" class="h-4 w-4" />
              Copiar
            }
          </button>
        </div>
      </div>

      <!-- Verificar status manualmente -->
      <button
        type="button"
        (click)="verificarManualmente()"
        [disabled]="verificando()"
        class="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-primary/30 text-primary text-sm font-medium hover:bg-primary/5 transition-colors disabled:opacity-60"
      >
        <lucide-icon
          [img]="RefreshCw"
          class="h-4 w-4"
          [class.animate-spin]="verificando()"
        />
        {{ verificando() ? 'Verificando...' : 'Já paguei — verificar confirmação' }}
      </button>

      <p class="text-center text-xs text-muted-foreground">
        O pagamento é confirmado automaticamente em instantes após o PIX ser efetuado.
      </p>
    </div>
  `,
})
export class PixCheckoutComponent implements OnInit, OnDestroy {
  @Input() propostaId!: string;
  @Input() qrCodeBase64!: string;
  @Input() codigoCopia!: string;
  @Input() expiracao!: string;
  @Output() pago = new EventEmitter<void>();
  @Output() erro = new EventEmitter<string>();

  readonly Copy = Copy;
  readonly Check = Check;
  readonly RefreshCw = RefreshCw;
  readonly Clock = Clock;

  private readonly modalService = inject(PropostaModalService);
  private readonly platformId = inject(PLATFORM_ID);

  copiado = signal(false);
  verificando = signal(false);
  tempoRestante = signal('--:--');

  private pollInterval?: ReturnType<typeof setInterval>;
  private countdownInterval?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.iniciarCountdown();
    this.iniciarPolling();
  }

  ngOnDestroy(): void {
    clearInterval(this.pollInterval);
    clearInterval(this.countdownInterval);
  }

  copiarCodigo(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    navigator.clipboard.writeText(this.codigoCopia).then(() => {
      this.copiado.set(true);
      setTimeout(() => this.copiado.set(false), 2500);
    }).catch(() => {
      this.copiado.set(true);
      setTimeout(() => this.copiado.set(false), 2500);
    });
  }

  verificarManualmente(): void {
    this.verificando.set(true);
    this.modalService.consultarStatus(this.propostaId).subscribe({
      next: (res) => {
        this.verificando.set(false);
        if (res.status === 'PAGO') {
          this.pago.emit();
        }
      },
      error: () => this.verificando.set(false),
    });
  }

  private iniciarPolling(): void {
    this.pollInterval = setInterval(() => {
      this.modalService.consultarStatus(this.propostaId).subscribe({
        next: (res) => {
          if (res.status === 'PAGO') {
            clearInterval(this.pollInterval);
            this.pago.emit();
          }
        },
      });
    }, 5000);
  }

  private iniciarCountdown(): void {
    const expiration = this.expiracao ? new Date(this.expiracao) : new Date(Date.now() + 30 * 60 * 1000);
    const update = () => {
      const diff = Math.max(0, expiration.getTime() - Date.now());
      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      this.tempoRestante.set(`${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
      if (diff === 0) clearInterval(this.countdownInterval);
    };
    update();
    this.countdownInterval = setInterval(update, 1000);
  }
}
