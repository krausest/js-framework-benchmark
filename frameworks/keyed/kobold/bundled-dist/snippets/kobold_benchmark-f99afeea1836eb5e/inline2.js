export function __e0_10f4d4d44b3ea73f(a,b,c,d,e) {
let e0=document.createElement("tr");
e0.className=a;
let e1=document.createElement("td");
e1.className="col-md-1";
e1.append(b);
let e2=document.createElement("td");
e2.className="col-md-4";
let e3=document.createElement("a");
e3.addEventListener("click",c);
e3.append(d);
e2.append(e3);
let e4=document.createElement("td");
e4.className="col-md-1";
let e5=document.createElement("a");
e5.addEventListener("click",e);
let e6=document.createElement("span");
e6.className="glyphicon glyphicon-remove";
e6.setAttribute("aria_hidden","true");
e5.append(e6);
e4.append(e5);
let e7=document.createElement("td");
e7.className="col-md-6";
e0.append(e1,e2,e4,e7);
return e0;
}
