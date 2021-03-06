import { AuthService } from './../auth/auth.service';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { UserData, Username, ProblemKeyValue } from './../../../models/model';
import { User } from 'firebase';
import { map, switchMap, flatMap, filter, take } from 'rxjs/operators';
import { of, BehaviorSubject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { reject } from 'q';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userSubject: BehaviorSubject<string> = new BehaviorSubject(undefined);
  userEmailSubject: BehaviorSubject<string> = new BehaviorSubject(undefined);

  constructor(
    private db: AngularFireDatabase,
    private authService: AuthService,
    private afAuth: AngularFireAuth,
    ) { }

  saveUser(userData: UserData) {
    return this.db.object(`/users/${userData.username}`).update(userData);
  }

  saveUsername(userData: UserData) {
    return this.db.object(`/usernames/${userData.username}`).update({'email': userData.email });
  }

  updateData(data: UserData) {
    return this.db.object(`/users/${data.email}` ).update(data);
  }

  getAllUsers(): AngularFireList<User> {
    return this.db.list('/users');
  }

  userExists(): AngularFireList<Username> {
    return this.db.list('/usernames/');
  }

  isUsernameTaken(username: string) {
    return this.db.object(`/usernames/${username}`).valueChanges();
  }

  isRatedProblem(currentUser: string, problem: ProblemKeyValue) {
    return this.db.list(`/users/${currentUser}/ratedProblems/${problem.key}`).valueChanges();
  }

  addRating(currentUser: string, problem: ProblemKeyValue, rating: number) {
    return new Promise((resolve, reject) => {
      this.db.database.ref(`/problems/${problem.value.topic}/${problem.key}`)
      .on('value', (snapshot) => resolve(snapshot.val()));
    }).then((firebaseRefValue) => {
      const problemDataWithRating = {...firebaseRefValue, rating: rating };
      return this.db.list(`/users/${currentUser}/ratedProblems/`).set(problem.key, problemDataWithRating);
    }).catch((err) => {
      throw new Error(err);
    });
  }

  likeProblem(currentUser: string, problem: ProblemKeyValue) {
    return new Promise((resolve, reject) => {
      this.db.database.ref(`/problems/${problem.value.topic}/${problem.key}`)
      .on('value', (snapshot) => resolve(snapshot.val()));
    }).then((firebaseRef) => {
      return this.db.list(`/users/${currentUser}/likedProblems/`).set(problem.key, firebaseRef);
    }).catch((err) => {
      throw new Error(err);
    });
  }

  unlikeProblem(currentUser: string, problem: ProblemKeyValue) {
    return this.db.list(`/users/${currentUser}/likedProblems/`).remove(problem.key);
  }

  checkProblemLiked(currentUser: string, problem: ProblemKeyValue) {
    return this.db.list(`/users/${currentUser}/`).valueChanges();
  }

  updateUserData(currentUser: string, newData: Object) {
    return this.db.object(`/users/${currentUser}/`).update(newData);
  }

  getUser() {
    return this.authService.user$.pipe(
      map((user: User) => {
        if (user) {
          this.userSubject.next(user.email);
          return this.userSubject.value;
        }
        return undefined;
      }),
      take(1),
    );
  }

  getUserDataSnapshot() {
    return this.getUser().pipe(
      filter((user) => Boolean(user)),
      switchMap(() => {
        return this.db.list(`/usernames/`).snapshotChanges();
      }),
      switchMap(snapshot => of(snapshot.filter(data => data['payload'].val()['email'] === this.userSubject.value))),
      flatMap((snap: any) => {
        this.userEmailSubject.next(snap[0].payload.key);
        return snap;
      }),
      take(1),
    );
  }

  getUserData() {
    return this.getUserDataSnapshot().pipe(
      filter((snapshot) => Boolean(snapshot)),
      switchMap(() => {
        return this.db.object(`/users/${this.userEmailSubject.value}`).valueChanges();
      }),
      flatMap((userdata: UserData) => {
        return of(userdata);
      }),
      take(1)
    );
  }

  changePassword(password: string) {
    return this.afAuth.auth.currentUser.updatePassword(password);
  }
}
