import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  inject,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { LucideAngularModule, X, CheckCircle, Loader, AlertCircle } from 'lucide-angular';
import {
  PropostaModalService,
  PropostaRequest,
} from '../../../services/proposta-modal.service';

type Step = 'form' | 'loading' | 'success' | 'error';

@Component({
  selector: 'app-proposta-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, LucideAngularModule],
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
          class="relative w-full max-w-lg rounded-2xl bg-card text-card-foreground shadow-2xl border border-border overflow-hidden"
          (click)="$event.stopPropagation()"
        >
          <!-- Close button -->
          <button
            type="button"
            (click)="fechar()"
            class="absolute top-4 right-4 p-1.5 rounded-full hover:bg-muted transition-colors"
            aria-label="Fechar"
          >
            <lucide-icon [img]="X" class="h-5 w-5 text-muted-foreground" />
          </button>

          <!-- STEP: Form -->
          @if (step() === 'form') {
            <div class="p-6 sm:p-8">
              <h2 id="modal-title" class="text-xl font-bold mb-1">Contratar Plano</h2>
              <p class="text-sm text-muted-foreground mb-6">
                Preencha os dados da empresa para prosseguir com o pagamento.
              </p>

              <!-- Resumo do plano -->
              <div class="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-1">
                <div class="flex justify-between text-sm">
                  <span class="text-muted-foreground">Plano</span>
                  <span class="font-semibold text-secondary">{{ ctx()?.nomePlano }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-muted-foreground">Colaboradores</span>
                  <span class="font-medium">{{ ctx()?.quantidadeColaboradores }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-muted-foreground">Tipo</span>
                  <span class="font-medium">{{ ctx()?.tipoContratacao === 'PONTUAL' ? 'Avulso' : 'Mensal' }}</span>
                </div>
                <div class="flex justify-between items-center pt-1 border-t border-primary/10 mt-1">
                  <span class="text-muted-foreground text-sm">Valor</span>
                  <span class="text-lg font-bold text-foreground">{{ formatBRL(ctx()?.valorTotal ?? 0) }}</span>
                </div>
              </div>

              <!-- Formulário -->
              <form #f="ngForm" (ngSubmit)="enviar(f)" class="space-y-4" novalidate>
                <!-- CNPJ -->
                <div>
                  <label class="block text-sm font-medium mb-1" for="cnpj">CNPJ</label>
                  <input
                    id="cnpj"
                    name="cnpj"
                    type="text"
                    [(ngModel)]="form.cnpj"
                    (input)="onCnpjInput($event)"
                    required
                    minlength="18"
                    maxlength="18"
                    placeholder="00.000.000/0000-00"
                    class="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    [class.border-destructive]="f.submitted && f.controls['cnpj']?.invalid"
                  />
                  @if (f.submitted && f.controls['cnpj']?.invalid) {
                    <p class="text-xs text-destructive mt-1">CNPJ inválido (ex: 00.000.000/0000-00)</p>
                  }
                </div>

                <!-- Razão Social -->
                <div>
                  <label class="block text-sm font-medium mb-1" for="razaoSocial">Razão Social</label>
                  <input
                    id="razaoSocial"
                    name="razaoSocial"
                    type="text"
                    [(ngModel)]="form.razaoSocial"
                    required
                    placeholder="Nome da empresa conforme CNPJ"
                    class="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    [class.border-destructive]="f.submitted && f.controls['razaoSocial']?.invalid"
                  />
                  @if (f.submitted && f.controls['razaoSocial']?.invalid) {
                    <p class="text-xs text-destructive mt-1">Razão social é obrigatória</p>
                  }
                </div>

                <!-- Telefone -->
                <div>
                  <label class="block text-sm font-medium mb-1" for="telefone">Telefone de Contato</label>
                  <input
                    id="telefone"
                    name="telefone"
                    type="tel"
                    [(ngModel)]="form.contatoTelefone"
                    (input)="onTelefoneInput($event)"
                    required
                    minlength="14"
                    placeholder="(11) 99999-9999"
                    class="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    [class.border-destructive]="f.submitted && f.controls['telefone']?.invalid"
                  />
                  @if (f.submitted && f.controls['telefone']?.invalid) {
                    <p class="text-xs text-destructive mt-1">Telefone inválido</p>
                  }
                </div>

                <!-- E-mail -->
                <div>
                  <label class="block text-sm font-medium mb-1" for="email">E-mail do Administrador</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    [(ngModel)]="form.contatoEmail"
                    required
                    email
                    placeholder="admin@empresa.com.br"
                    class="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    [class.border-destructive]="f.submitted && f.controls['email']?.invalid"
                  />
                  @if (f.submitted && f.controls['email']?.invalid) {
                    <p class="text-xs text-destructive mt-1">E-mail inválido</p>
                  }
                </div>

                <button
                  type="submit"
                  class="btn-secondary w-full min-h-[48px] font-semibold"
                >
                  Ir para pagamento
                </button>
              </form>
            </div>
          }

          <!-- STEP: Loading -->
          @if (step() === 'loading') {
            <div class="p-8 flex flex-col items-center justify-center gap-4 min-h-[280px]">
              <lucide-icon [img]="Loader" class="h-10 w-10 text-primary animate-spin" />
              <p class="text-muted-foreground text-sm">Criando sua proposta...</p>
            </div>
          }

          <!-- STEP: Success -->
          @if (step() === 'success') {
            <div class="p-8 flex flex-col items-center text-center gap-4 min-h-[280px] justify-center">
              <div class="rounded-full bg-green-100 dark:bg-green-900/30 p-4">
                <lucide-icon [img]="CheckCircle" class="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <h3 class="text-lg font-bold">Proposta criada!</h3>
              <p class="text-sm text-muted-foreground">
                Você será redirecionado para o ambiente seguro de pagamento em instantes.
              </p>
              <a
                [href]="linkPagamento()"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-secondary px-8 min-h-[44px]"
              >
                Acessar pagamento
              </a>
              <button type="button" (click)="fechar()" class="text-sm text-muted-foreground hover:underline">
                Fechar
              </button>
            </div>
          }

          <!-- STEP: Error -->
          @if (step() === 'error') {
            <div class="p-8 flex flex-col items-center text-center gap-4 min-h-[280px] justify-center">
              <div class="rounded-full bg-red-100 dark:bg-red-900/30 p-4">
                <lucide-icon [img]="AlertCircle" class="h-10 w-10 text-red-600 dark:text-red-400" />
              </div>
              <h3 class="text-lg font-bold">Algo deu errado</h3>
              <p class="text-sm text-muted-foreground">{{ erroMensagem() }}</p>
              <button type="button" (click)="voltarForm()" class="btn-secondary px-8 min-h-[44px]">
                Tentar novamente
              </button>
            </div>
          }
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

  readonly modalService = inject(PropostaModalService);
  readonly ctx = this.modalService.context;

  step = signal<Step>('form');
  linkPagamento = signal('');
  erroMensagem = signal('');

  form: { cnpj: string; razaoSocial: string; contatoTelefone: string; contatoEmail: string } = {
    cnpj: '',
    razaoSocial: '',
    contatoTelefone: '',
    contatoEmail: '',
  };

  fechar(): void {
    this.step.set('form');
    this.form = { cnpj: '', razaoSocial: '', contatoTelefone: '', contatoEmail: '' };
    this.modalService.close();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.fechar();
  }

  voltarForm(): void {
    this.step.set('form');
  }

  enviar(f: NgForm): void {
    if (f.invalid) return;

    const ctx = this.ctx();
    if (!ctx) return;

    this.step.set('loading');

    const request: PropostaRequest = {
      cnpj: this.form.cnpj.replace(/[^0-9]/g, ''),
      razaoSocial: this.form.razaoSocial,
      contatoTelefone: this.form.contatoTelefone.replace(/[^0-9]/g, ''),
      contatoEmail: this.form.contatoEmail,
      plano: ctx.plano,
      tipoContratacao: ctx.tipoContratacao,
      quantidadeColaboradores: ctx.quantidadeColaboradores,
    };

    this.modalService.enviar(request).subscribe({
      next: (res) => {
        this.linkPagamento.set(res.linkPagamento);
        this.step.set('success');
        if (res.linkPagamento) {
          window.open(res.linkPagamento, '_blank', 'noopener,noreferrer');
        }
      },
      error: (err) => {
        const msg = err?.error?.message ?? 'Não foi possível criar a proposta. Tente novamente.';
        this.erroMensagem.set(msg);
        this.step.set('error');
      },
    });
  }

  onCnpjInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let v = input.value.replace(/\D/g, '').slice(0, 14);
    if (v.length > 12) v = v.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, '$1.$2.$3/$4-$5');
    else if (v.length > 8) v = v.replace(/^(\d{2})(\d{3})(\d{3})(\d{0,4})/, '$1.$2.$3/$4');
    else if (v.length > 5) v = v.replace(/^(\d{2})(\d{3})(\d{0,3})/, '$1.$2.$3');
    else if (v.length > 2) v = v.replace(/^(\d{2})(\d{0,3})/, '$1.$2');
    input.value = v;
    this.form.cnpj = v;
  }

  onTelefoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let v = input.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 10) v = v.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    else if (v.length > 6) v = v.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    else if (v.length > 2) v = v.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    else v = v.replace(/^(\d*)/, '($1');
    input.value = v;
    this.form.contatoTelefone = v;
  }

  formatBRL(value: number): string {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}
