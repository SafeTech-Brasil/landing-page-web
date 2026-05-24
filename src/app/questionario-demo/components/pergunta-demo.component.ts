import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { IPerguntaDemo, IRespostaPossivelDemo } from '../interfaces/pergunta.interface';

@Component({
  selector: 'app-pergunta-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rounded-xl border border-border bg-card p-5 space-y-4">
      <div class="flex gap-3">
        <span class="shrink-0 w-7 h-7 rounded-full bg-secondary/10 text-secondary text-sm font-bold flex items-center justify-center">
          {{ pergunta().ordem }}
        </span>
        <p class="text-sm font-medium leading-relaxed pt-0.5">{{ pergunta().descricao }}</p>
      </div>

      <div class="grid grid-cols-5 gap-2">
        @for (opcao of respostas(); track opcao.valor) {
          <button
            type="button"
            (click)="selecionar(opcao.valor)"
            class="flex flex-col items-center gap-1 p-2 rounded-lg border text-xs font-medium transition-all"
            [class]="respostaSelecionada() === opcao.valor
              ? 'border-secondary bg-secondary text-white'
              : 'border-border bg-background hover:border-secondary/50 hover:bg-secondary/5 text-foreground'"
          >
            <span class="text-base font-bold">{{ opcao.valor }}</span>
            <span class="text-center leading-tight opacity-80">{{ opcao.descricao }}</span>
          </button>
        }
      </div>
    </div>
  `
})
export class PerguntaDemoComponent {
  pergunta = input.required<IPerguntaDemo>();
  respostas = input.required<IRespostaPossivelDemo[]>();
  respostaSelecionada = input<number | null>(null);

  respondeu = output<number>();

  selecionar(valor: number): void {
    this.respondeu.emit(valor);
  }
}
