import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/do';

import { render } from 'lit-html';

import { GitUser } from './git-user';
import { allRowsTemplate } from './html-templates';


const USER_COUNT = 5;

function runDemo() {
  const refreshButton: HTMLElement = document.querySelector('.refresh') as HTMLElement;
  const rowsContainer: HTMLElement = document.querySelector('.rows') as HTMLElement;

  // render initial (empty) list to receive button HTML elements
  const initialUserData = Array(USER_COUNT).fill({ is_hidden: true });
  render(allRowsTemplate(initialUserData as GitUser[]), rowsContainer);
  const deleteButtons: HTMLElement[] = Array.from(
    document.querySelectorAll('a.delete')
  );

  // create a combined stream from all the delete button clicks (<index-in-del-button>)
  let deleteButtonsStream = Observable.from(
    Array(USER_COUNT).fill(0).map((val, i) => i)
  );
  deleteButtons.forEach((button: HTMLElement, i: number) => {
    const buttonStream = Observable.fromEvent(button, 'click')
      .do(() => { console.log(`Delete button #${i} clicked`); })
      .mapTo(i);
    deleteButtonsStream = deleteButtonsStream.merge(buttonStream);
  }, );

  // create refresh button stream
  const refreshButtonStream = Observable.fromEvent(refreshButton, 'click')
    .do(() => console.info('Refresh clicked'))
    .map(() => {
      const offset = Math.floor(Math.random() * 500);
      return 'https://api.github.com/users?since=' + offset;
    });

  // organize fetch data stream:
  // 1) from static URL (initial)
  // 2) + refresh button
  // 3) merged with delete button data
  const fetchUsersStream = Observable
    .of('https://api.github.com/users')
    .do(() => console.info('Initial URL'))
    .merge(refreshButtonStream)
    .mergeMap((url: string) => Observable.fromPromise(
      fetch(url)
        .then((res: Response) => res.json())
        .then((values: object[]) => values.slice(0, USER_COUNT))
    ))
    // .mergeMap((users: object[]) => deleteButtonsStream.map((i: number) => {
    //     Object.assign(users[i], { is_hidden: true });
    //     return users;
    //   })
    // );

  fetchUsersStream.subscribe((val) => {
    // console.log(val);
    render(allRowsTemplate(val as GitUser[]), rowsContainer);
  })
}


if (window) {
  Object.assign(window, { runDemo });
}
