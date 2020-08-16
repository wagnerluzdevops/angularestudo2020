import { Component, OnInit } from '@angular/core';
import { Observable, Observer, Subject, ConnectableObservable } from 'rxjs';

import { publish, refCount, share } from 'rxjs/operators';

@Component({
  selector: 'app-hot-observables',
  templateUrl: './hot-observables.component.html',
  styleUrls: ['./hot-observables.component.css']
})
export class HotObservablesComponent implements OnInit {
  n = 0;
  n1 = 0;
  n2 = 0;
  s1 = '';
  s2 = '';

  myObservable: Observable<number>;

  constructor() { }

  ngOnInit() {
    this.myObservable = new Observable(
      (observer: Observer<number>) => {
        let i = 0;
        console.log('%c Observable Created', 'background: #cccccc; color: #ff0000');
        setInterval(() => {
          i++;
          console.log('%c i = ' + i, 'background: #cccccc; color: #0000FF');
          // tslint:disable-next-line: triple-equals
          (i == 100) ? observer.complete() : observer.next(i);
        }, 1000);
      }
    );
    this.usingSubjects();
    // this.usingPublish();
    // this.usingShare();
  }


  usingShare() {
    const multicasted = this.myObservable.pipe(share());

    // Subscriber 1
    this.s1 = 'waiting for interval...';
    setTimeout(() => {
      // tslint:disable-next-line: variable-name
      multicasted.subscribe((_n) => {
        this.n1 = _n;
        this.s1 = 'OK';
      });
    }, 2000);

    // Subscriber 2
    this.s2 = 'waiting for interval...';
    setTimeout(() => {
      // tslint:disable-next-line: variable-name
      multicasted.subscribe((_n) => {
        this.n2 = _n;
        this.s2 = 'OK';
      });
    }, 4000);
  }

  usingPublish() {
    // const multicasted = this.myObservable.pipe(publish(), refCount());

    const multicasted: ConnectableObservable<number> = this.myObservable
      .pipe(publish()) as ConnectableObservable<number>;
    multicasted.connect();

    // Subscriber 1
    this.s1 = 'waiting for interval...';
    setTimeout(() => {
      // tslint:disable-next-line: variable-name
      multicasted.subscribe((_n) => {
        this.n1 = _n;
        this.s1 = 'OK';
      });
    }, 2000);

    // Subscriber 2
    this.s2 = 'waiting for interval...';
    setTimeout(() => {
      // tslint:disable-next-line: variable-name
      multicasted.subscribe((_n) => {
        this.n2 = _n;
        this.s2 = 'OK';
      });
    }, 4000);
  }

  usingSubjects() {
    const subject = new Subject<number>();
    this.myObservable.subscribe(subject);

    // Subscriber 1
    this.s1 = 'waiting for interval...';
    setTimeout(() => {
      // tslint:disable-next-line: variable-name
      subject.subscribe((_n) => {
        this.n1 = _n;
        this.s1 = 'OK';
      });
    }, 2000);

    // Subscriber 2
    this.s2 = 'waiting for interval...';
    setTimeout(() => {
      // tslint:disable-next-line: variable-name
      subject.subscribe((_n) => {
        this.n2 = _n;
        this.s2 = 'OK';
      });
    }, 4000);

  }



}
