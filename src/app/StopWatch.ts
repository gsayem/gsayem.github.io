export class StopWatch {    
    private _timeStart: number;
    private _elapsed: number;
    private _isRunning: boolean;
    private _hours: number;
    private _minutes: number;
    private _seconds: number;

    constructor() {
        this._isRunning = false;
    }

    get IsRunning(): boolean {
        this._elapsed = new Date().getTime() - this._timeStart;
        return this._isRunning;
    }
    get ElapsedInMilliSecond(): number {
        if (this._isRunning) {
            this._elapsed = new Date().getTime() - this._timeStart;
        }
        return this._elapsed;
    }
    get ElapsedInSecond(): number {
        if (this._isRunning) {
            this._elapsed = new Date().getTime() - this._timeStart;
        }
        return Math.floor(this._elapsed / 1000);
    }
    get ElapsedInMinute(): number {
        if (this._isRunning) {
            this._elapsed = new Date().getTime() - this._timeStart;
        }

        return Math.floor((1 / 60000) * this._elapsed);
    }
    get ElapsedInHour(): number {
        if (this._isRunning) {
            this._elapsed = new Date().getTime() - this._timeStart;
        }

        return Math.floor((1 / 3600000) * this._elapsed);
    }
    get ElapsedInFormat(): string {
        if (this._isRunning) {
            this._elapsed = new Date().getTime() - this._timeStart;
        }
        this._hours = Math.floor(this._elapsed / 3600000); // 1 Hour = 3600000 Milliseconds
        this._minutes = Math.floor((this._elapsed % 3600000) / 60000); // 1 Minutes = 60000 Milliseconds
        this._seconds = Math.floor(((this._elapsed % 360000) % 60000) / 1000); // 1 Second = 1000 Milliseconds
        return this._hours.toString().padStart(2, "0") + ":" + this._minutes.toString().padStart(2, "0") + ":" + this._seconds.toString().padStart(2, "0");
    }

    Start() {
        this._isRunning = true;
        this._timeStart = new Date().getTime();
    }
    Stop() {
        this._isRunning = false;
        this._elapsed = new Date().getTime() - this._timeStart;
    }

}