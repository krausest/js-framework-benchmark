const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
const lengths = [adjectives.length, colours.length, nouns.length];
function* _random(n) {
    for (let max of lengths) {
        const arr = new Array(n);
        for (i = 0; i < n; i++) arr[i] = Math.round(Math.random() * 1000) % max;
        yield arr
    }
}
const data = [], tbody = document.getElementsByTagName('tbody')[0];
let index = 1, i, lbl, selected, temp;

function create(e, n = 1000) { if (data.length) clear(e); append(e, n); }
function append(e, n = 1000) {
    const [r1, r2, r3] = _random(n);
    const itemTemplate = document.getElementById('itemTemplate').content.firstElementChild;
    const itemId = itemTemplate.firstElementChild.firstChild, itemLabel = itemTemplate.querySelector('a.lbl').firstChild;
    while (--n >= 0) {
        itemId.nodeValue = index++;
        data.push(itemLabel.nodeValue = `${adjectives[r1[n]]} ${colours[r2[n]]} ${nouns[r3[n]]}`)
        tbody.appendChild(itemTemplate.cloneNode(true));
    }
}
function update(e) {
    const labels = tbody.querySelectorAll('a.lbl'), length = labels.length;
    for (i = 0; i < length; i += 10) labels[i].firstChild.nodeValue = data[i] += ' !!!';
}
function clear(e) { data.length = 0; tbody.textContent = '' }

function swap(e) {
    if (data.length < 999) return;
    [data[1], data[998]] = [data[998], data[1]];
    tbody.replaceChild(tbody.children[1], (temp = tbody.children[998]));
    tbody.insertBefore(temp, tbody.children[1]);
}
tbody.onclick = (e) => {
    e.preventDefault; e.stopPropagation;
    if (e.target.matches('a.lbl')) {
        const element = e.composedPath()[2];
        if (element === selected) selected.className = selected.className ? "" : "danger";
        else {
            if (selected) selected.className = "";
            element.className = "danger"; selected = element
        }
    } else if (e.target.matches('span.remove')) { 
        data.splice(Array.prototype.indexOf.call(tbody.children, tbody.removeChild(e.composedPath()[3])), 1);
    }
}
for (let [key, fn] of Object.entries({
    run: create, runlots: (e) => create(e, 10000),
    add: append, update, clear, swaprows: swap
})) document.getElementById(key).onclick = (e) => { e.stopPropagation(); fn(e) }