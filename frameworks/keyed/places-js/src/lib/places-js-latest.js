/*(()=>{
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(`* [data-template] { visibility:hidden}`);
  document.adoptedStyleSheets = [sheet];
})()*/

/*
 * Don't iniitalize directly. use DataStore.createApiLoadSignal instead
 **/
class ApiLoadAction{

	constructor(getRequestConfig) {
		this.getRequestConfig = getRequestConfig;
	}

	/**
	 * @param params API request parameters
	 * @param cacheKey
	 * @param requestKey
	 */
	async fetch(params, cacheKey, requestKey){

		const queryConfig = this.getRequestConfig(params);

		if(!queryConfig.headers){
			queryConfig.headers = {};
		}

		const response = await ApiLoadAction.getResponseData(
				queryConfig,
				);

		if(cacheKey && requestKey){
			if(queryConfig?.method !== "GET"){
				for(let i = 0; i< sessionStorage.length; i++){
					const key = sessionStorage.key(i);
					sessionStorage.setItem(key, JSON.stringify({}));
				}
			}

			const data = JSON.parse(sessionStorage.getItem(cacheKey));
			data[requestKey] = response;
			sessionStorage.setItem(cacheKey, JSON.stringify(data));

		}
		return response;
	}

	static async #getErrorData(response, url) {

		const contentType = response.headers.get("content-type");
		if (contentType && contentType.includes("application/json")) {
			message = await response.json();
		} else {
			if (response.status === 404) {
				message = `Endpoint ${url} not found`;
			} else {
				message = await response.text();
			}
		}

		return {
status: response.status,
					errorMessage: message,
					endpoint: url,
		};
	}

	/**
	 * Directly make an API request and return the data. Use this method if the API request needs
	 * to be run as part of an event handler and no other components subscribe to the request.
	 * Cache data will not be used or updated.
	 *
	 * @param {ApiRequestConfig} queryConfig Configuration of the API request.
	 */
	static async getResponseData(queryConfig){

		let authData = null;

		const data = window.localStorage.getItem("authToken");
		if(data){
			authData = JSON.parse(data).access_token;
		}

		if (authData) {
			if(queryConfig.headers){
				queryConfig.headers["authToken"] = authData;
			} else {
				queryConfig.headers = {
					"authToken": authData
				};
			}
		}

		try {

        //The replace call is a workaround for an issue with url strings containing double quotes.
    const response = await fetch(queryConfig.url.replace(/"/g, ""), {
      method: queryConfig.method ?? "GET",
      headers: queryConfig.headers,
      body: queryConfig.body,
    });

    if (response.status !== 200) {
      return await this.#getErrorData(response,queryConfig.url)
    }

    const contentType = response.headers.get("content-type");
    if (contentType === "application/json") {
      return await response.json();
    }

    //Cjlear cache because there was a likely data update.
    if(queryConfig.method !== "GET"){
      for(let i = 0; i< sessionStorage.length; i++){
        const key = sessionStorage.key(i);
        sessionStorage.setItem(key, JSON.stringify({}));
      }
    }
    return { status: 200 };
    } catch (e) {
      return {errorMessage:e.message};
    }
  }
}

class TemplateItem {

	#clickTemplateEvents;
  #changeTemplateEvents;

  #clickTemplateHandlers;
  #changeTemplateHandlers;

  #handlerDepthMap = {};
  #nodes = {}

  #parentNode;

	static #templateFunctions = new Map();

  #templateNode;
  #templateRoot = null;
  #templateSignals;
  #signalMap = new Map();

	static init(componentHtml){
		let template = new TemplateItem(componentHTML)
		const obj = new item.prototype.constructor(); 
		obj.#defineComponent();
	}

	static addTemplateFunction(name,templateFunction){
		TemplateItem.#templateFunctions.set(name,templateFunction);
	}

	constructor(html){
		this.#defineComponent(html);
	}

	#initSignalMap(){
		for(let i=0;i<this.#templateSignals.length;i++){
			this.#signalMap.set(
					this.#templateSignals[i].fieldName,
					this.#templateSignals[i]
					);
		}
	}

	setupChangeEventHandlers(events){
    
		if(events){

			this.#changeTemplateHandlers = events;

				(function(templateRoot,handlerDepthMap,changeTemplateEvents,changeTemplateHandlers){

          const getItemIdForEvent = ({eventItem,key}) =>{
            const depth = handlerDepthMap[key];
				    for(let i=0; i<depth;i++){
				      eventItem = eventItem.parentNode;
				    }
            return eventItem.data_id;
				  }
          
          templateRoot.addEventListener("change",(e)=>{

						  const changeId = e.target.getAttribute("data-change-id")
              || e.target.parentNode.getAttribute("data-change-id") 
						  || e.target.parentNode.parentNode.getAttribute("data-change-id") 
						  if(changeId){

                const key = "data-click-id_"+changeId;
						    const componentId 
						      = getItemIdForEvent({
								    "eventItem":e.target,
								    "key":key
                  });

						  const handlerName = changeTemplateEvents[changeId];
						  changeTemplateHandlers[handlerName]({
							  "componentId":componentId
              });
					  } 
				  });
				})(this.#templateRoot, this.#handlerDepthMap,this.#changeTemplateEvents, this.#changeTemplateHandlers) 
			}  
		}	

		setupClickEventHandlers(events){
      
			if(events){
				this.#clickTemplateHandlers = events;

				(function(templateRoot,handlerDepthMap,clickTemplateEvents,clickTemplateHandlers){

				 const getItemIdForEvent = ({eventItem,key}) =>{
				 const depth = handlerDepthMap[key];

				  for(let i=0; i<depth;i++){
            eventItem = eventItem.parentNode;
				  }
				  return eventItem.data_id;
				}

       templateRoot.addEventListener("click",(e)=>{

         const clickId = e.target.getAttribute("data-click-id")
         || e.target.parentNode.getAttribute("data-click-id") 
         || e.target.parentNode.parentNode.getAttribute("data-click-id") 

        if(clickId){

          const key = "data-click-id_"+clickId;
          const componentId 
            = getItemIdForEvent({
               "eventItem":e.target,
               "key":key
            });

           const handlerName = clickTemplateEvents[clickId];
           clickTemplateHandlers[handlerName]({
               "componentId":componentId
           });
          } 
        });
      })(this.#templateRoot, this.#handlerDepthMap,this.#clickTemplateEvents, this.#clickTemplateHandlers) 
    } 
  }


  getSignalByFieldName(fieldName){
    return this.#signalMap.get(fieldName);
  }

  getAllSignals(){
    return this.#signalMap.values();
  }

  #evaluateConditional(templateStr){

    const split = templateStr.split("\n");

    while(true){

      let depth = 0;

      let firstIfPos;
      let elsePos;
      let endPos;


      for(let i=0; i<split.length;i++){

        if(split[i].includes("{#if")){
          depth++;
          if(!firstIfPos){
            firstIfPos = i;
          }
        }

        if(split[i].includes("{else}")){
          if(depth === 1){
            elsePos = i;
          }
        }

        if(split[i].includes("{/if}")){
          depth--;
          if(depth === 0){
            endPos = i;
            break;
          }
        }
      }

      if(!firstIfPos){
        break;
      } else {

        const ifCheckName = split[firstIfPos].trim().split(" ")[1].split("}")[0];
        const ifCheck =TemplateItem.#templateFunctions.get(ifCheckName);	

        if(!ifCheck){
          throw new Error(`No template function defined for ${ifCheckName}`);
        }

        if(ifCheck()){
          split.splice(endPos,1);

          if(elsePos){
            split.splice(elsePos,endPos-elsePos);
          }
          split.splice(firstIfPos,1);
        }	
        else {
          split.splice(endPos,1);
          split.splice(firstIfPos,elsePos-firstIfPos+1);	
        }
        firstIfPos = null;
        elsePos = null;
        endPos = null;

      }
    }
    return split.join("\n");
  }

	#defineComponent(templateStr){

    templateStr = this.#evaluateConditional(templateStr);
    
    this.#changeTemplateEvents = [];
    this.#clickTemplateEvents = [];
    const start = Date.now();

    const changeSplitRegex = new RegExp("onchange=\"{","i");
    const clickSplitRegex = new RegExp("onclick=\"{","i");

    this.#templateSignals = [];
 
    let tokens = [];
    
    let startPos;
    let isHtmlTagSection;
 
    //Tokenize template string.
    for(let i=0; i < templateStr.length;i++){
      const templateChar = templateStr.charAt(i);
    
      if(!startPos){
        startPos = i;
        isHtmlTagSection = (templateChar === "<") 
      }
     
      else if(isHtmlTagSection && templateChar === ">"){

        const token = templateStr.substring(startPos, i+1);
        
        const sections = token.split("}");
        let startSection;

        const templateAttrs = [];
        for(let j=0; j < sections.length; j++){
          const section = sections[j];
          const equalPos = section.lastIndexOf("=");
          const spacePos = section.lastIndexOf(" ", equalPos);

          if(j === 0){
            startSection = section.substring(0, spacePos+1);
          }

          if(j < sections.length - 1){
            templateAttrs.push({
              "attr":section.substring(spacePos+1, equalPos),
              "fieldName": section.substring(equalPos+3)
            });
          }
        }


        let endSection = sections[sections.length - 1];
        if(templateAttrs.length > 0){
          if(endSection.startsWith("\">")){
            endSection = endSection.substring(0, endSection.length-2)+">";
          }
        } else {
          startSection = token.substring(0, token.length - 1);
          endSection = ">";
        }
        tokens.push({
          "endSection":endSection,
          "isHtml": true,
          "startSection":startSection,
          "templateAttrs": templateAttrs
        });

        startPos = null;
        isHtmlTagSection = false;
      } else {
        if(templateChar === "<"){
          let token = templateStr.substring(startPos,i)
            .replaceAll("\t","")
            .replaceAll("\n","")
            .trim();
          if(token.trim().length >0){
            tokens.push({
              "isHtml": false,
              "token": token
            });
          }

          startPos = null;
          i--;
        }
      }
    }

    //Determine signals and event handlers.
    for(let i=0; i<tokens.length; i++){
      const token = tokens[i]; 
      if(token.isHtml){
        for(let j=0; j<token.templateAttrs.length; j++){
 
          let attr = token.templateAttrs[j].attr;
          if(attr.startsWith("on")){
            if(attr === "onchange" || attr === "onChange"){
              token.templateAttrs[j].signalRef =
                `data-change-id=${this.#changeTemplateEvents.length}`
              this.#changeTemplateEvents.push(token.templateAttrs[j].fieldName);
            }
            if(attr === "onclick" || attr === "onClick"){
              token.templateAttrs[j].signalRef =
                `data-click-id=${this.#clickTemplateEvents.length}`
              this.#clickTemplateEvents.push(token.templateAttrs[j].fieldName);
            }
          }
          else {
            const signalId = this.#templateSignals.length;
            const signalRef = i > 0 ? `data-signal-id-${signalId}` : ``

            if(attr === "innerhtml"){
              attr = "innerHTML";
            }

            const signalData = {
              "attr": attr,
              "fieldName": token.templateAttrs[j].fieldName,
              "isOuter": i === 0,
              "signalId": i > 0 ? signalId : -1,
              "signalPath": signalRef
            }

            token.templateAttrs[j].signalRef = signalRef;
            this.#templateSignals.push(signalData);
          }
        }
      } else {
        if(tokens[i].token.includes("{")){
          const nameStart = tokens[i].token.indexOf("{");
          const nameEnd = tokens[i].token.indexOf("}");
          const fieldName = tokens[i].token.substring(nameStart+1,nameEnd);

          const signalId = this.#templateSignals.length; 
          const signalRef = i > 0 ? `data-signal-id-${signalId}` : ``
 
          const signalData = {
            "attr": "textcontent",
            "fieldName": fieldName,
            "isOuter": false,
            "signalId": signalId,
            "signalPath":signalRef
          }

          tokens[i-1].templateAttrs.push({
            "attr": "textcontent",
            "fieldName": fieldName,
            "signalRef": signalRef
          });
          this.#templateSignals.push(signalData);
        } else {
          tokens[i].textcontent = tokens[i].token;
        }
      }
    }

    // Create new string with references to event handlers and signals.
    let templateArr = [];
    for(let i = 0; i<tokens.length;i++){
      const token = tokens[i];
      if(token.isHtml){

        if(token.templateAttrs.length > 0){
          templateArr.push(token.startSection);
         
          for(let j=0; j<token.templateAttrs.length; j++){
            templateArr.push(" "+token.templateAttrs[j].signalRef + " ");
          }
          templateArr.push(token.endSection);  
        } else {
          templateArr.push(token.startSection + token.endSection);
        }
      } else {
        if(token.textcontent){
          templateArr.push(token.textcontent);
        }
      }
    }
   
    let template = document.createElement("template"); 
		template.innerHTML = templateArr.join(""); 
    this.#templateNode = template.content.firstChild;

    const handlerAttrs = ["data-click-id","data-change-id"];

    handlerAttrs.forEach((handlerAttr)=>{

      const attrSelector = `[${handlerAttr}]`; 

      this.#templateNode
      .querySelectorAll(attrSelector)
      .forEach((node)=>{

        const clickNum = node.attributes[handlerAttr].value;

        let depth = 0;
        while(node.parentNode.nodeName !== "#document-fragment"){
          if(node.parentNode !== null){
            node = node.parentNode;
            depth++;
          } 
        }
        const handlerDepthKey = `${handlerAttr}_${clickNum}`;
        this.#handlerDepthMap[handlerDepthKey] = depth;  
      });
    });

    for(let i=0; i<this.#templateSignals.length; i++){

      const signal = this.#templateSignals[i];

      // A signal id of less than one means that the data is 
      // at the root.      
      if(signal.signalId >= 0){

        const selector = `[${signal.signalPath}]`

        let childNodePath = [];
        let node = template.content.querySelector(selector);
        let searchNode = node;

        while(searchNode.parentNode.nodeName !== "#document-fragment"){ 
          for(let j=0; j<searchNode.parentNode.childNodes.length; j++){ 
            if(Object.is(searchNode.parentNode.childNodes[j], searchNode)){
              childNodePath.push(`:nth-child(${j+1})`);
            }
          }
          searchNode = searchNode.parentNode;
        }

        childNodePath = childNodePath.reverse();
        node.attributes.removeNamedItem(signal.signalPath);
        signal.signalPath = childNodePath.join(">");
      }
    }

    this.#initSignalMap();

    //Tenplate parsing needs to be optimized for performance.
    //This is to display the overhead of the current logic.
    const parseTime = Date.now() - start;
    if(parseTime > 0){
      console.warn(`Slow template parse time of ${parseTime} miliseconds`);
    }
  }

  isAttributeChar(str){
    const code = str.charCodeAt(0);
    return (code > 64 && code < 91) || (code > 96 && code < 123)
  }

  setDataField(dataField){
    this.dataField = dataField;
  }

  getDataField(){
    return this.dataField; 
  }

  setId(id){
    this.id = id;
  }

  setTemplateName(templateName){
    this.templateName = templateName.toUpperCase();
  }

  setTemplateRoot(root){
    this.#templateRoot = root;
  }

  //TOOD: Fix bug related to this.#templateNode no longer being valid.
  setSingleNode(node){
    this.#templateNode = document.querySelector("[data-template]");
    this.#templateNode.replaceChildren(node);
  }

  appendNode(node){
    this.#templateRoot.appendChild(node);
  }

  appendChild(fragment){
    this.#templateRoot.appendChild(fragment);
  }

  getTemplateNode(){ 
    return this.#templateNode
  } 

  addNode(id,node){
    this.#nodes[id]=node;
  }

  getNode(id){
    return this.#nodes[id];
  }

  getFirstNode(){
    return this.#nodes[0];
  }

  removeChild(id){
    this.#templateRoot.removeChild(this.#nodes[id]);
  }

  clearNodes() { 
    this.#templateRoot.replaceChildren([]);
    setTimeout(()=>{
      Object.keys(this.#nodes).forEach((id)=>{
        this.#nodes[id] = null;
      });
      this.#nodes = {};
    },0);
  }

  setTemplateHtml(html){
    this.#templateRoot.innerHTML = html;
  }

  getTemplateHtml(){
    return this.#templateNode.innerHTML;
  }
}

TemplateItem.addTemplateFunction("isMobile",()=>{
	return window.matchMedia("(max-width: 32em)").matches;
});

class StaticComponent extends HTMLElement {

	static #clickSplitRegex = new RegExp("onclick=\"{","i");
	#handlerMap = {};

	constructor(){
		super();

		const split = this.innerHTML.split(StaticComponent.#clickSplitRegex);
		for(let i=1; i<split.length; i++){
			const sectionSplit = split[i].split("}");
			const handlerName = sectionSplit[0];
			split[i]=`data-${this.nodeName}-click="${handlerName}"${sectionSplit[1]}`;
		}   
		this.innerHTML = split.join("");
	}


	setClickEvents(handlerConfig){

		const clickSelectorName = `data-${this.nodeName.toLowerCase()}-click`;

		this
			.querySelectorAll(`[${clickSelectorName}]`)
			.forEach((node)=>{

					const eventHandlerName = node.attributes[clickSelectorName].value;

					node.id = eventHandlerName;
					node.removeAttribute(clickSelectorName);

					this.#handlerMap[node.id] = handlerConfig[eventHandlerName];
			});

		  this.addEventListener("click",(e)=>{
				const clickId = e.target?.id;

			if(this.#handlerMap[clickId]){
				this.#handlerMap[clickId](e);
		  }
	  });  
	}
}

class PresentationComponent extends HTMLElement {

	#componentIsRendering = false;
	#loadingFromStores = new Set();
	#loadingStarted = 0;
	#loadingIndicatorConfig;

	#changeEventListeners;
	#clickEventListeners;
	#clickEventListenersAdded = false;

	#subscribedStores = [];

	#componentStore = {};

  #templateDomNode;
	#templateItem;

	//HTML before loading animiation.
	#htmlBeforeLoading;

	#lightDomHTML = "<p>Use light DOM or render() method to show HTML</p>";

	#selectorCache = new Map();

	static #templateCount = 0;

	#changeTemplateEvents = {};
	#clickTemplateEvents = {};

	#changeTemplateItemHandlers = {};
	#clickTemplateItemHandlers = {};

  #loadingAnimationStart;

	static clickHandlerCount = 0;
	static changeHandlerCount = 0;

	/**
	 * @param dataStoreSubscriptions - An array of data stores the component should
	 * subscribe to.
	 * indicator.
	 **/
	constructor(dataStoreSubscriptions = [], loadingIndicatorConfig) {
		super();


		//Light DOM is enabled.
		if(this.innerHTML){
			this.#lightDomHTML = this.innerHTML;
		}

		//Performance optimization if component is not subscribed to data stores.
		if(dataStoreSubscriptions.length === 0) {
			return;
		}

		// Make sure component is subscribed to data stores.	
		this.#subscribedStores = dataStoreSubscriptions;

		for(let i=0;i <this.#subscribedStores.length;i++){
			this.#subscribedStores[i].dataStore.subscribeComponent(this);
		}

		this.updateFromSubscribedStores();
	}

  startLoadingIndicator(){
    this.#lightDomHTML = this.innerHTML;
    this.innerHTML = this.#loadingIndicatorConfig.generateLoadingIndicatorHtml();
    this.#loadingAnimationStart = Date.now();
  }

	connectedCallback(){
		const defaultStore = this.dataset["store"];

		if(defaultStore){

			const loadingIndicatorComponent = this.dataset['loadingIndicator']
				if(loadingIndicatorComponent){

					const imagePath = this.dataset['loadingImage'];				
					const loadingHTML = `
            <${loadingIndicatorComponent}
						  ${imagePath ? `image-path=${imagePath}` : ``}	
            >
					  </${loadingIndicatorComponent}>`;

					this.#loadingIndicatorConfig = {
            generateLoadingIndicatorHtml: ()=>{
						  return loadingHTML
						},
            minTimeMs: 500
					}
          this.startLoadingIndicator();
				}

			const dataStore = DataStore.getStore(defaultStore);
			this.#subscribedStores = [{
				"dataStore":DataStore.getStore(defaultStore)
			}];
			dataStore.subscribeComponent(this);	
		}

		this.updateFromSubscribedStores();
    if(this.querySelector("[data-template]")){
      this.#setupTemplate()
    }
	}

	init(initialState){
		this.updateData(initialState);
	}

	setClickEvents(events){
		this.#clickTemplateEvents = events;
	}

	setChangeEvents(events) {
		this.#changeTemplateEvents = events;
	}

	#generateSignal(params){

		const {
			fieldName,
				attr,
				isOuter,
				signalId,
				signalPath
		} = params.signalConfig

		const{ 
			signalData,
				elementRoot
		} = params.updateData;

		let element = elementRoot;

		if(!isOuter){       
			const cacheId = `${elementRoot.data_id}-${signalId}`;

			if(!(this.#selectorCache.has(cacheId))){
				element=element.querySelector(signalPath);
				this.#selectorCache.set(cacheId,element);
			} else {
				element = this.#selectorCache.get(cacheId);
			}
		}
  
    if (attr === "textcontent"){
			element.textContent = signalData[fieldName];
		}
		if (attr==="innerHTML"){
			element.innerHTML = signalData[fieldName];
		}  else {
			element.setAttribute(attr,`${signalData[fieldName]}`);
		}
	}

	addChangeEventListeners(eventListeners){
		this.#changeEventListeners = eventListeners;
	}


	/**
	 * Shows custom loading indicator if it exists. This custom loading indicator
	 * replaces UI components and disables any user events.
	 **/
	lockComponent(dataStore){

		if(!this.#loadingFromStores.has(dataStore)){
			this.#loadingFromStores.add(dataStore);
		}

    // Deprecated. This is included for backwards compatibility.
		if(this.#loadingStarted === 0){
			this.#loadingStarted = Date.now();
		}

		if(this.#loadingIndicatorConfig && !this.#loadingAnimationStart){ 

      //Deprecated.
			this.#htmlBeforeLoading = this.innerHTML;
      
      this.#lightDomHTML = this.innerHTML;
      //this.startLoadingIndicator();
			this.innerHTML = this.#loadingIndicatorConfig.generateLoadingIndicatorHtml();
      this.#loadingAnimationStart = Date.now();

		}
	}

	unlockComponent(dataStore) {
		this.#loadingFromStores.delete(dataStore);
	}

	/**
	 * Unsubscribe component when it is removed from the UI.
	 **/
	disconnectedCallback(){

		for(let i = 0; i < this.#subscribedStores.length; i++){
			this.#subscribedStores[i].dataStore.unsubscribeComponent(this);
		}
	}

	/**
	 * Update component with state data
	 **/
	updateData(storeUpdates) {
		if (storeUpdates) {
			this.#componentIsRendering = true;
			this.#componentStore = {...this.#componentStore,...storeUpdates};
			this.#generateAndSaveHTML(this.#componentStore);
			this.#componentIsRendering = false;
		}
	}

	updateFromSubscribedStores() {

    let allSubscribedStoresHaveData = true;
    for(let i = 0; i < this.#subscribedStores.length; i++){
      allSubscribedStoresHaveData = 
        allSubscribedStoresHaveData &&
        (this.#subscribedStores[i].dataStore.hasLatestData());
    }

    // Make sure a component state is updated only when all the subscribed
    // stores have data 
    if(allSubscribedStoresHaveData){

      let dataToUpdate = {};
      for(let i =0; i < this.#subscribedStores.length; i++){

        const item = this.#subscribedStores[i];
        let storeData = item.dataStore.getComponentUpdateData();

        if(item.componentReducer){
          storeData = item.componentReducer(storeData);
        }

        if(item.fieldName) {
          dataToUpdate[item.fieldName] = storeData;
        } else {
          dataToUpdate = storeData;
        }
      }
        this.updateData(
           dataToUpdate,
        );
      }
	}

	render(){
		return this.#lightDomHTML;
	}

	updateSingleItem(data){
    if(!this.#templateItem){
      this.#setupTemplate();
    }
		this.#updateSingleItemTemplate(data);  
	}

	#updateSingleItemTemplate(state){

    const node = this.#templateItem.getFirstNode();
    const templateNode = this.#templateItem.getTemplateNode();

    if(!node){
    
      const addNode = templateNode.cloneNode(true);
      const iter = this.#templateItem.getAllSignals();
      while(true){

        const signalConfig = iter.next().value;

        if(!signalConfig){
          break;
        }

        if(state[signalConfig.fieldName] === undefined){
          console.error(
            `No state defined for template field ${signalConfig.fieldName}`)
        }
        this.#generateSignal({
          signalConfig:signalConfig,
          updateData:{
            "signalData":state,
            "elementRoot":addNode,
          }
        });
      }
      //TODO: Refactor. Having addNode and appendNode can
      // be confusing.
      this.#templateItem.addNode(0, addNode);
      this.#templateItem.setSingleNode(addNode);
    } else {
      
      const iter = this.#templateItem.getAllSignals();
      while(true){

        const signalConfig = iter.next().value;

        if(!signalConfig){
          break;
        }

        if(state[signalConfig.fieldName]){
          this.#generateSignal({
            signalConfig:signalConfig,
            updateData:{
              "signalData":state,
              "elementRoot":addNode,
            }
          });
        }
      }

      console.error("Logic for updates not implemented");
    }
  }


	#setupTemplate(){
		let templateNode = this.querySelector("[data-template]");

		//Component does not have a temnplate 
		if(!templateNode){
			return;
		} 

    templateNode.style.visibility = "initial";

		let templateHTML = templateNode.innerHTML;
	  
    templateNode.innerHTML = "";
    this.#templateItem = new TemplateItem(templateHTML); 

		templateNode.innerHTML = ""; this.#templateItem.setTemplateRoot(templateNode);
		this.#templateItem.setDataField(templateNode?.getAttributeNode("data-template").value);
		this.#templateItem.setId(`template-${PresentationComponent.#templateCount}`);
		this.#templateItem.setTemplateName(this.nodeName);
		
		this.#templateItem.setupClickEventHandlers(this.#clickTemplateEvents);
		this.#templateItem.setupChangeEventHandlers(this.#changeTemplateEvents);
	}

  async #completeLoadAnimation() {
    if(!this.#loadingIndicatorConfig){
      return;
    }
    const minTime = this.#loadingIndicatorConfig.minTimeMs;
    const remainTime = (Date.now() - this.#loadingAnimationStart);

    const promise = new Promise((resolve, reject)=>{
      setTimeout(()=>{
        resolve();
      },remainTime);
    });


    await Promise.resolve(promise);
    this.innerHTML = this.#lightDomHTML;
    this.#loadingAnimationStart = null;
  }

	async addItems(addFragments){

    if(this.#loadingAnimationStart){
      await this.#completeLoadAnimation();
    }
    if(!this.#templateItem){ 
      this.#setupTemplate()
    }

    const templateNode = this.#templateItem.getTemplateNode();

    for(let j=0;j<addFragments.length;j++){

      const {insertBefore,insertData} = addFragments[j];
      let addFragment = document.createDocumentFragment();

      for(let k=0;k<insertData.length;k++){
       
        const addNode = templateNode.cloneNode(true);          
        const iter = this.#templateItem.getAllSignals();

        addNode.data_id = insertData[k].id;
        this.#templateItem.addNode(insertData[k].id,addNode);

        while(true){

          const signalConfig = iter.next().value;

          if(!signalConfig){
            break;
          }

          this.#generateSignal({
            signalConfig:signalConfig,
            updateData:{
              "signalData":insertData[k],
              "elementRoot":addNode,
            }
          })
        }
        addFragment.appendChild(addNode);
      }

      if(insertBefore !== -1){
        const lastNode = this.#templateItem.getNode(insertBefore);
        lastNode.parentNode.insertBefore(addFragment, lastNode);
      } else {
        this.#templateItem.appendChild(addFragment); 
      }
    }
  }

  removeItems(removeData,isReplace,isClear){
    if(this.#loadingAnimationStart !== null){
      this.#completeLoadAnimation();
    }
    if(isClear && !isReplace){
      this.#templateItem.clearNodes();
    }
    else {
      removeData.forEach((id)=>{ 
        this.#templateItem.removeChild(id);
      });
    }

    setTimeout(()=>{

      if(isClear){
        this.#selectorCache.clear();
      } else{ 
        for(const [key,value] of this.#selectorCache){
          const nodeId = key.split("-")[0];
          if(removeData.has(parseInt(nodeId))){
            this.#selectorCache.delete(key);
          }
        }
      }
    },0); 
  }

  swapUpdates(swapUpdates){
    for(let m=0; m<swapUpdates.length; m++){

      const {moveNodeId,moveBeforeId} = swapUpdates[m]
        const nodeToMove = this.#templateItem.getNode(moveNodeId); 

      if(moveBeforeId !== null){

        const moveBefore = this.#templateItem.getNode(moveBeforeId);
        moveBefore
          .parentNode
          .insertBefore(nodeToMove,moveBefore);
      } else { 
        nodeToMove.parentNode.appendChild(nodeToMove);
      }  
    }
  }

  async updateVisible(data){
    if(!this.#templateItem){
      this.#completeLoadAnimation()
      return;
    }
    if(this.#loadingAnimationStart !== null){
      this.#completeLoadAnimation();
    }


    const updates = data[this.#templateItem.dataField] || [];
    for(let i=0;i<updates.length;i++){

      let attrName,attrValue,id;

      Object.keys(updates[i]).forEach((key)=>{
        if(key === "id"){
          id = updates[i][key];
        } else {
          attrName = key;
          attrValue = updates[i][key];
        }
      });

      if(id){

        const updateConfig = { 
          signalConfig: this.#templateItem.getSignalByFieldName(attrName),
          updateData: {
            "signalData":{[attrName]:attrValue},
            "elementRoot": this.#templateItem.getNode(id)
          }
        }

        this.#generateSignal(updateConfig);
      } 
    }
  }

  #generateAndSaveHTML(data) {

    if(this.#loadingStarted > 0){

      const current = Date.now();
      const loadTime = current - this.#loadingStarted;

      this.#loadingStarted = 0;

      //Handle case where loading indicator is configured to stay visible for
      //a minimum amount of time.
      if(this.#loadingIndicatorConfig?.minTimeMs){
        const remainingTime = this.#loadingIndicatorConfig.minTimeMs - loadTime;

        const self = this;
        if(remainingTime > 0){
          setTimeout(()=>{ 
              this.innerHTML = this.render(data);
              },remainingTime);
        } else {
          this.innerHTML = this.render(data);
        }
      } else {
        this.innerHTML = this.render(data);
      }
    }
    else {
      this.innerHTML =  this.render(data);
    }
    this.#setupTemplate();
  } 
}

class ShadowDOMComponent extends HTMLElement {
	connectedCallback() {
		this.attachShadow({ mode: "open" });

		this.shadowRoot;
		const template = document.createElement("template");

		template.innerHTML = this.getTemplateStyle() + `<div></div>`;
		this.shadowRoot.appendChild(template.content.cloneNode(true));
		this.shadowRoot.querySelector("div").innerHTML = this.render(); 
	}
}

/**
 * Class to define a custom data store load action with direct control over any async calls that are made.
 * It is intended for use when additional processing needs to be done after an async call, or if a store needs
 * to combine data from multiple sources.
 */
class CustomLoadSignal {
	constructor(loadFunction) {
		this.fetch = async (params) => {
			return await loadFunction(params);
		};
	}
}

/**
 * Class to determine a custom load action that includes a dependenccy on other stores
 **/
class DataStoreSignal {
	constructor(stores) {

		//TODO: Make the store also subscribe to updates
		//from the dependent stores.
		this.fetch = async (params) => {

			const promises = [];
			stores.forEach((storeConfig)=>{
			
        const storeFetch = new Promise((resolve,reject)=>{
    
          storeConfig.store.fetchData().then(()=>{
            const data = storeConfig.store.getStoreData();
            const resolveState = {
              [storeConfig.fieldName]:data
            }
            resolve(resolveState);
          });
        });

				promises.push(storeFetch);
			});

			const data = await Promise.all(promises);
      const result = {};
     
      for(let i=0; i < data.length; i++){
        Object.assign(result,data[i]);
      }
      
			return result;
		};
	}
}

class DataStore {

	static #storeCount = 0;
	static #storeNameMap = new Map();

	#componentSubscriptions = [];
	#fieldTypeMapping = {};
	#isLoading = false; 
	#loadAction;

	#presentationUpdates = {};
	#presentationSignals = {};	
	#prevOrdering = {};
	#reactiveFieldNames = [];
	#requestStoreId;
	#storeData = null;

	constructor(loadAction, storeName) {
		this.#componentSubscriptions = [];
		this.#requestStoreId = `store-${DataStore.#storeCount}`;

		sessionStorage.setItem(this.#requestStoreId, JSON.stringify({}));

		if(storeName){
			if(DataStore.#storeNameMap.has(storeName)){
				throw new Error("Cannot create store with duplicate name:"+storeName);
			}
			DataStore.#storeNameMap.set(storeName, this);
		}

		this.#loadAction = loadAction;

		DataStore.#storeCount++;

		this.#presentationUpdates["removed"] = []
		this.#presentationUpdates["moved"] = []
		this.#presentationUpdates["updated"] = []
	}

	static getStore(storeName){
		return this.#storeNameMap.get(storeName);
	}

  static createWithApiLoadSignal(
    {presentationSignals, queryConfig, storeName}){
    let store = new DataStore(
      new ApiLoadAction(queryConfig),
      storeName);
    if(presentationSignals) {
      store.setupPresentationSignals(presentationSignals)
    }

    return store
  }

  static createWithDataStoreSignals({
    presentationSignals,storeSignals, storeName}){
   
    if(!storeSignals){
      throw new Error("storeSignals is undefined");
    }

    let store = new DataStore(new DataStoreSignal(storeSignals),storeName);

    if(presentationSignals) {
      store.setupPresentationSignals(presentationSignals)
    }
    return store;
  }

  static createWithCustomLoadSignal(loadAction,storeName){
    return new DataStore(new CustomLoadSignal(loadAction),storeName);
  }

	/**
	 * Setup signals to enable fine-grained reactivity on
	 * presentation components.
	 */
  setupPresentationSignals(presentationSignals){

		this.#presentationSignals = presentationSignals;

    let isArray = false;
		Object.keys(presentationSignals).forEach((key)=>{
			this.#prevOrdering[key]=[];
      if(key !== "update"){
        isArray = true;
      }
		});

    let topLevelUpdateFields;
    if(presentationSignals.update){
      topLevelUpdateFields = Object.keys(presentationSignals.update);
    }
    
    const singleItemUpdate = (storeUpdates) =>{
      if(!this.#storeData){
        this.#storeData = {};
      }
      
      let renderUpdates = {}
      
      for(let i =0; i<topLevelUpdateFields.length;i++){
        const fieldName = topLevelUpdateFields[i];
        const updateData 
          = this.#presentationSignals.update[fieldName](storeUpdates);

        if(updateData !== this.#storeData[fieldName]){
          renderUpdates[fieldName] = updateData;
        }
      }

      if(Object.keys(storeUpdates).length > 0) {
        for(let i = 0; i < this.#componentSubscriptions.length; i++){
          this.#componentSubscriptions[i].updateSingleItem(
            renderUpdates
          );
        }	  
      }
      this.#storeData = storeUpdates;
    }

		const signalUpdates = (storeUpdates)=> {

      if(!isArray){ 
        singleItemUpdate(storeUpdates);
        return;
      }

			let changeData = new Map();

			this.#presentationUpdates["removed"] = []
			this.#presentationUpdates["moved"] = []
			this.#presentationUpdates["updated"] = []
      this.#presentationUpdates["isClear"] = false
			Object.keys(storeUpdates).forEach((field)=>{

				if(Array.isArray(storeUpdates[field])){
					//Assign id value to items.
					if(this.#presentationSignals[field]?.id){
						for(let j =0;j<storeUpdates[field].length;j++){
							storeUpdates[field][j].id =
							this.#presentationSignals[field].id(storeUpdates[field][j])
						}
					}

          this.#fieldTypeMapping[field] = "array";

          const dataItem = storeUpdates[field]; 
          const dataItemOld = this.#prevOrdering[field] ||[];

          const updatedOrdering = [];

          const prevIds = new Set();
          const newIds = new Set();

          this.#presentationUpdates["removed"] = new Set(dataItemOld);        
          let sameLocs = true;
          for(let num=0;num<Math.max(dataItem.length,dataItemOld.length);num++){
            if(num<dataItem.length){
              updatedOrdering.push(dataItem[num].id);
              newIds.add(dataItem[num].id);
              this.#presentationUpdates["removed"].delete(dataItem[num].id);
            }
            if(num < dataItemOld.length){
              prevIds.add(dataItemOld[num]);
            }
            if(!dataItem[num] || dataItem[num].id !==dataItemOld[num]){
              sameLocs = false; 
            }
          }

          let isReplace = false;
          let added = new Set();

          if(!sameLocs) {
            if(prevIds.size === 0){
              added = newIds;
            } else {
              added = sameLocs ? new Set(): newIds.difference(prevIds);
            }
          }

          if(added.size > 0){

            let addFragments = [];
            let addFragment = null;
            
            const addSignals = this.#presentationSignals[field].update;
            const addSignalKeys = Object.keys(addSignals);
            for(let num=0; num < updatedOrdering.length; num++){
              const id = updatedOrdering[num];

              for(let key =0; key<addSignalKeys.length;key++){
                const signalField = addSignalKeys[key];
                const signal = addSignals[signalField];
                if((typeof signal) === "function"){
                  dataItem[num][signalField] = signal(dataItem[num]);	
                }
              }
              if(added.has(id)){

                if(addFragment === null){
                  addFragment = [];
                }
                addFragment.push(dataItem[num]);
              } else {

                if(addFragment !== null){
                  addFragments.push({
                    "insertBefore":dataItem[num].id,
                    "insertData":addFragment
                  })
                  addFragment = null;
                }
              }
            }
            if(addFragment !== null){
              addFragments.push({
                "insertBefore": -1,
                "insertData":addFragment, 
              })
              isReplace = true;
            } 
            this.#prevOrdering[field]=updatedOrdering;

            for(let i = 0; i < this.#componentSubscriptions.length; i++){
              this.#componentSubscriptions[i].addItems(addFragments);
            }

          }

          this.#presentationUpdates["moved"] = [];

          if(!updatedOrdering || updatedOrdering.length === 0){
            this.#presentationUpdates["isClear"] = true;
          }

					if(this.#presentationUpdates["removed"].size > 0){

            let updatedPrev = [];
            
            for(let a=0;a<this.#storeData[field].length;a++){
              const item = this.#storeData[field][a];
              if(!this.#presentationUpdates["removed"].has(item.id)){
                updatedPrev.push(item);
              }
            }

            this.#storeData[field] = updatedPrev;
            this.#prevOrdering[field]=updatedOrdering;
            for(let i = 0; i < this.#componentSubscriptions.length; i++){
              this.#componentSubscriptions[i].removeItems(
                  this.#presentationUpdates["removed"],
                  isReplace,
                  this.#presentationUpdates["isClear"]);
            }
          }

          const movedNodes = {}
          let sameNumber = false;
          if(!isReplace && updatedOrdering.length === this.#prevOrdering[field].length){
            sameNumber = true;

            const swapUpdates = [];
            for(let num=0;num<updatedOrdering.length;num++){

              if(updatedOrdering[num] !== this.#prevOrdering[field][num]){


                let insertBefore = null;
                if (num < updatedOrdering.length -1){
                  insertBefore = updatedOrdering[num+1];
                }

                this.#presentationUpdates["moved"].push({
                  moveNodeId:updatedOrdering[num],
                  moveBeforeId:insertBefore
                });

                for(let a =0;a<this.#storeData[field].length;a++){
                  const item = this.#storeData[field][a];

                  if(a+1===updatedOrdering[num]){

                    if(!(updatedOrdering[num]===insertBefore-1)){
                      swapUpdates.push({
                      "updateIndex":num,
                      "updateData":item
                      })
                    }

              }
            }              
          }
        }

        for(let a = 0; a < this.#componentSubscriptions.length; a++){
          this.#componentSubscriptions[a].swapUpdates(this.#presentationUpdates["moved"]);
        }
        for(let a=swapUpdates.length-1;a>=0;a--){
          const swapItem = swapUpdates[a];
          this.#storeData[field][swapItem.updateIndex]=swapItem.updateData;
        } 
        this.#prevOrdering[field] = updatedOrdering;
      }
      if(sameNumber){

        const arrayChanges = [];
        const reactiveFields = this.#presentationSignals[field]["update"];

        for(let i=0;i<storeUpdates[field].length;i++){

          let oldStateRow = this.#storeData[field][i];

          let hasChanged = false;
          for(let j=0;j<reactiveFields.length;j++){
            const reactiveName = reactiveFields[j];

            const oldState = oldStateRow[reactiveName];
            const newState = storeUpdates[field][i][reactiveName];
            if(oldState !== newState){  
              hasChanged = true;
            }
          }

            if(hasChanged){
              arrayChanges.push(storeUpdates[field][i]);   
            }
          }
          changeData.set(field,arrayChanges);
        }
      } else {
        this.#fieldTypeMapping[field] = "item";
        changeData[field] = storeUpdates[field];
      }			
    });


      this.#presentationUpdates["fieldTypeMapping"] = this.#fieldTypeMapping


     if(this.#storeData === null){
        this.#storeData = {};
      }
      //Look at storeUpdates if changeData is empty
      if(changeData.size === 0){
        changeData = new Map();
        Object.keys(storeUpdates).forEach((key)=>{
          if(!Array.isArray(storeUpdates[key])){
            changeData.set(key,storeUpdates[key]); 
          }
        });
      }
      if(changeData.size > 0) {

        this.#presentationUpdates["updates"] = this.#generatePresentationUpdates(changeData);
        for(let i = 0; i < this.#componentSubscriptions.length; i++){
          this.#componentSubscriptions[i].updateVisible(
            this.#presentationUpdates["updates"]
          );
        } 
      }

      Object.keys(storeUpdates).forEach((field)=>{
       
        this.#storeData[field] = storeUpdates[field]
      }); 
		}
		this.updateStoreData = signalUpdates;
	} 

  #generatePresentationUpdates(updates){

		const presentationUpdates = {}; 

		const keys = Object.keys(this.#presentationSignals);
		for(let i=0;i<keys.length;i++){

			const key = keys[i];

			const presentationField 
				= this.#presentationSignals[key]["presentationField"] || key;

			const dataToUpdate = this.#storeData[presentationField];

			if(Array.isArray(dataToUpdate)){ 
				presentationUpdates[presentationField] = {};
			} else {
				presentationUpdates[presentationField] = "";
			}
		}

		const signalKeys = Object.keys(this.#presentationSignals);
		for(let i=0; i<signalKeys.length;i++){

			const stateField = signalKeys[i]; 
			const {update,presentationField} = this.#presentationSignals[stateField];

			if(!updates.get(stateField)){
				continue;
			}
			if(!Array.isArray(update)){

				let changeData;

				if((typeof update)=== "function"){
          //TODO: Add check if state field is array.
					changeData = update({
            "prevState":this.#storeData[stateField],
            "newState": updates.get(stateField)
          });
				} else {
					changeData = {param: updates.get(stateField)}
				}

				const dataToUpdate = this.#storeData[presentationField];

				if(Array.isArray(dataToUpdate)){
					for(let j=0;j<changeData.length;j++){
						const id = changeData[j].id;
						const updateVal = changeData[j].param;
						if(!presentationUpdates[presentationField][id]){
							presentationUpdates[presentationField][id] = {}; 
						}
						presentationUpdates[presentationField][id][presentationField] = updateVal;
					}
					presentationUpdates[presentationField] = changeData;
				} 
				else {
					presentationUpdates[presentationField] = changeData["param"];
				}
			} else {
				let changeData = [];
				for(let i=0;i<updates.get(stateField).length;i++){

					const updateData = updates.get(stateField)[i];
					const id = updateData.id;          
					const reactiveFields = this.#presentationSignals[stateField]["update"];

					if(Array.isArray(reactiveFields)){ 
						for(let j=0;j<reactiveFields.length;j++){
							changeData.push({
							  "id":id,
								[reactiveFields[j]]:updateData[`${reactiveFields}`]
							});
						}
					}else {
						Object.keys(reactiveFields).forEach((fieldName)=>{
								changeData.push({
										"id": id,
										[fieldName]:reactiveFields[fieldName](updateData[`${reactiveFields[fieldName]}`]),

										})
								})
					}
				}
				presentationUpdates[stateField] = changeData;
			}
		}
    
		return presentationUpdates;
	}

	/** * Returns store data.
	 * @returns A JSON object representing store data.
	 */
	getStoreData() {  
		return this.#storeData; 
	}

  getComponentUpdateData(){
    if(Object.keys(this.#presentationSignals).length > 0){
      return this.#presentationUpdates;
    }
    
    return this.#storeData;
  }

	/**
	 * @returns {boolean} false if the data in the store is null or undefined and is not in a loading state true otherwise.
	 */
	hasLatestData() {
		return this.#storeData !== null && this.#storeData !== undefined  && !this.#isLoading;
	}

	/**
	 * Update data in the store and trigger a render of components subscribed to the store.
	 * @param storeUpdates Updated store data. Fields not specified in storeData will not be updated.
	 */
	updateStoreData(storeUpdates){ 
   
    this.#storeData = storeUpdates;
		for(let i = 0; i < this.#componentSubscriptions.length; i++){
			this.#componentSubscriptions[i].updateFromSubscribedStores();
		}  
	}

	getSubscribedComponents(){
		return this.#componentSubscriptions;
	}

	/**
	 * Retrieves data from an external source.
	 * @param params Parameters for the request.
	 * @param dataStore Optional data store that will be subscribed to updates from this store.
	 */
	async fetchData(params = {}, dataStore){

		// Do not make a data request if there is an active one in progress. The active one will push data to subscribed components.
		if(!this.#isLoading) {
			this.#isLoading = true;
			const requestConfig = this.#loadAction.getRequestConfig ? this.#loadAction.getRequestConfig(params) : {};

			let response = null;
			let requestKey = null;

			// Retrieve cached response if one exists.
			if(this.#requestStoreId || this.#requestStoreId.length > 0){
				requestKey = `${requestConfig.method ?? ''}_${requestConfig.url}_${JSON.stringify(requestConfig.body) ?? ''}`;

				const dataStr = sessionStorage.getItem(requestKey);
				if(dataStr){
					const data = JSON.parse(dataStr);

					if(!(Object.keys(data).length === 0) && requestData in data){
						response = data[requestData];
					}
				}
			}

			// Make an API call if a cached response does not exist.
			if(response === null) {
				//Replace component with loading indicator if one exists.
				for (let i = 0; i < this.#componentSubscriptions.length; i++) {
					this.#componentSubscriptions[i].lockComponent(this);
				}
				if (dataStore) {
					const dataStoreSubscribedComponents = dataStore.getSubscribedComponents();
					for (let i = 0; i < dataStoreSubscribedComponents.length; i++) {
						dataStoreSubscribedComponents[i].lockComponent(dataStore);
					}
				}
				response = await this.#loadAction.fetch(params, this.#requestStoreId,requestKey); 
			} 
	
      this.updateStoreData(response);

			this.#isLoading = false;

      //Should only run if presentation signals are being used.
      if(Object.keys(this.#presentationSignals).length === 0) {
        for(let i = 0; i < this.#componentSubscriptions.length; i++){
          this.#componentSubscriptions[i].unlockComponent(this);
          this.#componentSubscriptions[i].updateFromSubscribedStores();
        }
      }

			if(dataStore){
				const dataStoreSubscribedComponents = dataStore.getSubscribedComponents();
				for(let i = 0; i < dataStoreSubscribedComponents.length; i++){
					dataStoreSubscribedComponents[i].unlockComponent(dataStore);
				}
				dataStore.updateStoreData(response);
			}
			return response;
		}
	}

	unsubscribeComponent(component){
		this.#componentSubscriptions.splice(this.#componentSubscriptions.indexOf(component), 1);
	}

	subscribeComponent(component){

		let i = 0;
		while(i < this.#componentSubscriptions.length){
			if(this.#componentSubscriptions[i] === component){
				this.#componentSubscriptions = this.#componentSubscriptions.splice(i, 1);
				break;
			}
			i++;
		}
		this.#componentSubscriptions.push(component);

	}
}

export { ApiLoadAction, CustomLoadSignal, PresentationComponent, ShadowDOMComponent, StaticComponent, DataStore};
