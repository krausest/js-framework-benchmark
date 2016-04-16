/// <reference path="../node_modules/angular2/typings/browser.d.ts" />

import {Component} from 'angular2/core';

@Component({
  selector: 'my-app',
  template: `
	<div class="container">
		<div class="jumbotron">
			<div class="row">
				<div class="col-md-8">
					<h1>Angular v2.0.0-beta.15</h1>
				</div>
				<div class="col-md-4">
					<button type="button" class="btn btn-primary btn-block" id="add" (click)="add()" ref="text">Add 1000 rows</button>
					<button type="button" class="btn btn-primary btn-block" id="run" (click)="run()" ref="text">Create 1000 rows</button>
					<button type="button" class="btn btn-primary btn-block" id="update" (click)="update()">Update every 10th row</button>
					<button type="button" class="btn btn-primary btn-block" id="hideall" (click)="hideAll()">HideAll</button>
					<button type="button" class="btn btn-primary btn-block" id="showall" (click)="showAll()">ShowAll</button>
					<button type="button" class="btn btn-primary btn-block" id="runlots" (click)="runLots()">Create lots of rows</button>
					<button type="button" class="btn btn-primary btn-block" id="clear" (click)="clear()">Clear</button>
					<button type="button" class="btn btn-primary btn-block" id="swaprows" (click)="swapRows()">Swap Rows</button>
					<h3 id="duration"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span>&nbsp;</h3>
				</div>
			</div>
		</div>
		<table class="table table-hover table-striped test-data">
			<tr [class.danger]="item.id === selected" *ngFor="#item of data">
				<td class="col-md-1">{{item.id}}</td>
				<td class="col-md-4">
					<a href="#" (click)="select(item, $event)">{{item.label}}</a>
				</td>
				<td class="col-md-1"><a href="#" (click)="delete(item, $event)"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>
				<td class="col-md-6"></td>
			</tr>
		</table>
	</div>
  `
})
export class App {
	data: Array<any> = [];
    selected: string = undefined;
    id: number = 1;
    backup: Array<any> = undefined;
    
    constructor() {
    }
    
    buildData(count: number = 1000): Array<string> {
        var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
        var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
        var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
        var data = [];
        for (var i = 0; i < count; i++) {
            data.push({id: this.id, label: adjectives[this._random(adjectives.length)] + " " + colours[this._random(colours.length)] + " " + nouns[this._random(nouns.length)] });
            this.id++;
        }
        return data;
    }

    _random(max: number) {
        return Math.round(Math.random()*1000)%max;
    }

    select(item, event) {
        event.preventDefault();
        this.selected = item.id;
    }

    delete(item, event) {
       event.preventDefault();
       for (let i = 0, l = this.data.length; i < l; i++) {
         if(this.data[i].id === item.id) {
         	this.data.splice(i, 1);
         	break;
         }
       }
    }

    run(event) {
        this.data = this.buildData();
    }

    add(event) {
        this.data = this.data.concat(this.buildData(1000));
    }

    update(event) {
        for (let i=0;i<this.data.length;i+=10) {
            this.data[i].label += ' !!!';
        }
    }
    
    hideAll() {
    	this.backup = this.data;
        this.data = [];
        this.selected = undefined;
    }
    showAll() {
        this.data = this.backup;
        this.backup = null;
        this.selected = undefined;
    }
    runLots() {
        this.data = this.buildData(10000);
        this.selected = undefined;
    }
    clear() {
        this.data = [];
        this.selected = undefined;
    }
    swapRows() {
    	if(this.data.length > 10) {
    		var a = this.data[4];
    		this.data[4] = this.data[9];
    		this.data[9] = a;
    	}
    }
}