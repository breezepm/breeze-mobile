import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from '../../directives/directives.module';
import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { SearchEffects } from './effects/search.effects';
import { SearchPage } from './pages/search.page';
import { SearchResultComponent } from './components/search-result.component';

@NgModule({
  imports: [
    IonicModule,
    EffectsModule.run(SearchEffects),
    DirectivesModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    SearchPage,
    SearchResultComponent,
  ],
  entryComponents: [
    SearchPage,
    SearchResultComponent,
  ],
})
export class SearchModule {}
