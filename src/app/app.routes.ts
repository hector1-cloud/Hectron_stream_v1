import {Routes} from '@angular/router';

export const routes: Routes = [
  { path: 'studio', children: [] },
  { path: '', children: [] },
  { path: '**', children: [] }
];
