import { Component, Input } from '@angular/core';
import { SearchResult } from '../../../models/search/search.model';

@Component({
  selector: 'search-result',
  templateUrl: 'search-result.component.html',
  styles: [ 'search-result.component.scss' ],
})
export class SearchResultComponent {
  @Input() public item: SearchResult;
}
