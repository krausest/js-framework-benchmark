module App

open Fable.Ripple
open Fable.Ripple.Dom

type Row =
    {
        Id: int
        Label: Var<string>
    }

let adjectives =
    [|
        "pretty"; "large"; "big"; "small"; "tall"; "short"; "long"; "handsome"
        "plain"; "quaint"; "clean"; "elegant"; "easy"; "angry"; "crazy"; "helpful"
        "mushy"; "odd"; "unsightly"; "adorable"; "important"; "inexpensive"
        "cheap"; "expensive"; "fancy"
    |]

let colours =
    [|
        "red"; "yellow"; "blue"; "green"; "pink"; "brown"; "purple"; "brown"
        "white"; "black"; "orange"
    |]

let nouns =
    [|
        "table"; "chair"; "house"; "bbq"; "desk"; "car"; "pony"; "cookie"
        "sandwich"; "burger"; "pizza"; "mouse"; "keyboard"
    |]

let private rng = System.Random()

let random (max: int) =
    int (System.Math.Round(rng.NextDouble() * 1000.0)) % max

let mutable nextId = 1

let buildData (count: int) =
    Array.init
        count
        (fun _ ->
            let label =
                adjectives.[random adjectives.Length]
                + " "
                + colours.[random colours.Length]
                + " "
                + nouns.[random nouns.Length]

            let row =
                {
                    Id = nextId
                    Label = Var.create label
                }

            nextId <- nextId + 1
            row
        )

let data = Var.create Array.empty<Row>
let selected = Var.create 0 // ids start at 1, so 0 is "nothing selected"

let run () = data.Value <- buildData 1000
let runLots () = data.Value <- buildData 10000
let add () = data.Value <- Array.append data.Value (buildData 1000)
let clear () = data.Value <- Array.empty

let update () =
    Signal.batch (fun () ->
        let rows = data.Value
        let mutable index = 0

        while index < rows.Length do
            rows.[index].Label.Value <- rows.[index].Label.Value + " !!!"
            index <- index + 10
    )

let swapRows () =
    let rows = data.Value

    if rows.Length > 998 then
        let swapped = Array.copy rows
        swapped.[1] <- rows.[998]
        swapped.[998] <- rows.[1]
        data.Value <- swapped

let remove (id: int) =
    data.Value <- data.Value |> Array.filter (fun row -> row.Id <> id)

let button (id: string) (text: string) (onClick: unit -> unit) =
    Html.div
        [
            attr.className "col-sm-6 smallpad"
            Html.button
                [
                    attr.id id
                    attr.className "btn btn-primary btn-block"
                    attr.type' "button"
                    on.click (fun _ -> onClick ())
                    Html.text text
                ]
        ]

let row (row: Row) =
    Html.tr
        [
            attr.toggleClass ("danger", (fun () -> selected.Value = row.Id))
            Html.td
                [
                    attr.className "col-md-1"
                    Html.text (string row.Id)
                ]
            Html.td
                [
                    attr.className "col-md-4"
                    Html.a
                        [
                            on.click (fun _ -> selected.Value <- row.Id)
                            Html.text (fun () -> row.Label.Value)
                        ]
                ]
            Html.td
                [
                    attr.className "col-md-1"
                    Html.a
                        [
                            on.click (fun _ -> remove row.Id)
                            Html.span
                                [
                                    attr.className "glyphicon glyphicon-remove"
                                    attr.custom ("aria-hidden", "true")
                                ]
                        ]
                ]
            Html.td [ attr.className "col-md-6" ]
        ]

let app () =
    Html.div
        [
            attr.className "container"
            Html.div
                [
                    attr.className "jumbotron"
                    Html.div
                        [
                            attr.className "row"
                            Html.div
                                [
                                    attr.className "col-md-6"
                                    Html.h1 "Fable.Ripple-keyed"
                                ]
                            Html.div
                                [
                                    attr.className "col-md-6"
                                    Html.div
                                        [
                                            attr.className "row"
                                            button "run" "Create 1,000 rows" run
                                            button "runlots" "Create 10,000 rows" runLots
                                            button "add" "Append 1,000 rows" add
                                            button "update" "Update every 10th row" update
                                            button "clear" "Clear" clear
                                            button "swaprows" "Swap Rows" swapRows
                                        ]
                                ]
                        ]
                ]
            Html.table
                [
                    attr.className "table table-hover table-striped test-data"
                    Html.tbody [ Html.each (fun () -> data.Value) (fun r -> r.Id) row ]
                ]
            Html.span
                [
                    attr.className "preloadicon glyphicon glyphicon-remove"
                    attr.custom ("aria-hidden", "true")
                ]
        ]

Html.mount "main" (app ())
