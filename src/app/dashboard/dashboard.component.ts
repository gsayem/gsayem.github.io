import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import * as PDFJS from 'pdfjs-dist/build/pdf';
//import * as PDFJS from '.../pdfjs-dist/';
import { BruteForce } from '../BruteForce'
import { PasswordCombination } from '../PasswordCombination';
import { NotificationsComponent } from '../notifications/notifications.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  _notificationsComponent: NotificationsComponent = new NotificationsComponent();
  constructor() {

  }
  ngOnInit() {
  }
  public _bruteForce: BruteForce = new BruteForce();
  public _isPasswordRequired: boolean = false;
  public _showPasswordSection: boolean = false;

  passwordCombination: Array<PasswordCombination> = new Array<PasswordCombination>();
  pdfSrc: any;
  pdf: any;

  options = [
    { name: 'No Idea', value: 0, checked: true },
    { name: 'Numbers', value: 1, checked: false },
    { name: 'Capital Characters', value: 2, checked: false },
    { name: 'Small Characters', value: 3, checked: false },
    { name: 'Special Characters', value: 4, checked: false }
  ]
  get selectedOptions() {
    return this.options
      .filter(opt => opt.checked)
      .map(opt => opt.value)
  }
  async GetPossiblePasswordCount() {
    this.SetPasswordCombination();
    if (this._bruteForce._pwdMinLength < 1) {
      this._bruteForce._pwdMinLength = 1;
    }

    if (this._bruteForce._pwdMinLength > 30) {
      this._bruteForce._pwdMinLength = 30;
    }

    if (this._bruteForce._pwdMaxLength < 1) {
      this._bruteForce._pwdMaxLength = 1;
    }

    if (this._bruteForce._pwdMaxLength > 30) {
      this._bruteForce._pwdMaxLength = 30;
    }

    this._bruteForce = new BruteForce(this.pdf, this.passwordCombination,
      this._bruteForce._pwdMinLength, this._bruteForce._pwdMaxLength, this._bruteForce._threadCount);
    this._bruteForce.GetPossiblePasswordCount();
  }
  async onFileSelected($event) {    
    var isPasswordNeededResolved = false;
    this.pdf = document.querySelector('#file');
    if (typeof (FileReader) !== 'undefined') {
      let reader = new FileReader();
      reader.onload = (e: any) => {
        this.pdfSrc = { data: e.target.result }
        let loadingTask = PDFJS.getDocument(this.pdfSrc);
        loadingTask.onPassword = function (updatePassword, reason) {
          if (reason === PDFJS.PasswordResponses.NEED_PASSWORD && !isPasswordNeededResolved) {
            isPasswordNeededResolved = true;
            return;
          }
        }
      };
      reader.readAsArrayBuffer(this.pdf.files[0]);
    }

    await this._bruteForce.wait(1000);
    this._isPasswordRequired = isPasswordNeededResolved;
    if (!this._isPasswordRequired) {
      let msg = "Selected file is not password protected.";
      this._notificationsComponent.showNotification1('top', 'center', msg, 1);
    }
  }

  async ThreadCountChange() {
    if (this._bruteForce._threadCount > 12) {
      let msg = "Maximum 12 thread allow. Maximum thread can consume more memory of your system.";
      this._bruteForce._threadCount = 12;
      this._notificationsComponent.showNotification1('top', 'center', msg, 4);
    }
    if (this._bruteForce._threadCount < 1) {
      let msg = "Minimum 1 thread required.";
      this._bruteForce._threadCount = 1;
      this._notificationsComponent.showNotification1('top', 'center', msg, 4);
    }
  }

  async Run() {
    this.SetPasswordCombination();
    if (this._isPasswordRequired) {      
      this._showPasswordSection = true;
      this._bruteForce = new BruteForce(this.pdf, this.passwordCombination,
        this._bruteForce._pwdMinLength, this._bruteForce._pwdMaxLength, this._bruteForce._threadCount);
      this._bruteForce.SplitBruteForce();
    }
  }
  async SetPasswordCombination() {
    this.passwordCombination = new Array<PasswordCombination>();
    let chkPwdCombination = this.selectedOptions;
    if (chkPwdCombination != null && chkPwdCombination.length > 0) {
      chkPwdCombination.forEach(element => {
        console.log(element);
        switch (element as PasswordCombination) {
          case PasswordCombination.Numbers:
            this.passwordCombination.push(PasswordCombination.Numbers);
            break;
          case PasswordCombination.SmallCharacters:
            this.passwordCombination.push(PasswordCombination.SmallCharacters);
            break;
          case PasswordCombination.CapitalCharacters:
            this.passwordCombination.push(PasswordCombination.CapitalCharacters);
            break;
          case PasswordCombination.SpecialCharacters:
            this.passwordCombination.push(PasswordCombination.SpecialCharacters);
            break;
          case PasswordCombination.NoIdea:
            this.passwordCombination.push(PasswordCombination.NoIdea);
            break;
        }
      });

    }
  }
}
