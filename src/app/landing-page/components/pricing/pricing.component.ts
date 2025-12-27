import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, CheckCircle2, Zap } from 'lucide-angular';

@Component({
  selector: 'app-pricing',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <section id="planos" class="py-12 sm:py-16 md:py-20 lg:py-24 bg-pattern relative" aria-labelledby="pricing-heading">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="text-center mb-12 sm:mb-16">
          <h2 id="pricing-heading" class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-4 sm:px-0">
            Escolha o <span class="text-gradient">Plano Ideal</span>
          </h2>
          <p class="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0">
            Soluções flexíveis para empresas de todos os tamanhos
          </p>
        </div>

        <!-- Pricing cards - stacked on mobile, grid on desktop -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          <!-- Basic Plan -->
          <div class="rounded-2xl border bg-card text-card-foreground shadow-lg card-hover p-6 sm:p-8">
            <h3 class="text-2xl sm:text-3xl font-bold mb-2">Básico</h3>
            <p class="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">Para pequenas equipes</p>
            <div class="mb-6 sm:mb-8">
              <span class="text-4xl sm:text-5xl font-bold">R$ 299</span>
              <span class="text-muted-foreground text-base sm:text-lg">/mês</span>
            </div>
            <ul class="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              <li class="flex items-start gap-2 sm:gap-3">
                <lucide-icon [img]="CheckCircle2" class="h-5 w-5 sm:h-6 sm:w-6 text-secondary flex-shrink-0 mt-0.5" />
                <span class="text-sm sm:text-base">Até 50 colaboradores</span>
              </li>
              <li class="flex items-start gap-2 sm:gap-3">
                <lucide-icon [img]="CheckCircle2" class="h-5 w-5 sm:h-6 sm:w-6 text-secondary flex-shrink-0 mt-0.5" />
                <span class="text-sm sm:text-base">Questionário psicossocial</span>
              </li>
              <li class="flex items-start gap-2 sm:gap-3">
                <lucide-icon [img]="CheckCircle2" class="h-5 w-5 sm:h-6 sm:w-6 text-secondary flex-shrink-0 mt-0.5" />
                <span class="text-sm sm:text-base">Relatórios básicos</span>
              </li>
              <li class="flex items-start gap-2 sm:gap-3">
                <lucide-icon [img]="CheckCircle2" class="h-5 w-5 sm:h-6 sm:w-6 text-secondary flex-shrink-0 mt-0.5" />
                <span class="text-sm sm:text-base">Suporte por email</span>
              </li>
            </ul>
            <button class="btn-outline w-full min-h-[44px] sm:min-h-[48px]">
              Contratar Plano
            </button>
          </div>

          <!-- Professional Plan - Featured (no transform on mobile) -->
          <div class="card-featured rounded-2xl p-6 sm:p-8 md:transform md:-translate-y-4">
            <div class="relative z-10">
              <div class="flex items-center gap-2 mb-4">
                <div class="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-secondary-brand text-white text-xs font-bold rounded-full flex items-center gap-2 animate-pulse-brand">
                  <lucide-icon [img]="Zap" class="h-3 w-3 sm:h-4 sm:w-4" />
                  MAIS POPULAR
                </div>
              </div>
              <h3 class="text-2xl sm:text-3xl font-bold mb-2">Profissional</h3>
              <p class="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">Para empresas em crescimento</p>
              <div class="mb-6 sm:mb-8">
                <span class="text-4xl sm:text-5xl font-bold text-gradient">R$ 699</span>
                <span class="text-muted-foreground text-base sm:text-lg">/mês</span>
              </div>
              <ul class="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <li class="flex items-start gap-2 sm:gap-3">
                  <lucide-icon [img]="CheckCircle2" class="h-5 w-5 sm:h-6 sm:w-6 text-secondary flex-shrink-0 mt-0.5" />
                  <span class="text-sm sm:text-base">Até 200 colaboradores</span>
                </li>
                <li class="flex items-start gap-2 sm:gap-3">
                  <lucide-icon [img]="CheckCircle2" class="h-5 w-5 sm:h-6 sm:w-6 text-secondary flex-shrink-0 mt-0.5" />
                  <span class="text-sm sm:text-base">Todos os questionários</span>
                </li>
                <li class="flex items-start gap-2 sm:gap-3">
                  <lucide-icon [img]="CheckCircle2" class="h-5 w-5 sm:h-6 sm:w-6 text-secondary flex-shrink-0 mt-0.5" />
                  <span class="text-sm sm:text-base">Relatórios avançados</span>
                </li>
                <li class="flex items-start gap-2 sm:gap-3">
                  <lucide-icon [img]="CheckCircle2" class="h-5 w-5 sm:h-6 sm:w-6 text-secondary flex-shrink-0 mt-0.5" />
                  <span class="text-sm sm:text-base">Analytics em tempo real</span>
                </li>
                <li class="flex items-start gap-2 sm:gap-3">
                  <lucide-icon [img]="CheckCircle2" class="h-5 w-5 sm:h-6 sm:w-6 text-secondary flex-shrink-0 mt-0.5" />
                  <span class="text-sm sm:text-base">Suporte prioritário</span>
                </li>
              </ul>
              <button class="btn-secondary w-full min-h-[44px] sm:min-h-[48px]">
                Contratar Plano
              </button>
            </div>
          </div>

          <!-- Enterprise Plan -->
          <div class="rounded-2xl border bg-card text-card-foreground shadow-lg card-hover p-6 sm:p-8">
            <h3 class="text-2xl sm:text-3xl font-bold mb-2">Enterprise</h3>
            <p class="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">Para grandes corporações</p>
            <div class="mb-6 sm:mb-8">
              <span class="text-3xl sm:text-4xl font-bold">Personalizado</span>
            </div>
            <ul class="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              <li class="flex items-start gap-2 sm:gap-3">
                <lucide-icon [img]="CheckCircle2" class="h-5 w-5 sm:h-6 sm:w-6 text-secondary flex-shrink-0 mt-0.5" />
                <span class="text-sm sm:text-base">Colaboradores ilimitados</span>
              </li>
              <li class="flex items-start gap-2 sm:gap-3">
                <lucide-icon [img]="CheckCircle2" class="h-5 w-5 sm:h-6 sm:w-6 text-secondary flex-shrink-0 mt-0.5" />
                <span class="text-sm sm:text-base">Todos os recursos</span>
              </li>
              <li class="flex items-start gap-2 sm:gap-3">
                <lucide-icon [img]="CheckCircle2" class="h-5 w-5 sm:h-6 sm:w-6 text-secondary flex-shrink-0 mt-0.5" />
                <span class="text-sm sm:text-base">API personalizada</span>
              </li>
              <li class="flex items-start gap-2 sm:gap-3">
                <lucide-icon [img]="CheckCircle2" class="h-5 w-5 sm:h-6 sm:w-6 text-secondary flex-shrink-0 mt-0.5" />
                <span class="text-sm sm:text-base">Consultoria especializada</span>
              </li>
              <li class="flex items-start gap-2 sm:gap-3">
                <lucide-icon [img]="CheckCircle2" class="h-5 w-5 sm:h-6 sm:w-6 text-secondary flex-shrink-0 mt-0.5" />
                <span class="text-sm sm:text-base">Gerente de conta dedicado</span>
              </li>
            </ul>
            <button class="btn-outline w-full min-h-[44px] sm:min-h-[48px]">
              Fale Conosco
            </button>
          </div>
        </div>
      </div>
      
      <!-- Section separator -->
      <div class="section-separator"></div>
    </section>
  `
})
export class PricingComponent {
  readonly CheckCircle2 = CheckCircle2;
  readonly Zap = Zap;
}
