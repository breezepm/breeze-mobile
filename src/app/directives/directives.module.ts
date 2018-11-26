import { NgModule } from '@angular/core';

import { AutoResizeDirective } from './auto-resize.directive';

@NgModule({
  declarations: [
    AutoResizeDirective,
  ],
  exports: [
    AutoResizeDirective,
  ],
})
export class DirectivesModule {}
