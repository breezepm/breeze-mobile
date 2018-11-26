import { Http, RequestOptionsArgs, RequestOptions, Headers, Response } from '@angular/http';
import { Injectable, Inject } from '@angular/core';

import { AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/first';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';

import { removeLeadingSlash } from '../helpers/remove-leading-slash';
import { removeTailingSlash } from '../helpers/remove-tailing-slash';
import { API_URL } from './api-url.value';
import { logout } from '../modules/user/actions/user.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { ConfigurationService } from './configuration.service';

export interface ServerError {
  status: number;
  data: any;
}

@Injectable()
export class HttpInterceptor {
  private defaultHeaders: Headers = new Headers({ 'Content-Type': 'application/json' });
  private isServerErrorPopupOpen = false;
  private isExpiredErrorPopupOpen = false;

  constructor(
    protected http: Http,
    protected progressBar: SlimLoadingBarService,
    @Inject(API_URL) protected apiUrl: string,
    protected alert: AlertController,
    protected store: Store<AppState>,
    protected configurationService: ConfigurationService
  ) {
    this.apiUrl = removeTailingSlash(apiUrl);
  }

  public get<T>(url: string, options?: RequestOptionsArgs): Observable<T | ServerError> {
    this.progressBar.start();
    return this.http
      .get(this.getFullUrl(url), { ...this.defaultRequestOptions(), ...options })
      .map<Response, T>(this.handleResponse.bind(this))
      .catch(this.handleError.bind(this));
  }

  public post<T>(url: string, body: any, options?: RequestOptionsArgs): Observable<T | ServerError> {
    this.progressBar.start();
    return this.http
      .post(this.getFullUrl(url), JSON.stringify(body), { ...this.defaultRequestOptions(), ...options })
      .map(this.handleResponse.bind(this))
      .catch(this.handleError.bind(this));
  }

  public put<T>(url: string, body: any, options?: RequestOptionsArgs): Observable<T | ServerError> {
    this.progressBar.start();
    return this.http
      .put(this.getFullUrl(url), JSON.stringify(body), { ...this.defaultRequestOptions(), ...options })
      .map<Response, T>(this.handleResponse.bind(this))
      .catch(this.handleError.bind(this));
  }

  public delete<T>(url: string, options?: RequestOptionsArgs): Observable<T | ServerError> {
    this.progressBar.start();
    return this.http
      .delete(this.getFullUrl(url), { ...this.defaultRequestOptions(), ...options })
      .map<Response, T>(this.handleResponse.bind(this))
      .catch(this.handleError.bind(this));
  }

  public setHeader(name: string, value: any): void {
    this.defaultHeaders.append(name, value);
  }

  public removeHeaders(...names: string[]): void {
    names.forEach(name => this.defaultHeaders.delete(name));
  }

  private handleResponse(res: Response): any {
    this.progressBar.complete();
    try {
      return res.json();
    } catch (_) {
      return res.text();
    }
  }

  private handleError(res: Response): Observable<ServerError> {
    if (this.configurationService.useBugsnag) {
      Bugsnag.notify(res.url, res.statusText);
    }
    this.progressBar.complete();
    let data;
    try {
      data = res.json();
    } catch (_) {
      data = { error: res.statusText };
    }
    const error: ServerError = { status: res.status, data };
    const isServerError: boolean = error.status === 0 || error.status === 500;
    const isExpiredError: boolean = error.status === 402;

    if (isServerError && !this.isServerErrorPopupOpen) {
      this.showServerErrorPopup();
    } else if (isExpiredError && !this.isExpiredErrorPopupOpen) {
      this.showExpiredErrorPopup();
    }

    return Observable.throw(error);
  }

  private defaultRequestOptions(): RequestOptionsArgs {
    return new RequestOptions({ headers: this.defaultHeaders });
  }

  private getFullUrl(url: string): string {
    return `${this.apiUrl}/${removeLeadingSlash(url)}.json`;
  }

  private showExpiredErrorPopup(): void {
    this.isExpiredErrorPopupOpen = true;

    const click$: Observable<Event> = Observable.fromEvent(document, 'click');

    const closePopup$: Observable<boolean> = click$.mapTo(false).first();

    const popupConfig = {
      title: 'Oops!',
      message: 'Your account has expired, please contact your account owner or support@breeze.pm',
      buttons: ['OK'],
    };

    this.alert.create(popupConfig).present();

    closePopup$.subscribe(v => {
      this.isExpiredErrorPopupOpen = v;
      this.store.dispatch(logout());
    });
  }

  private showServerErrorPopup(): void {
    this.isServerErrorPopupOpen = true;

    const click$: Observable<Event> = Observable.fromEvent(document, 'click');

    const closePopup$: Observable<boolean> = click$.mapTo(false).first();

    const popupConfig = {
      title: 'Oops!',
      message: 'Failed to connect to the server!',
      buttons: ['OK'],
    };

    this.alert.create(popupConfig).present();

    closePopup$.subscribe(v => this.isServerErrorPopupOpen = v);
  }

}
