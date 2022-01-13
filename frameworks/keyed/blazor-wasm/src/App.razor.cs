namespace blazor_wasm
{
    public partial class App
    {
        public List<Data> Data { get; set; } = new();
        public int Selected { get; set; }

        private readonly string[] adjectives = new string[]
        {
            "pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"
        };
        
        private readonly string[] colours = new string[]
        {
            "red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"
        };
        
        private readonly string[] nouns = new string[]
        {
            "table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"
        };

        private int _rowId = 1;

        List<Data> BuildData(int count = 1000)
        {
            List<Data> result = new(count);
            for (int i = 0; i < count; i++)
            {
                Data data = new()
                {
                    Id = _rowId++,
                    Label = $"{adjectives[Random.Shared.Next(adjectives.Length)]} {colours[Random.Shared.Next(colours.Length)]} {nouns[Random.Shared.Next(nouns.Length)]}",
                };

                data.Select = (e) => Select(data);
                data.Remove = (e) => Remove(data);
                result.Add(data);
            }

            return result;
        }

        public void Select(Data item)
        {
            Selected = item.Id;
        }

        void Remove(Data item)
        {
            Data.Remove(item);
        }

        void Run()
        {
            Data = BuildData();
        }
        void Runlots()
        {
            Data = BuildData(10000);
        }
        void Add()
        {
            Data.AddRange(BuildData(1000));
        }
        void Update()
        {
            for (var i = 0; i < Data.Count; i += 10)
            {
                Data[i].Label += " !!!";
            }
        }
        void Clear()
        {
            Data.Clear();
            Selected = 0;
        }
        void SwapRows()
        {
            if (Data.Count > 998)
            {
                var a = Data[1];
                Data[1] = Data[998];
                Data[998] = a;
            }
        }
    }
}
