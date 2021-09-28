import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  PageEvent,
  MatPaginator,
} from '@angular/material';
import { ITodo } from './todo';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})
export class TodoListComponent implements OnInit {
  constructor(public dialog: MatDialog, private http: HttpClient) {}

  dataLength: any = tsk.length;
  newDataID: any;
  dataValue: any;
  msg: string = '';
  flag: string = '';
  isDone: any = [];
  isLogin: any;

  length = 5;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 100];
  pageEvent: PageEvent;

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput
      .split(',')
      .map((str) => +str);
  }
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    var tok: string;
    console.log(localStorage.getItem('token'));
    tok = localStorage.getItem('token')!;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: tok,
    });
    this.http
      .get<any>('http://localhost:3000/tasks', { headers: headers })
      .subscribe((data) => {
        tsk = data;
        this.dataSource = new MatTableDataSource(tsk);
        this.dataSource.paginator = this.paginator;
        this.reloadData();
      });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  actionDelete(data) {
    const response = confirm('Esta seguro que quiere eliminar la tarea?');
    if (response) {
      let currentID = data;
      var tok: string;
      console.log(localStorage.getItem('token'));
      tok = localStorage.getItem('token')!;
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: tok,
      });
      this.http
        .delete<any>('http://localhost:3000/tasks/' + data, {
          headers: headers,
        })
        .subscribe((data) => {
          console.log('REGISTRO ELIMINADO');
          this.reloadData();
        });
    }
  }

  actionComplete(data) {
    let currentID = data;
    var tok: string;
    console.log(localStorage.getItem('token'));
    tok = localStorage.getItem('token')!;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: tok,
    });
    this.http
      .put<any>(
        'http://localhost:3000/tasks/' + currentID + '?status=COMPLETED',
        { headers: headers }
      )
      .subscribe((data) => {
        console.log('Cambio de estado a COMPLETED');
      });
    this.isDone[data] = true;
    console.log(data[currentID]);
  }

  actionRefresh(data) {
    let currentID = data;
    var tok: string;
    console.log(localStorage.getItem('token'));
    tok = localStorage.getItem('token')!;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: tok,
    });
    this.http
      .put<any>(
        'http://localhost:3000/tasks/' + currentID + '?status=PENDING',
        { headers: headers }
      )
      .subscribe((data) => {
        console.log('Cambio de estado a PENDING');
      });
    this.isDone[currentID] = false;
    console.log(data[currentID]);
  }

  openDialog(data): void {
    let currentID = data - 1;
    this.newDataID = Math.max.apply(
      Math,
      tsk.map((newID) => newID.id)
    );

    if (!data) {
      this.dataValue = {
        id: this.newDataID + 1,
        title: '',
        detail: '',
        status: '',
      };
    } else {
      this.dataValue = tsk[currentID];
    }

    let dialogRef = this.dialog.open(DialogAddTodo, {
      width: '500px',
      data: this.dataValue,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (!data) {
          var tok: string;
          console.log(localStorage.getItem('token'));
          tok = localStorage.getItem('token')!;
          let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: tok,
          });
          this.http
            .post<any>(
              'http://localhost:3000/tasks',
              {
                title: result.title,
                detail: result.detail,
                status: 'PENDING',
              },
              { headers: headers }
            )
            .subscribe((data) => {
              console.log('YA SE GUARDO EN EL BACKEND');
              this.reloadData();
            });
        } else {
          var tok: string;
          console.log(localStorage.getItem('token'));
          tok = localStorage.getItem('token')!;
          let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: tok,
          });
          this.http
            .put<any>(
              'http://localhost:3000/tasks/' + data,
              {
                title: result.title,
                detail: result.detail,
              },
              { headers: headers }
            )
            .subscribe((data) => {
              console.log('YA SE ACTUALIZO EN EL BACKEND');
              this.reloadData();
            });
        }
      }
    });
  }

  reloadData() {
    this.http.get<any>('http://localhost:3000/tasks').subscribe((data) => {
      tsk = data;
      this.dataSource = new MatTableDataSource(tsk);
      this.dataSource.paginator = this.paginator;
    });
  }

  Register(data): void {
    if (!data) {
      this.dataValue = {
        username: '',
        password: '',
      };
    }

    let dialogRef = this.dialog.open(DialogRegister, {
      width: '500px',
      data: this.dataValue,
    });
    console.log('Estoy en el Registro!');

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (!data) {
          this.http
            .post<any>('http://localhost:3000/user', {
              username: result.username,
              password: result.password,
            })
            .subscribe((data) => {
              console.log('YA SE GUARDO EL NUEVO USUARIO EN EL BACKEND');
            });
          console.log('Estoy en el metodo HTTP');
        }
        console.log(result.username);
        console.log(result.password);
      }
    });
  }

  //////////////////////////////////////////////////////////////////////
  //LOGIN
  //////////////////////////////////////////////////////////////////////

  Login(data): void {
    if (!data) {
      this.dataValue = {
        username: '',
        password: '',
      };
    }

    let dialogRef = this.dialog.open(DialogLogin, {
      width: '500px',
      data: this.dataValue,
    });
    console.log('Estoy en el Login!');

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (!data) {
          this.http
            .post<any>('http://localhost:3000/auth', {
              username: result.username,
              password: result.password,
            })
            .subscribe((data) => {
              console.log('VERIFICANDO EN EL BACKEND');
              localStorage.setItem('token', data.token);
              console.log(data.token);
              this.isLogin = false;
            });
        }
        console.log(result.username);
        console.log(result.password);
      }
    });
  }

  logout(): void {
    this.isLogin = true;
  }

  displayedColumns = ['todo', 'action'];
  dataSource = new MatTableDataSource(tsk);
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'DialogAddTodo.html',
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

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'DialogLogin.html',
})
export class DialogLogin {
  constructor(
    public dialogRef: MatDialogRef<DialogLogin>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'DialogRegister.html',
})
export class DialogRegister {
  constructor(
    public dialogRef: MatDialogRef<DialogRegister>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

var tsk: ITodo[] = [];
