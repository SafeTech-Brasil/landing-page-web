import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ArrowRight } from 'lucide-angular';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <section id="inicio" class="relative py-16 sm:py-20 md:py-24 lg:py-32 overflow-hidden bg-gradient-brand" aria-labelledby="hero-heading">
      <div 
        class="absolute inset-0 z-0 opacity-10 bg-cover bg-center"
        style="background-image: url('/hero-bg.jpg');"
        aria-hidden="true"
      ></div>
      
      <!-- Decorative circles - hidden on mobile for performance -->
      <div class="hidden md:block absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" aria-hidden="true"></div>
      <div class="hidden md:block absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" aria-hidden="true"></div>
      
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="max-w-4xl mx-auto text-center">
          <!-- Main heading with responsive font sizes -->
          <h1 id="hero-heading" class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            Proteja sua equipe e evite multas com <span class="block sm:inline text-secondary mt-2 sm:mt-0">Gestão de Saúde Simplificada</span>
          </h1>
          
          <!-- Subtitle with responsive sizing -->
          <p class="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
            A plataforma completa para questionários psicossociais e conformidade com normas regulamentadoras
          </p>
          
          <!-- CTA buttons - stacked on mobile, side by side on desktop -->
          <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center max-w-md sm:max-w-none mx-auto px-4 sm:px-0">
            <a 
              href="https://safetechpsicossocial.com.br" 
              target="_blank" 
              rel="noopener noreferrer"
              class="btn-secondary inline-flex items-center justify-center w-full sm:w-auto text-base sm:text-sm md:text-base"
            >
              Quero minha Avaliação Gratuita <lucide-icon [img]="ArrowRight" class="ml-2 h-5 w-5" aria-hidden="true" />
            </a>
            <a 
              href="#planos" 
              class="btn-outline-light inline-flex items-center justify-center w-full sm:w-auto text-base sm:text-sm md:text-base"
            >
              Ver Planos
            </a>
          </div>
        </div>
      </div>
    </section>
  `
})
export class HeroComponent {
  readonly ArrowRight = ArrowRight;
}
