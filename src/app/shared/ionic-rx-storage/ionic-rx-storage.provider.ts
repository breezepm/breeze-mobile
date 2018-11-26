import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { Observable } from 'rxjs/';

@Injectable()
export class IonicRxStorage {
  constructor(private storage: Storage) {}

  public clear(): Observable<null> {
    return this.ready$.switchMap(() => this.storage.clear());
  }

  public get(key: string): Observable<any> {
    const itemFromStorage$ = Observable.fromPromise(this.storage.get(key));
    return this.ready$.switchMap(() => itemFromStorage$);
  }

  public set(key: string, value: any): Observable<any> {
    const storageSaving$ = Observable.fromPromise(this.storage.set(key, value));
    return this.ready$.switchMap(() => storageSaving$);
  }

  public remove(key: string): Observable<any> {
    const storageDeleting$ = Observable.fromPromise(this.storage.remove(key));
    return this.ready$.switchMap(() => storageDeleting$);
  }

  private get ready$(): Observable<LocalForage> {
    return Observable.fromPromise(this.storage.ready());
  }

}
