import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { HeroComponent } from './components/hero/hero.component';
import { QuestionnairesComponent } from './components/questionnaires/questionnaires.component';
import { PricingComponent } from './components/pricing/pricing.component';
import { StatsComponent } from './components/stats/stats.component';
import { SocialProofComponent } from './components/social-proof/social-proof.component';
import { CtaComponent } from './components/cta/cta.component';
import { FooterComponent } from './components/footer/footer.component';
import { FaqComponent } from './components/faq/faq.component';

@Component({
  selector: 'app-landing-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HeaderComponent,
    HeroComponent,
    QuestionnairesComponent,
    PricingComponent,
    StatsComponent,
    SocialProofComponent,
    FaqComponent,
    CtaComponent,
    FooterComponent
  ],
  template: `
    <a href="#inicio" class="skip-to-main">Pular para conteúdo principal</a>
    <div class="min-h-screen bg-background font-sans text-foreground">
      <app-header />
      <main role="main">
        <app-hero />
        <app-stats />
        <app-questionnaires />
        <app-pricing />
        <app-social-proof />
        <app-faq />
        <app-cta />
      </main>
      <app-footer />
    </div>
  `
})
export class LandingPageComponent { }
