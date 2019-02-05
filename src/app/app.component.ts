import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'codebase';
  data = '';

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.http.get('assets/text.txt', {responseType: `text`}).subscribe(data => this.data = data);
  }
}