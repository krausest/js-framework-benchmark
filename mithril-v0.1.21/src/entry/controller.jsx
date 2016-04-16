/**
 * Created by stef on 17.11.15.
 */
'use strict';
/** @jsx m */

var m = require('mithril')
var Store = require('./store');

var startTime;
var lastMeasure;
var startMeasure = function(name) {
    startTime = performance.now();
    lastMeasure = name;
}
var stopMeasure = function() {
    var last = lastMeasure;
    if (lastMeasure) {
        window.setTimeout(function () {
            var stop = performance.now();
            var duration = 0;
            console.log(lastMeasure+" took "+(stop-startTime));
        }, 0);
    }
}

var Row = {
    controller: function(props) {
        return {
            click: function() {
                const id = props.id;
                props.onclick(id);
            },
            remove: function() {
                const id = props.id;
                props.onremove(id);
            },
        }
    },
    view: function(ctrl, props) {
        return (<tr key={props.id} className={props.styleClass}>
            <td class="col-md-1">{props.id}</td>
            <td class="col-md-4">
                <a onclick={ctrl.click}>{props.label}</a>
            </td>
            <td class="col-md-1"><a onclick={ctrl.remove}><span className="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>
            <td class="col-md-6"></td>
        </tr>);
    }
}

var Controller = {
    controller: function() {
        return {
            data: function() { return Store.data;},
            selected: function() { return Store.selected;},
            run: function() {
                startMeasure("run")
                Store.run();
            },
            add: function() {
                startMeasure("add")
                Store.add();
            },
            update: function() {
                startMeasure("update")
                Store.update();
            },
            select: function(id) {
                startMeasure("select");
                Store.select(id);
            },
            remove: function(id) {
                startMeasure("delete")
                Store.remove(id);
            },
            hideAll: function() {
                startMeasure("hideAll")
                Store.hideAll();
            },
            showAll: function() {
                startMeasure("showAll")
                Store.showAll();
            },
            runLots: function() {
                startMeasure("runLots")
                Store.runLots();
            },
            clear: function() {
                startMeasure("clear")
                Store.clear();
            },
            done: function() {
                stopMeasure();
            }
        }
    },

    view: function(ctrl) {
        var ret = [
        	m(
	            'div',
	            { className: 'container', config: ctrl.done },
	            [
	            m(
	                'div',
	                { 'class': 'jumbotron' },
	                m(
	                    'div',
	                    { 'class': 'row' },
	                    [
	                    m(
	                        'div',
	                        { 'class': 'col-md-8' },
	                        m(
	                            'h1',
	                            'Mithril v0.1.21'
	                        )
	                    ),
	                    m(
	                        'div',
	                        { 'class': 'col-md-4' },
	                        [
	                        m(
	                            'button',
	                            { type: 'button', 'class': 'btn btn-primary btn-block', id: 'add', onclick: ctrl.add },
	                            'Add 1000 rows'
	                        ),
	                        m(
	                            'button',
	                            { type: 'button', 'class': 'btn btn-primary btn-block', id: 'run', onclick: ctrl.run },
	                            'Create 1000 rows'
	                        ),
	                        m(
	                            'button',
	                            { type: 'button', 'class': 'btn btn-primary btn-block', id: 'update', onclick: ctrl.update },
	                            'Update every 10th row'
	                        ),
	                        m(
	                            'button',
	                            { type: 'button', 'class': 'btn btn-primary btn-block', id: 'hideall', onclick: ctrl.hideAll },
	                            'HideAll'
	                        ),
	                        m(
	                            'button',
	                            { type: 'button', 'class': 'btn btn-primary btn-block', id: 'showall', onclick: ctrl.showAll },
	                            'ShowAll'
	                        ),
	                        m(
	                            'button',
	                            { type: 'button', 'class': 'btn btn-primary btn-block', id: 'runlots', onclick: ctrl.runLots },
	                            'Create lots of rows'
	                        ),
	                        m(
	                            'button',
	                            { type: 'button', 'class': 'btn btn-primary btn-block', id: 'clear', onclick: ctrl.clear },
	                            'Clear'
	                        ),
	                        m(
	                            'h3',
	                            { id: 'duration' },
	                            m('span', { 'class': 'glyphicon glyphicon-remove', 'aria-hidden': 'true' }),
	                            ' '
	                        )
	                        ]
	                    )
	                    ]
	                )
	            ),
	            m(
	                'table',
	                { 'class': 'table table-hover table-striped test-data' },
	                m(
	                    'tbody',
	                    ctrl.data().map((props, index) => {
	                    	return m(
								'tr',
								{
									key: props.id,
									className: props.id === ctrl.selected() ? 'danger' : ''
								},
								[
								m(
									'td',
									{ 'class': 'col-md-1' },
									props.id
								),
								m(
									'td',
									{ 'class': 'col-md-4' },
									m(
										'a',
										{
											onclick: () => ctrl.select(props.id)
										},
										props.label
									)
								),
								m(
									'td',
									{ 'class': 'col-md-1' },
									m(
										'a',
										{
											onclick: () => ctrl.remove(props.id)
										},
										m('span', { className: 'glyphicon glyphicon-remove', 'aria-hidden': 'true' })
									)
								),
								m('td', { 'class': 'col-md-6' })
								]
							);
	                    })
	                )
	            )
	            ]
	        )
	    ];
        return ret;
    }
};

export default Controller;