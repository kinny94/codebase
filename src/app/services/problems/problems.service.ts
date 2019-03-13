import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 

import { problems } from 'problems/problems';
import { of, BehaviorSubject, Observable } from 'rxjs';
import { AngularFireDatabase, AngularFireObject, AngularFireList } from '@angular/fire/database';
import { TopicProblems } from 'src/models/model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProblemsService {

  constructor(
    private http: HttpClient,
    private db: AngularFireDatabase
  ) { }

  _everyProblemsSubject: BehaviorSubject<Array<string>> = new BehaviorSubject([]);
  _everyProblem$: Observable<Array<string>> = this._everyProblemsSubject.asObservable();

  getAllProblems(topic: string): AngularFireObject<TopicProblems> {
    return this.db.object(`/problems/${topic}`);
  }

  getProblemString(topic: string, problem: string) {
    return this.http.get<string>(`/api/${topic}/${problem}`);
  }

  getEverything(): AngularFireList<TopicProblems> {
    return this.db.list('/problems');
  }
}
