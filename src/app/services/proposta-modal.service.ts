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
  recaptchaToken: string;
}

export interface PropostaResponse {
  id: string;
  status: string;
  mensagem: string;
}

export interface PagamentoPIXResponse {
  paymentId: string;
  qrCodeBase64: string;
  codigoCopia: string;
  expiracao: string;
}

export interface PagamentoCartaoRequest {
  nomeTitular: string;
  numeroCartao: string;
  mesValidade: string;
  anoValidade: string;
  ccv: string;
  cpfTitular: string;
  cep: string;
  numeroEndereco: string;
  parcelas: number;
}

export interface PagamentoCartaoResponse {
  propostaId: string;
  status: string;
  mensagem: string;
}

export interface PropostaStatusResponse {
  id: string;
  status: string;
}

const API_URL = 'https://api.safetechpsicossocial.com.br';

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

  criarProposta(request: PropostaRequest): Observable<PropostaResponse> {
    return this.http.post<PropostaResponse>(`${API_URL}/api/public/propostas`, request);
  }

  iniciarPix(propostaId: string): Observable<PagamentoPIXResponse> {
    return this.http.post<PagamentoPIXResponse>(
      `${API_URL}/api/public/propostas/${propostaId}/pagamento/pix`,
      {}
    );
  }

  iniciarCartao(propostaId: string, request: PagamentoCartaoRequest): Observable<PagamentoCartaoResponse> {
    return this.http.post<PagamentoCartaoResponse>(
      `${API_URL}/api/public/propostas/${propostaId}/pagamento/cartao`,
      request
    );
  }

  consultarStatus(propostaId: string): Observable<PropostaStatusResponse> {
    return this.http.get<PropostaStatusResponse>(
      `${API_URL}/api/public/propostas/${propostaId}/status`
    );
  }
}
