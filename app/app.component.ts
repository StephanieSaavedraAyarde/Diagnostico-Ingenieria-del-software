import { Component } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private title: Title) {}

  ngOnInit() {
    this.title.setTitle('Diagnostico | Stephanie Saavedra Ayarde');
  }
}
