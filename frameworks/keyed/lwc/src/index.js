import App from "bench/app";
import { createElement } from "lwc";

const element = createElement("bench-app", { is: App });
const container = document.getElementById("main");
container.appendChild(element);
