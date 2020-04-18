using System;
using System.Collections.Generic;
using System.Diagnostics;

namespace blazor_wasm
{
    public partial class App
    {
        List<Data> data = new List<Data>();
        int selected;
        int id = 1;
        Random random = new Random(0);

        string[] adjectives = new string[]
        {
            "pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"
        };

        string[] colours = new string[]
        {
            "red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"
        };

        string[] nouns = new string[]
        {
            "table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"
        };

        List<Data> BuildData(int count = 1000)
        {
            var result = new List<Data>();
            for (int i = 0; i < count; i++)
            {
                result.Add(new Data
                {
                    Id = this.id++,
                    Label = adjectives[this.random.Next(adjectives.Length)] + " " + colours[this.random.Next(colours.Length)] + " " + nouns[this.random.Next(nouns.Length)]
                });
            }

            return result;
        }

        public void Select(Data item)
        {
            this.selected = item.Id;
        }

        void Delete(Data item)
        {
            this.data.Remove(item);
        }

        void Run()
        {
            this.data = this.BuildData();
        }
        void Runlots()
        {
            this.data = this.BuildData(10000);
        }
        void Add()
        {
            this.data.AddRange(this.BuildData(1000));
        }
        void Update()
        {
            for (var i = 0; i < this.data.Count; i += 10)
            {
                this.data[i].Label += " !!!";
            }
        }
        void Clear()
        {
            this.data = new List<Data>();
            this.selected = 0;
        }
        void SwapRows()
        {
            if (this.data.Count > 998)
            {
                var a = this.data[1];
                this.data[1] = this.data[998];
                this.data[998] = a;
            }
        }
    }
}
