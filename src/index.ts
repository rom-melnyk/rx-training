import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';


function runDemo() {
  console.info('It works!');

  const stream1 = Observable.of('https://api.github.com/users');
  stream1.subscribe((val) => {
    console.log(val);
  })
}
