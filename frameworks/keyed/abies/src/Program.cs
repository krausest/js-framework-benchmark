// =============================================================================
// Abies js-framework-benchmark Implementation
// =============================================================================
// Standard benchmark for comparing JavaScript framework performance.
// See: https://github.com/krausest/js-framework-benchmark
//
// Operations:
// - Create 1,000 / 10,000 rows
// - Append 1,000 rows
// - Update every 10th row
// - Select row (highlight)
// - Swap rows (positions 2 and 998)
// - Delete row
// - Clear all rows
// =============================================================================

using Abies;
using Abies.DOM;
using static Abies.Html.Elements;
using static Abies.Html.Attributes;
using static Abies.Html.Events;

// Start the Abies runtime
await Runtime.Run<Benchmark, Arguments, Model>(new Arguments());

/// <summary>
/// Application startup arguments.
/// </summary>
public record Arguments;

/// <summary>
/// A single row in the benchmark table.
/// </summary>
public record Row(int Id, string Label);

/// <summary>
/// The application model (state).
/// </summary>
public record Model(List<Row> Data, int? Selected, int NextId);

#region Messages

/// <summary>
/// No-op message for unhandled cases.
/// </summary>
public record NoOp : Message;

/// <summary>
/// Create 1,000 rows (replacing existing).
/// </summary>
public record Create : Message;

/// <summary>
/// Create 10,000 rows (replacing existing).
/// </summary>
public record CreateLots : Message;

/// <summary>
/// Append 1,000 rows to existing.
/// </summary>
public record Append : Message;

/// <summary>
/// Update every 10th row by appending " !!!" to the label.
/// </summary>
public record UpdateEvery10th : Message;

/// <summary>
/// Clear all rows.
/// </summary>
public record Clear : Message;

/// <summary>
/// Swap rows at positions 2 and 998 (1-indexed, so indices 1 and 997).
/// </summary>
public record SwapRows : Message;

/// <summary>
/// Select a row by ID.
/// </summary>
public record Select(int Id) : Message;

/// <summary>
/// Delete a row by ID.
/// </summary>
public record Delete(int Id) : Message;

#endregion

/// <summary>
/// The Benchmark application implementing the MVU pattern.
/// </summary>
public class Benchmark : Program<Model, Arguments>
{
    #region Label Generation

    private static readonly string[] _adjectives =
    [
        "pretty", "large", "big", "small", "tall", "short", "long", "handsome",
        "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful",
        "mushy", "odd", "unsightly", "adorable", "important", "inexpensive",
        "cheap", "expensive", "fancy"
    ];

    private static readonly string[] _colours =
    [
        "red", "yellow", "blue", "green", "pink", "brown", "purple", "brown",
        "white", "black", "orange"
    ];

    private static readonly string[] _nouns =
    [
        "table", "chair", "house", "bbq", "desk", "car", "pony", "cookie",
        "sandwich", "burger", "pizza", "mouse", "keyboard"
    ];

    private static readonly Random _rng = new();

    private static string GenerateLabel() =>
        $"{_adjectives[_rng.Next(_adjectives.Length)]} {_colours[_rng.Next(_colours.Length)]} {_nouns[_rng.Next(_nouns.Length)]}";

    private static List<Row> BuildData(int count, int startId)
    {
        var data = new List<Row>(count);
        for (int i = 0; i < count; i++)
        {
            data.Add(new Row(startId + i, GenerateLabel()));
        }
        return data;
    }

    #endregion

    /// <summary>
    /// Initialize the application with an empty model.
    /// </summary>
    public static (Model, Command) Initialize(Url url, Arguments argument)
        => (new Model([], null, 1), Commands.None);

    /// <summary>
    /// Update the model based on incoming messages.
    /// </summary>
    public static (Model model, Command command) Update(Message message, Model model)
        => message switch
        {
            Create => (model with { Data = BuildData(1000, model.NextId), NextId = model.NextId + 1000, Selected = null }, Commands.None),
            CreateLots => (model with { Data = BuildData(10000, model.NextId), NextId = model.NextId + 10000, Selected = null }, Commands.None),
            Append => (model with { Data = [.. model.Data, .. BuildData(1000, model.NextId)], NextId = model.NextId + 1000 }, Commands.None),
            UpdateEvery10th => (model with { Data = UpdateEvery10thRow(model.Data) }, Commands.None),
            Clear => (model with { Data = [], Selected = null }, Commands.None),
            SwapRows => (model with { Data = SwapRowsAtPositions(model.Data) }, Commands.None),
            Select s => (model with { Selected = s.Id }, Commands.None),
            Delete d => (model with { Data = model.Data.Where(r => r.Id != d.Id).ToList() }, Commands.None),
            _ => (model, Commands.None)
        };

    private static List<Row> UpdateEvery10thRow(List<Row> data)
    {
        var result = new List<Row>(data.Count);
        for (int i = 0; i < data.Count; i++)
        {
            if (i % 10 == 0)
            {
                var row = data[i];
                result.Add(row with { Label = row.Label + " !!!" });
            }
            else
            {
                result.Add(data[i]);
            }
        }
        return result;
    }

    private static List<Row> SwapRowsAtPositions(List<Row> data)
    {
        // Swap rows at positions 2 and 998 (1-indexed = indices 1 and 997)
        if (data.Count < 999)
        {
            return data;
        }

        var result = new List<Row>(data);
        (result[1], result[997]) = (result[997], result[1]);
        return result;
    }

    /// <summary>
    /// Render the view based on the current model.
    /// </summary>
    public static Document View(Model model)
        => new("Abies keyed",
            div([class_("container")], [
                Jumbotron(),
                table([class_("table table-hover table-striped test-data")], [
                    tbody([id("tbody")], [
                        .. model.Data.ConvertAll(row => TableRow(row, model.Selected == row.Id))
                    ])
                ]),
                span([class_("preloadicon glyphicon glyphicon-remove"), ariaHidden("true")], [])
            ])
        );

    private static Node Jumbotron() =>
        div([class_("jumbotron")], [
            div([class_("row")], [
                div([class_("col-md-6")], [
                    h1([], [text("Abies-keyed")])
                ]),
                div([class_("col-md-6")], [
                    div([class_("row")], [
                        ActionButton("run", "Create 1,000 rows", new Create()),
                        ActionButton("runlots", "Create 10,000 rows", new CreateLots()),
                        ActionButton("add", "Append 1,000 rows", new Append()),
                        ActionButton("update", "Update every 10th row", new UpdateEvery10th()),
                        ActionButton("clear", "Clear", new Clear()),
                        ActionButton("swaprows", "Swap Rows", new SwapRows())
                    ])
                ])
            ])
        ]);

    private static Node ActionButton(string buttonId, string label, Message msg) =>
        div([class_("col-sm-6 smallpad")], [
            button([
                type("button"),
                class_("btn btn-primary btn-block"),
                id(buttonId),
                onclick(msg)
            ], [
                text(label)
            ])
        ]);

    private static Node TableRow(Row row, bool isSelected) =>
        tr([class_(isSelected ? "danger" : ""), id(row.Id.ToString())], [
            td([class_("col-md-1")], [text(row.Id.ToString())]),
            td([class_("col-md-4")], [
                a([class_("lbl"), onclick(new Select(row.Id))], [text(row.Label)])
            ]),
            td([class_("col-md-1")], [
                a([onclick(new Delete(row.Id))], [
                    span([class_("glyphicon glyphicon-remove"), ariaHidden("true")], [])
                ])
            ]),
            td([class_("col-md-6")], [])
        ], id: $"row-{row.Id}");

    /// <summary>
    /// Handle URL changes (not used in benchmark).
    /// </summary>
    public static Message OnUrlChanged(Url url) => new NoOp();

    /// <summary>
    /// Handle link clicks (not used in benchmark).
    /// </summary>
    public static Message OnLinkClicked(UrlRequest urlRequest) => new NoOp();

    /// <summary>
    /// Define subscriptions (not used in benchmark).
    /// </summary>
    public static Subscription Subscriptions(Model model)
        => SubscriptionModule.None;

    /// <summary>
    /// Handle commands (not used in benchmark).
    /// </summary>
    public static Task HandleCommand(Command command, Func<Message, ValueTuple> dispatch)
        => Task.CompletedTask;
}
