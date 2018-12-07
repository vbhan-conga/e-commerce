import { environment } from '../../environments/environment';
import { Injector, Injectable } from '@angular/core';
import * as _ from 'lodash';

export function ngswAppInitializer(injector: Injector, script: string): Function {
    if (!(('serviceWorker' in navigator) && environment.production)) {
        return;
    }

    // Wait for service worker controller changes, and fire an INITIALIZE action when a new SW
    // becomes active. This allows the SW to initialize itself even if there is no application
    // traffic.
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (navigator.serviceWorker.controller !== null) {
            navigator.serviceWorker.controller.postMessage({ action: 'INITIALIZE' });
        }
    });

    // Don't return the Promise, as that will block the application until the SW is registered, and
    // cause a crash if the SW registration fails.
    navigator.serviceWorker.register(script);
}

@Injectable({
    providedIn: 'root'
})
export class ServiceWorkerService{
    constructor(private injector: Injector){}

    initialize(){
        ngswAppInitializer(this.injector, _.get(window, 'sv.resource', '') + '/apttus-worker.js');
    }
}