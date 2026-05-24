import { Injectable, signal, computed } from '@angular/core';
import { IRespostaDemo } from '../interfaces/pergunta.interface';
import { PERGUNTAS_DEMO, RESPOSTAS_POSSIVEIS } from '../data/perguntas.data';

export interface DadosParticipante {
  nome: string;
  email: string;
  empresa: string;
}

@Injectable({ providedIn: 'root' })
export class QuestionarioDemoStateService {
  private _respostas = signal<Record<string, number>>({});
  private _participante = signal<DadosParticipante | null>(null);

  readonly perguntas = PERGUNTAS_DEMO;
  readonly respostasPossiveis = RESPOSTAS_POSSIVEIS;
  readonly totalPerguntas = PERGUNTAS_DEMO.length;

  readonly respostas = computed(() => this._respostas());
  readonly participante = computed(() => this._participante());

  readonly todasRespondidas = computed(() => {
    const r = this._respostas();
    return PERGUNTAS_DEMO.every(p => r[p.id] !== undefined && r[p.id] !== null);
  });

  readonly totalRespondidas = computed(() => {
    const r = this._respostas();
    return PERGUNTAS_DEMO.filter(p => r[p.id] !== undefined).length;
  });

  setParticipante(dados: DadosParticipante): void {
    this._participante.set(dados);
  }

  setResposta(perguntaId: string, valor: number): void {
    this._respostas.update(r => ({ ...r, [perguntaId]: valor }));
  }

  getRespostaValor(perguntaId: string): number | null {
    return this._respostas()[perguntaId] ?? null;
  }

  buildPayload(): IRespostaDemo[] {
    const r = this._respostas();
    return PERGUNTAS_DEMO
      .filter(p => r[p.id] !== undefined)
      .map(p => ({ perguntaId: p.id, valor: r[p.id] }));
  }

  reset(): void {
    this._respostas.set({});
    this._participante.set(null);
  }
}
