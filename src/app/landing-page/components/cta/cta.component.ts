import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ArrowRight } from 'lucide-angular';

@Component({
  selector: 'app-cta',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <section class="py-24 bg-gradient-brand text-white relative overflow-hidden" aria-labelledby="cta-heading">
       <!-- Decorative elements -->
      <div class="absolute top-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl" aria-hidden="true"></div>
      <div class="absolute bottom-10 left-10 w-72 h-72 bg-secondary/20 rounded-full blur-3xl" aria-hidden="true"></div>
      
      <div class="container mx-auto px-4 text-center relative z-10">
        <h2 id="cta-heading" class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
          Pronto para Transformar a Gestão da sua Empresa?
        </h2>
        <p class="text-xl md:text-2xl mb-10 opacity-90 max-w-3xl mx-auto">
          Comece hoje mesmo com nossa avaliação gratuita e veja os resultados em poucos dias
        </p>
        <a 
          href="https://safetechpsicossocial.com.br" 
          target="_blank" 
          rel="noopener noreferrer"
          class="btn-secondary inline-flex items-center justify-center bg-primary-foreground text-primary hover:bg-primary-foreground/90"
        >
          Começar Agora <lucide-icon [img]="ArrowRight" class="ml-2 h-5 w-5" aria-hidden="true" />
        </a>
      </div>
    </section>
  `
})
export class CtaComponent {
  readonly ArrowRight = ArrowRight;
}
