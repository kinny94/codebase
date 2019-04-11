import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ProblemKeyValue } from './../../../models/model';
import { ProblemsService } from './../../services/problems/problems.service';
import { User } from 'firebase';
import { Globals } from './../../global';
import { UserService } from './../../services/user-service/user.service';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star.component.html',
  styleUrls: ['./star.component.scss'],
})
export class StarComponent implements OnInit {

  @Input()
  private rating: number;
  @Input()
  private starCount = 5;
  @Input()
  private color = 'accent';
  @Input()
  problem: ProblemKeyValue;

  private snackBarDuration = 2000;
  private ratingArr = [];
  user: User;

  constructor(
    private snackBar: MatSnackBar,
    private problemService: ProblemsService,
    private globals: Globals,
    private userService: UserService
  ) { }

  ngOnInit() {
    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }
  }

  onClick(rating: number) {
    const previousRating = this.rating;
    if (this.globals.user) {
      const currentUser = this.globals.userData.username;
      if (this.globals.userData.ratedProblems && this.globals.userData.ratedProblems[this.problem.key]) {
        this.problemService.changeRatings(this.problem, rating, previousRating).pipe(
          map(newRatings => {
            this.problemService.addNewRatings(this.problem, newRatings);
          }),
          take(1),
          map(() => {
            this.userService.addRating(currentUser, this.problem, rating);
          }),
          take(1),
        ).subscribe();
      } else {
        this.problemService.setNewRatings(this.problem, rating).pipe(
          map(newRatings => {
            this.problemService.addNewRatings(this.problem, newRatings);
          }),
          take(1),
          map(() => {
            this.userService.addRating(currentUser, this.problem, rating);
          }),
          take(1),
        ).subscribe();
      }

      this.snackBar.open('You rated ' + rating + ' / ' + this.starCount, '', {
        duration: this.snackBarDuration
      });
      this.rating = rating;
      return false;
    } else {
      this.snackBar.open('Login to rate the problems', '', {
        duration: this.snackBarDuration
      });
    }
  }

  showIcon(index: number) {
    if (this.rating >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }
}
export enum StarRatingColor {
  primary = 'primary',
  accent = 'accent',
  warn = 'warn'
}