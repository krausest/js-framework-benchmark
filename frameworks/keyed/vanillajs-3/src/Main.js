"use strict";

new class App {
    index = 1; data = [];
    tbody = document.getElementsByTagName('tbody')[0];
    constructor() {
        this.tbody.onclick = this.onclick();
        for (let key of ['run', 'runlots', 'add', 'update', 'clear', 'swaprows']) {
            document.getElementById(key).onclick = (e) => { e.stopPropagation(); this[key](); }
        }
    };
    run(n = 1000) { if (this.data.length) this.clear(); this.add(n); };
    runlots() { this.run(10000) };
    add(n = 1000) {
        const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
        const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
        const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
        const l1 = adjectives.length, l2 = colours.length,l3 = nouns.length;
    
        const nt = Math.round(n / 100);
        const itemTemplate = document.getElementById('itemTemplate').content.cloneNode(true);
    
        while (nt >= itemTemplate.children.length * 2) itemTemplate.appendChild(itemTemplate.cloneNode(true));
        while (nt > itemTemplate.children.length) itemTemplate.appendChild(itemTemplate.firstElementChild.cloneNode(true));
        
        const ids = Array.prototype.map.call(itemTemplate.querySelectorAll('td:first-child'), i => i.firstChild)
        const labels = Array.prototype.map.call(itemTemplate.querySelectorAll('a.lbl'), i => i.firstChild);
        
        let i, j = 0, r1, r2, r3;;
        while ((n -= nt) >= 0) {
            for (i = 0; i < nt; i++, j++) {
                r1 = Math.round(Math.random() * 1000) % l1;
                r2 = Math.round(Math.random() * 1000) % l2;
                r3 = Math.round(Math.random() * 1000) % l3;
                ids[i].nodeValue = this.index++;
                this.data.push(labels[i].nodeValue = `${adjectives[r1]} ${colours[r2]} ${nouns[r3]}`);
            }
            this.tbody.appendChild(itemTemplate.cloneNode(true));
        }
    };
    update() {
        const children = this.tbody.children, data = this.data;
        let child, lbl;
        for (let i = 0; i < this.data.length; i+=10) {
            child = children[i];
            if (child.hasOwnProperty('lbl')) lbl = child.lbl;
            else child.lbl = lbl = children[i].querySelector('a.lbl').firstChild;
            lbl.nodeValue = this.data[i] = `${this.data[i]} !!!`
        }
    };
    clear() { this.tbody.textContent = ''; this.data = [] };
    
    swaprows() {
        if (this.data.length < 999) return;  // nb: swap does not affect labels
        const first = this.tbody.firstChild, sec = first.nextSibling, 
            third = sec.nextSibling, c998 = this.tbody.children[998];
        this.tbody.insertBefore(this.tbody.insertBefore(sec, c998) && c998, third);
        const temp = this.data[1]; this.data[1] = this.data[998]; this.data[998] = temp;
    };
    onclick() {
        let selected;
        return (e) => {
            e.stopPropagation;
            if (e.target.matches('a.lbl')) {
                e.preventDefault;
                const element = e.target.parentNode.parentNode;
                if (element === selected) selected.className = selected.className ? "" : "danger";
                else {
                    if (selected) selected.className = "";
                    element.className = "danger"; selected = element;
                }
            } else if (e.target.matches('span.remove')) { 
                const element = e.target.parentNode.parentNode.parentNode;
                const index = Array.prototype.indexOf.call(this.tbody.children, element);
                element.remove();
                this.data.splice(index, 1);
            }
        }
    }
}();
