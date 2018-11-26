import { Component, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { pathIsDefined } from './../../../../helpers/path-is-defined';

@Component({
  selector: 'br-user-avatar',
  templateUrl: 'user-avatar.component.html',
  styles: [ 'user-avatar.componet.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserAvatarComponent implements OnChanges {
  @Input() public avatar: string;
  @Input() public background: string;
  @Input() public initials: string;

  public ngOnChanges(changes: SimpleChanges) {
    if (pathIsDefined([ 'background', 'currentValue' ], changes)) {
      const HASH = '#';
      if (this.background.charAt(0) !== HASH) {
        this.background = `${HASH}${this.background}`;
      }
    }
  }
}
