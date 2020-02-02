import { Component, VERSION, AfterViewChecked} from '@angular/core';

interface Data {
  id: number;
  label: string;
}

let startTime: number;
let lastMeasure: string;
let startMeasure = function (name: string) {
    startTime = performance.now();
    lastMeasure = name;
}
let stopMeasure = function () {
    var last = lastMeasure;
    if (lastMeasure) {
        window.setTimeout(function () {
            lastMeasure = null;
            var stop = performance.now();
            var duration = 0;
            console.log(last + " took " + (stop - startTime));
        }, 0);
    }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent implements AfterViewChecked {
    data: Array<Data> = [];
    selected: number = undefined;
    id: number = 1;
    backup: Array<Data> = undefined;
    version: string;

    constructor() {
        this.version = VERSION.full;
    }

    buildData(count: number = 1000): Array<Data> {
        var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
        var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
        var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
        var data: Array<Data> = [];
        for (var i = 0; i < count; i++) {
            data.push({ id: this.id, label: adjectives[this._random(adjectives.length)] + " " + colours[this._random(colours.length)] + " " + nouns[this._random(nouns.length)] });
            this.id++;
        }
        return data;
    }

    _random(max: number) {
        return Math.round(Math.random() * 1000) % max;
    }

    itemById(index: number, item: Data) {
        return item.id;
    }

    select(item: Data, event: Event) {
        startMeasure("select");
        event.preventDefault();
        this.selected = item.id;
    }

    delete(item: Data, event: Event) {
        event.preventDefault();
        startMeasure("delete");
        for (let i = 0, l = this.data.length; i < l; i++) {
            if (this.data[i].id === item.id) {
                this.data.splice(i, 1);
                break;
            }
        }
    }

    run() {
        startMeasure("run");
        this.data = this.buildData();
    }

    add() {
        startMeasure("add");
        this.data = this.data.concat(this.buildData(1000));
    }

    update() {
        startMeasure("update");
        for (let i = 0; i < this.data.length; i += 10) {
            this.data[i].label += ' !!!';
        }
    }
    runLots() {
        startMeasure("runLots");
        this.data = this.buildData(10000);
        this.selected = undefined;
    }
    clear() {
        startMeasure("clear");
        this.data = [];
        this.selected = undefined;
    }
    swapRows() {
        startMeasure("swapRows");
        if (this.data.length > 998) {
            var a = this.data[1];
            this.data[1] = this.data[998];
            this.data[998] = a;
        }
    }

    ngAfterViewChecked() {
        stopMeasure();
        // console.log("hello");
    }
}
/*
console.log instead of stopMeasure:

# of paint events  2
duration to paint  177.773
duration to paint  184.564
*** duration 184.564 upper bound  431.669
# of paint events  2
duration to paint  173.896
duration to paint  183.906
*** duration 183.906 upper bound  402.2
# of paint events  2
duration to paint  190.76
duration to paint  198.217
*** duration 198.217 upper bound  421.332
# of paint events  2
duration to paint  187.647
duration to paint  199.781
*** duration 199.781 upper bound  429.665
# of paint events  2
duration to paint  189.009
duration to paint  200.573
*** duration 200.573 upper bound  426.834
# of paint events  2
duration to paint  186.369
duration to paint  200.142
*** duration 200.142 upper bound  429.66
# of paint events  2
duration to paint  193.733
duration to paint  206.532
*** duration 206.532 upper bound  441.442
# of paint events  2
duration to paint  186.035
duration to paint  199.266
*** duration 199.266 upper bound  424.128

# of paint events  2
duration to paint  11.407
duration to paint  12.091
*** duration 12.091 upper bound  49.27
# of paint events  2
duration to paint  24.476
duration to paint  25.187
*** duration 25.187 upper bound  60.505
# of paint events  2
duration to paint  13.824
duration to paint  14.467
*** duration 14.467 upper bound  49.185
# of paint events  2
duration to paint  16.531
duration to paint  17.303
*** duration 17.303 upper bound  59.026
# of paint events  2
duration to paint  14.894
duration to paint  15.769
*** duration 15.769 upper bound  50.523
result angular-ng-v8.2.14-keyed_03_update10th1k_x16.json min 12.091 max 25.187 mean 17.7031 median 15.731 stddev 4.96844606715442


With stopMeasure():

# of paint events  2
duration to paint  127.487
duration to paint  137.713
*** duration 137.713 upper bound  358.016
# of paint events  2
duration to paint  146.576
duration to paint  157.879
*** duration 157.879 upper bound  384.147
# of paint events  2
duration to paint  152.573
duration to paint  164.835
*** duration 164.835 upper bound  404.388
# of paint events  2
duration to paint  139.172
duration to paint  152.099
*** duration 152.099 upper bound  392.945
# of paint events  2
duration to paint  142.25
duration to paint  151.936
*** duration 151.936 upper bound  386.661
# of paint events  2
duration to paint  140.18
duration to paint  154.406
*** duration 154.406 upper bound  382.604
# of paint events  2
duration to paint  133.93
duration to paint  145.996
*** duration 145.996 upper bound  378.452

# of paint events  2
duration to paint  21.878
duration to paint  22.595
*** duration 22.595 upper bound  58.178
# of paint events  2
duration to paint  19.532
duration to paint  20.327
*** duration 20.327 upper bound  55.337
# of paint events  2
duration to paint  16.731
duration to paint  18.041
*** duration 18.041 upper bound  56.938
# of paint events  2
duration to paint  19.322
duration to paint  20.087
*** duration 20.087 upper bound  55.454
# of paint events  2
duration to paint  16.21
duration to paint  17.109
*** duration 17.109 upper bound  50.657
# of paint events  2
duration to paint  28.661
duration to paint  29.353
*** duration 29.353 upper bound  72.148
result angular-ng-v8.2.14-keyed_03_update10th1k_x16.json min 9.141 max 29.353 mean 17.487299999999998 median 17.575000000000003 stddev 5.986980263687009

*/
