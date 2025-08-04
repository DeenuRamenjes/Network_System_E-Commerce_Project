import { ApplicationConfig, EnvironmentProviders, Provider, importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

const materialModules = [
  MatButtonModule,
  MatDialogModule,
  MatProgressSpinnerModule,
  MatIconModule
];

export function provideMaterial(): (Provider | EnvironmentProviders)[] {
  return [
    provideAnimations(),
    provideAnimationsAsync(),
    importProvidersFrom(...materialModules)
  ];
}
