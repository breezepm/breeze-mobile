import { ModalPreloaderComponent } from './components/modal-preloader/modal-preloader.component';
import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { PipesModule } from './../../pipes/pipes.module';
import { DirectivesModule } from './../../directives/directives.module';
import { TaskPage } from './pages/task.page';
import { TaskEffects } from './effects/task.effects';
import { TaskCommentEffects } from './effects/task-comment.effects';
import { EffectsModule } from '@ngrx/effects';
import { UserComponentsModule } from './../user/components/user-components.module';
import { TaskComponentsModule } from './components/task-components.module';
import { TasksByProjectsPage } from './pages/tasks-by-projects.page';
import { TasksByDatePage } from './pages/tasks-by-date.page';
import { TasksPopoverPage } from './pages/tasks-popover.page';
import { TaskBreadcrumbsComponent } from './components/task-breadcrumbs.component';
import { TaskDetailsOnListComponent } from './components/details-on-list/task-details-on-list.component';
import {
  TaskStageModal, TaskCommentModal, TaskAttachmentsModal,
  TaskStatusModal, TaskTodosModal, TaskDatesModal, TaskUsersModal,
  TaskDescriptionModal, TaskTimeEntriesModal,
} from './modals/';
import { MentionModule } from '../../shared/mention/mention.module';
import { TaskPopoverPage } from './pages/task-popover.page';
import { Clipboard } from '@ionic-native/clipboard';
import { AddNewTaskPage } from './pages/add-new-task.page';

@NgModule({
  imports: [
    IonicModule,
    EffectsModule.run(TaskEffects),
    EffectsModule.run(TaskCommentEffects),
    UserComponentsModule,
    DirectivesModule,
    PipesModule,
    TaskComponentsModule,
    MentionModule,
    ReactiveFormsModule,
  ],
  declarations: [
    ModalPreloaderComponent,
    TaskBreadcrumbsComponent,
    TaskDetailsOnListComponent,
    TaskPage,
    TasksByProjectsPage,
    TasksByDatePage,
    TasksPopoverPage,
    TaskStageModal,
    TaskCommentModal,
    TaskAttachmentsModal,
    TaskStatusModal,
    TaskUsersModal,
    TaskTodosModal,
    TaskTimeEntriesModal,
    TaskDatesModal,
    TaskDescriptionModal,
    TaskPopoverPage,
    AddNewTaskPage,
  ],
  entryComponents: [
    TaskBreadcrumbsComponent,
    TaskDetailsOnListComponent,
    TaskPage,
    TasksByProjectsPage,
    TasksByDatePage,
    TasksPopoverPage,
    TaskStageModal,
    TaskCommentModal,
    TaskAttachmentsModal,
    TaskStatusModal,
    TaskTodosModal,
    TaskUsersModal,
    TaskTimeEntriesModal,
    TaskDatesModal,
    TaskDescriptionModal,
    TaskPopoverPage,
    AddNewTaskPage,
  ],
  providers: [ DatePipe, Clipboard ],
})
export class TasksModule {}
