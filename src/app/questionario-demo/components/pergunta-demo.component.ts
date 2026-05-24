import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { IPerguntaDemo, IRespostaPossivelDemo } from '../interfaces/pergunta.interface';

@Component({
  selector: 'app-pergunta-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rounded-xl border border-gray-200 bg-white p-5 space-y-4 shadow-sm">
      <div class="flex gap-3">
        <span class="shrink-0 w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold flex items-center justify-center">
          {{ pergunta().ordem }}
        </span>
        <p class="text-sm font-medium text-gray-800 leading-relaxed pt-0.5">{{ pergunta().descricao }}</p>
      </div>

      <div class="grid grid-cols-5 gap-2">
        @for (opcao of respostas(); track opcao.valor) {
          <button
            type="button"
            (click)="selecionar(opcao.valor)"
            class="flex flex-col items-center gap-1 p-2 rounded-lg border text-xs font-medium transition-all"
            [class]="respostaSelecionada() === opcao.valor
              ? 'border-emerald-500 bg-emerald-500 text-white shadow-sm'
              : 'border-gray-200 bg-gray-50 hover:border-emerald-400 hover:bg-emerald-50 text-gray-700'"
          >
            <span class="text-base font-bold">{{ opcao.valor }}</span>
            <span class="text-center leading-tight">{{ opcao.descricao }}</span>
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
