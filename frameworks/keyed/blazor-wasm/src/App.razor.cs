using System;
using System.Collections.Generic;
using System.Diagnostics;

namespace blazor_wasm
{
    public partial class App
    {
        string lastMeasure;
        Stopwatch Stopwatch;

        void StartMeasure(string name)
        {
            Stopwatch = Stopwatch.StartNew();
            lastMeasure = name;
        }

        void StopMeasure()
        {
            Stopwatch.Stop();
            var last = this.lastMeasure ?? "";
            if (!string.IsNullOrWhiteSpace(this.lastMeasure))
            {
                lastMeasure = string.Empty;
                Console.WriteLine($"{last} took {Stopwatch.ElapsedMilliseconds} ms");
                Stopwatch.Reset();
            }
        }

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
            StartMeasure("select");
            this.selected = item.Id;
        }

        void Delete(Data item)
        {
            StartMeasure("delete");
            this.data.Remove(item);
        }

        void Run()
        {
            StartMeasure("run");
            this.data = this.BuildData();
        }
        void Runlots()
        {
            StartMeasure("runlots");
            this.data = this.BuildData(10000);
        }
        void Add()
        {
            StartMeasure("add");
            this.data.AddRange(this.BuildData(1000));
        }
        void Update()
        {
            StartMeasure("update");
            for (var i = 0; i < this.data.Count; i += 10)
            {
                this.data[i].Label += " !!!";
            }
        }
        void Clear()
        {
            StartMeasure("clear");
            this.data = new List<Data>();
            this.selected = 0;
        }
        void SwapRows()
        {
            StartMeasure("swapRows");
            if (this.data.Count > 998)
            {
                var a = this.data[1];
                this.data[1] = this.data[998];
                this.data[998] = a;
            }
        }

        protected override void OnAfterRender(bool firstRender)
        {
            if (!firstRender)
            {
                this.StopMeasure();
            }
        }
    }
}
