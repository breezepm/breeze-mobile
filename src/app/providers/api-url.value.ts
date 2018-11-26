import { InjectionToken } from '@angular/core';
import { appEndpoint } from './../endpoints/app-endpoint';

export const API_URL = new InjectionToken('apiUrl');

export const apiUrlProvider = { provide: API_URL, useValue: appEndpoint };
