/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import {APP_INITIALIZER, ErrorHandler, Injector, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './@core/core.module';
import { ThemeModule } from './@theme/theme.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {LOCATION_INITIALIZED} from '@angular/common';
import {CryptoService} from './services/crypto.service';
import {AppSettings} from './app.settings';
import * as moment from 'moment-timezone';
import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';
import {UserSettingsInterface} from './interfaces/user-settings.interface';
import {HttpConfigInterceptor} from './providers/httpConfig.interceptor';

import {
  NbChatModule,
  NbDatepickerModule,
  NbDialogModule,
  NbMenuModule,
  NbSidebarModule,
  NbToastrModule,
  NbWindowModule,
} from '@nebular/theme';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    CoreModule.forRoot(),
    ThemeModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: appInitializerFactory, deps: [TranslateService, Injector, CryptoService], multi: true},
    // [{ provide: ErrorHandler, useClass: GlobalErrorHandler}],
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}


// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

/**
 * Initialize our Application - this func waits for our promise and then our application resumes
 * This func sets our language and fetches our language json
 */
export function appInitializerFactory(translate: TranslateService, injector: Injector, crypto: CryptoService) {
  return () => new Promise<any>((resolve: any) => {
    const locationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve(null));
    locationInitialized.then(() => {
      const allowedLanguages = ['de'];
      let langToSet;
      // get settings object
      const data = localStorage.getItem(AppSettings.CLIENTSETTINGS);
      if (data !== null && data !== '') {
        try {
          const json: UserSettingsInterface = JSON.parse(crypto.decrypt(data));
          langToSet = json.lang;
        } catch (e) {
          console.log(e);
        }
      }
      if (typeof langToSet === 'undefined') {
        // if not set we use navigator language
        langToSet = navigator.language.slice(0, 2);
      }
      if (allowedLanguages.indexOf(langToSet) === -1) {
        langToSet = 'de';
      }
      translate.setDefaultLang(langToSet);
      // date.setLocale(langToSet);
      translate.use(langToSet).subscribe(() => {
        console.log(`Successfully initialized '${langToSet}' language.'`);
        // date.setLocale(langToSet);
        moment.locale(langToSet);
      }, err => {
        console.error(`Problem with '${langToSet}' language initialization.'`);
      }, () => {
        resolve(null);
      });
    });
  });
}
