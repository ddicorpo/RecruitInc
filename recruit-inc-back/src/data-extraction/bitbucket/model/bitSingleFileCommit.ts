import { ISingleFileCommit } from "../../../matching-algo/data-model/input-model/ISingleFileCommit";

export class bitSingleFileCommit{

    private iSIngleFileCommit: ISingleFileCommit;
    private _filePath: string;
    private _linesAdded: number;
    private _linesDeleted: number;

    public constructor(){
        this._filePath = this.iSIngleFileCommit.filePath;
        this._linesAdded = this.iSIngleFileCommit.lineAdded;
        this._linesDeleted = this.iSIngleFileCommit.lineDeleted;
    }

    get linesDeleted(): number {
        return this._linesDeleted;
    }

    set linesDeleted(value: number) {
        this._linesDeleted = value;
    }

    get filePath(): string {
        return this._filePath;
    }

    set filePath(value: string) {
        this._filePath = value;
    }

    get linesAdded(): number {
        return this._linesAdded;
    }

    set linesAdded(value: number) {
        this._linesAdded = value;
    }

}