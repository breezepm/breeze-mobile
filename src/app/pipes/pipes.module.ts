import { NgModule } from '@angular/core';

import { SafeHtmlPipe } from './safe-html.pipe';
import { HourMinuteFormatPipe } from './hour-minute.pipe';

@NgModule({
  declarations: [ SafeHtmlPipe, HourMinuteFormatPipe ],
  exports: [ SafeHtmlPipe, HourMinuteFormatPipe ],
})
export class PipesModule {}
