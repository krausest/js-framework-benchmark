import { Component } from '@angular/core';
import {get, set, bindState} from 'xsm'

interface Data {
    id: number;
    label: string;
}

@Component({
  styleUrls: ['../currentStyle.css'],
  selector: 'app-table',
  template: `
    <table class="table table-hover table-striped test-data">
        <tbody>
            <tr [class.danger]="item.id===selected" *ngFor="let item of rows; trackBy: itemById">
                <td class="col-md-1">{{item.id}}</td>
                <td class="col-md-4">
                    <a href="#" (click)="select(item, $event)">{{item.label}}</a>
                </td>
                <td class="col-md-1"><a href="#" (click)="delete(item, $event)"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>
                <td class="col-md-6"></td>
            </tr>
        </tbody>
    </table>
`
})
export class TableComponent {
  selected: number = 0;
    // rows: {id: number, label: string}[] = [];
  rows: Array<Data> = [];

  constructor() {
      bindState(this, {rows: []});
  }

  itemById(index: number, item) {
      return item.id;
  }

  select(item, event: Event) {
      event.preventDefault();
      this.selected = item.id;
  }

  delete(item, event: Event) {
      event.preventDefault();
      let rows = get('rows');
      rows.splice(rows.indexOf(item), 1);
  }

}
