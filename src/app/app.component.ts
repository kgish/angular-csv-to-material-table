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
    title: Record<string, string> = {};

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
                this.displayedColumns.forEach(column =>
                    this.title[column] = this.capitalize(column.replace(/_/g, ' '))
                )
                console.log(`${ cn } handleComplete() displayedColumns='${JSON.stringify(this.displayedColumns)}'`);
                console.log(`${ cn } handleComplete() titles='${JSON.stringify(this.title)}'`);
                this.dataSource = data;
            }
        } else {
            console.error(`${ cn } handleComplete() empty data!`);
        }
    }

    private capitalize = (str: string) => str[0].toUpperCase() + str.slice(1);
}
