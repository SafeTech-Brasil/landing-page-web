import { Injectable, signal } from '@angular/core';

export interface AvaliacaoDados {
  nome: string;
  cpf: string;
  empresa: string;
}

@Injectable({ providedIn: 'root' })
export class AvaliacaoService {
  isOpen = signal(false);
  dados = signal<AvaliacaoDados | null>(null);

  abrirModal(): void { this.isOpen.set(true); }
  fecharModal(): void { this.isOpen.set(false); }
  setDados(dados: AvaliacaoDados): void { this.dados.set(dados); }
}
