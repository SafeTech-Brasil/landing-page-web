import { Component, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { LucideAngularModule, Moon, Sun, Menu, X } from 'lucide-angular';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, LucideAngularModule, NgOptimizedImage],
  template: `
    <header class="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50" role="banner">
      <div class="container mx-auto px-4 py-4 flex items-center justify-between">
        <a href="#inicio" class="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md">
          <img ngSrc="logo.png" alt="SafeTech Brasil Logo" width="40" height="40" class="h-10 w-auto" priority />
          <span class="text-xl font-bold text-foreground">SafeTech Brasil</span>
        </a>
        
        <!-- Mobile Menu Button -->
        <button
          (click)="toggleMobileMenu()"
          class="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          [attr.aria-label]="isMobileMenuOpen() ? 'Fechar menu' : 'Abrir menu'"
          [attr.aria-expanded]="isMobileMenuOpen()"
          aria-controls="mobile-menu"
        >
          @if (isMobileMenuOpen()) {
            <lucide-icon [img]="X" class="h-6 w-6" aria-hidden="true" />
          } @else {
            <lucide-icon [img]="Menu" class="h-6 w-6" aria-hidden="true" />
          }
        </button>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center gap-6" aria-label="Navegação principal">
          <a href="#recursos" class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md px-2 py-1">
            Recursos
          </a>
          <a href="#questionarios" class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md px-2 py-1">
            Questionários
          </a>
          <a href="#planos" class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md px-2 py-1">
            Planos
          </a>
          <a href="#faq" class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md px-2 py-1">
            FAQ
          </a>
          
          <!-- Theme Toggle Button -->
          <button
            (click)="themeService.toggleTheme()"
            class="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            [attr.aria-label]="themeService.theme() === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'"
          >
            @if (themeService.theme() === 'light') {
              <lucide-icon [img]="Moon" class="h-5 w-5" aria-hidden="true" />
            } @else {
              <lucide-icon [img]="Sun" class="h-5 w-5" aria-hidden="true" />
            }
          </button>
          
          <a 
            href="https://safetechpsicossocial.com.br" 
            target="_blank" 
            rel="noopener noreferrer"
            class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Acessar Plataforma
          </a>
        </nav>
      </div>

      <!-- Mobile Menu -->
      @if (isMobileMenuOpen()) {
        <nav 
          id="mobile-menu"
          class="md:hidden border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          aria-label="Menu mobile"
        >
          <div class="container mx-auto px-4 py-4 space-y-4">
            <a 
              href="#recursos" 
              (click)="closeMobileMenu()"
              class="block text-base font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md px-3 py-2"
            >
              Recursos
            </a>
            <a 
              href="#questionarios" 
              (click)="closeMobileMenu()"
              class="block text-base font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md px-3 py-2"
            >
              Questionários
            </a>
            <a 
              href="#planos" 
              (click)="closeMobileMenu()"
              class="block text-base font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md px-3 py-2"
            >
              Planos
            </a>
            <a 
              href="#faq" 
              (click)="closeMobileMenu()"
              class="block text-base font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md px-3 py-2"
            >
              FAQ
            </a>
            <div class="flex items-center justify-between pt-4 border-t border-border">
              <button
                (click)="themeService.toggleTheme()"
                class="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                [attr.aria-label]="themeService.theme() === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'"
              >
                @if (themeService.theme() === 'light') {
                  <lucide-icon [img]="Moon" class="h-5 w-5" aria-hidden="true" />
                } @else {
                  <lucide-icon [img]="Sun" class="h-5 w-5" aria-hidden="true" />
                }
              </button>
              <a 
                href="https://safetechpsicossocial.com.br" 
                target="_blank" 
                rel="noopener noreferrer"
                class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Acessar Plataforma
              </a>
            </div>
          </div>
        </nav>
      }
    </header>
  `
})
export class HeaderComponent {
  readonly Moon = Moon;
  readonly Sun = Sun;
  readonly Menu = Menu;
  readonly X = X;

  readonly themeService = inject(ThemeService);
  readonly isMobileMenuOpen = signal(false);

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(value => !value);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }
}
