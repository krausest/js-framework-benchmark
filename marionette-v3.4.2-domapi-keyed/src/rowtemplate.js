const tr = document.createElement('tr');

const td1 = document.createElement('td');
td1.className = 'col-md-1';
tr.appendChild(td1);

const td2 = document.createElement('td');
td2.className = 'col-md-4';
tr.appendChild(td2);

const a2 = document.createElement('a');
a2.className = 'js-link';
td2.appendChild(a2);

const td3 = document.createElement('td');
td3.className = 'col-md-1';
tr.appendChild(td3);

const a = document.createElement('a');
a.className = 'js-del';
td3.appendChild(a);

const span = document.createElement('span');
span.className = 'glyphicon glyphicon-remove';
span.setAttribute('aria-hidden', 'true');
a.appendChild(span);

const td4 = document.createElement('td');
td4.className = 'col-md-6';
tr.appendChild(td4);

export default function(data) {
    td1.innerText = data.id;
    a2.innerText = data.label;
    tr.dataset.id = data.id;
    return tr;
}