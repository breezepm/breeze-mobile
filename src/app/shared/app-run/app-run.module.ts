import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { AppRunEffects } from './effects/app-run.effects';

@NgModule({
  imports: [ EffectsModule.run(AppRunEffects) ],
})
export class AppRunModule {}
