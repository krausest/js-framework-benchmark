using System;
using System.Collections.Generic;
using NetWasm.UI.Reactive;

namespace NetWasmUiBench;

public sealed class Row
{
    public Row(int id, string label)
    {
        Id = id;
        Label = new Signal<string>(label);
    }

    public int Id { get; }

    public Signal<string> Label { get; }
}

public static class Data
{
    private static readonly string[] Adjectives =
    [
        "pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean",
        "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important",
        "inexpensive", "cheap", "expensive", "fancy",
    ];

    private static readonly string[] Colours =
        ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];

    private static readonly string[] Nouns =
        ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

    private static readonly Random random = new();
    private static int nextId = 1;

    public static List<Row> Build(int count)
    {
        var rows = new List<Row>(count);
        for (var i = 0; i < count; i++)
        {
            rows.Add(new Row(nextId++,
                Adjectives[random.Next(Adjectives.Length)] + " " + Colours[random.Next(Colours.Length)] + " " +
                Nouns[random.Next(Nouns.Length)]));
        }

        return rows;
    }
}
