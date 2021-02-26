import { Component } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent {

  menu: NbMenuItem[] = [
    {
      title: this.translate.instant('menu.dashboard'),
      icon: 'home-outline',
      link: '/pages/dashboard',
    },
    {
      title: 'Charts',
      icon: 'pie-chart-outline',
      children: [
        {
          title: 'Echarts',
          link: '/pages/charts/echarts',
        },
        {
          title: 'Charts.js',
          link: '/pages/charts/chartjs',
        }
      ],
    },
  ];

  constructor(
    private translate: TranslateService,
  ) {
  }

}
