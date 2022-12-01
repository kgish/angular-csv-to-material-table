import { Component, OnInit } from '@angular/core';
import { Papa, ParseConfig, ParseResult } from 'ngx-papaparse';
import { HttpClient } from '@angular/common/http';

const cn = 'AppComponent';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements OnInit {

    displayedColumns: string[] = [];
    dataSource: Array<object> = [];

    constructor(private http: HttpClient, private papa: Papa) {
    }

    ngOnInit() {
        this.http.get('assets/data.csv', { responseType: 'text' })
            .subscribe(data => this.handleData(data));
    }

    handleData(data: string) {
        const options: ParseConfig = {
            complete: results => this.handleComplete(results),
            delimiter: ',',
            header: true
        };

        this.papa.parse(data, options);
    }

    handleComplete(results: ParseResult<any>) {
        const { data, errors } = results;

        if (data && data.length > 0) {
            const badErrors = errors.filter(error => error.type !== 'FieldMismatch');
            if (badErrors.length) {
                console.error(`${ cn } handleComplete() errors='${ JSON.stringify(badErrors) }'!`);
            } else {
                this.displayedColumns = Object.keys(data[0]);
                console.log(`${ cn } handleComplete() displayedColumns='${JSON.stringify(this.displayedColumns)}'`);
                this.dataSource = data;
            }
        } else {
            console.error(`${ cn } handleComplete() empty data!`);
        }
    }
}
