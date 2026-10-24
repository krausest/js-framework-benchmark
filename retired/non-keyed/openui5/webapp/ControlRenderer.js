/*!
 * ${copyright}
 */

sap.ui.define([], function () {

    var ControlRenderer = {
      apiVersion: 4
    };

    ControlRenderer.render = function (oRM, oControl) {
        oRM.openStart("div", oControl)
        oRM.openEnd()

        this.renderJumbotron(oRM, oControl);
        this.renderTable(oRM, oControl);

        oRM.close("div")
    };

    ControlRenderer.renderJumbotron = function(oRM, oControl) {
        // <div class="jumbotron">
        oRM.openStart("div");
        oRM.class("jumbotron");
        oRM.openEnd();

            // <div class="row">
            oRM.openStart("div");
            oRM.class("row");
            oRM.openEnd();

                // <div class="col-md-6">
                oRM.openStart("div");
                oRM.class("col-md-6");
                oRM.openEnd();

                    // <h1>OpenUI5 non-keyed</h1>
                    oRM.openStart("h1");
                    oRM.openEnd();
                    oRM.text("OpenUI5 non-keyed");
                    oRM.close("h1");

                oRM.close("div");

                // <div class="col-md-6">
                oRM.openStart("div");
                oRM.class("col-md-6");
                oRM.openEnd();

                    oRM.openStart("div")
                    oRM.class("row");
                    oRM.openEnd();

                    // action buttons
                    [
                        {id: "run", text: "Create 1,000 rows"},
                        {id: "runlots", text: "Create 10,000 rows"},
                        {id: "add", text: "Append 1,000 rows"},
                        {id: "update", text: "Update every 10th row"},
                        {id: "clear", text: "Clear"},
                        {id: "swaprows", text: "Swap Rows"},
                    ].forEach(({id, text}) => this.renderButton(oRM, id, text))

                    oRM.close("div");
                oRM.close("div");

            oRM.close("div");

        oRM.close("div");
    }

    ControlRenderer.renderButton = function (oRM, id, text) {
        // <div class="col-sm-6 smallpad">
        oRM.openStart("div");
        oRM.class("col-sm-6").class("smallpad");
        oRM.openEnd();

            // <button type="button" class="btn btn-primary btn-block" id="run" @click={{run}}>
            oRM.openStart("button", id);
            oRM.class("btn").class("btn-primary").class("btn-block");
            oRM.openEnd();

                // Create 1,000 rows
                oRM.text(text);

            oRM.close("button");

        oRM.close("div");
    }

    ControlRenderer.renderTable = function (oRM, oControl) {
        const selected = oControl.getSelected()
        // <table class="table table-hover table-striped test-data" @click={{this.handleClick}}>
        oRM.openStart("table");
        oRM.class("table").class("table-hover").class("table-striped").class("test-data");
        oRM.openEnd();

            // <tbody>
            oRM.openStart("tbody");
            oRM.openEnd();
                //rows
                oControl.getRows().forEach(row => {
                    // <tr id={{this.id}} class={{this._class}}></tr>
                    // difference to keyed - no `id` per row
                    oRM.openStart("tr");
                    if (row.id === selected) {
                        oRM.class("danger");
                    }
                    oRM.openEnd()
                        // <td class="col-md-1">{{this.id}}</td>
                        oRM.openStart("td");
                        oRM.class("col-md-1")
                        oRM.openEnd()
                            oRM.text(row.id);
                        oRM.close("td")

                        // <<td class="col-md-4">
                        oRM.openStart("td");
                        oRM.class("col-md-4")
                        oRM.openEnd()
                            // <a data-action="select" data-id={{this.id}}>{{this.label}}</a>
                            oRM.openStart("a");
                            oRM.attr("data-action", "select");
                            oRM.attr("data-id", row.id);
                            oRM.openEnd()
                                oRM.text(row.label);
                            oRM.close("a")
                        oRM.close("td")

                        // <td class="col-md-1">
                        oRM.openStart("td");
                        oRM.class("col-md-1")
                        oRM.openEnd()
                            // <a>
                            oRM.openStart("a");
                            oRM.openEnd()
                                // <span class="glyphicon glyphicon-remove" aria-hidden="true" data-action="remove" data-id={{this.id}}></span>
                                oRM.openStart("span");
                                oRM.attr("data-action", "remove");
                                oRM.attr("data-id", row.id);
                                oRM.attr("aria-hidden", true);
                                oRM.class("glyphicon").class("glyphicon-remove")
                                oRM.openEnd()
                                // oRM.text("X")
                                oRM.close("span")

                            oRM.close("a")
                        oRM.close("td")

                        // <td class="col-md-6"></td>
                        oRM.openStart("td");
                        oRM.class("col-md-6")
                        oRM.openEnd()
                        oRM.close("td")
                    oRM.close("tr");
                })

            oRM.close("tbody");

        oRM.close("table");
    }

    return ControlRenderer;

}, /* bExport= */ true);
