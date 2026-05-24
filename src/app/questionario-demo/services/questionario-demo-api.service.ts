import { Injectable, inject, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IRespostaDemo } from '../interfaces/pergunta.interface';

const API_URL = isDevMode()
  ? 'http://localhost:8080'
  : 'https://api.psicosafe.com.br';

export interface DemoRelatorioRequest {
  nome: string;
  email: string;
  empresa: string;
  respostas: { perguntaOrdem: number; valor: number }[];
}

@Injectable({ providedIn: 'root' })
export class QuestionarioDemoApiService {
  private http = inject(HttpClient);

  gerarRelatorio(request: DemoRelatorioRequest): Observable<Blob> {
    return this.http.post(`${API_URL}/api/v1/publico/demo/relatorio`, request, {
      responseType: 'blob'
    });
  }
}
