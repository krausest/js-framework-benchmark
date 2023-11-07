sap.ui.define(["sap/ui/core/Control", "./ControlRenderer", "./Store"], (Control, ControlRenderer, Store) => {
    return Control.extend("ui5.benchmark.Control", {
        metadata: {
            properties: {
                text: { type: "string", defaultValue: "asdf" },
                rows: { type: "object[]", defaultValue: [] },
                selected: {type: "int", defaultValue: undefined}
            },
        },
        init() {
            this.store = new Store();
        },
        onclick(e) {
            switch (e.target?.id) {
                case "run":
                    this.run();
                    break;
                case "runlots":
                    this.runlots();
                    break;
                case "add":
                    this.add();
                    break;
                case "update":
                    this.update();
                    break;
                case "clear":
                    this.clear();
                    break;
                case "swaprows":
                    this.swaprows();
                    break;
            }

            const { action, id } = e.target.dataset;
            if (action && id) {
                this[action](id);
            }
        },
        run() {
            this.store.run()
            this.setRows(this.store.data);
        },
        runlots() {
            this.store.runlots();
            this.setRows(this.store.data);
        },
        add() {
            this.store.add();
            this.setRows(this.store.data);
        },
        update() {
            this.store.update();
            this.setRows(this.store.data);
            this.setText(`${Date.now()}`)
        },
        clear() {
            this.store.clear();
            this.setRows(this.store.data)
        },
        swaprows() {
            this.store.swaprows();
            this.setRows(this.store.data);
        },
        remove(id) {
            this.store.delete(parseInt(id));
            this.setRows(this.store.data);
        },
        select(id) {
            this.setSelected(parseInt(id));
        },
        renderer: ControlRenderer,
    })
})
