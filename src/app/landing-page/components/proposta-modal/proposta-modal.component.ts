import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { LucideAngularModule, X, CheckCircle, Loader, AlertCircle, Smartphone, CreditCard, ChevronLeft, Mail, Phone, Settings, Rocket, PartyPopper } from 'lucide-angular';
import {
  PropostaModalService,
  PropostaRequest,
  PagamentoPIXResponse,
} from '../../../services/proposta-modal.service';
import { PixCheckoutComponent } from '../pix-checkout/pix-checkout.component';
import { CartaoCheckoutComponent } from '../cartao-checkout/cartao-checkout.component';

type Step = 'dados-empresa' | 'metodo' | 'carregando-pix' | 'pix' | 'cartao' | 'sucesso' | 'erro';

@Component({
  selector: 'app-proposta-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, LucideAngularModule, PixCheckoutComponent, CartaoCheckoutComponent],
  template: `
    @if (modalService.isOpen()) {
      <!-- Backdrop -->
      <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        (click)="onBackdropClick($event)"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <!-- Card -->
        <div
          class="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl bg-card text-card-foreground shadow-2xl border border-border"
          (click)="$event.stopPropagation()"
        >
          <!-- Header fixo -->
          <div class="sticky top-0 z-10 flex items-center justify-between p-5 pb-4 bg-card border-b border-border/60">
            <div class="flex items-center gap-2">
              @if (canGoBack()) {
                <button type="button" (click)="voltar()" class="p-1.5 rounded-full hover:bg-muted transition-colors mr-1" aria-label="Voltar">
                  <lucide-icon [img]="ChevronLeft" class="h-5 w-5 text-muted-foreground" />
                </button>
              }
              <h2 id="modal-title" class="text-base font-bold">{{ stepTitle() }}</h2>
            </div>
            <button type="button" (click)="fechar()" class="p-1.5 rounded-full hover:bg-muted transition-colors" aria-label="Fechar">
              <lucide-icon [img]="X" class="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          <div class="p-5 sm:p-6">

            <!-- Indicador de steps (exceto sucesso/erro) -->
            @if (step() !== 'sucesso' && step() !== 'erro') {
              <div class="flex items-center gap-1.5 mb-5">
                @for (s of stepIndicators; track s.id) {
                  <div class="flex items-center gap-1.5 flex-1">
                    <div class="h-1.5 flex-1 rounded-full transition-all duration-300"
                         [class]="isStepCompleted(s.id) ? 'bg-primary' : isStepActive(s.id) ? 'bg-primary/40' : 'bg-muted'"></div>
                  </div>
                }
              </div>
            }

            <!-- ============ STEP: DADOS DA EMPRESA ============ -->
            @if (step() === 'dados-empresa') {
              <div class="space-y-4">
                <!-- Resumo do plano -->
                <div class="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-1.5">
                  <div class="flex justify-between text-sm">
                    <span class="text-muted-foreground">Plano</span>
                    <span class="font-semibold text-secondary">{{ ctx()?.nomePlano }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-muted-foreground">Colaboradores</span>
                    <span class="font-medium">{{ ctx()?.quantidadeColaboradores }}</span>
                  </div>
                  <div class="flex justify-between items-center pt-1 border-t border-primary/10">
                    <span class="text-muted-foreground text-sm">Total</span>
                    <span class="text-xl font-bold">{{ formatBRL(ctx()?.valorTotal ?? 0) }}</span>
                  </div>
                </div>

                <form #f="ngForm" (ngSubmit)="enviarDadosEmpresa(f)" class="space-y-3" novalidate>
                  <div>
                    <label class="block text-sm font-medium mb-1">CNPJ</label>
                    <input name="cnpj" type="text" inputmode="numeric" [(ngModel)]="formEmpresa.cnpj"
                      (input)="onCnpjInput($event)" required minlength="18" maxlength="18"
                      placeholder="00.000.000/0000-00"
                      class="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
                      [class.border-destructive]="f.submitted && f.controls['cnpj']?.invalid" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-1">Razão Social</label>
                    <input name="razao" type="text" [(ngModel)]="formEmpresa.razaoSocial" required
                      placeholder="Nome conforme CNPJ"
                      class="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      [class.border-destructive]="f.submitted && f.controls['razao']?.invalid" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-1">Telefone</label>
                    <input name="telefone" type="tel" [(ngModel)]="formEmpresa.contatoTelefone"
                      (input)="onTelefoneInput($event)" required minlength="14"
                      placeholder="(11) 99999-9999"
                      class="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
                      [class.border-destructive]="f.submitted && f.controls['telefone']?.invalid" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-1">E-mail do Administrador</label>
                    <input name="email" type="email" [(ngModel)]="formEmpresa.contatoEmail" required email
                      placeholder="admin@empresa.com.br"
                      class="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      [class.border-destructive]="f.submitted && f.controls['email']?.invalid" />
                  </div>
                  <button type="submit" [disabled]="carregandoEmpresa()"
                    class="btn-secondary w-full min-h-[48px] font-semibold flex items-center justify-center gap-2 disabled:opacity-60 mt-2">
                    @if (carregandoEmpresa()) {
                      <lucide-icon [img]="Loader" class="h-4 w-4 animate-spin" />
                      Aguarde...
                    } @else {
                      Continuar para pagamento
                    }
                  </button>
                </form>
              </div>
            }

            <!-- ============ STEP: MÉTODO DE PAGAMENTO ============ -->
            @if (step() === 'metodo') {
              <div class="space-y-4">
                <p class="text-sm text-muted-foreground text-center">
                  Escolha como deseja pagar <strong>{{ formatBRL(ctx()?.valorTotal ?? 0) }}</strong>
                </p>

                <!-- PIX -->
                <button type="button" (click)="selecionarPix()"
                  class="w-full flex items-start gap-4 p-5 rounded-2xl border-2 hover:border-primary transition-all text-left group">
                  <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                    <lucide-icon [img]="Smartphone" class="h-6 w-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-semibold">PIX</p>
                    <p class="text-sm text-muted-foreground">Confirmação imediata. Qualquer banco ou carteira digital.</p>
                    <span class="inline-flex mt-1.5 items-center rounded-full bg-teal-100 dark:bg-teal-900/30 px-2.5 py-0.5 text-xs font-medium text-teal-700 dark:text-teal-300">
                      Mais rápido
                    </span>
                  </div>
                </button>

                <!-- Cartão de crédito -->
                <button type="button" (click)="selecionarCartao()"
                  class="w-full flex items-start gap-4 p-5 rounded-2xl border-2 hover:border-primary transition-all text-left group">
                  <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <lucide-icon [img]="CreditCard" class="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-semibold">Cartão de Crédito</p>
                    <p class="text-sm text-muted-foreground">Visa, Mastercard, Elo, Amex e outros.</p>
                    @if ((installmentCount()) > 1) {
                      <span class="inline-flex mt-1.5 items-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300">
                        Parcelável em até {{ installmentCount() }}x sem juros
                      </span>
                    }
                  </div>
                </button>
              </div>
            }

            <!-- ============ STEP: CARREGANDO PIX ============ -->
            @if (step() === 'carregando-pix') {
              <div class="flex flex-col items-center justify-center gap-4 py-10">
                <lucide-icon [img]="Loader" class="h-10 w-10 text-primary animate-spin" />
                <p class="text-muted-foreground text-sm">Gerando QR Code PIX...</p>
              </div>
            }

            <!-- ============ STEP: PIX ============ -->
            @if (step() === 'pix' && pixData()) {
              <app-pix-checkout
                [propostaId]="propostaId()"
                [qrCodeBase64]="pixData()!.qrCodeBase64"
                [codigoCopia]="pixData()!.codigoCopia"
                [expiracao]="pixData()!.expiracao"
                (pago)="onPago()"
                (erro)="onErro($event)"
              />
            }

            <!-- ============ STEP: CARTÃO ============ -->
            @if (step() === 'cartao') {
              <app-cartao-checkout
                [propostaId]="propostaId()"
                [valorTotal]="ctx()?.valorTotal ?? 0"
                (pago)="onPago()"
                (erro)="onErro($event)"
              />
            }

            <!-- ============ STEP: SUCESSO ============ -->
            @if (step() === 'sucesso') {
              <div class="space-y-6 pb-2">

                <!-- Hero de sucesso -->
                <div class="text-center space-y-3 pt-2">
                  <div class="flex justify-center">
                    <div class="relative">
                      <div class="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <lucide-icon [img]="CheckCircle" class="h-10 w-10 text-green-600 dark:text-green-400" />
                      </div>
                      <div class="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-yellow-100 dark:bg-yellow-900/40 flex items-center justify-center border-2 border-card">
                        <lucide-icon [img]="PartyPopper" class="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 class="text-xl font-bold">Contratação realizada!</h3>
                    <p class="text-sm text-muted-foreground mt-1">
                      Bem-vindo à Psicosafe, <strong class="text-foreground">{{ formEmpresa.razaoSocial }}</strong>
                    </p>
                  </div>
                </div>

                <!-- Resumo contratado -->
                <div class="rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10 px-4 py-3 flex items-center justify-between gap-4 text-sm">
                  <div>
                    <p class="font-semibold text-green-800 dark:text-green-300">{{ ctx()?.nomePlano }}</p>
                    <p class="text-green-700 dark:text-green-400 text-xs mt-0.5">
                      {{ ctx()?.quantidadeColaboradores }} colaboradores · {{ ctx()?.tipoContratacao === 'PONTUAL' ? 'Avulso' : 'Mensal' }}
                    </p>
                  </div>
                  <span class="font-bold text-green-800 dark:text-green-300 whitespace-nowrap">
                    {{ formatBRL(ctx()?.valorTotal ?? 0) }}
                  </span>
                </div>

                <!-- Timeline de próximos passos -->
                <div>
                  <p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">O que acontece agora</p>
                  <ol class="space-y-0">

                    <!-- Passo 1 -->
                    <li class="flex gap-4">
                      <div class="flex flex-col items-center">
                        <div class="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <lucide-icon [img]="Mail" class="h-4 w-4 text-primary" />
                        </div>
                        <div class="w-px flex-1 bg-border mt-1 mb-1 min-h-[24px]"></div>
                      </div>
                      <div class="pb-4 pt-1.5 min-w-0">
                        <p class="text-sm font-semibold leading-tight">Confirmação por e-mail</p>
                        <p class="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                          Um resumo da contratação foi enviado para
                          <span class="font-medium text-foreground break-all">{{ formEmpresa.contatoEmail }}</span>.
                        </p>
                      </div>
                    </li>

                    <!-- Passo 2 -->
                    <li class="flex gap-4">
                      <div class="flex flex-col items-center">
                        <div class="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <lucide-icon [img]="Phone" class="h-4 w-4 text-primary" />
                        </div>
                        <div class="w-px flex-1 bg-border mt-1 mb-1 min-h-[24px]"></div>
                      </div>
                      <div class="pb-4 pt-1.5 min-w-0">
                        <p class="text-sm font-semibold leading-tight">Nossa equipe entra em contato</p>
                        <p class="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                          Em até <strong class="text-foreground">24 horas úteis</strong> um especialista
                          liga ou envia mensagem para o número informado.
                        </p>
                      </div>
                    </li>

                    <!-- Passo 3 -->
                    <li class="flex gap-4">
                      <div class="flex flex-col items-center">
                        <div class="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <lucide-icon [img]="Settings" class="h-4 w-4 text-primary" />
                        </div>
                        <div class="w-px flex-1 bg-border mt-1 mb-1 min-h-[24px]"></div>
                      </div>
                      <div class="pb-4 pt-1.5 min-w-0">
                        <p class="text-sm font-semibold leading-tight">Configuração do ambiente</p>
                        <p class="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                          Configuramos a plataforma com os dados da sua empresa e cadastramos
                          os primeiros acessos de administrador.
                        </p>
                      </div>
                    </li>

                    <!-- Passo 4 (sem linha abaixo) -->
                    <li class="flex gap-4">
                      <div class="flex flex-col items-center">
                        <div class="w-9 h-9 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                          <lucide-icon [img]="Rocket" class="h-4 w-4 text-secondary" />
                        </div>
                      </div>
                      <div class="pt-1.5 min-w-0">
                        <p class="text-sm font-semibold leading-tight">Acesso liberado + onboarding</p>
                        <p class="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                          Recebe as credenciais e uma sessão guiada para explorar todos os recursos
                          da plataforma com nossa equipe.
                        </p>
                      </div>
                    </li>

                  </ol>
                </div>

                <!-- Rodapé -->
                <div class="rounded-xl bg-muted/50 px-4 py-3 text-xs text-muted-foreground text-center leading-relaxed">
                  Dúvidas? Fale conosco pelo e-mail
                  <span class="font-medium text-foreground">contato&#64;safetechpsicossocial.com.br</span>
                </div>

                <button type="button" (click)="fechar()"
                  class="btn-secondary w-full min-h-[48px] font-semibold">
                  Entendido, até logo!
                </button>
              </div>
            }

            <!-- ============ STEP: ERRO ============ -->
            @if (step() === 'erro') {
              <div class="flex flex-col items-center text-center gap-5 py-6">
                <div class="rounded-full bg-red-100 dark:bg-red-900/30 p-5">
                  <lucide-icon [img]="AlertCircle" class="h-12 w-12 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 class="text-xl font-bold mb-2">Algo deu errado</h3>
                  <p class="text-sm text-muted-foreground max-w-xs mx-auto">{{ erroMensagem() }}</p>
                </div>
                <button type="button" (click)="voltarParaMetodo()"
                  class="btn-secondary px-10 min-h-[44px]">
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
  readonly Mail = Mail;
  readonly Phone = Phone;
  readonly Settings = Settings;
  readonly Rocket = Rocket;
  readonly PartyPopper = PartyPopper;

  readonly modalService = inject(PropostaModalService);
  readonly ctx = this.modalService.context;

  step = signal<Step>('dados-empresa');
  propostaId = signal('');
  pixData = signal<PagamentoPIXResponse | null>(null);
  erroMensagem = signal('');
  carregandoEmpresa = signal(false);

  formEmpresa = { cnpj: '', razaoSocial: '', contatoTelefone: '', contatoEmail: '' };

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
    return this.step() === 'metodo' || this.step() === 'cartao';
  }

  voltar(): void {
    if (this.step() === 'metodo') this.step.set('dados-empresa');
    else if (this.step() === 'cartao') this.step.set('metodo');
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
    this.step.set('sucesso');
  }

  onErro(msg: string): void {
    this.erroMensagem.set(msg);
    this.step.set('erro');
  }

  enviarDadosEmpresa(f: NgForm): void {
    if (f.invalid) return;
    this.carregandoEmpresa.set(true);

    const ctx = this.ctx();
    if (!ctx) return;

    const request: PropostaRequest = {
      cnpj: this.formEmpresa.cnpj.replace(/\D/g, ''),
      razaoSocial: this.formEmpresa.razaoSocial,
      contatoTelefone: this.formEmpresa.contatoTelefone.replace(/\D/g, ''),
      contatoEmail: this.formEmpresa.contatoEmail,
      plano: ctx.plano,
      tipoContratacao: ctx.tipoContratacao,
      quantidadeColaboradores: ctx.quantidadeColaboradores,
    };

    this.modalService.criarProposta(request).subscribe({
      next: (res) => {
        this.carregandoEmpresa.set(false);
        this.propostaId.set(res.id);
        this.step.set('metodo');
      },
      error: (err) => {
        this.carregandoEmpresa.set(false);
        const msg = err?.error?.message ?? 'Erro ao registrar proposta. Tente novamente.';
        this.erroMensagem.set(msg);
        this.step.set('erro');
      },
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
  }

  onTelefoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let v = input.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 10) v = v.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    else if (v.length > 6) v = v.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    else if (v.length > 2) v = v.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    input.value = v;
    this.formEmpresa.contatoTelefone = v;
  }

  formatBRL(value: number): string {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}
