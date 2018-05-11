import { PDFProgressData, PDFDocumentProxy } from 'ng2-pdf-viewer';
import * as PDFJS from 'pdfjs-dist/build/pdf';
import { StopWatch } from './StopWatch';
import { PasswordCombination } from './PasswordCombination';
import { NotificationsComponent } from './notifications/notifications.component'

export class BruteForce {

    public _threadCount = 12;
    public _Thread1Pwd: string = "Inactive";
    public _Thread2Pwd: string = "Inactive";
    public _Thread3Pwd: string = "Inactive";
    public _Thread4Pwd: string = "Inactive";
    public _Thread5Pwd: string = "Inactive";

    public _Thread6Pwd: string = "Inactive";
    public _Thread7Pwd: string = "Inactive";
    public _Thread8Pwd: string = "Inactive";
    public _Thread9Pwd: string = "Inactive";
    public _Thread10Pwd: string = "Inactive";
    public _Thread11Pwd: string = "Inactive";
    public _Thread12Pwd: string = "Inactive";

    _notificationsComponent: NotificationsComponent = new NotificationsComponent();
    _passwoprdTitleText: string = "Password is";
    _passwoprdTitleBoxColor: string = "blue";

    readonly _numbers = "0123456789"; //10
    readonly _smallChar = "abcdefghijklmnopqrstubwxyz"; //26
    readonly _capChar = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; //26
    readonly _spcChar = "`~!@#$%^&*()_-+=;:'\"\"\|,<.>/?[{]} "; //33   

    public finalSuccessPwd: string = '';
    public _currentPasswoprd = '';
    public _elapsed = '';
    public _pwdCount: number = 0;
    public _totalPwd: number = 0;
    public _passwordCombinationChar: string[] = [];
    public _pwdMinLength: number;
    public _pwdMaxLength: number;
    public _perMinutePwd: number;
    public _remainingTime: string;
    public _isPasswordSuccess: boolean = false;
    public pdfSrc: any;
    public pdf: any;
    _stopWatch = new StopWatch();
    public _passwordCombination: Array<PasswordCombination>;

    constructor(pdf?: any, passwordCombination?: Array<PasswordCombination>, minPwdLen?: number, maxPwdLen?: number, threadCount?: number) {
        this.pdf = pdf;
        this._passwordCombination = passwordCombination;
        this._pwdMinLength = minPwdLen == undefined ? 1 : minPwdLen;
        this._pwdMaxLength = maxPwdLen == undefined ? 6 : maxPwdLen;
        this._threadCount = threadCount == undefined ? 6 : threadCount;
        this.SetPasswordCombination();
        this.GetPossiblePasswordCount();
    }

    async SetPasswordCombination() {
        this._passwordCombinationChar = [];

        if (this._passwordCombination != null && this._passwordCombination.length > 0) {
            if (this._passwordCombination.find(s => s == PasswordCombination.NoIdea) != null) {
                this._passwordCombinationChar = Array.from(this._numbers + this._smallChar + this._capChar + this._spcChar);
            } else {
                this._passwordCombination.forEach(element => {
                    switch (element) {
                        case PasswordCombination.Numbers:
                            this._passwordCombinationChar = Array.from(this._numbers);
                            break;
                        case PasswordCombination.SmallCharacters:
                            this._passwordCombinationChar = this._passwordCombinationChar.concat(Array.from(this._smallChar));
                            break;
                        case PasswordCombination.CapitalCharacters:
                            this._passwordCombinationChar = this._passwordCombinationChar.concat(Array.from(this._capChar));
                            break;
                        case PasswordCombination.SpecialCharacters:
                            this._passwordCombinationChar = this._passwordCombinationChar.concat(Array.from(this._spcChar));
                            break;
                    }
                });
            }
        } else {
            this._passwordCombinationChar = Array.from(this._numbers + this._smallChar + this._capChar + this._spcChar);
        }
    }

    async GetPossiblePasswordCount() {
        let TemptotalPwd = 0;
        var charCount = this._passwordCombinationChar.length;
        for (let i = this._pwdMinLength; i <= this._pwdMaxLength; i++) {
            TemptotalPwd += Math.pow(charCount, i);
        }
        try {
            this._totalPwd = TemptotalPwd;
        }
        catch (Exception) {

        }
    }
    async wait(ms: number) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }
    async passwordSet(pdf: PDFDocumentProxy, pwd: string, threadId: number) {
        this._isPasswordSuccess = true;
        this.finalSuccessPwd = pwd;
        await this.wait(this._pwdMaxLength > 10 ? 500 : 1);
        this._currentPasswoprd = pwd;
        if (this._isPasswordSuccess) {
            let msg = "Password found!!!";
            this._notificationsComponent.showNotification1('top', 'center', msg, 2);
            this._passwoprdTitleBoxColor = "green";
        }
        switch (threadId) {
            case 0:
                this._Thread1Pwd = this._currentPasswoprd;
                break;
            case 1:
                this._Thread2Pwd = this._currentPasswoprd;
                break;
            case 2:
                this._Thread3Pwd = this._currentPasswoprd;
                break;
            case 3:
                this._Thread4Pwd = this._currentPasswoprd;
                break;
            case 4:
                this._Thread5Pwd = this._currentPasswoprd;
                break;
            case 5:
                this._Thread6Pwd = this._currentPasswoprd;
                break;
            case 6:
                this._Thread7Pwd = this._currentPasswoprd;
                break;
            case 7:
                this._Thread8Pwd = this._currentPasswoprd;
                break;
            case 8:
                this._Thread9Pwd = this._currentPasswoprd;
                break;
            case 9:
                this._Thread10Pwd = this._currentPasswoprd;
                break;
            case 10:
                this._Thread11Pwd = this._currentPasswoprd;
                break;
            case 11:
                this._Thread12Pwd = this._currentPasswoprd;
                break;
            default:
                break;
        }
    }
    async pdfCheck(pwd, threadId) {
        if (typeof (FileReader) !== 'undefined') {
            let reader = new FileReader();
            reader.onload = (e: any) => {
                this.pdfSrc = { data: e.target.result, password: pwd }
                PDFJS.getDocument(this.pdfSrc).then(data => this.passwordSet(data, pwd, threadId));
            };
            reader.readAsArrayBuffer(this.pdf.files[0]);
        }
    }
    async StatusUpdate() {
        if (!this._isPasswordSuccess) {
            this._perMinutePwd = Math.round(this._pwdCount / this._stopWatch.ElapsedInSecond * 60);

            let inMiliSecond = Math.round((1 / this._perMinutePwd) * (this._totalPwd - this._pwdCount)) * 60 * 1000;
            let days = Math.floor(inMiliSecond / 86400000); // 1 Day = ‪86400000‬ Milliseconds
            let hours = Math.floor((inMiliSecond % 86400000) / 3600000); // 1 Hour = 3600000 Milliseconds
            let minutes = Math.floor(((inMiliSecond % 86400000) % 3600000) / 60000); // 1 Minutes = 60000 Milliseconds
            let seconds = Math.floor((((inMiliSecond % 86400000) % 3600000) % 60000) / 1000); // 1 Second = 1000 Milliseconds

            this._remainingTime = days.toString() + "Days  " + hours.toString().padStart(2, "0") + ":"
                + minutes.toString().padStart(2, "0") + ":"
                + seconds.toString().padStart(2, "0");
        }
    }
    async BruteForceApply() {
        this._stopWatch.Start();
        let totalChar = this._passwordCombinationChar.length;
        let R = 0;
        let series: string[];
        let totalItem = 0;
        let charCount = 0;
        let charIndex = 0;


        this.GetPossiblePasswordCount();
        for (var pwdLength = this._pwdMinLength; pwdLength <= this._pwdMaxLength && !this._isPasswordSuccess; pwdLength++) {
            R = pwdLength;
            series = new Array<string>(R);
            totalItem = Math.pow(this._passwordCombinationChar.length, R);
            charCount = Math.pow(totalChar, R - 1);
            charIndex = 0;
            await this.wait(1);
            for (var n = 1; n <= totalItem && !this._isPasswordSuccess; n++) {
                this._elapsed = this._stopWatch.ElapsedInFormat;
                charCount = Math.pow(totalChar, R - 1);
                var firstReminder = n % charCount;
                var secoundReminder = n % charCount;
                await this.wait(1);
                series[0] = this._passwordCombinationChar[Math.ceil(n / charCount) - 1];

                if (firstReminder == 0) {

                    for (var i = 1; i <= R - 1; i++) {
                        series[i] = this._passwordCombinationChar[totalChar - 1]; //'Z';                            
                    }

                }
                else {
                    for (var k = 1; k <= R - 1; k++) {
                        charCount = Math.pow(totalChar, R - k - 1);
                        charIndex = Math.ceil(secoundReminder / charCount) - 1;
                        series[k] = this._passwordCombinationChar[charIndex == -1 ? this._passwordCombinationChar.length - 1 : charIndex];
                        if (secoundReminder == 0) {
                            for (var i = k + 1; i <= R - k + 1; i++) {
                                series[i] = this._passwordCombinationChar[totalChar - 1]; //'Z';                            
                            }
                        }
                        secoundReminder = secoundReminder % charCount;
                    }
                }
                this._currentPasswoprd = series.join('');
                this._pwdCount++;
                console.clear();
                await this.wait(1);
                this.pdfCheck(this._currentPasswoprd, 1)
                if (this._isPasswordSuccess) {
                    break;
                }
                this.StatusUpdate();
            }
            if (this._isPasswordSuccess) {
                break;
            }
        }

    }
    async BruteForceApplyBack() {
        this._stopWatch.Start();
        let totalChar = this._passwordCombinationChar.length;
        let R = 0;
        let series: string[];
        let totalItem = 0;
        let charCount = 0;
        let charIndex = 0;


        this.GetPossiblePasswordCount();
        for (var pwdLength = this._pwdMinLength; pwdLength <= this._pwdMaxLength && !this._isPasswordSuccess; pwdLength++) {
            R = pwdLength;
            series = new Array<string>(3);
            totalItem = Math.pow(this._passwordCombinationChar.length, R);
            charCount = Math.pow(totalChar, R - 1);
            charIndex = 0;
            await this.wait(1);
            for (var n = totalItem; n >= 1 && !this._isPasswordSuccess; n--) {
                this._elapsed = this._stopWatch.ElapsedInFormat;
                charCount = Math.pow(totalChar, R - 1);
                var firstReminder = n % charCount;
                var secoundReminder = n % charCount;
                await this.wait(1);
                series[0] = this._passwordCombinationChar[Math.ceil(n / charCount) - 1];

                if (firstReminder == 0) {

                    for (var i = 1; i <= R - 1; i++) {
                        series[i] = this._passwordCombinationChar[totalChar - 1]; //'Z';                            
                    }

                }
                else {
                    for (var k = 1; k <= R - 1; k++) {
                        charCount = Math.pow(totalChar, R - k - 1);
                        charIndex = Math.ceil(secoundReminder / charCount) - 1;
                        series[k] = this._passwordCombinationChar[charIndex == -1 ? this._passwordCombinationChar.length - 1 : charIndex];
                        if (secoundReminder == 0) {
                            for (var i = k + 1; i <= R - k + 1; i++) {
                                series[i] = this._passwordCombinationChar[totalChar - 1]; //'Z';                            
                            }
                        }
                        secoundReminder = secoundReminder % charCount;
                    }
                }
                this._currentPasswoprd = series.join('');
                this._pwdCount++;
                console.clear();
                await this.wait(1);
                this.pdfCheck(this._currentPasswoprd, 1)
                if (this._isPasswordSuccess) {
                    break;
                }
                this.StatusUpdate();
            }
            if (this._isPasswordSuccess) {
                break;
            }
        }

    }
    async BruteForceApplySplit(threadId: number, startItem: number, totalItem: number, charCount: number,
        totalChar: number, series: string[], charIndex: number, R: number) {
        this.GetPossiblePasswordCount();
        for (var n = startItem; n <= totalItem + startItem; n++) {
            this._elapsed = this._stopWatch.ElapsedInFormat;
            charCount = Math.pow(totalChar, R - 1);
            var firstReminder = n % charCount;
            var secoundReminder = n % charCount;

            series[0] = this._passwordCombinationChar[Math.ceil(n / charCount) - 1];
            if (firstReminder == 0) {

                for (var i = 1; i <= R - 1; i++) {
                    series[i] = this._passwordCombinationChar[totalChar - 1]; //'Z';                            
                }

            }
            else {
                for (var k = 1; k <= R - 1; k++) {
                    charCount = Math.pow(totalChar, R - k - 1);
                    charIndex = Math.ceil(secoundReminder / charCount) - 1;
                    series[k] = this._passwordCombinationChar[charIndex == -1 ? this._passwordCombinationChar.length - 1 : charIndex];
                    if (secoundReminder == 0) {
                        for (var i = k + 1; i <= R - k + 1; i++) {
                            series[i] = this._passwordCombinationChar[totalChar - 1]; //'Z';                            
                        }
                    }
                    secoundReminder = secoundReminder % charCount;
                }
            }
            this._currentPasswoprd = series.join('');
            switch (threadId) {
                case 0:
                    this._Thread1Pwd = this._currentPasswoprd;
                    break;
                case 1:
                    this._Thread2Pwd = this._currentPasswoprd;
                    break;
                case 2:
                    this._Thread3Pwd = this._currentPasswoprd;
                    break;
                case 3:
                    this._Thread4Pwd = this._currentPasswoprd;
                    break;
                case 4:
                    this._Thread5Pwd = this._currentPasswoprd;
                    break;
                case 5:
                    this._Thread6Pwd = this._currentPasswoprd;
                    break;
                case 6:
                    this._Thread7Pwd = this._currentPasswoprd;
                    break;
                case 7:
                    this._Thread8Pwd = this._currentPasswoprd;
                    break;
                case 8:
                    this._Thread9Pwd = this._currentPasswoprd;
                    break;
                case 9:
                    this._Thread10Pwd = this._currentPasswoprd;
                    break;
                case 10:
                    this._Thread11Pwd = this._currentPasswoprd;
                    break;
                case 11:
                    this._Thread12Pwd = this._currentPasswoprd;
                    break;
                default:
                    break;
            }
            this._pwdCount++;
            console.clear();
            this.StatusUpdate();
            await this.wait(1);
            this.pdfCheck(this._currentPasswoprd, threadId)
            if (this._isPasswordSuccess) {
                break;
            }
        }

    }
    async SplitBruteForce() {
        this._stopWatch.Start();
        let totalLongList = [this._threadCount];
        let totalItem = 0;
        let charCount = 0;
        let charIndex = 0;

        for (var pwdLength = this._pwdMinLength; pwdLength <= this._pwdMaxLength && !this._isPasswordSuccess; pwdLength++) {
            let totalItemTemp = Math.pow(this._passwordCombinationChar.length, pwdLength);
            for (var i = 0; i < this._threadCount; i++) {
                totalLongList[i] = Math.round(totalItemTemp / this._threadCount);
            }
            totalLongList[0] = totalLongList[0] + (totalItemTemp - (totalLongList[0] * this._threadCount));

            let temp = 1;
            let series = new Array<string>(pwdLength);
            for (var i = 0; i < this._threadCount - 1; ++i) {
                this.BruteForceApplySplit(i, temp, totalLongList[i], charCount, this._passwordCombinationChar.length,
                    series, charIndex, pwdLength);
                temp += totalLongList[i];
            }
            await this.BruteForceApplySplit(this._threadCount - 1, temp, totalLongList[this._threadCount - 1], charCount, this._passwordCombinationChar.length,
                series, charIndex, pwdLength);
        }
        if (!this._isPasswordSuccess) {
            let msg = "Password not found, please change the password combination and length.";
            this._notificationsComponent.showNotification1('top', 'center', msg, 4);
            this._passwoprdTitleText = msg;
            this._currentPasswoprd = "";
            this._passwoprdTitleBoxColor = "red";
        }
    }
}