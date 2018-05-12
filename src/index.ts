import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/do';

import { render } from 'lit-html';

import { GitUser } from './git-user';
import { allRowsTemplate } from './html-templates';


const USER_COUNT = 5;

function runDemo() {
  const refreshButton: HTMLElement = document.querySelector('.refresh') as HTMLElement;
  const rowsContainer: HTMLElement = document.querySelector('.rows') as HTMLElement;
  const deletebuttons: HTMLElement[] = [];

  const refreshButtonStream = Observable.fromEvent(refreshButton, 'click')
    .do(() => console.info('Refresh clicked'))
    .map(() => {
      const offset = Math.floor(Math.random() * 500);
      return 'https://api.github.com/users?since=' + offset;
    });

  const fetchUsersStream = Observable
    .of('https://api.github.com/users')
    .do(() => console.info('Initial URL'))
    .merge(refreshButtonStream)
    .mergeMap((val: string) => Observable.fromPromise(
      fetch(val)
        .then((res: Response) => res.json())
        .then((values: object[]) => values.slice(0, USER_COUNT))
    ));

  fetchUsersStream.subscribe((val) => {
    render(allRowsTemplate(val as GitUser[]), rowsContainer);
  })
}


if (window) {
  Object.assign(window, { runDemo });
}
