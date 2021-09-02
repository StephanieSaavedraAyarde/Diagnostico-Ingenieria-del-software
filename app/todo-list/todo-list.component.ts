import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  PageEvent,
  MatPaginator
} from '@angular/material';
import { ITodo } from './todo';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  tit: any;
  tit1: any;
  des: any;
  des1: any;

  title = 'Tareas Pendientes';
  public tsk: any[] = [];

  constructor(public dialog: MatDialog, private http: HttpClient) {}

  dataLength: any = TodoData.length;
  newDataID: any;
  dataValue: any;
  msg: string = '';
  flag: string = '';

  length = 5;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 100];
  pageEvent: PageEvent;
  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  actionEdit(data) {
    alert(TodoData[data - 1].todo);
  }

  actionDelete(data) {
    const response = confirm('Esta seguro que quiere eliminar la tarea?');
    if (response) {
      const posData = TodoData.map(pos => pos.id).indexOf(data);
      this.http
        .delete<any>('http://localhost:3000/tasks/' + posData)
        .subscribe(data => {
          console.log('Ya llego');
          this.reloadData();
        });
    }
  }

  actionComplete(data) {
    let currentID = data - 1;
    this.http
      .put<any>(
        'http://localhost:3000/tasks/' + currentID + '?status=COMPLETED',
        ''
      )
      .subscribe(data => {
        console.log('Ya llego');
        window.location.reload();
      });
  }

  actionRefresh(data) {
    let currentID = data - 1;
    TodoData[currentID].isDone = true;
  }

  openDialog(data): void {
    let currentID = data - 1;

    this.newDataID = Math.max.apply(Math, TodoData.map(newID => newID.id));

    if (!data) {
      this.dataValue = {
        id: this.newDataID + 1,
        todo: '',
        level: '',
        isDone: true
      };
    } else {
      this.dataValue = TodoData[currentID];
    }

    let dialogRef = this.dialog.open(DialogAddTodo, {
      width: '500px',
      data: this.dataValue
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (!data) {
          this.http
            .post<any>('http://localhost:3000/tasks', {
              title: result.todo,
              detail: result.level
            })
            .subscribe(data => {
              this.tsk.push(result);
            });
        } else {
          this.http
            .put<any>('http://localhost:3000/tasks/' + currentID, {
              title: result.todo,
              detail: result.level
            })
            .subscribe(data => {
              console.log('Ya llego');
              window.location.reload();
            });
        }
      }
    });
  }

  reloadData() {
    this.dataSource = new MatTableDataSource(TodoData);
    this.dataSource.paginator = this.paginator;
  }

  displayedColumns = ['todo', 'action'];
  dataSource = new MatTableDataSource(TodoData);
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'DialogAddTodo.html'
})
export class DialogAddTodo {
  constructor(
    public dialogRef: MatDialogRef<DialogAddTodo>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

var TodoData: ITodo[] = [
  {
    id: 1,
    todo: 'Completar Primera Evaluacion',
    level: 'Instalar Sakila y practicar consultas',
    isDone: true
  },
  {
    id: 2,
    todo: 'Programar segunda evaluacion',
    level: 'Programar la interfaz web',
    isDone: true
  }
];
