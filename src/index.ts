import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';


function runDemo() {
  console.info('It works!');

  const stream1 = Observable
    .of('https://api.github.com/users')
    .mergeMap((val: string) => Observable.fromPromise(
      fetch(val)
        .then((res: Response) => res.json())
    ));

  stream1.subscribe((val) => {
    console.log(val);
  })
}


if (window) {
  Object.assign(window, { runDemo });
}
