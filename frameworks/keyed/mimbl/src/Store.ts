let adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
let colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
let nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

function _random( max: number)
{
    return Math.round(Math.random() * 1000) % max;
}

export type StoreItem = { id: number, label: string };

export class Store
{
    data: StoreItem[] = [];
    nextID = 1;

    buildData(count: number)
    {
        var data = new Array(count);
        for (var i = 0; i < count; i++)
            data[i] = {
                id: this.nextID++,
                label: `${adjectives[_random(adjectives.length)]} ${colours[_random(colours.length)]} ${nouns[_random(nouns.length)]}`
            };

            return data;
    }

    updateData( mod: number)
    {
        for (let i = 0; i < this.data.length; i += mod)
        	this.data[i].label += ' !!!';
    }

    delete( id: number)
    {
        let index = this.data.findIndex( d => d.id === id);
        this.data.splice( index, 1);
    }

    deleteByIndex( index: number)
    {
        this.data.splice( index, 1);
    }

    run()
    {
        this.data = this.buildData( 1000);
    }

    add( count: number)
    {
        var newData = this.buildData( count);
        this.data = this.data.concat(newData);
        return newData;
    }

    update( mod: number)
    {
        this.updateData( mod);
    }

    runLots()
    {
        this.data = this.buildData( 10000);
    }

    clear()
    {
        this.data = [];
    }

    swapRows( n: number, m: number)
    {
        if (this.data.length > n && this.data.length > m)
        {
    		var a = this.data[n];
    		this.data[n] = this.data[m];
    		this.data[m] = a;
    	}
    }
}