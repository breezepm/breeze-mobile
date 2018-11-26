import { AlertController } from 'ionic-angular';
import { TestBed } from '@angular/core/testing';
import { Http, RequestOptions, Headers } from '@angular/http';

import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Subject, Observable } from 'rxjs/';

import { HttpInterceptor } from './http.interceptor';
import { API_URL } from './api-url.value';
import { Store } from '@ngrx/store';
import { ConfigurationService } from './configuration.service';

describe('HttpInterceptor wrapper service:', () => {
  let httpInterceptor: HttpInterceptor;

  const apiUrl: string = 'www.helol.com/api/////';

  let response$: Subject<any>;

  const httpStub = jasmine.createSpyObj('Http', ['get', 'post', 'put', 'delete']);

  const configurationServiceStub = { useBugsnag: false };

  const progressBarStub = jasmine.createSpyObj('ProgressBar', ['start', 'complete']);

  const presentAlert = { present: jasmine.createSpy('alert present') };
  const alertControllerStub = {
    create: jasmine.createSpy('alert create').and.returnValue(presentAlert),
  };

  function preTest() {
    response$ = new Subject();
    httpStub.get.and.returnValue(response$);
    httpStub.post.and.returnValue(response$);
    httpStub.put.and.returnValue(response$);
    httpStub.delete.and.returnValue(response$);

    httpInterceptor = TestBed
      .configureTestingModule({
        providers: [
          HttpInterceptor,
          { provide: ConfigurationService, useValue: configurationServiceStub },
          { provide: Store, useValue: null },
          { provide: API_URL, useValue: apiUrl },
          { provide: Http, useValue: httpStub },
          { provide: SlimLoadingBarService, useValue: progressBarStub },
          { provide: AlertController, useValue: alertControllerStub },
        ],
      })
      .get(HttpInterceptor);
  }

  function postTest() {
    httpStub.get.calls.reset();
  }

  beforeEach(preTest);
  afterEach(postTest);

  it('should be defined', () => {
    expect(httpInterceptor).toBeDefined();
  });

  describe('GET method', () => {
    let request$: Observable<any>;
    const defaultOptions = new RequestOptions({
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    beforeEach(() => {
      request$ = httpInterceptor.get('///yoda');
    });

    it('removes the leading slashes from the URL and the tailing slashes of the apiUrl, then adds ".json"', () => {
      expect(httpStub.get).toHaveBeenCalledWith('www.helol.com/api/yoda.json', { ...defaultOptions });
    });

    it('starts the progress bar', () => {
      expect(progressBarStub.start).toHaveBeenCalled();
    });

    it('fetches the data from the backend and parses to json', (ImYourFather) => {
      request$.subscribe((res) => {
        expect(res).toBe(1);
        ImYourFather();
      });
      response$.next({ json: () => 1 });
    });

    it('completes the progress bar', () => {
      expect(progressBarStub.complete).toHaveBeenCalled();
    });

    it('catches an error and lifts a new observable that returns the error not parsed to json', (INeedCoffee) => {
      const rejection: any = { status: 401, json: () => 'oh-my-g' };
      request$.subscribe(
        null,
        (err) => {
          expect(err).toEqual({ status: rejection.status, data: rejection.json() });
          INeedCoffee();
        }
      );
      response$.error(rejection);
    });

  });

  describe('POST method', () => {
    let request$: Observable<any>;
    const defaultOptions = new RequestOptions({
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });
    const luke = { id: 1, name: 'Luke', age: 183.8 };

    beforeEach(() => {
      request$ = httpInterceptor.post('jedi', luke);
    });

    it('parses the body of the post request to string', () => {
      expect(httpStub.post).toHaveBeenCalledWith(
        'www.helol.com/api/jedi.json',
        JSON.stringify(luke),
        { ...defaultOptions }
      );
    });

    it('starts the progress bar', () => {
      expect(progressBarStub.start).toHaveBeenCalled();
    });

    it('sends the data to the backend and parses the response to json', (runForTheHills) => {
      request$.subscribe((res) => {
        expect(res).toEqual(luke);
        runForTheHills();
      });
      response$.next({ json: () => luke });
    });

    it('completes the progress bar', () => {
      expect(progressBarStub.complete).toHaveBeenCalled();
    });

    it('catches an error and lifts a new observable that returns the error not parsed to json', (INeedBeer) => {
      const rejection: any = { status: 401, json: () => 'oh-my-go' };
      request$.subscribe(
        null,
        (err) => {
          expect(err).toEqual({ status: rejection.status, data: rejection.json() });
          INeedBeer();
        }
      );
      response$.error(rejection);
    });

  });

  describe('PUT method', () => {
    let request$: Observable<any>;
    const defaultOptions = new RequestOptions({
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });
    const luke = { id: 1, name: 'Luke', age: 184 };

    beforeEach(() => {
      request$ = httpInterceptor.put(`jedi/${luke.id}`, luke);
    });

    it('parses the body of the post request to string', () => {
      expect(httpStub.put).toHaveBeenCalledWith(
        'www.helol.com/api/jedi/1.json',
        JSON.stringify(luke),
        { ...defaultOptions }
      );
    });

    it('starts the progress bar', () => {
      expect(progressBarStub.start).toHaveBeenCalled();
    });

    it('sends the data to the backend and parses the response to json', (ciao) => {
      request$.subscribe((res) => {
        expect(res).toEqual(luke);
        ciao();
      });
      response$.next({ json: () => luke });
    });

    it('completes the progress bar', () => {
      expect(progressBarStub.complete).toHaveBeenCalled();
    });

    it('catches an error and lifts a new observable that returns the error not parsed to json', (ahoj) => {
      const rejection: any = { status: 401, json: () => 'oh-my-god' };
      request$.subscribe(
        null,
        (err) => {
          expect(err).toEqual({ status: rejection.status, data: rejection.json() });
          ahoj();
        }
      );
      response$.error(rejection);
    });

    it('shows an alert popup to the user if the error status is 500 or 0', (ahoj) => {
      const rejection: any = {
        status: 500,
        json() {
          return;
        },
      };
      request$.subscribe(
        null,
        (err) => {
          expect(err).toEqual({ status: rejection.status, data: rejection.json() });
          expect(alertControllerStub.create).toHaveBeenCalledWith({
            title: 'Oops!',
            message: 'Failed to connect to the server!',
            buttons: ['OK'],
          });
          expect(presentAlert.present).toHaveBeenCalled();
          ahoj();
        }
      );
      response$.error(rejection);
    });

  });

  describe('DELETE method', () => {
    let request$: Observable<any>;
    const defaultOptions = new RequestOptions({
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });
    const luke = { id: 1, name: 'Luke', age: 184 };

    beforeEach(() => {
      request$ = httpInterceptor.delete(`jedi/${luke.id}`);
    });

    it('parses the body of the post request to string', () => {
      expect(httpStub.delete).toHaveBeenCalledWith('www.helol.com/api/jedi/1.json', { ...defaultOptions });
    });

    it('starts the progress bar', () => {
      expect(progressBarStub.start).toHaveBeenCalled();
    });

    it('sends the data to the backend and parses the response to json', (ciaoLuke) => {
      request$.subscribe((res) => {
        expect(res).toEqual(luke);
        ciaoLuke();
      });
      response$.next({ json: () => luke });
    });

    it('completes the progress bar', () => {
      expect(progressBarStub.complete).toHaveBeenCalled();
    });

    it('catches an error and lifts a new observable that returns the error not parsed to json', (bye) => {
      const rejection: any = { status: 401, json: () => 'oh-my-god' };
      request$.subscribe(
        null,
        (err) => {
          expect(err).toEqual({ status: rejection.status, data: rejection.json() });
          bye();
        }
      );
      response$.error(rejection);
    });

  });

  describe('setHeader method', () => {
    const defaultHeaders = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'my-awesome-token',
    });
    const expectedOptions = new RequestOptions({ headers: defaultHeaders });

    beforeEach((moveOn) => {
      httpInterceptor.setHeader('Authorization', 'my-awesome-token');
      httpInterceptor.get('/coffee').subscribe(moveOn);
      response$.next({
        json() {
          return;
        },
      });
    });

    it('appends the new header to the default ones', () => {
      const [_, requestOptions] = httpStub.get.calls.argsFor(0);
      expect(httpStub.get).toHaveBeenCalledWith('www.helol.com/api/coffee.json', { ...expectedOptions });
      expect(requestOptions.headers.get('Content-Type')).toBe(expectedOptions.headers.get('Content-Type'));
      expect(requestOptions.headers.get('Authorization')).toBe(expectedOptions.headers.get('Authorization'));
    });
  });

  describe('removeHeaders method', () => {
    const expectedOptions = new RequestOptions({
      headers: new Headers({ 'Accept': 'everything' }),
    });

    beforeEach((turnOffTheSpeakers) => {
      httpInterceptor.setHeader('Accept', 'everything');
      httpInterceptor.removeHeaders('Content-Type');
      httpInterceptor.get('/more-coffee').subscribe(turnOffTheSpeakers);
      response$.next({
        json() {
          return;
        },
      });
    });

    it('removes the given headers names from the default ones', () => {
      const [_, requestOptions] = httpStub.get.calls.argsFor(0);
      expect(httpStub.get).toHaveBeenCalledWith('www.helol.com/api/more-coffee.json', { ...expectedOptions });
      expect(requestOptions.headers.get('Content-Type')).toEqual(null);
      expect(requestOptions.headers.get('Accept')).toBe(expectedOptions.headers.get('Accept'));
    });
  });

});
