// dom ready 
bui.ready(function(global){
    
    // build data
    let ID = 1
    function _random(max) {
    return Math.round(Math.random() * 1000) % max
    }

    function buildData(count = 1000) {
        const adjectives = [ 'pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive', 'fancy' ]
        const colours = [ 'red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange' ]
        const nouns = [ 'table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse', 'keyboard' ];

        const data = [];

        for (let i = 0; i < count; i++){
            data.push({
            id: ID++,
            label:
                adjectives[_random(adjectives.length)] +
                ' ' +
                colours[_random(colours.length)] +
                ' ' +
                nouns[_random(nouns.length)]
            })
        }
        
        return data
    }

    // page status manager store
    var bs = bui.store({
        el: `#home`,
        scope: "home",
        data: {
           rows:[],
        },
        methods: {
            add() {
                let data = buildData(1000);
                let alldata = this.$data.rows.concat(data);
                this.rows = alldata;
            },
            update() {
                let rows = this.$data.rows;
                
                for (let i = 0; i < rows.length; i += 10) {
                    let item = rows[i];
                        item.label += ' !!!';

                    this.rows.splice(i,1,item);
                }
            },

            remove(id) {
                const index = this.rows.findIndex(x => x.id == id)
                this.rows.splice(index, 1)
            },
            select(ref) {
                // use jquery remove class will faster than use status change.
                // ref: click this dom
                $(".danger").removeClass('danger');
                $(ref).parents('tr').addClass('danger');
            },
            run() {
                let data = buildData(1000);
                this.rows = data;
            },
            runLots() {
                let data = buildData(10000);
                this.rows = data;
            },
            clear() {
                this.rows = [];
            },
            swap() {
                if (this.rows.length > 998) {
                    const a = this.$data.rows[1];
                    let b = this.$data.rows[998];
                    this.rows.splice(1,1,b);
                    this.rows.splice(998,1,a);
                }
            }
        },
        watch: {},
        computed: {},
        templates: {
            tplRows(data){
                let fragment = document.createDocumentFragment();

                data.forEach((item,index)=>{
                    let tr = document.createElement('tr');

                    tr.innerHTML = `<td class="col-md-1">${item.id}</td>
                    <td class="col-md-4">
                        <a b-click="home.select($this)">${item.label}</a>
                    </td>
                    <td class="col-md-1">
                        <a b-click="home.remove('${item.id}')">
                        <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                        </a>
                    </td>
                    <td class="col-md-6"></td>`

                    fragment.appendChild(tr);
                })
                
                return fragment;
            }

        },
        beforeMount: function(){
            // example: init value, in beforeMount need $data
            // this.$data.rows = []
        },
        mounted: function(){
            // example: chane value, in mounted don't need $data
            // this.rows = [];
        }
    })


});