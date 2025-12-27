import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, LucideAngularModule, NgOptimizedImage],
  template: `
    <footer class="py-16 border-t border-border bg-gradient-soft" role="contentinfo">
      <div class="container mx-auto px-4">
        <!-- Main footer content -->
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <!-- Brand column -->
          <div class="lg:col-span-1">
            <div class="flex items-center gap-3 mb-4">
              <img ngSrc="logo.png" alt="SafeTech Brasil Logo" width="40" height="40" class="h-10 w-auto" />
              <span class="text-xl font-bold">SafeTech Brasil</span>
            </div>
            <p class="text-muted-foreground mb-6 max-w-sm">
              Tecnologia de ponta para garantir a saúde, segurança e bem-estar dos colaboradores da sua empresa.
            </p>
          </div>
          
          <!-- Product column -->
          <div>
            <h3 class="font-bold text-foreground mb-4 text-lg">Produto</h3>
            <ul class="space-y-3">
              <li><a href="#recursos" class="text-muted-foreground hover:text-primary transition-colors">Recursos</a></li>
              <li><a href="#questionarios" class="text-muted-foreground hover:text-primary transition-colors">Questionários</a></li>
              <li><a href="#planos" class="text-muted-foreground hover:text-primary transition-colors">Planos</a></li>
              <li><a href="#" class="text-muted-foreground hover:text-primary transition-colors">Integrações</a></li>
            </ul>
          </div>
          
          <!-- Company column -->
          <div>
            <h3 class="font-bold text-foreground mb-4 text-lg">Empresa</h3>
            <ul class="space-y-3">
              <li><a href="#" class="text-muted-foreground hover:text-primary transition-colors">Sobre Nós</a></li>
              <li><a href="#" class="text-muted-foreground hover:text-primary transition-colors">Contato</a></li>
              <li><a href="#" class="text-muted-foreground hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" class="text-muted-foreground hover:text-primary transition-colors">Carreiras</a></li>
            </ul>
          </div>
          
          <!-- Legal column -->
          <div>
            <h3 class="font-bold text-foreground mb-4 text-lg">Legal</h3>
            <ul class="space-y-3">
              <li><a href="#" class="text-muted-foreground hover:text-primary transition-colors">Privacidade</a></li>
              <li><a href="#" class="text-muted-foreground hover:text-primary transition-colors">Termos de Uso</a></li>
              <li><a href="#" class="text-muted-foreground hover:text-primary transition-colors">Segurança</a></li>
              <li><a href="#" class="text-muted-foreground hover:text-primary transition-colors">LGPD</a></li>
            </ul>
          </div>
        </div>
        
        <!-- Bottom bar -->
        <div class="pt-8 border-t border-border">
          <div class="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2025 SafeTech Brasil. Todos os direitos reservados.</p>
            <div class="flex gap-1 items-center">
            </div>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent { }
