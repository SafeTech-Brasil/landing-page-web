import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ShieldCheck, Users, Award, BadgeCheck } from 'lucide-angular';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-social-proof',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <section class="py-16 md:py-20 bg-pattern relative overflow-hidden" aria-labelledby="guarantees-heading">
      <!-- Decorative elements -->
      <div class="absolute top-10 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" aria-hidden="true"></div>
      <div class="absolute bottom-10 right-10 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" aria-hidden="true"></div>
      
      <div class="container mx-auto px-4 relative z-10">
        <div class="text-center mb-12 md:mb-16">
          <div class="inline-block px-4 py-2 bg-primary/10 dark:bg-primary/30 text-sm font-semibold rounded-full mb-4" [style.color]="themeService.theme() === 'dark' ? 'white' : '#1e3a5f'">
            GARANTIAS E SEGURANÇA
          </div>
          <h2 id="guarantees-heading" class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Nossos <span class="text-gradient">Compromissos</span> com Você
          </h2>
          <p class="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Sua tranquilidade é nossa prioridade. Conte com garantias reais e suporte especializado
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
          <!-- Guarantee 1 -->
          <div class="bg-card p-6 md:p-8 rounded-xl border-2 border-primary/30 shadow-lg card-hover relative overflow-hidden group">
            <div class="absolute top-2 right-2">
              <div class="w-3 h-3 bg-secondary rounded-full animate-pulse" aria-hidden="true"></div>
            </div>
            <div class="flex flex-col items-center text-center">
              <div class="relative mb-6">
                <div class="absolute inset-0 bg-primary/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" aria-hidden="true"></div>
                <div class="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <lucide-icon [img]="ShieldCheck" class="h-8 w-8 text-white" aria-hidden="true" />
                </div>
              </div>
              <div class="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-xs font-bold rounded-full mb-3" [style.color]="themeService.theme() === 'dark' ? '#60a5fa' : '#1e3a5f'">
                <lucide-icon [img]="BadgeCheck" class="h-4 w-4" aria-hidden="true" />
                VALIDADO
              </div>
              <h3 class="font-bold text-xl mb-3">Conformidade 100% Garantida</h3>
              <p class="text-sm text-muted-foreground leading-relaxed">
                Questionários validados por especialistas e em total conformidade com todas as normas regulamentadoras vigentes. Proteção jurídica completa.
              </p>
            </div>
          </div>

          <!-- Guarantee 2 -->
          <div class="bg-card p-6 md:p-8 rounded-xl border-2 border-secondary/30 shadow-lg card-hover relative overflow-hidden group">
            <div class="absolute top-2 right-2">
              <div class="w-3 h-3 bg-secondary rounded-full animate-pulse" aria-hidden="true"></div>
            </div>
            <div class="flex flex-col items-center text-center">
              <div class="relative mb-6">
                <div class="absolute inset-0 bg-secondary/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" aria-hidden="true"></div>
                <div class="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <lucide-icon [img]="Users" class="h-8 w-8 text-white" aria-hidden="true" />
                </div>
              </div>
              <div class="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 text-xs font-bold rounded-full mb-3" [style.color]="themeService.theme() === 'dark' ? '#34d399' : '#10b981'">
                <lucide-icon [img]="BadgeCheck" class="h-4 w-4" aria-hidden="true" />
                24/7
              </div>
              <h3 class="font-bold text-xl mb-3">Suporte Especializado Dedicado</h3>
              <p class="text-sm text-muted-foreground leading-relaxed">
                Equipe de especialistas sempre disponível para ajudar na implementação, otimização e resolução de dúvidas. Seu sucesso é nosso compromisso.
              </p>
            </div>
          </div>

          <!-- Guarantee 3 -->
          <div class="bg-card p-6 md:p-8 rounded-xl border-2 border-accent/30 shadow-lg card-hover relative overflow-hidden group">
            <div class="absolute top-2 right-2">
              <div class="w-3 h-3 bg-accent rounded-full animate-pulse" aria-hidden="true"></div>
            </div>
            <div class="flex flex-col items-center text-center">
              <div class="relative mb-6">
                <div class="absolute inset-0 bg-accent/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" aria-hidden="true"></div>
                <div class="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <lucide-icon [img]="Award" class="h-8 w-8 text-white" aria-hidden="true" />
                </div>
              </div>
              <div class="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 text-xs font-bold rounded-full mb-3" [style.color]="themeService.theme() === 'dark' ? '#38bdf8' : '#0ea5e9'">
                <lucide-icon [img]="BadgeCheck" class="h-4 w-4" aria-hidden="true" />
                CERTIFICADO
              </div>
              <h3 class="font-bold text-xl mb-3">Qualidade Premium Garantida</h3>
              <p class="text-sm text-muted-foreground leading-relaxed">
                Plataforma desenvolvida seguindo as melhores práticas internacionais de segurança, usabilidade e performance. Testada e aprovada.
              </p>
            </div>
          </div>

          <!-- Guarantee 4 -->
          <div class="bg-card p-6 md:p-8 rounded-xl border-2 border-primary/30 shadow-lg card-hover relative overflow-hidden group">
            <div class="absolute top-2 right-2">
              <div class="w-3 h-3 bg-secondary rounded-full animate-pulse" aria-hidden="true"></div>
            </div>
            <div class="flex flex-col items-center text-center">
              <div class="relative mb-6">
                <div class="absolute inset-0 bg-primary/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" aria-hidden="true"></div>
                <div class="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <lucide-icon [img]="ShieldCheck" class="h-8 w-8 text-white" aria-hidden="true" />
                </div>
              </div>
              <div class="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 text-xs font-bold rounded-full mb-3" [style.color]="themeService.theme() === 'dark' ? '#34d399' : '#10b981'">
                <lucide-icon [img]="BadgeCheck" class="h-4 w-4" aria-hidden="true" />
                SEM RISCO
              </div>
              <h3 class="font-bold text-xl mb-3">Teste Grátis Sem Compromisso</h3>
              <p class="text-sm text-muted-foreground leading-relaxed">
                Experimente todas as funcionalidades sem custo. Veja os resultados na prática antes de decidir. Zero riscos, apenas benefícios.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class SocialProofComponent {
  readonly themeService = inject(ThemeService);
  readonly ShieldCheck = ShieldCheck;
  readonly Users = Users;
  readonly Award = Award;
  readonly BadgeCheck = BadgeCheck;
}
