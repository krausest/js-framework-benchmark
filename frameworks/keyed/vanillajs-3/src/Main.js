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
    
        const itemTemplate = document.getElementById('itemTemplate').content;    // .cloneNode(true);
        const nt = Math.max(itemTemplate.children.length, n / 100);   // Math.round(n / 50);

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
        const labels = this.tbody.querySelectorAll('tr:nth-child(10n+1)>td>a.lbl'), length = labels.length, data = this.data;
        let i = 0, lbl; for (lbl of labels) { lbl.firstChild.nodeValue = data[i] += ' !!!'; i += 10 }
    };
    clear() { this.tbody.textContent = ''; this.data = [] };
    
    swaprows() {
        const tbody = this.tbody, data = this.data;
        if (tbody.children.length < 999) return; 
        const first = tbody.firstElementChild;
        [data[1], data[998]] = [data[998], data[1]];
        tbody.insertBefore(tbody.insertBefore(first.nextElementSibling, 
            tbody.children[998]).nextElementSibling, first.nextElementSibling);
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
