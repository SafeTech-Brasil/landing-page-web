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
import { LucideAngularModule, Copy, Check, RefreshCw, Clock, Smartphone, Scan, CircleCheck } from 'lucide-angular';
import { PropostaModalService } from '../../../services/proposta-modal.service';

@Component({
  selector: 'app-pix-checkout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule],
  template: `
    <div class="space-y-5">

      <!-- Header -->
      <div class="text-center space-y-1">
        <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-50 border-2 border-emerald-200 mb-1">
          <span class="text-3xl">💠</span>
        </div>
        <h3 class="text-xl font-bold text-slate-800">Pague com PIX</h3>
        <p class="text-sm text-slate-500">Escaneie o QR Code ou copie o código abaixo</p>
      </div>

      <!-- QR Code -->
      <div class="flex justify-center">
        <div class="rounded-2xl border-4 border-[#1e3a5f]/20 bg-white p-4 shadow-lg ring-1 ring-[#1e3a5f]/10">
          <img
            [src]="'data:image/png;base64,' + qrCodeBase64"
            alt="QR Code PIX"
            class="w-52 h-52 block rounded-lg"
          />
        </div>
      </div>

      <!-- Countdown -->
      <div class="flex items-center justify-center">
        <div class="flex items-center gap-2 px-5 py-2 rounded-full bg-amber-50 border border-amber-200">
          <lucide-icon [img]="Clock" class="h-4 w-4 text-amber-500 flex-shrink-0" />
          <span class="text-sm text-amber-700 font-medium">Expira em</span>
          <span class="font-mono font-bold text-amber-800 text-lg tracking-widest">{{ tempoRestante() }}</span>
        </div>
      </div>

      <!-- Código copia-e-cola -->
      <div class="space-y-2">
        <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Código PIX – Copia e Cola</p>
        <div class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-mono break-all text-slate-500 select-all leading-relaxed max-h-16 overflow-hidden">
          {{ codigoCopia }}
        </div>
        <button
          type="button"
          (click)="copiarCodigo()"
          class="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-95"
          [class]="copiado()
            ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200'
            : 'bg-[#1e3a5f] text-white hover:bg-[#162d4a] shadow-md shadow-slate-300/40'"
        >
          @if (copiado()) {
            <lucide-icon [img]="Check" class="h-4 w-4" />
            Código copiado com sucesso!
          } @else {
            <lucide-icon [img]="Copy" class="h-4 w-4" />
            Copiar código PIX
          }
        </button>
      </div>

      <!-- Como pagar -->
      <div class="space-y-2">
        <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Como pagar</p>
        <div class="grid grid-cols-3 gap-2">
          <div class="flex flex-col items-center text-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div class="w-7 h-7 rounded-full bg-[#1e3a5f] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">1</div>
            <lucide-icon [img]="Smartphone" class="h-5 w-5 text-[#1e3a5f]" />
            <span class="text-xs text-slate-600 leading-tight">Abra o app do seu banco</span>
          </div>
          <div class="flex flex-col items-center text-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div class="w-7 h-7 rounded-full bg-[#1e3a5f] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">2</div>
            <lucide-icon [img]="Scan" class="h-5 w-5 text-[#1e3a5f]" />
            <span class="text-xs text-slate-600 leading-tight">PIX → Copia e Cola</span>
          </div>
          <div class="flex flex-col items-center text-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div class="w-7 h-7 rounded-full bg-[#1e3a5f] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">3</div>
            <lucide-icon [img]="CircleCheck" class="h-5 w-5 text-[#1e3a5f]" />
            <span class="text-xs text-slate-600 leading-tight">Cole e confirme o valor</span>
          </div>
        </div>
      </div>

      <!-- Verificar + polling indicator -->
      <div class="space-y-2">
        <button
          type="button"
          (click)="verificarManualmente()"
          [disabled]="verificando()"
          class="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 text-sm font-medium hover:border-[#1e3a5f]/50 hover:text-[#1e3a5f] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <lucide-icon
            [img]="RefreshCw"
            class="h-4 w-4"
            [class.animate-spin]="verificando()"
          />
          {{ verificando() ? 'Verificando pagamento...' : 'Já paguei — verificar confirmação' }}
        </button>

        <div class="flex items-center justify-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span class="text-xs text-slate-400">Verificando automaticamente a cada 5 segundos</span>
        </div>
      </div>

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
  readonly Smartphone = Smartphone;
  readonly Scan = Scan;
  readonly CircleCheck = CircleCheck;

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
        if (res.status === 'PAGO') this.pago.emit();
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
