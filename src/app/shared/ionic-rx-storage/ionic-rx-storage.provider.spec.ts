import { TestBed } from '@angular/core/testing';
import { Storage } from '@ionic/storage';

import { Observable } from 'rxjs/';

import { IonicRxStorage } from './ionic-rx-storage.provider';

describe('IonicRxStorage', () => {
  let ionicRxStorage: IonicRxStorage;

  const storageStub = jasmine.createSpyObj('Storage', [ 'get', 'set', 'remove', 'clear', 'ready' ]);

  const resolveWith = <T> (value: T): Promise<T> => new Promise(resolve => resolve(value));

  function preTest() {
    ionicRxStorage = TestBed.configureTestingModule({
      providers: [
        IonicRxStorage,
        { provide: Storage, useValue: storageStub },
      ],
    })
    .get(IonicRxStorage);

    storageStub.ready.and.returnValue(resolveWith<boolean>(true));
  }

  beforeEach(preTest);

  it('should be defined', () => {
    expect(ionicRxStorage).toBeDefined();
  });

  describe('CLEAR method', () => {
    let request$: Observable<any>;

    beforeEach(() => {
      storageStub.clear.and.returnValue(resolveWith<boolean>(true));
      request$ = ionicRxStorage.clear();
    });

    it('should call the clear method on the original Storage service', (go) => {
      request$.subscribe(val => {
        expect(storageStub.clear).toHaveBeenCalled();
        expect(val).toBe(true);
        go();
      });
    });
  });

  describe('GET method', () => {
    let request$: Observable<any>;

    beforeEach(() => {
      storageStub.get.and.returnValue(resolveWith<number>(1));
      request$ = ionicRxStorage.get('numberOne');
    });

    it('should call the get method on the original Storage service and return the requested value', (go) => {
      request$.subscribe(val => {
        expect(storageStub.get).toHaveBeenCalledWith('numberOne');
        expect(val).toBe(1);
        go();
      });
    });
  });

  describe('REMOVE method', () => {
    let request$: Observable<any>;

    beforeEach(() => {
      storageStub.remove.and.returnValue(resolveWith<number>(2));
      request$ = ionicRxStorage.remove('numberTwo');
    });

    it('should call the remove method on the original Storage service and return the removed value', (go) => {
      request$.subscribe(val => {
        expect(storageStub.remove).toHaveBeenCalledWith('numberTwo');
        expect(val).toBe(2);
        go();
      });
    });
  });

  describe('SET method', () => {
    let request$: Observable<any>;

    beforeEach(() => {
      storageStub.set.and.returnValue(resolveWith<number>(3));
      request$ = ionicRxStorage.set('numberThree', 3);
    });

    it('should call the set method on the original Storage service and return the saved value', (go) => {
      request$.subscribe(val => {
        expect(storageStub.set).toHaveBeenCalledWith('numberThree', 3);
        expect(val).toBe(3);
        go();
      });
    });
  });
});
