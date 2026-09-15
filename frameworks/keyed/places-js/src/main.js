import {DataStore,PresentationComponent} from "./lib/places-js-latest.js";
import {store} from "./store.js"

export class MainElement extends PresentationComponent {
  constructor(){
    super([{
        dataStore:store
      }]
    );
    this.setClickEvents({
      "select": ({componentId})=>{
        store.select(componentId);
      },
      "delete":({componentId})=>{
        store.delete(componentId);
      }
    })
  } 
}

customElements.define("main-element", MainElement);
