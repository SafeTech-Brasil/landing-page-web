import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Calculator, Users, ArrowRight, Building2, MessageCircle } from 'lucide-angular';

interface PricingTier {
  name: string;
  min: number;
  max: number;
  base: number;
  extraRate: number;
  extraFrom: number;
}

@Component({
  selector: 'app-pricing',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, LucideAngularModule],
  template: `
    <section id="planos" class="py-12 sm:py-16 md:py-20 lg:py-24 bg-pattern relative" aria-labelledby="pricing-heading">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="text-center mb-12 sm:mb-16">
          <h2 id="pricing-heading" class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-4 sm:px-0">
            Simule seu <span class="text-gradient">Investimento</span>
          </h2>
          <p class="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0">
            Arraste o controle ou digite a quantidade de colaboradores
          </p>
        </div>

        <!-- Simulator Card -->
        <div class="max-w-2xl mx-auto">
          <div class="rounded-2xl border-2 border-primary/20 bg-card text-card-foreground shadow-lg p-6 sm:p-8 space-y-8">

            <!-- Card Header -->
            <div class="text-center pb-2">
              <div class="flex items-center justify-center gap-2 mb-2">
                <lucide-icon [img]="Calculator" class="h-6 w-6 text-primary" />
                <h3 class="font-semibold tracking-tight text-2xl">Simulador de Preços</h3>
              </div>
            </div>

            <!-- Slider + Input -->
            <div class="space-y-4">
              <div class="flex items-center gap-4">
                <lucide-icon [img]="Users" class="h-5 w-5 text-primary flex-shrink-0" />
                <label class="text-sm font-medium whitespace-nowrap" for="collab-input">Colaboradores:</label>
                <input
                  id="collab-input"
                  type="number"
                  [ngModel]="collaborators()"
                  (ngModelChange)="onInputChange($event)"
                  class="h-10 w-28 rounded-md border border-input bg-background px-3 py-2 text-center font-bold text-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  [min]="1"
                  [max]="2000"
                />
              </div>

              <!-- Range Slider -->
              <input
                type="range"
                [min]="1"
                [max]="1500"
                [ngModel]="collaborators()"
                (ngModelChange)="onSliderChange($event)"
                class="pricing-slider w-full h-2 rounded-full appearance-none cursor-pointer"
                aria-label="Quantidade de colaboradores"
              />

              <!-- Scale Labels -->
              <div class="flex justify-between text-xs text-muted-foreground px-0.5">
                <span>1</span>
                <span>250</span>
                <span>500</span>
                <span>750</span>
                <span>1000</span>
                <span>1500</span>
              </div>
            </div>

            <!-- Price Display -->

            <!-- Estado: < 3 colaboradores -->
            @if (collaborators() < 3) {
              <div class="text-center py-6 text-muted-foreground">
                O mínimo para planos mensais é de 3 colaboradores.
              </div>
            }

            <!-- Estado: 3–1000 (cards de preco) -->
            @if (collaborators() >= 3 && !isCorporate()) {
              <div class="space-y-4">
                <div class="grid sm:grid-cols-2 gap-4">
                  <!-- Card Mensal -->
                  <div class="rounded-xl border-2 border-primary bg-primary/5 p-6">
                    <p class="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                      Plano Mensal — {{ currentTier().name }}
                    </p>
                    <p class="text-3xl font-bold text-foreground mb-1">
                      {{ formatBRL(monthlyPrice()) }}
                      <span class="text-sm font-normal text-muted-foreground">/mês</span>
                    </p>
                    <p class="text-sm text-muted-foreground">
                      {{ formatBRL(pricePerCollaborator()) }} por colaborador
                    </p>
                  </div>

                  <!-- Card Pontual -->
                  <div class="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                    <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Avulso (Pontual)</p>
                    @if (collaborators() >= 10) {
                      <p class="text-3xl font-bold text-foreground mb-1">
                        {{ formatBRL(oneTimePrice()) }}
                        <span class="text-sm font-normal text-muted-foreground">único</span>
                      </p>
                      <p class="text-sm text-muted-foreground">
                        R$&nbsp;20,00 por colaborador
                      </p>
                    } @else {
                      <p class="text-sm text-muted-foreground mt-3">
                        Disponível a partir de 10 colaboradores
                      </p>
                    }
                  </div>
                </div>
              </div>

              <!-- CTA Button -->
              <div class="text-center">
                <a
                  href="https://safetechpsicossocial.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn-secondary inline-flex items-center gap-2 px-8 min-h-[44px] sm:min-h-[48px]"
                >
                  Contratar Agora
                  <lucide-icon [img]="ArrowRight" class="h-5 w-5" />
                </a>
              </div>
            }

            <!-- Estado: > 1000 (Corporate) -->
            @if (isCorporate()) {
              <div class="text-center space-y-4">
                <div class="rounded-xl border-2 border-primary bg-primary/5 p-6">
                  <div class="flex items-center justify-center gap-2 mb-2">
                    <lucide-icon [img]="Building2" class="h-6 w-6 text-primary" />
                    <p class="text-lg font-bold text-primary">Plano Corporate</p>
                  </div>
                  <p class="text-muted-foreground text-sm">
                    Para mais de 1.000 colaboradores, oferecemos condições especiais com atendimento personalizado.
                  </p>
                </div>
                <a
                  href="https://safetechpsicossocial.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn-primary inline-flex items-center gap-2 px-8 min-h-[44px] sm:min-h-[48px]"
                >
                  <lucide-icon [img]="MessageCircle" class="h-5 w-5" />
                  Fale com um Especialista
                </a>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Section separator -->
      <div class="section-separator"></div>
    </section>
  `,
  styles: [`
    .pricing-slider {
      background: linear-gradient(to right, var(--color-primary), var(--color-secondary));
      border-radius: 9999px;
    }
    .pricing-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 1.25rem;
      height: 1.25rem;
      border-radius: 50%;
      background: white;
      border: 2px solid var(--color-primary);
      cursor: pointer;
      box-shadow: 0 1px 3px rgba(0,0,0,0.2);
      transition: transform 0.15s ease;
    }
    .pricing-slider::-webkit-slider-thumb:hover {
      transform: scale(1.2);
    }
    .pricing-slider::-moz-range-thumb {
      width: 1.25rem;
      height: 1.25rem;
      border-radius: 50%;
      background: white;
      border: 2px solid var(--color-primary);
      cursor: pointer;
      box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    }
  `]
})
export class PricingComponent {
  readonly Calculator = Calculator;
  readonly Users = Users;
  readonly ArrowRight = ArrowRight;
  readonly Building2 = Building2;
  readonly MessageCircle = MessageCircle;

  private readonly tiers: PricingTier[] = [
    { name: 'Base',    min: 3,   max: 10,   base: 60,    extraRate: 0,    extraFrom: 0   },
    { name: 'Bronze',  min: 11,  max: 50,   base: 60,    extraRate: 5.50, extraFrom: 10  },
    { name: 'Prata',   min: 51,  max: 200,  base: 280,   extraRate: 5.00, extraFrom: 50  },
    { name: 'Ouro',    min: 201, max: 500,  base: 1030,  extraRate: 4.50, extraFrom: 200 },
    { name: 'Premium', min: 501, max: 1000, base: 2380,  extraRate: 3.50, extraFrom: 500 },
  ];

  collaborators = signal(50);

  isCorporate = computed(() => this.collaborators() > 1000);

  currentTier = computed(() => {
    const n = this.collaborators();
    if (n < 3) return this.tiers[0];
    return this.tiers.find(t => n >= t.min && n <= t.max) ?? this.tiers[this.tiers.length - 1];
  });

  monthlyPrice = computed(() => {
    const n = this.collaborators();
    const tier = this.currentTier();
    if (n <= 10) return tier.base;
    const extras = n - tier.extraFrom;
    return tier.base + (extras * tier.extraRate);
  });

  pricePerCollaborator = computed(() => {
    const n = this.collaborators();
    if (n === 0) return 0;
    return this.monthlyPrice() / n;
  });

  oneTimePrice = computed(() => this.collaborators() * 20);

  formatBRL(value: number): string {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  onSliderChange(value: number): void {
    this.collaborators.set(Math.max(1, Math.min(1500, Number(value))));
  }

  onInputChange(value: number): void {
    this.collaborators.set(Math.max(1, Math.min(2000, Number(value) || 1)));
  }
}
