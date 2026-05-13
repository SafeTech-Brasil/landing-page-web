import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';

export const routes: Routes = [
    {
        path: '',
        component: LandingPageComponent
    },
    {
        path: 'avaliacao',
        loadComponent: () => import('./avaliacao-pdf/avaliacao-pdf.component').then(m => m.AvaliacaoPdfComponent)
    }
];
