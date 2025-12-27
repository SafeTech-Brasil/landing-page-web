import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ChevronDown } from 'lucide-angular';

interface FaqItem {
  question: string;
  answer: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-faq',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <section id="faq" class="py-16 md:py-20 bg-muted/30" aria-labelledby="faq-heading">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12 md:mb-16">
          <h2 id="faq-heading" class="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Dúvidas <span class="text-gradient">Frequentes</span>
          </h2>
          <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
            Encontre respostas para as principais perguntas sobre nossa plataforma
          </p>
        </div>

        <div class="max-w-3xl mx-auto space-y-4">
          @for (item of faqItems(); track item.question) {
            <div class="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
              <button
                (click)="toggleFaq($index)"
                class="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-muted/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                [attr.aria-expanded]="item.isOpen"
                [attr.aria-controls]="'faq-answer-' + $index"
              >
                <span class="font-semibold text-foreground pr-4">{{ item.question }}</span>
                <lucide-icon 
                  [img]="ChevronDown" 
                  class="h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform duration-200"
                  [class.rotate-180]="item.isOpen"
                  aria-hidden="true"
                />
              </button>
              <div
                [id]="'faq-answer-' + $index"
                class="overflow-hidden transition-all duration-300"
                [class.max-h-0]="!item.isOpen"
                [class.max-h-96]="item.isOpen"
              >
                <div class="px-6 pb-5 text-muted-foreground leading-relaxed">
                  {{ item.answer }}
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `
})
export class FaqComponent {
  readonly ChevronDown = ChevronDown;

  readonly faqItems = signal<FaqItem[]>([
    {
      question: 'Como funciona a avaliação gratuita?',
      answer: 'A avaliação gratuita permite que você teste todas as funcionalidades da plataforma por um período determinado. Você pode criar questionários, enviar para colaboradores, visualizar relatórios e explorar todos os recursos sem compromisso financeiro.',
      isOpen: false
    },
    {
      question: 'A plataforma está em conformidade com as normas regulamentadoras?',
      answer: 'Sim, nossa plataforma foi desenvolvida seguindo rigorosamente todas as normas regulamentadoras vigentes, incluindo as NRs relacionadas à saúde e segurança do trabalho. Os questionários são validados por especialistas e atendem aos requisitos legais.',
      isOpen: false
    },
    {
      question: 'Meus dados estão seguros?',
      answer: 'Absolutamente. Utilizamos criptografia de ponta a ponta, servidores seguros e seguimos rigorosamente a LGPD (Lei Geral de Proteção de Dados). Seus dados e os de seus colaboradores estão completamente protegidos.',
      isOpen: false
    },
    {
      question: 'Quanto tempo leva para implementar?',
      answer: 'A implementação é rápida e simples. Em poucos minutos você pode começar a usar a plataforma. Nossa equipe oferece suporte durante todo o processo para garantir que tudo funcione perfeitamente desde o primeiro dia.',
      isOpen: false
    },
    {
      question: 'Posso personalizar os questionários?',
      answer: 'Sim, a plataforma permite personalização completa dos questionários. Você pode adaptar as perguntas às necessidades específicas da sua empresa, mantendo sempre a conformidade com as normas regulamentadoras.',
      isOpen: false
    },
    {
      question: 'Que tipo de suporte está disponível?',
      answer: 'Oferecemos suporte completo através de múltiplos canais, incluindo email, chat e telefone. Nossa equipe está sempre pronta para ajudar com dúvidas técnicas, implementação e otimização do uso da plataforma.',
      isOpen: false
    }
  ]);

  toggleFaq(index: number): void {
    const items = this.faqItems();
    items[index].isOpen = !items[index].isOpen;
    this.faqItems.set([...items]);
  }
}

