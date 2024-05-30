"use strict";
(function() {
    let index = 1, data = [], labels = null, invalidLabels = true, selected = null;
    const tbody = document.getElementsByTagName('tbody')[0];

    const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
    const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
    const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
    const l1 = adjectives.length, l2 = colours.length, l3 = nouns.length;
    const nts = (n) => Math.round(n / 100)

    function run(n = 1000) { if (data.length) clear(); add(n); }
    function runlots() { run(10000) }
    function add(n = 1000) {
        const nt = nts(n);
        let i, j = 0, r1, r2, r3;;

        const itemTemplates = document.getElementById(`t${n}`).content   // .cloneNode(true);
        if (itemTemplates.children.length < nt) {
            const itemTemplate = itemTemplates.firstElementChild;
            while (nt >= itemTemplates.children.length * 2) itemTemplates.appendChild(itemTemplates.cloneNode(true));
            while (nt > itemTemplates.children.length) itemTemplates.appendChild(itemTemplate.cloneNode(true));;
        }
        const ids = Array.prototype.map.call(itemTemplates.querySelectorAll(`td:first-child`), i => i.firstChild)
        const labels = Array.prototype.map.call(itemTemplates.querySelectorAll(`a.lbl`), i => i.firstChild);
        
        while ((n -= nt) >= 0) {
            for (i = 0; i < nt; i++, j++) {
                r1 = Math.round(Math.random() * 1000) % l1;
                r2 = Math.round(Math.random() * 1000) % l2;
                r3 = Math.round(Math.random() * 1000) % l3;
                ids[i].nodeValue = index++;
                data.push(labels[i].nodeValue = `${adjectives[r1]} ${colours[r2]} ${nouns[r3]}`);
            }
            tbody.appendChild(itemTemplates.cloneNode(true));
        } invalidLabels = true;
    };
    function update() {
        if (invalidLabels) labels = tbody.querySelectorAll('a.lbl'); invalidLabels = false;
        const length = labels.length;
        let i; for (i = 0; i < length; i += 10) labels[i].firstChild.nodeValue = data[i] += ' !!!';
    };
    function clear() { tbody.textContent = ''; data = []; invalidLabels = true; };
    function swaprows() {
        if (tbody.children.length < 999) return; invalidLabels = true;
        const first = tbody.firstElementChild;
        [data[1], data[998]] = [data[998], data[1]];
        tbody.insertBefore(tbody.insertBefore(first.nextElementSibling, 
            tbody.children[998]).nextElementSibling, first.nextElementSibling);
    };
    tbody.onclick = (e) => {
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
            const index = Array.prototype.indexOf.call(tbody.children, element);
            element.remove(); data.splice(index, 1); invalidLabels = true;
        }
    }
    for (let [key, value] of Object.entries({run, runlots, add, update, clear, swaprows})) {
        document.getElementById(key).onclick = (e) => { e.stopPropagation(); value(); }
    }
})();
