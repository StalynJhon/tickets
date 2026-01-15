import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

export interface ThemePreferences {
  theme: 'light' | 'dark';
  fontSize: number; // 12-24px
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private preferencesSubject = new BehaviorSubject<ThemePreferences>({
    theme: 'dark',
    fontSize: 16
  });
  
  public preferences$ = this.preferencesSubject.asObservable();
  private isBrowser: boolean;
  private readonly STORAGE_KEY = 'theme_preferences';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.loadPreferences();
      this.applyPreferences();
    }
  }

  private loadPreferences(): void {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.preferencesSubject.next({
          theme: parsed.theme || 'dark',
          fontSize: parsed.fontSize || 16
        });
      }
    } catch (error) {
      console.warn('Error loading theme preferences:', error);
    }
  }

  private savePreferences(preferences: ThemePreferences): void {
    if (!this.isBrowser) return;
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.warn('Error saving theme preferences:', error);
    }
  }

  private applyPreferences(): void {
    if (!this.isBrowser) return;
    
    const prefs = this.preferencesSubject.value;
    
    // Apply theme classes globally to body
    document.body.className = `theme-${prefs.theme}`;
    
    // Apply font size globally
    document.documentElement.style.setProperty('--global-font-size', `${prefs.fontSize}px`);
    
    // Apply CSS variables for theme colors
    this.applyThemeVariables(prefs.theme);
  }

  private applyThemeVariables(theme: 'light' | 'dark'): void {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      // Dark theme variables
      root.style.setProperty('--bg-primary', '#0f172a');
      root.style.setProperty('--bg-secondary', '#1a1a40');
      root.style.setProperty('--bg-card', '#162447');
      root.style.setProperty('--text-primary', '#c0d6ff');
      root.style.setProperty('--text-secondary', '#80aaff');
      root.style.setProperty('--border-color', '#3a3f5c');
      root.style.setProperty('--accent-color', '#00f0ff');
      root.style.setProperty('--accent-hover', '#3a86ff');
      
      // Additional theme variables
      root.style.setProperty('--bg-card-transparent', 'rgba(22, 36, 71, 0.9)');
      root.style.setProperty('--border-medium', '#4a5568');
      root.style.setProperty('--accent-dark', '#0066cc');
      root.style.setProperty('--accent-darker', '#004499');
      root.style.setProperty('--accent-alt', '#3a86ff');
      root.style.setProperty('--accent-medium', 'rgba(0, 240, 255, 0.4)');
      root.style.setProperty('--accent-bright', 'rgba(0, 240, 255, 0.6)');
      root.style.setProperty('--accent-subtle', 'rgba(0, 240, 255, 0.1)');
      root.style.setProperty('--accent-glow', 'rgba(0, 240, 255, 0.5)');
      root.style.setProperty('--accent-faint', 'rgba(0, 240, 255, 0.15)');
      root.style.setProperty('--accent-transparent', 'rgba(0, 240, 255, 0)');
      root.style.setProperty('--success-color', '#10b981');
      root.style.setProperty('--success-dark', '#059669');
      root.style.setProperty('--cancel-color', '#64748b');
      root.style.setProperty('--cancel-shadow', 'rgba(100, 116, 139, 0.3)');
      root.style.setProperty('--text-on-accent', '#ffffff');
      root.style.setProperty('--shadow-light', 'rgba(0, 0, 0, 0.1)');
      root.style.setProperty('--shadow-medium', 'rgba(0, 0, 0, 0.2)');
      root.style.setProperty('--shadow-heavy', 'rgba(0, 0, 0, 0.3)');
      root.style.setProperty('--shadow-ultra-light', 'rgba(0, 0, 0, 0.02)');
      root.style.setProperty('--modal-backdrop', 'rgba(0, 0, 0, 0.6)');
      root.style.setProperty('--error-color', '#ef4444');
      root.style.setProperty('--error-dark', '#b91c1c');
      root.style.setProperty('--edit-bg', '#e0f2fe');
      root.style.setProperty('--edit-color', '#0369a1');
      root.style.setProperty('--edit-bg-hover', '#bae6fd');
      root.style.setProperty('--delete-bg', '#fee2e2');
      root.style.setProperty('--delete-color', '#b91c1c');
      root.style.setProperty('--delete-bg-hover', '#fecaca');
      root.style.setProperty('--cancel-hover', '#475569');
      root.style.setProperty('--cancel-shadow-bright', 'rgba(100, 116, 139, 0.4)');
      
      // Sidebar specific dark theme
      root.style.setProperty('--bg-sidebar', '#1f2937');
      root.style.setProperty('--text-sidebar', '#ffffff');
      root.style.setProperty('--bg-sidebar-hover', '#374151');
      root.style.setProperty('--text-sidebar-hover', '#ffffff');
      root.style.setProperty('--bg-sidebar-active', '#111827');
      root.style.setProperty('--text-sidebar-active', '#ffffff');
      root.style.setProperty('--shadow-dark', 'rgba(0, 0, 0, 0.25)');
    } else {
      // Light theme variables
      root.style.setProperty('--bg-primary', '#f8fafc');
      root.style.setProperty('--bg-secondary', '#e2e8f0');
      root.style.setProperty('--bg-card', '#ffffff');
      root.style.setProperty('--text-primary', '#1e293b');
      root.style.setProperty('--text-secondary', '#64748b');
      root.style.setProperty('--border-color', '#cbd5e1');
      root.style.setProperty('--accent-color', '#0ea5e9');
      root.style.setProperty('--accent-hover', '#0284c7');
      
      // Additional theme variables
      root.style.setProperty('--bg-card-transparent', 'rgba(255, 255, 255, 0.9)');
      root.style.setProperty('--border-medium', '#94a3b8');
      root.style.setProperty('--accent-dark', '#0369a1');
      root.style.setProperty('--accent-darker', '#075985');
      root.style.setProperty('--accent-alt', '#0284c7');
      root.style.setProperty('--accent-medium', 'rgba(14, 165, 233, 0.3)');
      root.style.setProperty('--accent-bright', 'rgba(14, 165, 233, 0.4)');
      root.style.setProperty('--accent-subtle', 'rgba(14, 165, 233, 0.1)');
      root.style.setProperty('--accent-glow', 'rgba(14, 165, 233, 0.3)');
      root.style.setProperty('--accent-faint', 'rgba(14, 165, 233, 0.15)');
      root.style.setProperty('--accent-transparent', 'rgba(14, 165, 233, 0)');
      root.style.setProperty('--success-color', '#10b981');
      root.style.setProperty('--success-dark', '#059669');
      root.style.setProperty('--cancel-color', '#64748b');
      root.style.setProperty('--cancel-shadow', 'rgba(100, 116, 139, 0.3)');
      root.style.setProperty('--text-on-accent', '#ffffff');
      root.style.setProperty('--shadow-light', 'rgba(0, 0, 0, 0.05)');
      root.style.setProperty('--shadow-medium', 'rgba(0, 0, 0, 0.1)');
      root.style.setProperty('--shadow-heavy', 'rgba(0, 0, 0, 0.15)');
      root.style.setProperty('--shadow-ultra-light', 'rgba(0, 0, 0, 0.02)');
      root.style.setProperty('--modal-backdrop', 'rgba(0, 0, 0, 0.5)');
      root.style.setProperty('--error-color', '#ef4444');
      root.style.setProperty('--error-dark', '#b91c1c');
      root.style.setProperty('--edit-bg', '#e0f2fe');
      root.style.setProperty('--edit-color', '#0369a1');
      root.style.setProperty('--edit-bg-hover', '#bae6fd');
      root.style.setProperty('--delete-bg', '#fee2e2');
      root.style.setProperty('--delete-color', '#b91c1c');
      root.style.setProperty('--delete-bg-hover', '#fecaca');
      root.style.setProperty('--cancel-hover', '#475569');
      root.style.setProperty('--cancel-shadow-bright', 'rgba(100, 116, 139, 0.4)');
      
      // Sidebar specific light theme
      root.style.setProperty('--bg-sidebar', '#f1f5f9');
      root.style.setProperty('--text-sidebar', '#1e293b');
      root.style.setProperty('--bg-sidebar-hover', '#e2e8f0');
      root.style.setProperty('--text-sidebar-hover', '#0f172a');
      root.style.setProperty('--bg-sidebar-active', '#cbd5e1');
      root.style.setProperty('--text-sidebar-active', '#0f172a');
      root.style.setProperty('--shadow-dark', 'rgba(0, 0, 0, 0.1)');
    }
  }

  setTheme(theme: 'light' | 'dark'): void {
    const current = this.preferencesSubject.value;
    const newPrefs = { ...current, theme };
    this.preferencesSubject.next(newPrefs);
    this.savePreferences(newPrefs);
    this.applyPreferences();
  }

  setFontSize(size: number): void {
    const clampedSize = Math.max(12, Math.min(24, size));
    const current = this.preferencesSubject.value;
    const newPrefs = { ...current, fontSize: clampedSize };
    this.preferencesSubject.next(newPrefs);
    this.savePreferences(newPrefs);
    this.applyPreferences();
  }



  toggleTheme(): void {
    const current = this.preferencesSubject.value;
    const newTheme = current.theme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  resetToDefaults(): void {
    const defaults: ThemePreferences = {
      theme: 'dark',
      fontSize: 16
    };
    this.preferencesSubject.next(defaults);
    this.savePreferences(defaults);
    this.applyPreferences();
  }

  getCurrentPreferences(): ThemePreferences {
    return this.preferencesSubject.value;
  }
}