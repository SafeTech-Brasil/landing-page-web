import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, CheckCircle2 } from 'lucide-angular';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-questionnaires',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, LucideAngularModule, NgOptimizedImage],
  template: `
    <section id="questionarios" class="py-20" aria-labelledby="questionnaires-heading">
      <div class="container mx-auto px-4">
        <!-- Feature 1 -->
        <div class="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 id="questionnaires-heading" class="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Questionário Psicossocial Completo
            </h2>
            <p class="text-lg text-muted-foreground mb-6">
              Avalie os riscos psicossociais do ambiente de trabalho de forma profissional e em conformidade com as normas vigentes.
            </p>
            <ul class="space-y-4">
              <li class="flex items-start gap-3">
                <lucide-icon [img]="CheckCircle2" class="h-6 w-6 text-secondary flex-shrink-0 mt-0.5" />
                <span class="text-foreground">Questionários validados por especialistas</span>
              </li>
              <li class="flex items-start gap-3">
                <lucide-icon [img]="CheckCircle2" class="h-6 w-6 text-secondary flex-shrink-0 mt-0.5" />
                <span class="text-foreground">Relatórios automáticos e personalizados</span>
              </li>
              <li class="flex items-start gap-3">
                <lucide-icon [img]="CheckCircle2" class="h-6 w-6 text-secondary flex-shrink-0 mt-0.5" />
                <span class="text-foreground">Acompanhamento longitudinal dos resultados</span>
              </li>
            </ul>
          </div>
          <div class="rounded-lg overflow-hidden shadow-lg">
            <img 
              ngSrc="/feature-questionnaire.jpg" 
              alt="Interface do questionário psicossocial mostrando formulário de avaliação com campos para dados do colaborador e questões sobre saúde mental e bem-estar no trabalho"
              width="800"
              height="600"
              class="w-full h-auto"
              loading="lazy"
              (error)="onImageError($event)"
            />
          </div>
        </div>

        <!-- Feature 2 -->
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div class="order-2 md:order-1 rounded-lg overflow-hidden shadow-lg">
            <img 
              ngSrc="/feature-analytics.jpg" 
              alt="Dashboard de análises mostrando gráficos de indicadores de risco psicossocial, comparativos por departamento e métricas de conformidade com normas regulamentadoras"
              width="800"
              height="600"
              class="w-full h-auto"
              loading="lazy"
              (error)="onImageError($event)"
            />
          </div>
          <div class="order-1 md:order-2">
            <h2 class="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Insights Poderosos para Decisões Estratégicas
            </h2>
            <p class="text-lg text-muted-foreground mb-6">
              Transforme dados em ações concretas com nossa plataforma de análise avançada.
            </p>
            <ul class="space-y-4">
              <li class="flex items-start gap-3">
                <lucide-icon [img]="CheckCircle2" class="h-6 w-6 text-secondary flex-shrink-0 mt-0.5" />
                <span class="text-foreground">Visualização clara de indicadores de risco</span>
              </li>
              <li class="flex items-start gap-3">
                <lucide-icon [img]="CheckCircle2" class="h-6 w-6 text-secondary flex-shrink-0 mt-0.5" />
                <span class="text-foreground">Comparativos por departamento e período</span>
              </li>
              <li class="flex items-start gap-3">
                <lucide-icon [img]="CheckCircle2" class="h-6 w-6 text-secondary flex-shrink-0 mt-0.5" />
                <span class="text-foreground">Exportação de dados para auditorias</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  `
})
export class QuestionnairesComponent {
  readonly CheckCircle2 = CheckCircle2;

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.style.display = 'none';
    }
  }
}
