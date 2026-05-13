import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { LucideAngularModule, Printer, ArrowLeft } from 'lucide-angular';
import { AvaliacaoService } from '../services/avaliacao.service';

const PERGUNTAS = [
  { ordem: 1,  texto: 'Você percebe que sua carga de trabalho aumenta devido à má distribuição das tarefas?' },
  { ordem: 2,  texto: 'Com que frequência sente que o tempo disponível não é suficiente para finalizar todas as suas atividades no trabalho?' },
  { ordem: 3,  texto: 'Sua função exige atenção constante durante o expediente?' },
  { ordem: 4,  texto: 'Seu trabalho frequentemente demanda que você proponha soluções inovadoras?' },
  { ordem: 5,  texto: 'Sua atividade coloca você diante de situações emocionalmente desafiadoras?' },
  { ordem: 6,  texto: 'Seu cargo exige que você exponha sua opinião regularmente?' },
  { ordem: 7,  texto: 'Você participa das decisões tomadas pela equipe?' },
  { ordem: 8,  texto: 'Você sente que está sempre aprendendo coisas novas em sua função?' },
  { ordem: 9,  texto: 'Seu trabalho permite que você utilize plenamente suas habilidades?' },
  { ordem: 10, texto: 'Os objetivos do seu trabalho são claros para você?' },
  { ordem: 11, texto: 'Sabe exatamente quais são suas responsabilidades?' },
  { ordem: 12, texto: 'O reconhecimento pelo seu desempenho é feito pela liderança?' },
  { ordem: 13, texto: 'O ambiente de trabalho é respeitoso com todos?' },
  { ordem: 14, texto: 'Já percebeu exigências contraditórias no seu trabalho?' },
  { ordem: 15, texto: 'Você sente que faz parte de uma equipe unida?' },
  { ordem: 16, texto: 'O ambiente entre você e seus colegas é harmonioso?' },
  { ordem: 17, texto: 'A chefia incentiva o desenvolvimento dos funcionários?' },
  { ordem: 18, texto: 'Seu gestor envolve a equipe no planejamento das atividades?' },
  { ordem: 19, texto: 'As informações da gerência são transmitidas de forma clara?' },
  { ordem: 20, texto: 'Os funcionários confiam nas informações recebidas dos colegas?' },
  { ordem: 21, texto: 'O trabalho dos funcionários é valorizado quando bem executado?' },
  { ordem: 22, texto: 'Funcionários com problemas de saúde recebem tratamento adequado?' },
  { ordem: 23, texto: 'Você sente que seu trabalho tem significado?' },
  { ordem: 24, texto: 'Sente orgulho do que faz?' },
  { ordem: 25, texto: 'Sente que sua opinião é considerada?' },
  { ordem: 26, texto: 'Você está satisfeito com o seu trabalho como um todo?' },
  { ordem: 27, texto: 'Recebeu apoio para aprender novas tecnologias?' },
  { ordem: 28, texto: 'Sente que sua saúde foi prejudicada pelo trabalho?' },
  { ordem: 29, texto: 'Sua vida pessoal já foi afetada negativamente pelo trabalho?' },
  { ordem: 30, texto: 'Já ouviu de familiares ou amigos que trabalha demais?' },
  { ordem: 31, texto: 'Sentiu-se cansado frequentemente?' },
  { ordem: 32, texto: 'Sentiu-se nervoso recentemente?' },
  { ordem: 33, texto: 'Sentiu-se ansioso nos últimos dias?' },
  { ordem: 34, texto: 'Sentiu-se desmotivado para as tarefas cotidianas?' },
  { ordem: 35, texto: 'Sentiu-se culpado por algo no último mês?' },
  { ordem: 36, texto: 'Perdeu o interesse por coisas que antes eram prazerosas?' },
  { ordem: 37, texto: 'Já passou por situações de assédio sexual?' },
  { ordem: 38, texto: 'Já foi alvo de insultos ou comentários ofensivos no trabalho?' },
  { ordem: 39, texto: 'Já passou por situações de provocações verbais no ambiente profissional?' },
  { ordem: 40, texto: 'Já enfrentou situações de assédio sexual ou comportamento inadequado no trabalho?' },
  { ordem: 41, texto: 'Já foi ameaçado ou sofreu algum tipo de agressão física no trabalho?' },
];

@Component({
  selector: 'app-avaliacao-pdf',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule],
  styles: [`
    :host { display: block; background: #f1f5f9; min-height: 100vh; }

    .ctrl-bar {
      position: sticky; top: 0; z-index: 10;
      background: rgba(255,255,255,0.95); backdrop-filter: blur(8px);
      border-bottom: 1px solid #e2e8f0;
      padding: 10px 20px;
      display: flex; align-items: center; justify-content: space-between;
      gap: 12px;
    }
    .btn-back {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 13px; font-weight: 600; color: #475569;
      padding: 7px 14px; border-radius: 6px;
      border: 1px solid #e2e8f0; background: white;
      cursor: pointer; transition: all 0.2s;
    }
    .btn-back:hover { background: #f8fafc; color: #0f172a; }
    .btn-print {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 13px; font-weight: 700; color: white;
      padding: 8px 20px; border-radius: 6px; border: none;
      background: linear-gradient(to right, #10b981, #0ea5e9);
      cursor: pointer; box-shadow: 0 4px 12px rgba(16,185,129,.35);
      transition: all 0.2s;
    }
    .btn-print:hover { transform: scale(1.03); }

    .doc-outer {
      max-width: 860px; margin: 24px auto; padding: 0 16px 40px;
    }
    .doc {
      background: white; border-radius: 8px;
      box-shadow: 0 4px 24px rgba(0,0,0,.10);
      padding: 32px 36px;
      font-family: 'Arial', sans-serif; color: #0f172a;
    }

    /* ---- Document Header ---- */
    .doc-header {
      display: flex; justify-content: space-between; align-items: flex-start;
      border-bottom: 2.5px solid #1e3a5f; padding-bottom: 14px; margin-bottom: 16px;
    }
    .logo-name { font-size: 22px; font-weight: 900; color: #1e3a5f; letter-spacing: -0.5px; }
    .logo-tag  { font-size: 9px; color: #10b981; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 2px; }
    .doc-title-block { text-align: right; }
    .doc-title { font-size: 14px; font-weight: 800; color: #1e3a5f; }
    .doc-subtitle { font-size: 10px; color: #64748b; margin-top: 2px; }

    /* ---- Info grid ---- */
    .info-grid {
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 5px 20px;
      background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px;
      padding: 12px 16px; margin-bottom: 14px; font-size: 11.5px;
    }
    .info-row { display: flex; gap: 6px; }
    .info-label { font-weight: 700; color: #475569; white-space: nowrap; }
    .info-value { color: #0f172a; }
    .info-line { border-bottom: 1px solid #94a3b8; flex: 1; margin-bottom: 1px; }

    /* ---- Instructions ---- */
    .instructions {
      font-size: 11px; color: #475569; line-height: 1.5;
      background: #eff6ff; border-left: 3px solid #1e3a5f;
      padding: 8px 12px; border-radius: 0 4px 4px 0; margin-bottom: 10px;
    }
    .scale-legend {
      display: flex; flex-wrap: wrap; gap: 6px 20px; justify-content: center;
      font-size: 10.5px; font-weight: 700; color: #1e3a5f;
      background: #eef2ff; border: 1px solid #c7d2fe;
      padding: 7px 12px; border-radius: 4px; margin-bottom: 14px;
    }
    .scale-item { display: flex; align-items: center; gap: 5px; }
    .scale-circle {
      width: 13px; height: 13px; border: 1.5px solid #1e3a5f; border-radius: 50%;
      display: inline-block; flex-shrink: 0;
    }

    /* ---- Questions table ---- */
    .q-table { width: 100%; border-collapse: collapse; font-size: 11px; }
    .q-table thead tr { background: #1e3a5f; color: white; }
    .q-table th {
      padding: 7px 4px; text-align: center; font-size: 10px; font-weight: 700;
      border: 1px solid #2d4f7c;
    }
    .q-table th.col-q { text-align: left; padding-left: 10px; }
    .q-table td {
      padding: 6px 4px; border: 1px solid #e2e8f0; vertical-align: middle;
    }
    .q-table tr:nth-child(even) td { background: #f8fafc; }
    .q-table td.col-n {
      text-align: center; font-weight: 800; color: #1e3a5f; width: 26px; font-size: 11px;
    }
    .q-table td.col-q { padding: 6px 10px; line-height: 1.45; }
    .q-table td.col-a { text-align: center; width: 54px; }
    .answer-circle {
      width: 16px; height: 16px; border: 1.5px solid #64748b; border-radius: 50%;
      display: inline-block;
      print-color-adjust: exact; -webkit-print-color-adjust: exact;
    }

    /* ---- Signature ---- */
    .sig-area {
      display: grid; grid-template-columns: 1fr 1fr; gap: 32px;
      margin-top: 28px; padding-top: 16px; border-top: 1px solid #e2e8f0;
    }
    .sig-block { display: flex; flex-direction: column; align-items: center; }
    .sig-line-el { width: 100%; border-top: 1px solid #334155; margin-bottom: 6px; }
    .sig-label { font-size: 10px; color: #64748b; text-align: center; }

    /* ---- Footer ---- */
    .doc-footer {
      margin-top: 20px; padding-top: 10px; border-top: 1px solid #e2e8f0;
      font-size: 9px; color: #94a3b8; text-align: center; line-height: 1.6;
    }

    /* ---- Print ---- */
    @media print {
      :host { background: white; }
      .ctrl-bar { display: none !important; }
      .doc-outer { margin: 0; padding: 0; max-width: 100%; }
      .doc { box-shadow: none; border-radius: 0; padding: 0; }
      .q-table tr { page-break-inside: avoid; }
      .answer-circle { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    }
  `],
  template: `
    <!-- Control bar (hidden when printing) -->
    <div class="ctrl-bar">
      <button class="btn-back" type="button" (click)="voltar()">
        <lucide-icon [img]="ArrowLeft" style="width:14px;height:14px" /> Voltar
      </button>
      <span style="font-size:13px;color:#64748b;font-weight:600">
        Questionário Psicossocial — {{ service.dados()?.empresa }}
      </span>
      <button class="btn-print" type="button" (click)="imprimir()">
        <lucide-icon [img]="Printer" style="width:15px;height:15px" /> Imprimir / Salvar PDF
      </button>
    </div>

    <div class="doc-outer">
      @if (service.dados(); as dados) {
        <div class="doc">

          <!-- Header do documento -->
          <div class="doc-header">
            <div>
              <div class="logo-name">SafeTech Brasil</div>
              <div class="logo-tag">Saúde &amp; Segurança do Trabalho</div>
            </div>
            <div class="doc-title-block">
              <div class="doc-title">Avaliação Psicossocial do Trabalho</div>
              <div class="doc-subtitle">Questionário de Fatores de Risco — NR-01 / NR-17</div>
            </div>
          </div>

          <!-- Dados do respondente -->
          <div class="info-grid">
            <div class="info-row">
              <span class="info-label">Empresa:</span>
              <span class="info-value">{{ dados.empresa }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Respondente:</span>
              <span class="info-value">{{ dados.nome }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Data de Aplicação:</span>
              <span class="info-value">{{ dataAtual }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">CPF:</span>
              <span class="info-value">{{ dados.cpf }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Setor/Cargo:</span>
              <span class="info-line"></span>
            </div>
            <div class="info-row">
              <span class="info-label">Matrícula:</span>
              <span class="info-line"></span>
            </div>
          </div>

          <!-- Instruções -->
          <p class="instructions">
            <strong>Instruções:</strong> Para cada questão abaixo, marque com um <strong>X</strong> dentro do círculo
            correspondente à opção que melhor descreve sua experiência no trabalho nos últimos 30 dias.
            Responda com sinceridade — suas respostas são confidenciais.
          </p>

          <!-- Legenda da escala -->
          <div class="scale-legend">
            <span class="scale-item"><span class="scale-circle"></span> 1 – Nunca</span>
            <span class="scale-item"><span class="scale-circle"></span> 2 – Raramente</span>
            <span class="scale-item"><span class="scale-circle"></span> 3 – Às vezes</span>
            <span class="scale-item"><span class="scale-circle"></span> 4 – Frequentemente</span>
            <span class="scale-item"><span class="scale-circle"></span> 5 – Sempre</span>
          </div>

          <!-- Tabela de perguntas -->
          <table class="q-table">
            <thead>
              <tr>
                <th style="width:28px">N°</th>
                <th class="col-q">Questão</th>
                <th style="width:52px">1<br>Nunca</th>
                <th style="width:52px">2<br>Raramente</th>
                <th style="width:52px">3<br>Às vezes</th>
                <th style="width:52px">4<br>Freq.</th>
                <th style="width:52px">5<br>Sempre</th>
              </tr>
            </thead>
            <tbody>
              @for (p of perguntas; track p.ordem) {
                <tr>
                  <td class="col-n">{{ p.ordem }}</td>
                  <td class="col-q">{{ p.texto }}</td>
                  <td class="col-a"><span class="answer-circle"></span></td>
                  <td class="col-a"><span class="answer-circle"></span></td>
                  <td class="col-a"><span class="answer-circle"></span></td>
                  <td class="col-a"><span class="answer-circle"></span></td>
                  <td class="col-a"><span class="answer-circle"></span></td>
                </tr>
              }
            </tbody>
          </table>

          <!-- Área de assinaturas -->
          <div class="sig-area">
            <div class="sig-block">
              <div style="height:32px"></div>
              <div class="sig-line-el"></div>
              <div class="sig-label">Assinatura do Respondente</div>
            </div>
            <div class="sig-block">
              <div style="height:32px"></div>
              <div class="sig-line-el"></div>
              <div class="sig-label">Assinatura do Aplicador / Responsável RH</div>
            </div>
          </div>

          <!-- Rodapé -->
          <div class="doc-footer">
            SafeTech Brasil — Gestão de Saúde Ocupacional &nbsp;|&nbsp;
            safetechpsicossocial.com.br &nbsp;|&nbsp;
            Documento confidencial — uso interno exclusivo
          </div>

        </div>
      }
    </div>
  `,
})
export class AvaliacaoPdfComponent implements OnInit {
  readonly Printer = Printer;
  readonly ArrowLeft = ArrowLeft;

  readonly service = inject(AvaliacaoService);
  private readonly router = inject(Router);
  private readonly title = inject(Title);

  readonly perguntas = PERGUNTAS;
  readonly dataAtual = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  ngOnInit(): void {
    const dados = this.service.dados();
    if (!dados) {
      this.router.navigate(['/']);
      return;
    }
    this.title.setTitle(`Avaliação Psicossocial — ${dados.nome} — ${dados.empresa}`);
  }

  imprimir(): void {
    window.print();
  }

  voltar(): void {
    this.router.navigate(['/']);
  }
}
