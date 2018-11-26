import { Injectable } from '@angular/core';

@Injectable()
export class ConfigurationService {
  public useBugsnag: boolean = webpackGlobalVars.useBugsnag;
}
