import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule, X, FileText, Loader } from 'lucide-angular';
import { AvaliacaoService } from '../../../services/avaliacao.service';

@Component({
  selector: 'app-avaliacao-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, LucideAngularModule],
  template: `
    @if (service.isOpen()) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        (click)="onBackdropClick($event)"
        role="dialog"
        aria-modal="true"
        aria-labelledby="avaliacao-modal-title"
      >
        <div
          class="relative w-full max-w-md rounded-2xl bg-card text-card-foreground shadow-2xl border border-border"
          (click)="$event.stopPropagation()"
        >
          <!-- Header -->
          <div class="flex items-center justify-between p-5 pb-4 border-b border-border/60">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                <lucide-icon [img]="FileText" class="h-4 w-4 text-secondary" />
              </div>
              <h2 id="avaliacao-modal-title" class="text-base font-bold">Avaliação Gratuita</h2>
            </div>
            <button type="button" (click)="fechar()" class="p-1.5 rounded-full hover:bg-muted transition-colors" aria-label="Fechar">
              <lucide-icon [img]="X" class="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          <div class="p-5 space-y-4">
            <p class="text-sm text-muted-foreground">
              Preencha os dados do respondente para gerar o questionário psicossocial completo pronto para impressão em PDF.
            </p>

            <form #f="ngForm" (ngSubmit)="gerar(f)" class="space-y-3" novalidate>
              <div>
                <label class="block text-sm font-medium mb-1">Nome completo</label>
                <input name="nome" type="text" [(ngModel)]="form.nome" required
                  placeholder="Nome do colaborador"
                  class="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  [class.border-destructive]="f.submitted && f.controls['nome']?.invalid" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">CPF</label>
                <input name="cpf" type="text" inputmode="numeric" [(ngModel)]="form.cpf"
                  (input)="onCpfInput($event)" required minlength="14" maxlength="14"
                  placeholder="000.000.000-00"
                  class="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
                  [class.border-destructive]="f.submitted && f.controls['cpf']?.invalid" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Empresa</label>
                <input name="empresa" type="text" [(ngModel)]="form.empresa" required
                  placeholder="Nome da empresa"
                  class="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  [class.border-destructive]="f.submitted && f.controls['empresa']?.invalid" />
              </div>

              <button type="submit" [disabled]="carregando()"
                class="btn-secondary w-full min-h-[48px] font-semibold flex items-center justify-center gap-2 disabled:opacity-60 mt-2">
                @if (carregando()) {
                  <lucide-icon [img]="Loader" class="h-4 w-4 animate-spin" />
                  Gerando...
                } @else {
                  <lucide-icon [img]="FileText" class="h-4 w-4" />
                  Gerar Questionário
                }
              </button>
            </form>
          </div>
        </div>
      </div>
    }
  `,
})
export class AvaliacaoModalComponent {
  readonly X = X;
  readonly FileText = FileText;
  readonly Loader = Loader;

  readonly service = inject(AvaliacaoService);
  private readonly router = inject(Router);
  readonly carregando = signal(false);

  form = { nome: '', cpf: '', empresa: '' };

  fechar(): void {
    this.service.fecharModal();
    this.form = { nome: '', cpf: '', empresa: '' };
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.fechar();
  }

  onCpfInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let v = input.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 9) v = v.replace(/^(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4');
    else if (v.length > 6) v = v.replace(/^(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3');
    else if (v.length > 3) v = v.replace(/^(\d{3})(\d{0,3})/, '$1.$2');
    input.value = v;
    this.form.cpf = v;
  }

  gerar(f: NgForm): void {
    if (f.invalid) return;
    this.carregando.set(true);
    this.service.setDados({ nome: this.form.nome, cpf: this.form.cpf, empresa: this.form.empresa });
    this.service.fecharModal();
    this.router.navigate(['/avaliacao']).then(() => {
      this.carregando.set(false);
      this.form = { nome: '', cpf: '', empresa: '' };
    });
  }
}
