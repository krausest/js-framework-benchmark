export default class HomeController {
    constructor($scope) {
        console.log("$scope",$scope);
        this.$scope = $scope;
        this.start = 0;
        this.data = [];
        this.id = 1;
    }

    buildData(count = 1000) {
        var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
        var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
        var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
        var data = [];
        for (var i = 0; i < count; i++) {
            data.push({ id: this.id++, label: adjectives[this._random(adjectives.length)] + " " + colours[this._random(colours.length)] + " " + nouns[this._random(nouns.length)] });
        }
        return data;
    }
    printDuration() {
        this.$scope.$$postDigest(function() {
            let duration = Math.round(performance.now()-this.start);
            document.getElementById("duration").innerHTML = duration + " ms";
        }.bind(this));
    }
    _random(max) {
        return Math.round(Math.random() * 1000) % max;
    }
    add() {
        this.start = performance.now();
        this.data = this.data.concat(this.buildData(10));
        this.printDuration();
    }
    select(item) {
        this.start = performance.now();
        this.selected = item.id;
        this.printDuration();
    }
    del(item) {
        this.start = performance.now();
        const idx = this.data.findIndex(d => d.id===item.id);
        this.data.splice(idx, 1);
        this.printDuration();
    }
    update() {
        this.start = performance.now();
        for (let i=0;i<this.data.length;i+=10) {
            this.data[i].label += '.';
        }
        this.printDuration();
    }
    run() {
        this.start = performance.now();
        this.data = this.buildData();
        this.printDuration();
    };
}

HomeController.$inject = ['$scope'];