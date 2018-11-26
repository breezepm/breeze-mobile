import { UserComponentsModule } from './../../user/components/user-components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';

import { PipesModule } from './../../../pipes/pipes.module';
import { TaskCommentComponent } from './comment/task-comment.component';

@NgModule({
  imports: [ CommonModule, IonicModule, PipesModule, UserComponentsModule ],
  declarations: [ TaskCommentComponent ],
  entryComponents: [ TaskCommentComponent ],
  exports: [ TaskCommentComponent ],
})
export class TaskComponentsModule { }
