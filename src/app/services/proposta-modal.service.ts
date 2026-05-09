import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type PlanoEnum = 'BASE' | 'BRONZE' | 'PRATA' | 'OURO' | 'PREMIUM' | 'CORPORATE';
export type TipoContratacao = 'MENSAL' | 'PONTUAL';

export interface ModalContext {
  plano: PlanoEnum;
  tipoContratacao: TipoContratacao;
  quantidadeColaboradores: number;
  valorTotal: number;
  nomePlano: string;
}

export interface PropostaRequest {
  cnpj: string;
  razaoSocial: string;
  contatoTelefone: string;
  contatoEmail: string;
  plano: PlanoEnum;
  tipoContratacao: TipoContratacao;
  quantidadeColaboradores: number;
}

export interface PropostaResponse {
  id: string;
  status: string;
  linkPagamento: string;
  mensagem: string;
}

const API_URL = 'http://localhost:8080';

@Injectable({ providedIn: 'root' })
export class PropostaModalService {
  isOpen = signal(false);
  context = signal<ModalContext | null>(null);

  constructor(private http: HttpClient) {}

  open(ctx: ModalContext): void {
    this.context.set(ctx);
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
    this.context.set(null);
  }

  enviar(request: PropostaRequest): Observable<PropostaResponse> {
    return this.http.post<PropostaResponse>(`${API_URL}/api/public/propostas`, request);
  }
}
