'use strict';
(function ($) {
       /* convenience utility functions */
       var get = (name) => {
	 return document.getElementById(name);
       }

       /* helper for vtext creation */
       var vtext = (txt) => {
	   return {
            'type': 'vtext',
            'text': txt
          };
       }

       /* helper for vtext creation */
       var m = (tag, obj) => {
         return {
           type: 'vnode',
           tag: tag,
           children : obj.children === undefined ? [] : obj.children,
           props: obj.props === undefined ? {} : obj.props,
           ns: 'HTML',
      	   events : obj.events === undefined ? {} : obj.events,
           domRef: null,
           onCreated: null,
           onDestroyed: null,
           onBeforeDestroyed: null,
           key: 'key' in obj ? obj['key'] : null
         };
       };

       /* current virtual DOM */
       var currentVTree = null;
       var root = null;

       var initDelegator = () => {
           const events = [['click'],['input']];
	   window.delegate (root, events, function (cb) { cb(currentVTree); });
       };

      var render = () => {
 	   var newTree = view ();
	   window['diff'](currentVTree, newTree, root, document);
	   currentVTree = newTree;
       };
       var eventAction = function (f) {
           return {
	       options : { preventDefault: false, stopPropagation: false  },
               runEvent : function (e) { f(e); render (); }
           };
       };
       var eventActionStop = function (f) {
           return {
	       options : { preventDefault: false, stopPropagation: true  },
               runEvent : function (e) { f(e); render (); }
           };
       };
       var viewJumbotron = function () {
	   return m( 'div', {
	       props : { 'class' : 'jumbotron' }
             , children : [
		 m ( 'div', {
		     props : { 'class' : 'row' }
	             , children : [
			 m ('div', {
			     props : { 'class' : 'col-md-6' }
			     , children : [
				 m ('h1', { children : [ vtext ('miso.js-1.1.0.0-keyed') ] })
			     ]
			 })
			 , btn ('Create 1,000 rows', 'run')
			 , btn ('Create 10,000 rows', 'runlots')
			 , btn ('Append 1,000 rows', 'add')
			 , btn ('Update every 10th row', 'update')
			 , btn ('Clear', 'clear')
			 , btn ('Swap Rows', 'swaprows')
		     ]
		 })
	     ]});
       }

      var createData = (count = 1000) => {
          var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
          var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
          var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
          var data = [];
          for (var i = 0; i < count; i++)
              data.push({id: model.lastId++, label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)] });
          return data;
      };

      var _random = (max) => Math.round(Math.random()*1000)%max;

      var dispatch = function (op, id) {
	  return function () {

	   if (op === 'swaprows') {
	       if (model.data.length > 998) {
		  var a = model.data[1];
		  model.data[1] = model.data[998];
		  model.data[998] = a;
               }
	   }

	   if (op === 'run') {
               model.data = createData();
               model.selected = null;
	   }

	   if (op === 'clear') {
               model.data = [];
               model.selected = null;
	   }

	   if (op === 'select') {
	       console.log(op,id,'<- select');
               model.selected = id;
	   }

	   if (op === 'runlots') {
               model.data = createData(10000);
               model.selected = null;
	   }

	   if (op === 'add') {
               model.data = model.data.concat(createData(1000));
               model.selected = null;
	   }

	   if (op === 'delete') {
               const idx = model.data.findIndex(d => d.id==id);
               model.data = model.data.filter((e,i) => i!=idx);
	   }

	   if (op === 'update') {
              for (let i = 0; i < model.data.length; i += 10)
	        model.data[i].label += ' !!!';
	   }
         }
       }

        var btn = (msg,op) =>
	   m('div', {
	       props : { 'class': 'col-sm-6 smallpad' },
	       children : [
		   m('button', {
		       props : { type : 'button', class : 'btn btn-primary btn-block'
			       , id : op
			       },
                       events : { click : eventAction(dispatch(op)) },
		       children : [ vtext (msg) ]
		   })
	       ]
	   });

       var viewTable = () => {
	   return m ('table', {
	       props : { class : 'table table-hover table-striped test-data' },
	       children :
  	         [ m ('tbody',
		      { props : { id : 'tbody' }
			, children : model.data.map (makeRow)
		      })
		 ]
           });
       }

      var makeRow = (x) => {
          return m('tr', {
              key : x.id,
	      events : { click : eventActionStop (dispatch('select', x.id)) },
	      props : { 'class' : x.id === model.selected ? 'danger' : '' },
	      children : [
		  m('td', {
		      props: { class : 'col-md-1' },
		      children:  [vtext(x.id)]
		  }),
		  m('td', {
		      props: { class : 'col-md-4' },
  		      children:
    		        [ m('a', {
			    props : { class: 'lbl' },
			    children: [ vtext(x.label) ]
		          })
			]
		  }),
		  m('td', {
		      props: { class : 'col-md-1' },
		      children:  [
			m('a', { props : { class : 'remove' }
          		       , events : { click : eventActionStop (dispatch('delete', x.id)) }
  			       , children : [ m('span', { props : { class : 'remove glyphicon glyphicon-remove', 'aria-hidden' : true }}) ]
			       }
		      )]
		  }),
		  m('td', {
		      props: { class : 'col-md-6' }
		  }),
	      ]});
      }

       var view = () =>
	   m ( 'div', {
	       props : {
		   class: 'container'
	       },
	       children : [ viewJumbotron(), viewTable() ]
	   });

       var validation = () => {
	   /* DOM element validation */
	   if (!root) {
	     console.info('no root object specified, using body');
   	     root = document.body;
	   }
	   return true;
       }

       /* initial model */
       var model = null;

       var init = function (config) {
	   /* fetch root object */
	   root = get(config.name);

 	   /* assign root object for convenience */
	   model = config;

	   /* validate data */
	   if (!validation()) return;

	   /* set defaults */
	   model.lastId = 1;
	   model.data = [];

	   /* initial draw */
	   render ();

	   /* initial delegator */
	   initDelegator ();
       }

	/* initializes table */
	$.startApp = (config) => { init (config); };

})(window);
