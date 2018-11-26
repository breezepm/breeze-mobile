import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';

import { TaskFormComponent } from './task-form/task-form.component';
import { DirectivesModule } from './../../../directives/directives.module';
import { TaskDetailsOnKanbanViewComponent } from './details-on-kanban-view/task-details-on-kanban-view.component';
import { UserComponentsModule } from '../../user/components/user-components.module';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    DirectivesModule,
    UserComponentsModule,
    PipesModule,
  ],
  declarations: [
    TaskDetailsOnKanbanViewComponent,
    TaskFormComponent,
  ],
  entryComponents: [
    TaskDetailsOnKanbanViewComponent,
    TaskFormComponent,
  ],
  exports: [
    TaskDetailsOnKanbanViewComponent,
    TaskFormComponent,
  ],
})
export class ProjectsComponentsModule { }
