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
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  constructor(public dialog: MatDialog, private http: HttpClient) {}

  ngOnInit() {}
}
