module KrausestBenchmark

open Fable.Core
open Feliz.JSX.Solid
open Elmish.Solid

type Model = { data : (string * string) list; selected : int }

type Message = Run | RunLots | Add | Update | SwapRows | Clear | Select of id : string | Remove of id : string

let adjectives = [ "pretty"; "large"; "big"; "small"; "tall"; "short"; "long"; "handsome"; "plain"; "quaint"; "clean"; "elegant"; "easy"; "angry"; "crazy"; "helpful"; "mushy"; "odd"; "unsightly"; "adorable"; "important"; "inexpensive"; "cheap"; "expensive"; "fancy" ]
let colors = [ "red"; "yellow"; "blue"; "green"; "pink"; "brown"; "purple"; "brown"; "white"; "black"; "orange" ]
let nouns = [ "table"; "chair"; "house"; "bbq"; "desk"; "car"; "pony"; "cookie"; "sandwich"; "burger"; "pizza"; "mouse"; "keyboard" ]

let random = System.Random()

let buildData count =
    let data = Array.zeroCreate count
    for i in 0 .. count - 1 do
        let id = string i
        let label = $"{List.item (random.Next (adjectives.Length - 1)) adjectives} {List.item (random.Next (colors.Length - 1)) colors} {List.item (random.Next (nouns.Length - 1)) nouns}"
        data.[i] <- id, label
    List.ofArray data

let init () = { data = []; selected = 0 }, Elmish.Cmd.none

let update msg model =
    match msg with
    | Run       -> { selected = 0;              data = buildData 1000 }, Elmish.Cmd.none
    | RunLots   -> { selected = 0;              data = buildData 10000 }, Elmish.Cmd.none
    | Add       -> { selected = model.selected; data = List.append model.data (buildData 1000) }, Elmish.Cmd.none
    | Update    -> { selected = model.selected; data = model.data |> List.mapi (fun i (id, label) -> if i % 10 = 0 then id, $"{label} !!!" else id, label) }, Elmish.Cmd.none
    | SwapRows  -> { selected = model.selected; data = model.data |> List.mapi (fun i el -> if i = 1 then model.data.[998] else if i = 998 then model.data.[1] else el) }, Elmish.Cmd.none
    | Clear     -> { selected = 0;              data = [] }, Elmish.Cmd.none
    | Select id -> { selected = int id;         data = model.data }, Elmish.Cmd.none
    | Remove id -> { selected = model.selected; data = model.data |> List.filter (fun (i, _) -> i <> id) }, Elmish.Cmd.none

[<JSX.Component>]
let Button (id : string) (text : string) fn =
    Html.div [ Attr.className "col-sm-6 smallpad"; Html.children [
        Html.button [ Attr.id id; Attr.className "btn btn-primary btn-block"; Attr.typeButton; Ev.onClick fn; Html.children [
            Html.text text
        ]]
    ]]

[<JSX.Component>]
let App =

    let model, dispatch = Solid.createElmishStore (init, update)

    Html.div [ Attr.className "container"; Html.children [
        Html.div [ Attr.className "jumbotron"; Html.children [
            Html.div [ Attr.className "row"; Html.children [
                Html.div [ Attr.className "col-md-6"; Html.children [
                    Html.h1 "Fable Solid Elmish Keyed"
                ]]
                Html.div [ Attr.className "col-md-6"; Html.children [
                    Button "run"      "Create 1,000 rows"     (fun _ -> dispatch Run)
                    Button "runlots"  "Create 10,000 rows"    (fun _ -> dispatch RunLots)
                    Button "add"      "Append 1,000 rows"     (fun _ -> dispatch Add)
                    Button "update"   "Update every 10th row" (fun _ -> dispatch Update)
                    Button "clear"    "Clear"                 (fun _ -> dispatch Clear)
                    Button "swaprows" "Swap Rows"             (fun _ -> dispatch SwapRows)
                ]]
            ]]
        ]]
        Html.table [ Attr.className "table table-hover table-striped test-data"; Html.children [
            Html.tbody [ Html.children (model.data |> List.map (fun (id, label) -> 
                Html.tr [ Attr.className (if id = string model.selected then "danger" else ""); Html.children [
                    Html.td [ Attr.className "col-md-1"; Html.children [
                        Html.text id
                    ]]
                    Html.td [ Attr.className "col-md-4"; Html.children [
                        Html.a [ Attr.id id; Ev.onClick (fun _ -> dispatch (Select id)); Html.children [
                            Html.text label
                        ]]
                    ]]
                    Html.td [ Attr.className "col-md-1"; Html.children [
                        Html.a [ Attr.id id; Ev.onClick (fun _ -> dispatch (Remove id)); Html.children [
                            Html.span [ Attr.className "glyphicon glyphicon-remove"; Attr.ariaHidden true ]
                        ]]
                    ]]
                    Html.td [ Attr.className "col-md-6" ]
                ]]
            )) ]
        ]]
    ]]

let app () = App
Solid.render (app, Browser.Dom.document.getElementById("app"))
