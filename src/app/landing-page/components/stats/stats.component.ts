import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, TrendingDown, DollarSign, Clock, BarChart3 } from 'lucide-angular';

@Component({
  selector: 'app-stats',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <section id="recursos" class="py-16 md:py-20 bg-gradient-soft relative overflow-hidden" aria-labelledby="benefits-heading">
      <!-- Decorative background elements -->
      <div class="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" aria-hidden="true"></div>
      <div class="absolute bottom-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" aria-hidden="true"></div>
      
      <div class="container mx-auto px-4 relative z-10">
        <div class="text-center mb-12 md:mb-16">
          <div class="inline-block px-4 py-2 bg-secondary/10 text-secondary text-sm font-semibold rounded-full mb-4">
            RESULTADOS COMPROVADOS
          </div>
          <h2 id="benefits-heading" class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Resultados Reais para <span class="text-gradient">Sua Empresa</span>
          </h2>
          <p class="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Veja o impacto positivo que nossa plataforma traz para o seu negócio
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
          <!-- Benefit 1 -->
          <div class="bg-card p-6 md:p-8 rounded-xl border-2 border-primary/20 shadow-lg text-center card-hover relative overflow-hidden group">
            <div class="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full" aria-hidden="true"></div>
            <div class="relative z-10">
              <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-primary mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <lucide-icon [img]="TrendingDown" class="h-10 w-10 text-white" aria-hidden="true" />
              </div>
              <div class="text-3xl font-bold text-primary mb-2">-90%</div>
              <h3 class="text-xl font-bold mb-3">Redução de Multas</h3>
              <p class="text-sm text-muted-foreground leading-relaxed">
                Evite penalidades e autuações com conformidade total às normas regulamentadoras
              </p>
            </div>
          </div>

          <!-- Benefit 2 -->
          <div class="bg-card p-6 md:p-8 rounded-xl border-2 border-secondary/20 shadow-lg text-center card-hover relative overflow-hidden group">
            <div class="absolute top-0 right-0 w-20 h-20 bg-secondary/5 rounded-bl-full" aria-hidden="true"></div>
            <div class="relative z-10">
              <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-secondary mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <lucide-icon [img]="DollarSign" class="h-10 w-10 text-white" aria-hidden="true" />
              </div>
              <div class="text-3xl font-bold text-secondary mb-2">70%</div>
              <h3 class="text-xl font-bold mb-3">Economia de Tempo</h3>
              <p class="text-sm text-muted-foreground leading-relaxed">
                Automatize processos e libere sua equipe para atividades estratégicas
              </p>
            </div>
          </div>

          <!-- Benefit 3 -->
          <div class="bg-card p-6 md:p-8 rounded-xl border-2 border-accent/20 shadow-lg text-center card-hover relative overflow-hidden group">
            <div class="absolute top-0 right-0 w-20 h-20 bg-accent/5 rounded-bl-full" aria-hidden="true"></div>
            <div class="relative z-10">
              <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-accent mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <lucide-icon [img]="Clock" class="h-10 w-10 text-white" aria-hidden="true" />
              </div>
              <div class="text-3xl font-bold text-accent mb-2">24h</div>
              <h3 class="text-xl font-bold mb-3">Implementação Instantânea</h3>
              <p class="text-sm text-muted-foreground leading-relaxed">
                Comece a usar hoje mesmo. Sem necessidade de treinamento complexo ou configurações demoradas
              </p>
            </div>
          </div>

          <!-- Benefit 4 -->
          <div class="bg-card p-6 md:p-8 rounded-xl border-2 border-primary/20 shadow-lg text-center card-hover relative overflow-hidden group">
            <div class="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full" aria-hidden="true"></div>
            <div class="relative z-10">
              <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-primary mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <lucide-icon [img]="BarChart3" class="h-10 w-10 text-white" aria-hidden="true" />
              </div>
              <div class="text-3xl font-bold text-primary mb-2">100%</div>
              <h3 class="text-xl font-bold mb-3">Decisões Baseadas em Dados</h3>
              <p class="text-sm text-muted-foreground leading-relaxed">
                Relatórios instantâneos e dashboards em tempo real para ações preventivas eficazes
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class StatsComponent {
  readonly TrendingDown = TrendingDown;
  readonly DollarSign = DollarSign;
  readonly Clock = Clock;
  readonly BarChart3 = BarChart3;
}
