import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';
import { FormErrorComponent } from './form/components/form-error.component';

@NgModule({
  declarations: [
    FormErrorComponent,
  ],
  imports: [
    IonicModule,
    CommonModule,
  ],
  entryComponents: [
    FormErrorComponent,
  ],
  exports: [
    FormErrorComponent,
  ],
})

export class SharedModule {}
