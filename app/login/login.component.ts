import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { User } from './user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(public dialog: MatDialog, private http: HttpClient) {}

  newDataID: any;
  dataValue: any;

  ngOnInit() {}

  Auth(data): void {
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
              console.log(data.token)
            });
        }
        console.log(result.username);
        console.log(result.password);
      }
    });
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

var user: User[] = [];
