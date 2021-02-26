import {HttpErrorResponse, HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, filter, map, retry} from 'rxjs/operators';
import {Injectable} from '@angular/core';

/**
 * This provider intercepts (as the name suggests) every http request and modifies it as well as logs it, adds a retry and handles errors
 * optionally it also offers a loading overlay for every request
 */

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
    isLoading = false;
    currentCSRFToken = '';
    constructor(

    ) {

    }

  /**
   * Intercepts all http Calls and add Headers as well as log the calls
   * IMPORTANT: If "skip" header is set, we dont intercept and just handle the call
   */
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // skip if url has "skip" header set
        if (request.headers.has('skip')) {
          return next.handle(request);
        }



        if (!request.headers.has('Content-Type')) {
          // only add content-type json if body doesn't contain formData
          if (!(request.body instanceof FormData)) {
            request = request.clone({
              headers: request.headers.set('Content-Type', 'application/json').set('Accept', 'application/json')
            });
          }
        }

        if (!request.headers.has('X-CSRF-Token') && this.currentCSRFToken !== '') {
          // add CSRF Token if it is set
          request = request.clone({
            headers: request.headers.set('X-CSRF-Token', this.currentCSRFToken)
          });
        }


        console.log('sending--->>>', request);
        // this.showLoader();
        return next.handle(request).pipe(
          filter(e => e.type !== 0),
          map((event: HttpEvent<any>) => {
                console.log('retrieving<<<---', event);
                if (event.type === HttpEventType.Response) {
                  const CSRF = event.headers.get('X-CSRF-Token');
                  if (CSRF !== null) {
                    this.currentCSRFToken = CSRF;
                  }
                }
                return event;
            }),
            retry(1),
            catchError((error: HttpErrorResponse) => {
                return throwError(error);
            }),
            // finalize( () => this.hideLoader())
        );
    }

    /*
    async showLoader() {
        this.isLoading = true;
        return await this.loadingController.create({
            message: 'Verarbeite Anfrage...'
        }).then( res => {
            res.present().then(() => {
                if (!this.isLoading) {
                    this.hideLoader();
                }
            });
        });
    }

    async hideLoader() {
        this.isLoading = false;
        return await this.loadingController.dismiss().then(() => console.log('dismissed'));
    }
    */

}
