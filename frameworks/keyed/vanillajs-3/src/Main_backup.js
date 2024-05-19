"use strict";

new class App {
    index = 1; data = []; labels = null; invalidLabels = true;
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
    
        const nt = 5;    // n / 25;   // Math.round(n / 50);
        let i, j = 0, r1, r2, r3;;

        const itemTemplateContainer = document.getElementById('itemTemplate');   // .content; // .cloneNode(true);
        const itemTemplates = document.createDocumentFragment();
        const itemTemplate = itemTemplateContainer.firstElementChild;
        if (itemTemplateContainer.children.length >= nt) {
            for (i = 0; i < nt; i++) itemTemplates.appendChild(itemTemplate.cloneNode(true))
        } else {
            for (i = itemTemplateContainer.children.length; i < nt; i++) itemTemplateContainer.appendChild(itemTemplate.cloneNode(true));
            itemTemplates.append(...itemTemplateContainer.cloneNode(true).children)
        }
        const ids = Array.prototype.map.call(itemTemplates.querySelectorAll(`td:first-child`), i => i.firstChild)
        const labels = Array.prototype.map.call(itemTemplates.querySelectorAll(`a.lbl`), i => i.firstChild);
        
        while ((n -= nt) >= 0) {
            for (i = 0; i < nt; i++, j++) {
                r1 = Math.round(Math.random() * 1000) % l1;
                r2 = Math.round(Math.random() * 1000) % l2;
                r3 = Math.round(Math.random() * 1000) % l3;
                ids[i].nodeValue = this.index++;
                this.data.push(labels[i].nodeValue = `${adjectives[r1]} ${colours[r2]} ${nouns[r3]}`);
            }
            this.tbody.appendChild(itemTemplates.cloneNode(true));
        } this.invalidLabels = true;
    };
    update() {
        if (this.invalidLabels) this.labels = this.tbody.querySelectorAll('a.lbl'); this.invalidLabels = false;
        const labels = this.labels, length = labels.length, data = this.data;
        let i; for (i = 0; i < length; i += 10) labels[i].firstChild.nodeValue = data[i] += ' !!!';
    };
    clear() { this.tbody.textContent = ''; this.data = []; this.invalidLabels = true; };
    
    swaprows() {
        const tbody = this.tbody, data = this.data;
        if (tbody.children.length < 999) return; this.invalidLabels = true;
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
                element.remove(); this.invalidLabels = true;
                this.data.splice(index, 1);
            }
        }
    }
}();
