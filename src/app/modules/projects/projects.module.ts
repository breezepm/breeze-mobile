import { PopoverForStage } from './pages/popoverForStage.page';
import { ProjectPopoverTablet } from './pages/project-popover-tablet.page';
import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { EffectsModule } from '@ngrx/effects';
import { DragulaModule } from 'ng2-dragula';

import { ProjectPage } from './pages/project.page';
import { ProjectPopoverPage } from './pages/project-popover.page';
import { ProjectsPage } from './pages/projects.page';
import { ProjectEffects } from './effects/project.effects';
import { AddNewProjectPage } from './pages/add-new-project.page';
import { UserComponentsModule } from '../user/components/user-components.module';
import { ProjectsComponentsModule } from './components/projects-components.module';
import { FilterByPropPipe } from '../../pipes/user.search.pipe';
import { EditProjectPage } from './pages/edit-project.page';
import { FilterByAssignmentPipe } from '../../pipes/order-by.pipe';
import { DirectivesModule } from './../../directives/directives.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    IonicModule,
    EffectsModule.run(ProjectEffects),
    UserComponentsModule,
    ProjectsComponentsModule,
    DragulaModule,
    DirectivesModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    ProjectPopoverTablet,
    PopoverForStage,
    ProjectPage,
    ProjectPopoverPage,
    ProjectsPage,
    AddNewProjectPage,
    EditProjectPage,
    FilterByPropPipe, // Todo: move this to the pipes module
    FilterByAssignmentPipe, // Todo: move this to the pipes module
  ],
  entryComponents: [
    ProjectPopoverTablet,
    PopoverForStage,
    ProjectPage,
    ProjectPopoverPage,
    ProjectsPage,
    EditProjectPage,
    AddNewProjectPage,
  ],
})
export class ProjectsModule {}
