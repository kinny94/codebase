import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProblemsService } from 'src/app/services/problems/problems.service';
import { Files, Complexities } from 'src/models/model';
import { Observable } from 'rxjs';

const ELEMENT_DATA: Complexities[] = [
  {type_avg: 'Access (Average)', complexity_avg: 'Θ(1)', type_worst: 'Access (Worst)', complexity_worst: 'Θ(1)'},
  {type_avg: 'Search (Average)', complexity_avg: 'Θ(n)', type_worst: 'Search (Worst)', complexity_worst: 'Θ(n)'},
  {type_avg: 'Insertion (Average)', complexity_avg: 'Θ(n)', type_worst: 'Insertion (Worst)', complexity_worst: 'Θ(n)'},
  {type_avg: 'Deletion (Average)', complexity_avg: 'Θ(n)', type_worst: 'Deletion (Worst)', complexity_worst: 'Θ(n)'},
];


@Component({
  selector: 'app-array',
  templateUrl: './array.component.html',
  styleUrls: ['./array.component.scss']
})
export class ArrayComponent implements OnInit {

  _allProblems ?: Observable<Files[]>;
  displayedColumns: string[] = ['type_avg', 'complexity_avg', 'type_worst', 'complexity_worst'];
  dataSource = ELEMENT_DATA;

  constructor(
    private router: ActivatedRoute,
    private problem: ProblemsService
  ) { }

  ngOnInit() {
    const currentTopic = this.router.snapshot.routeConfig.path;
    this._allProblems = this.problem.getAllProblems(currentTopic);
  }

}