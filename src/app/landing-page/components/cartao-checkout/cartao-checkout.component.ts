import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  signal,
  computed,
  inject,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { LucideAngularModule, CreditCard, Lock } from 'lucide-angular';
import {
  PropostaModalService,
  PagamentoCartaoRequest,
} from '../../../services/proposta-modal.service';

interface InstallmentOption {
  n: number;
  parcela: number;
  label: string;
}

@Component({
  selector: 'app-cartao-checkout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, LucideAngularModule],
  template: `
    <div class="space-y-5">
      <div>
        <h3 class="text-lg font-bold mb-1">Cartão de Crédito</h3>
        <p class="text-sm text-muted-foreground">Dados do cartão são transmitidos com criptografia.</p>
      </div>

      <!-- Card preview -->
      <div class="rounded-2xl p-5 text-white relative overflow-hidden"
           [class]="cardBrandClass()">
        <div class="absolute inset-0 opacity-10"
             style="background: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.1) 10px, rgba(255,255,255,.1) 11px)"></div>
        <div class="relative z-10">
          <div class="flex justify-between items-start mb-6">
            <lucide-icon [img]="CreditCard" class="h-8 w-8 opacity-80" />
            <span class="text-sm font-bold uppercase tracking-widest opacity-80">{{ cardBrandLabel() }}</span>
          </div>
          <p class="font-mono text-xl tracking-widest mb-3 min-h-[1.75rem]">{{ maskedNumber() }}</p>
          <div class="flex justify-between text-xs uppercase tracking-wider opacity-70">
            <span>{{ form.nomeTitular || 'NOME DO TITULAR' }}</span>
            <span>{{ form.mesValidade || 'MM' }}/{{ form.anoValidade ? form.anoValidade.slice(-2) : 'AA' }}</span>
          </div>
        </div>
      </div>

      <form #f="ngForm" (ngSubmit)="enviar(f)" class="space-y-4" novalidate>
        <!-- Número do cartão -->
        <div>
          <label class="block text-sm font-medium mb-1">Número do Cartão</label>
          <input
            name="numero"
            type="text"
            inputmode="numeric"
            [(ngModel)]="form.numeroCartao"
            (input)="onCardInput($event)"
            required
            placeholder="0000 0000 0000 0000"
            maxlength="19"
            autocomplete="cc-number"
            class="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
            [class.border-destructive]="f.submitted && f.controls['numero']?.invalid"
          />
        </div>

        <!-- Nome no cartão -->
        <div>
          <label class="block text-sm font-medium mb-1">Nome no Cartão</label>
          <input
            name="nome"
            type="text"
            [(ngModel)]="form.nomeTitular"
            required
            placeholder="Como aparece no cartão"
            autocomplete="cc-name"
            class="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-ring"
            [class.border-destructive]="f.submitted && f.controls['nome']?.invalid"
          />
        </div>

        <!-- Validade + CCV -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium mb-1">Validade</label>
            <div class="flex gap-1">
              <input
                name="mes"
                type="text"
                inputmode="numeric"
                [(ngModel)]="form.mesValidade"
                (input)="onMesInput($event)"
                required
                placeholder="MM"
                maxlength="2"
                autocomplete="cc-exp-month"
                class="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-center font-mono focus:outline-none focus:ring-2 focus:ring-ring"
                [class.border-destructive]="f.submitted && f.controls['mes']?.invalid"
              />
              <span class="flex items-center text-muted-foreground font-bold">/</span>
              <input
                #anoRef
                name="ano"
                type="text"
                inputmode="numeric"
                [(ngModel)]="form.anoValidade"
                (input)="onAnoInput($event)"
                required
                placeholder="AAAA"
                maxlength="4"
                autocomplete="cc-exp-year"
                class="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-center font-mono focus:outline-none focus:ring-2 focus:ring-ring"
                [class.border-destructive]="f.submitted && f.controls['ano']?.invalid"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">CCV</label>
            <input
              name="ccv"
              type="text"
              inputmode="numeric"
              [(ngModel)]="form.ccv"
              (input)="onCcvInput($event)"
              required
              [placeholder]="isAmex() ? '0000' : '000'"
              [maxlength]="isAmex() ? 4 : 3"
              autocomplete="cc-csc"
              class="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-center font-mono focus:outline-none focus:ring-2 focus:ring-ring"
              [class.border-destructive]="f.submitted && f.controls['ccv']?.invalid"
            />
          </div>
        </div>

        <!-- Separador -->
        <div class="border-t border-dashed" aria-hidden="true"></div>

        <!-- CPF do titular -->
        <div>
          <label class="block text-sm font-medium mb-1">CPF do Titular</label>
          <input
            name="cpf"
            type="text"
            inputmode="numeric"
            [(ngModel)]="form.cpfTitular"
            (input)="onCpfInput($event)"
            required
            placeholder="000.000.000-00"
            maxlength="14"
            class="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
            [class.border-destructive]="f.submitted && f.controls['cpf']?.invalid"
          />
        </div>

        <!-- CEP + Número -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium mb-1">CEP (cobrança)</label>
            <input
              name="cep"
              type="text"
              inputmode="numeric"
              [(ngModel)]="form.cep"
              (input)="onCepInput($event)"
              required
              placeholder="00000-000"
              maxlength="9"
              class="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
              [class.border-destructive]="f.submitted && f.controls['cep']?.invalid"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Número</label>
            <input
              name="numero_end"
              type="text"
              [(ngModel)]="form.numeroEndereco"
              required
              placeholder="123"
              class="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              [class.border-destructive]="f.submitted && f.controls['numero_end']?.invalid"
            />
          </div>
        </div>

        <!-- Parcelamento -->
        <div>
          <label class="block text-sm font-medium mb-2">Parcelamento</label>
          <div class="grid gap-2">
            @for (opt of installmentOptions(); track opt.n) {
              <button
                type="button"
                (click)="form.parcelas = opt.n"
                class="flex justify-between items-center px-4 py-3 rounded-xl border-2 transition-all text-sm"
                [class]="form.parcelas === opt.n
                  ? 'border-primary bg-primary/5 font-semibold text-foreground'
                  : 'border-input hover:border-primary/40 text-muted-foreground hover:text-foreground'"
              >
                <span>{{ opt.label }}</span>
                @if (opt.n > 1) {
                  <span class="text-xs text-muted-foreground">sem juros</span>
                }
              </button>
            }
          </div>
        </div>

        <!-- Submit -->
        <button
          type="submit"
          [disabled]="carregando()"
          class="btn-secondary w-full min-h-[50px] font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <lucide-icon [img]="Lock" class="h-4 w-4" />
          {{ carregando() ? 'Processando...' : 'Pagar ' + formatBRL(valorTotal) }}
        </button>

        <p class="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <lucide-icon [img]="Lock" class="h-3.5 w-3.5" />
          Pagamento seguro via Asaas. Dados criptografados.
        </p>
      </form>
    </div>
  `,
})
export class CartaoCheckoutComponent {
  @Input() propostaId!: string;
  @Input() valorTotal = 0;
  @Output() pago = new EventEmitter<void>();
  @Output() erro = new EventEmitter<string>();

  readonly CreditCard = CreditCard;
  readonly Lock = Lock;

  private readonly modalService = inject(PropostaModalService);

  carregando = signal(false);

  form: {
    nomeTitular: string;
    numeroCartao: string;
    mesValidade: string;
    anoValidade: string;
    ccv: string;
    cpfTitular: string;
    cep: string;
    numeroEndereco: string;
    parcelas: number;
  } = {
    nomeTitular: '',
    numeroCartao: '',
    mesValidade: '',
    anoValidade: '',
    ccv: '',
    cpfTitular: '',
    cep: '',
    numeroEndereco: '',
    parcelas: 1,
  };

  readonly installmentOptions = computed((): InstallmentOption[] => {
    const opts: InstallmentOption[] = [];
    const limites = [1, 2, 3, 6, 9, 12];
    for (const n of limites) {
      const parcela = this.valorTotal / n;
      if (parcela >= 30) {
        opts.push({
          n,
          parcela,
          label:
            n === 1
              ? `1x de ${this.formatBRL(parcela)} (à vista)`
              : `${n}x de ${this.formatBRL(parcela)}`,
        });
      }
    }
    return opts;
  });

  cardBrand = computed(() => {
    const v = this.form.numeroCartao.replace(/\s/g, '');
    if (/^4/.test(v)) return 'visa';
    if (/^5[1-5]/.test(v) || /^2[2-7]/.test(v)) return 'mastercard';
    if (/^3[47]/.test(v)) return 'amex';
    if (/^6(?:011|5)/.test(v)) return 'elo';
    return 'default';
  });

  isAmex = computed(() => this.cardBrand() === 'amex');

  cardBrandClass = computed(() => {
    const map: Record<string, string> = {
      visa: 'bg-gradient-to-br from-blue-700 to-blue-900',
      mastercard: 'bg-gradient-to-br from-red-600 to-orange-600',
      amex: 'bg-gradient-to-br from-teal-600 to-teal-800',
      elo: 'bg-gradient-to-br from-yellow-500 to-yellow-700',
      default: 'bg-gradient-to-br from-slate-600 to-slate-800',
    };
    return map[this.cardBrand()];
  });

  cardBrandLabel = computed(() => {
    const map: Record<string, string> = {
      visa: 'VISA',
      mastercard: 'MASTERCARD',
      amex: 'AMEX',
      elo: 'ELO',
      default: '',
    };
    return map[this.cardBrand()];
  });

  maskedNumber = computed(() => {
    const v = this.form.numeroCartao || '';
    return v.padEnd(19, '·').slice(0, 19);
  });

  enviar(f: NgForm): void {
    if (f.invalid) return;
    this.carregando.set(true);

    const request: PagamentoCartaoRequest = {
      nomeTitular: this.form.nomeTitular.toUpperCase(),
      numeroCartao: this.form.numeroCartao.replace(/\s/g, ''),
      mesValidade: this.form.mesValidade,
      anoValidade: this.form.anoValidade,
      ccv: this.form.ccv,
      cpfTitular: this.form.cpfTitular.replace(/\D/g, ''),
      cep: this.form.cep.replace(/\D/g, ''),
      numeroEndereco: this.form.numeroEndereco,
      parcelas: this.form.parcelas,
    };

    this.modalService.iniciarCartao(this.propostaId, request).subscribe({
      next: (res) => {
        this.carregando.set(false);
        if (res.status === 'PAGO' || res.status === 'AGUARDANDO') {
          this.pago.emit();
        } else {
          this.erro.emit(res.mensagem || 'Erro ao processar pagamento.');
        }
      },
      error: (err) => {
        this.carregando.set(false);
        const msg = err?.error?.message ?? 'Pagamento recusado. Verifique os dados e tente novamente.';
        this.erro.emit(msg);
      },
    });
  }

  onCardInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let v = input.value.replace(/\D/g, '').slice(0, 16);
    v = v.replace(/(.{4})/g, '$1 ').trim();
    input.value = v;
    this.form.numeroCartao = v;
  }

  onMesInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let v = input.value.replace(/\D/g, '').slice(0, 2);
    if (v.length === 2 && parseInt(v) > 12) v = '12';
    input.value = v;
    this.form.mesValidade = v;
  }

  onAnoInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const v = input.value.replace(/\D/g, '').slice(0, 4);
    input.value = v;
    this.form.anoValidade = v;
  }

  onCcvInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const max = this.isAmex() ? 4 : 3;
    const v = input.value.replace(/\D/g, '').slice(0, max);
    input.value = v;
    this.form.ccv = v;
  }

  onCpfInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let v = input.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4');
    else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3');
    else if (v.length > 3) v = v.replace(/(\d{3})(\d{0,3})/, '$1.$2');
    input.value = v;
    this.form.cpfTitular = v;
  }

  onCepInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let v = input.value.replace(/\D/g, '').slice(0, 8);
    if (v.length > 5) v = v.replace(/(\d{5})(\d{0,3})/, '$1-$2');
    input.value = v;
    this.form.cep = v;
  }

  formatBRL(value: number): string {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}
