import { DomController, Platform } from 'ionic-angular';

export class AlertMock {

  public create(): any {
    const rtn: any = {};
    rtn.present = () => true;
    return rtn;
  }

  // function actually on the AlertClass (not AlertController), but using these interchangably for now
  public dismiss(): Promise<{}> {
    return new Promise((resolve: () => any): any => resolve());
  }
}

export class ToastMock {

  public create(): any {
    const rtn: any = {};
    rtn.present = () => true;
    return rtn;
  }
}

export class ConfigMock {

  public get(): any {
    return '';
  }

  public getBoolean(): boolean {
    return true;
  }

  public getNumber(): number {
    return 1;
  }

  public setTransition(): void {
    //
  }
}

export class FormMock {
  public register(): any {
    return true;
  }

  public nextId(): number {
    return 0;
  }

  public deregister() {
    //
  }

  public setAsFocused() {
    //
  }

  public tabFocus() {
    //
  }
}

export class NavMock {

  public pop(): any {
    return new Promise((resolve: () => any): any => resolve());
  }

  public push(): any {
    return new Promise((resolve: () => any): any => resolve());
  }

  public getActive(): any {
    return {
      'instance': {
        'model': 'something',
      },
    };
  }

  public setRoot(): any {
    return true;
  }

  public popToRoot(): any {
    return true;
  }
}

export class LoadingControllerMock {
  public create(_?: any): any {
    return ({
      present: () => {
        //
      },
      dismiss: () => {
        //
      },
    });
  }
}

export class ModalControllerMock {
  public create(_?: any): any {
    return ({
      present: () => {
        //
      },
      dismiss: () => {
        //
      },
    });
  }
}

export class PlatformMock extends Platform {
  public ready(): Promise<string> {
    return new Promise((resolve) => resolve('READY'));
  }

  public registerBackButtonAction(_: () => any, __?: number): () => any {
    return () => true;
  }

  public hasFocus(_: HTMLElement): boolean {
    return true;
  }

  public doc(): HTMLDocument {
    return document;
  }

  public is(): boolean {
    return true;
  }

  public getElementComputedStyle(_: any): any {
    return {
      paddingLeft: '10',
      paddingTop: '10',
      paddingRight: '10',
      paddingBottom: '10',
    };
  }

  public onResize(callback: any) {
    return callback;
  }

  public registerListener(_: any, __: string, ___: any): () => any {
    return () => true;
  }

  public win(): Window {
    return window;
  }

  public raf(_: any): number {
    return 1;
  }

  public timeout(callback: any, timer: number): any {
    return setTimeout(callback, timer);
  }

  public cancelTimeout(_: any) {
    //
  }

  public getActiveElement(): any {
    return document.activeElement;
  }

  public flushTimeouts(_?) {
    //
  }

  public flushRafs(_?) {
    //
  }

  public flushTimeoutsUntil(_?, __?) {
    //
  }
}

export class StorageMock {

  public get(_: string): Promise<{}> {
    return new Promise((resolve: (arg: any) => any) => resolve({}));
  }

  public set(key: string, value: string): Promise<{}> {
    return new Promise((resolve: (arg: any) => any) => resolve({ key, value }));
  }

  public remove(key: string): Promise<{}> {
    return new Promise((resolve: (arg: any) => any) => resolve({ key }));
  }

  public query(): Promise<{ res: { rows: Array<{}> }}> {
    return new Promise((resolve) => {
      resolve({
        res: {
          rows: [{}],
        },
      });
    });
  }
}

export class MenuMock {
  public close(): any {
    return new Promise((resolve: () => any) => resolve());
  }
}

export class AppMock {

  public getActiveNav(): NavMock {
    return new NavMock();
  }
}

export function DomMock(platform?: PlatformMock) {
  platform = platform || new PlatformMock();
  return new MockDomController(platform);
}

class MockDomController extends DomController {

  constructor(private mockedPlatform: PlatformMock) {
    super(mockedPlatform);
  }

  public flush(done: any) {
    this.mockedPlatform.flushTimeouts(() => {
      this.mockedPlatform.flushRafs((timeStamp: number) => {
        done(timeStamp);
      });
    });
  }

  public flushUntil(timeout: number, done: any) {
    this.mockedPlatform.flushTimeoutsUntil(timeout, () => {
      this.mockedPlatform.flushRafs((timeStamp: number) => {
        done(timeStamp);
      });
    });
  }
}
