import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
  effect,
  ChangeDetectorRef,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { LucideAngularModule, X, CheckCircle, Loader, AlertCircle, Smartphone, CreditCard, ChevronLeft, ChevronRight, Mail, Phone, Settings, Rocket, PartyPopper, Shield } from 'lucide-angular';
import {
  PropostaModalService,
  PropostaRequest,
  PagamentoPIXResponse,
} from '../../../services/proposta-modal.service';
import { PixCheckoutComponent } from '../pix-checkout/pix-checkout.component';
import { CartaoCheckoutComponent } from '../cartao-checkout/cartao-checkout.component';

const RECAPTCHA_SITE_KEY = '6Le1d-csAAAAAETMIqHADoWgtNA-2X8g2NhvIcQ4';

type Step = 'dados-empresa' | 'metodo' | 'carregando-pix' | 'pix' | 'cartao' | 'sucesso' | 'erro';

@Component({
  selector: 'app-proposta-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, LucideAngularModule, PixCheckoutComponent, CartaoCheckoutComponent],
  template: `
    @if (modalService.isOpen()) {
      <!-- Backdrop -->
      <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        (click)="onBackdropClick($event)"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <!-- Card -->
        <div
          class="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl bg-card text-card-foreground shadow-2xl"
          (click)="$event.stopPropagation()"
        >

          <!-- ── Header fixo com identidade da marca ── -->
          <div class="sticky top-0 z-10 rounded-t-2xl overflow-hidden">
            <!-- Barra de acento gradiente -->
            <div class="h-1 bg-gradient-to-r from-[#1e3a5f] via-[#0ea5e9] to-[#10b981]"></div>
            <!-- Área do header -->
            <div class="flex items-center justify-between px-5 py-3.5 bg-card border-b border-border/60">
              <div class="flex items-center gap-2.5">
                @if (canGoBack()) {
                  <button type="button" (click)="voltar()"
                    class="p-1.5 rounded-full hover:bg-muted transition-colors"
                    aria-label="Voltar">
                    <lucide-icon [img]="ChevronLeft" class="h-4 w-4 text-muted-foreground" />
                  </button>
                }
                <div>
                  <p class="text-[10px] font-bold tracking-widest text-secondary uppercase leading-none">PsicoSafe</p>
                  <h2 id="modal-title" class="text-sm font-bold leading-snug mt-0.5">{{ stepTitle() }}</h2>
                </div>
              </div>
              <button type="button" (click)="fechar()"
                class="p-1.5 rounded-full hover:bg-muted transition-colors"
                aria-label="Fechar">
                <lucide-icon [img]="X" class="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          <div class="p-5 sm:p-6">

            <!-- ── Indicador de progresso (exceto sucesso/erro/loading) ── -->
            @if (step() !== 'sucesso' && step() !== 'erro' && step() !== 'carregando-pix') {
              <div class="flex items-start mb-5">
                @for (s of stepIndicators; track s.id; let i = $index; let last = $last) {
                  <div class="flex flex-col items-center">
                    <div
                      class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 flex-shrink-0"
                      [class]="isStepCompleted(s.id)
                        ? 'bg-secondary text-white shadow-sm'
                        : isStepActive(s.id)
                          ? 'bg-primary text-white shadow-sm'
                          : 'bg-muted text-muted-foreground'">
                      {{ i + 1 }}
                    </div>
                    <span class="text-[10px] font-medium mt-1 whitespace-nowrap"
                      [class]="isStepActive(s.id) ? 'text-primary font-semibold' : isStepCompleted(s.id) ? 'text-secondary' : 'text-muted-foreground'">
                      {{ s.label }}
                    </span>
                  </div>
                  @if (!last) {
                    <div class="flex-1 h-px mt-3.5 mx-2 transition-all duration-300"
                      [class]="isStepCompleted(s.id) ? 'bg-secondary' : 'bg-border'">
                    </div>
                  }
                }
              </div>
            }

            <!-- ══════════ STEP: DADOS DA EMPRESA ══════════ -->
            @if (step() === 'dados-empresa') {
              <div class="space-y-4">

                <!-- Card do plano – cabeçalho navy + grid de detalhes -->
                <div class="rounded-xl overflow-hidden border border-primary/20 shadow-sm">
                  <div class="bg-gradient-to-r from-[#1e3a5f] to-[#1e4d80] px-4 py-3 flex items-center justify-between">
                    <div>
                      <p class="text-[10px] font-semibold uppercase tracking-widest text-white/60">Plano selecionado</p>
                      <p class="text-base font-bold text-white leading-tight mt-0.5">{{ ctx()?.nomePlano }}</p>
                    </div>
                    <p class="text-xl font-bold text-secondary">{{ formatBRL(ctx()?.valorTotal ?? 0) }}</p>
                  </div>
                  <div class="bg-primary/5 px-4 py-2.5 flex items-center gap-3 text-xs text-muted-foreground divide-x divide-border/60">
                    <span class="pr-3">
                      <span class="font-semibold text-foreground">{{ ctx()?.quantidadeColaboradores }}</span> colaboradores
                    </span>
                    <span class="pl-3">
                      {{ ctx()?.tipoContratacao === 'PONTUAL' ? 'Contratação Avulsa' : 'Assinatura Mensal' }}
                    </span>
                  </div>
                </div>

                <form #f="ngForm" (ngSubmit)="enviarDadosEmpresa(f)" class="space-y-3" novalidate>
                  <!-- CNPJ -->
                  <div>
                    <label class="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">CNPJ</label>
                    <input name="cnpj" type="text" inputmode="numeric" [(ngModel)]="formEmpresa.cnpj"
                      (input)="onCnpjInput($event)" required minlength="18" maxlength="18"
                      placeholder="00.000.000/0000-00"
                      class="w-full h-11 rounded-lg border bg-background px-3 text-sm font-mono transition-colors focus:outline-none focus:ring-2"
                      [class]="f.submitted && f.controls['cnpj']?.invalid
                        ? 'border-red-400 focus:ring-red-200'
                        : 'border-input focus:border-primary focus:ring-primary/20'" />
                  </div>
                  <!-- Razão Social -->
                  <div>
                    <label class="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Razão Social</label>
                    <input name="razao" type="text" [(ngModel)]="formEmpresa.razaoSocial"
                      (ngModelChange)="saveCache()" required maxlength="200"
                      placeholder="Nome conforme CNPJ"
                      class="w-full h-11 rounded-lg border bg-background px-3 text-sm transition-colors focus:outline-none focus:ring-2"
                      [class]="f.submitted && f.controls['razao']?.invalid
                        ? 'border-red-400 focus:ring-red-200'
                        : 'border-input focus:border-primary focus:ring-primary/20'" />
                  </div>
                  <!-- Telefone + E-mail lado a lado -->
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Telefone</label>
                      <input name="telefone" type="tel" [(ngModel)]="formEmpresa.contatoTelefone"
                        (input)="onTelefoneInput($event)" required minlength="14"
                        placeholder="(11) 99999-9999"
                        class="w-full h-11 rounded-lg border bg-background px-3 text-sm font-mono transition-colors focus:outline-none focus:ring-2"
                        [class]="f.submitted && f.controls['telefone']?.invalid
                          ? 'border-red-400 focus:ring-red-200'
                          : 'border-input focus:border-primary focus:ring-primary/20'" />
                    </div>
                    <div>
                      <label class="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">E-mail</label>
                      <input name="email" type="email" [(ngModel)]="formEmpresa.contatoEmail"
                        (ngModelChange)="saveCache()" required email maxlength="150"
                        placeholder="admin@empresa.com"
                        class="w-full h-11 rounded-lg border bg-background px-3 text-sm transition-colors focus:outline-none focus:ring-2"
                        [class]="f.submitted && f.controls['email']?.invalid
                          ? 'border-red-400 focus:ring-red-200'
                          : 'border-input focus:border-primary focus:ring-primary/20'" />
                    </div>
                  </div>

                  <button type="submit" [disabled]="carregandoEmpresa()"
                    class="btn-secondary w-full min-h-[48px] font-semibold flex items-center justify-center gap-2 disabled:opacity-60 mt-1">
                    @if (carregandoEmpresa()) {
                      <lucide-icon [img]="Loader" class="h-4 w-4 animate-spin" />
                      Aguarde...
                    } @else {
                      Continuar para pagamento
                      <lucide-icon [img]="ChevronRight" class="h-4 w-4" />
                    }
                  </button>

                  <p class="text-[10px] text-muted-foreground text-center leading-relaxed">
                    Protegido por reCAPTCHA ·
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener" class="underline hover:text-foreground">Privacidade</a>
                    ·
                    <a href="https://policies.google.com/terms" target="_blank" rel="noopener" class="underline hover:text-foreground">Termos</a>
                  </p>
                </form>
              </div>
            }

            <!-- ══════════ STEP: MÉTODO DE PAGAMENTO ══════════ -->
            @if (step() === 'metodo') {
              <div class="space-y-3">

                <!-- Valor destacado -->
                <div class="text-center py-2">
                  <p class="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Valor a pagar</p>
                  <p class="text-3xl font-bold text-foreground mt-1">{{ formatBRL(ctx()?.valorTotal ?? 0) }}</p>
                </div>

                <!-- PIX -->
                <button type="button" (click)="selecionarPix()"
                  class="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-border hover:border-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all text-left group">
                  <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-md">
                    <lucide-icon [img]="Smartphone" class="h-6 w-6 text-white" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 flex-wrap">
                      <p class="font-semibold">PIX</p>
                      <span class="inline-flex items-center rounded-full bg-teal-100 dark:bg-teal-900/40 px-2 py-0.5 text-[10px] font-bold text-teal-700 dark:text-teal-300 uppercase tracking-wide">
                        Mais rápido
                      </span>
                    </div>
                    <p class="text-xs text-muted-foreground mt-0.5">Confirmação imediata · Qualquer banco ou carteira</p>
                  </div>
                  <lucide-icon [img]="ChevronRight" class="h-5 w-5 text-muted-foreground group-hover:text-teal-500 transition-colors flex-shrink-0" />
                </button>

                <!-- Cartão de crédito -->
                <button type="button" (click)="selecionarCartao()"
                  class="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-border hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-left group">
                  <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md">
                    <lucide-icon [img]="CreditCard" class="h-6 w-6 text-white" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 flex-wrap">
                      <p class="font-semibold">Cartão de Crédito</p>
                      @if (installmentCount() > 1) {
                        <span class="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wide">
                          até {{ installmentCount() }}x sem juros
                        </span>
                      }
                    </div>
                    <p class="text-xs text-muted-foreground mt-0.5">Visa, Mastercard, Elo, Amex e outros</p>
                  </div>
                  <lucide-icon [img]="ChevronRight" class="h-5 w-5 text-muted-foreground group-hover:text-blue-500 transition-colors flex-shrink-0" />
                </button>

                <!-- Nota de segurança -->
                <div class="flex items-center justify-center gap-1.5 pt-1">
                  <lucide-icon [img]="Shield" class="h-3.5 w-3.5 text-muted-foreground" />
                  <p class="text-[11px] text-muted-foreground">Pagamento 100% seguro e criptografado</p>
                </div>
              </div>
            }

            <!-- ══════════ STEP: CARREGANDO PIX ══════════ -->
            @if (step() === 'carregando-pix') {
              <div class="flex flex-col items-center justify-center gap-4 py-12">
                <div class="w-16 h-16 rounded-2xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                  <lucide-icon [img]="Loader" class="h-8 w-8 text-teal-600 dark:text-teal-400 animate-spin" />
                </div>
                <div class="text-center">
                  <p class="font-semibold">Gerando QR Code PIX</p>
                  <p class="text-sm text-muted-foreground mt-1">Aguarde um instante...</p>
                </div>
              </div>
            }

            <!-- ══════════ STEP: PIX ══════════ -->
            @if (step() === 'pix' && pixData()) {
              <app-pix-checkout
                [propostaId]="propostaId()"
                [qrCodeBase64]="pixData()!.qrCodeBase64"
                [codigoCopia]="pixData()!.codigoCopia"
                [expiracao]="pixData()!.expiracao"
                (pago)="onPago()"
                (erro)="onErro($event)"
              />
              <div class="mt-4 pt-4 border-t border-border/60 text-center">
                <button type="button" (click)="selecionarCartao()"
                  class="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-2 hover:underline">
                  <lucide-icon [img]="CreditCard" class="h-4 w-4" />
                  Prefiro pagar com cartão de crédito
                </button>
              </div>
            }

            <!-- ══════════ STEP: CARTÃO ══════════ -->
            @if (step() === 'cartao') {
              <app-cartao-checkout
                [propostaId]="propostaId()"
                [valorTotal]="ctx()?.valorTotal ?? 0"
                (pago)="onPago()"
                (erro)="onErro($event)"
              />
            }

            <!-- ══════════ STEP: SUCESSO ══════════ -->
            @if (step() === 'sucesso') {
              <div class="space-y-5 pb-2">

                <!-- Hero -->
                <div class="text-center space-y-3 pt-1">
                  <div class="flex justify-center">
                    <div class="relative">
                      <div class="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <lucide-icon [img]="CheckCircle" class="h-10 w-10 text-green-600 dark:text-green-400" />
                      </div>
                      <div class="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-yellow-100 dark:bg-yellow-900/40 flex items-center justify-center border-2 border-card">
                        <lucide-icon [img]="PartyPopper" class="h-4 w-4 text-yellow-500" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 class="text-xl font-bold">Contratação realizada!</h3>
                    <p class="text-sm text-muted-foreground mt-1">
                      Bem-vindo à PsicoSafe, <strong class="text-foreground">{{ formEmpresa.razaoSocial }}</strong>
                    </p>
                  </div>
                </div>

                <!-- Resumo contratado -->
                <div class="rounded-xl overflow-hidden border border-green-200 dark:border-green-800 shadow-sm">
                  <div class="bg-gradient-to-r from-green-600 to-emerald-500 px-4 py-2.5 flex items-center justify-between">
                    <p class="font-semibold text-white text-sm">{{ ctx()?.nomePlano }}</p>
                    <p class="font-bold text-white">{{ formatBRL(ctx()?.valorTotal ?? 0) }}</p>
                  </div>
                  <div class="bg-green-50 dark:bg-green-900/10 px-4 py-2 text-xs text-green-700 dark:text-green-400">
                    {{ ctx()?.quantidadeColaboradores }} colaboradores · {{ ctx()?.tipoContratacao === 'PONTUAL' ? 'Avulso' : 'Mensal' }}
                  </div>
                </div>

                <!-- Timeline -->
                <div>
                  <p class="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">O que acontece agora</p>
                  <ol class="space-y-0">
                    <li class="flex gap-3">
                      <div class="flex flex-col items-center">
                        <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <lucide-icon [img]="Mail" class="h-3.5 w-3.5 text-primary" />
                        </div>
                        <div class="w-px flex-1 bg-border mt-1 mb-1 min-h-[20px]"></div>
                      </div>
                      <div class="pb-3 pt-1 min-w-0">
                        <p class="text-sm font-semibold">Confirmação por e-mail</p>
                        <p class="text-xs text-muted-foreground mt-0.5">
                          Resumo enviado para <span class="font-medium text-foreground break-all">{{ formEmpresa.contatoEmail }}</span>
                        </p>
                      </div>
                    </li>
                    <li class="flex gap-3">
                      <div class="flex flex-col items-center">
                        <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <lucide-icon [img]="Phone" class="h-3.5 w-3.5 text-primary" />
                        </div>
                        <div class="w-px flex-1 bg-border mt-1 mb-1 min-h-[20px]"></div>
                      </div>
                      <div class="pb-3 pt-1 min-w-0">
                        <p class="text-sm font-semibold">Nossa equipe entra em contato</p>
                        <p class="text-xs text-muted-foreground mt-0.5">Em até <strong class="text-foreground">24 horas úteis</strong></p>
                      </div>
                    </li>
                    <li class="flex gap-3">
                      <div class="flex flex-col items-center">
                        <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <lucide-icon [img]="Settings" class="h-3.5 w-3.5 text-primary" />
                        </div>
                        <div class="w-px flex-1 bg-border mt-1 mb-1 min-h-[20px]"></div>
                      </div>
                      <div class="pb-3 pt-1 min-w-0">
                        <p class="text-sm font-semibold">Configuração do ambiente</p>
                        <p class="text-xs text-muted-foreground mt-0.5">Plataforma configurada com os dados da sua empresa</p>
                      </div>
                    </li>
                    <li class="flex gap-3">
                      <div class="flex flex-col items-center">
                        <div class="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                          <lucide-icon [img]="Rocket" class="h-3.5 w-3.5 text-secondary" />
                        </div>
                      </div>
                      <div class="pt-1 min-w-0">
                        <p class="text-sm font-semibold">Acesso liberado + onboarding</p>
                        <p class="text-xs text-muted-foreground mt-0.5">Credenciais e sessão guiada com nossa equipe</p>
                      </div>
                    </li>
                  </ol>
                </div>

                <div class="rounded-xl bg-muted/50 px-4 py-3 text-xs text-muted-foreground text-center">
                  Dúvidas? <span class="font-medium text-foreground">contato&#64;safetechpsicossocial.com.br</span>
                </div>

                <button type="button" (click)="fechar()" class="btn-secondary w-full min-h-[48px] font-semibold">
                  Entendido, até logo!
                </button>
              </div>
            }

            <!-- ══════════ STEP: ERRO ══════════ -->
            @if (step() === 'erro') {
              <div class="flex flex-col items-center text-center gap-5 py-8">
                <div class="w-20 h-20 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <lucide-icon [img]="AlertCircle" class="h-10 w-10 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 class="text-xl font-bold mb-1">Algo deu errado</h3>
                  <p class="text-sm text-muted-foreground max-w-xs mx-auto">{{ erroMensagem() }}</p>
                </div>
                <button type="button" (click)="voltarParaMetodo()" class="btn-secondary px-10 min-h-[44px]">
                  Tentar novamente
                </button>
              </div>
            }

          </div>
        </div>
      </div>
    }
  `,
})
export class PropostaModalComponent {
  readonly X = X;
  readonly CheckCircle = CheckCircle;
  readonly Loader = Loader;
  readonly AlertCircle = AlertCircle;
  readonly Smartphone = Smartphone;
  readonly CreditCard = CreditCard;
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;
  readonly Mail = Mail;
  readonly Phone = Phone;
  readonly Settings = Settings;
  readonly Rocket = Rocket;
  readonly PartyPopper = PartyPopper;
  readonly Shield = Shield;

  readonly modalService = inject(PropostaModalService);
  readonly ctx = this.modalService.context;
  readonly cdr = inject(ChangeDetectorRef);

  step = signal<Step>('dados-empresa');
  propostaId = signal('');
  pixData = signal<PagamentoPIXResponse | null>(null);
  erroMensagem = signal('');
  carregandoEmpresa = signal(false);

  formEmpresa = { cnpj: '', razaoSocial: '', contatoTelefone: '', contatoEmail: '' };

  private readonly CACHE_KEY = 'psicosafe_proposta_rascunho';

  constructor() {
    effect(() => {
      if (this.modalService.isOpen()) {
        this.loadCache();
      }
    });
  }

  readonly stepIndicators = [
    { id: 'dados-empresa', label: 'Empresa' },
    { id: 'metodo', label: 'Pagamento' },
    { id: 'confirmacao', label: 'Confirmação' },
  ];

  readonly installmentCount = () => {
    const v = this.ctx()?.valorTotal ?? 0;
    if (v >= 600) return 12;
    if (v >= 270) return 9;
    if (v >= 180) return 6;
    if (v >= 90) return 3;
    if (v >= 60) return 2;
    return 1;
  };

  stepTitle(): string {
    const map: Partial<Record<Step, string>> = {
      'dados-empresa': 'Dados da Empresa',
      'metodo': 'Forma de Pagamento',
      'carregando-pix': 'PIX',
      'pix': 'Pagar com PIX',
      'cartao': 'Cartão de Crédito',
      'sucesso': 'Tudo certo!',
      'erro': 'Ops...',
    };
    return map[this.step()] ?? '';
  }

  isStepCompleted(id: string): boolean {
    const order = ['dados-empresa', 'metodo', 'confirmacao'];
    const current = ['pix', 'cartao', 'carregando-pix'].includes(this.step()) ? 'confirmacao' : this.step();
    return order.indexOf(id) < order.indexOf(current);
  }

  isStepActive(id: string): boolean {
    const current = ['pix', 'cartao', 'carregando-pix'].includes(this.step()) ? 'confirmacao' : this.step();
    return id === current;
  }

  canGoBack(): boolean {
    return this.step() === 'cartao';
  }

  voltar(): void {
    if (this.step() === 'cartao') {
      if (this.pixData()) this.step.set('pix');
      else this.step.set('metodo');
    }
  }

  fechar(): void {
    this.step.set('dados-empresa');
    this.propostaId.set('');
    this.pixData.set(null);
    this.formEmpresa = { cnpj: '', razaoSocial: '', contatoTelefone: '', contatoEmail: '' };
    this.modalService.close();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.fechar();
  }

  voltarParaMetodo(): void {
    this.step.set('metodo');
  }

  onPago(): void {
    this.clearCache();
    this.step.set('sucesso');
  }

  onErro(msg: string): void {
    this.erroMensagem.set(msg);
    this.step.set('erro');
  }

  enviarDadosEmpresa(f: NgForm): void {
    if (f.invalid) return;

    const ctx = this.ctx();
    if (!ctx) return;

    const grecaptcha = (window as any)['grecaptcha'];
    if (!grecaptcha) {
      this.erroMensagem.set('reCAPTCHA não disponível. Recarregue a página e tente novamente.');
      this.step.set('erro');
      return;
    }

    this.carregandoEmpresa.set(true);

    grecaptcha.ready(() => {
      grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'proposta' }).then((token: string) => {
        const request: PropostaRequest = {
          cnpj: this.formEmpresa.cnpj.replace(/\D/g, ''),
          razaoSocial: this.formEmpresa.razaoSocial,
          contatoTelefone: this.formEmpresa.contatoTelefone.replace(/\D/g, ''),
          contatoEmail: this.formEmpresa.contatoEmail,
          plano: ctx.plano,
          tipoContratacao: ctx.tipoContratacao,
          quantidadeColaboradores: ctx.quantidadeColaboradores,
          recaptchaToken: token,
        };

        this.modalService.criarProposta(request).subscribe({
          next: (res) => {
            this.carregandoEmpresa.set(false);
            this.propostaId.set(res.id);
            if (res.pixQrCodeBase64 && res.pixCodigoCopia) {
              this.pixData.set({
                paymentId: res.id,
                qrCodeBase64: res.pixQrCodeBase64,
                codigoCopia: res.pixCodigoCopia,
                expiracao: res.pixExpiracao ?? '',
              });
              this.step.set('pix');
            } else {
              this.step.set('metodo');
            }
            this.saveCache();
          },
          error: (err) => {
            this.carregandoEmpresa.set(false);
            const msg = err?.error?.message ?? 'Erro ao registrar proposta. Tente novamente.';
            this.erroMensagem.set(msg);
            this.step.set('erro');
          },
        });
      });
    });
  }

  selecionarPix(): void {
    this.step.set('carregando-pix');
    this.modalService.iniciarPix(this.propostaId()).subscribe({
      next: (res) => {
        this.pixData.set(res);
        this.step.set('pix');
      },
      error: (err) => {
        const msg = err?.error?.message ?? 'Erro ao gerar QR Code PIX.';
        this.onErro(msg);
      },
    });
  }

  selecionarCartao(): void {
    this.step.set('cartao');
  }

  onCnpjInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let v = input.value.replace(/\D/g, '').slice(0, 14);
    if (v.length > 12) v = v.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, '$1.$2.$3/$4-$5');
    else if (v.length > 8) v = v.replace(/^(\d{2})(\d{3})(\d{3})(\d{0,4})/, '$1.$2.$3/$4');
    else if (v.length > 5) v = v.replace(/^(\d{2})(\d{3})(\d{0,3})/, '$1.$2.$3');
    else if (v.length > 2) v = v.replace(/^(\d{2})(\d{0,3})/, '$1.$2');
    input.value = v;
    this.formEmpresa.cnpj = v;
    this.saveCache();
  }

  onTelefoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let v = input.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 10) v = v.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    else if (v.length > 6) v = v.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    else if (v.length > 2) v = v.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    input.value = v;
    this.formEmpresa.contatoTelefone = v;
    this.saveCache();
  }

  saveCache(): void {
    const s = this.step();
    const draft: Record<string, unknown> = {
      formEmpresa: { ...this.formEmpresa },
      propostaId: this.propostaId(),
      step: (s === 'pix' || s === 'metodo') ? s : 'dados-empresa',
    };
    if (s === 'pix' && this.pixData()) {
      draft['pixData'] = this.pixData();
    }
    localStorage.setItem(this.CACHE_KEY, JSON.stringify(draft));
  }

  private loadCache(): void {
    try {
      const raw = localStorage.getItem(this.CACHE_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw);
      if (draft.formEmpresa) {
        this.formEmpresa = { ...this.formEmpresa, ...draft.formEmpresa };
      }
      if (draft.propostaId) {
        this.propostaId.set(draft.propostaId);
        if (draft.step === 'pix' && draft.pixData) {
          this.pixData.set(draft.pixData);
          this.step.set('pix');
        } else if (draft.step === 'metodo') {
          this.step.set('metodo');
        }
      }
      this.cdr.markForCheck();
    } catch { /* ignore corrupt data */ }
  }

  private clearCache(): void {
    localStorage.removeItem(this.CACHE_KEY);
  }

  formatBRL(value: number): string {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}
