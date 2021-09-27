import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  PageEvent,
  MatPaginator,
} from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(public dialog: MatDialog, private http: HttpClient) {}

  ngOnInit() {}

  Verify(data): void {
    if (!data) {
      this.http
        .post<any>('http://localhost:3000/auth', {
          username: data.username,
          password: data.password,
        })
        .subscribe((data) => {
          console.log('SE ESTA VERIFICANDO EN EL BACKEND');
        });
    }
  }
}
