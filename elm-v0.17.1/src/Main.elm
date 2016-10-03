module Main exposing (..)

import Array exposing (Array)
import Array.Extra
import Html exposing (div, a, h1, span, button, table, td, tr, text, Html, Attribute)
import Html.App exposing (program)
import Html.Attributes exposing (id, class, classList, attribute, type', href)
import Html.Events exposing (onClick)
import Html.Keyed
import String
import Random.Pcg exposing (Seed, Generator)


main : Program Never
main =
    program
        { view = view
        , update = update
        , init = init
        , subscriptions = subscriptions
        }


adjectives : Array String
adjectives =
    Array.fromList
        [ "pretty"
        , "large"
        , "big"
        , "small"
        , "tall"
        , "short"
        , "long"
        , "handsome"
        , "plain"
        , "quaint"
        , "clean"
        , "elegant"
        , "easy"
        , "angry"
        , "crazy"
        , "helpful"
        , "mushy"
        , "odd"
        , "unsightly"
        , "adorable"
        , "important"
        , "inexpensive"
        , "cheap"
        , "expensive"
        , "fancy"
        ]


colours : Array String
colours =
    Array.fromList
        [ "red"
        , "yellow"
        , "blue"
        , "green"
        , "pink"
        , "brown"
        , "purple"
        , "brown"
        , "white"
        , "black"
        , "orange"
        ]


nouns : Array String
nouns =
    Array.fromList
        [ "table"
        , "chair"
        , "house"
        , "bbq"
        , "desk"
        , "car"
        , "pony"
        , "cookie"
        , "sandwich"
        , "burger"
        , "pizza"
        , "mouse"
        , "keyboard"
        ]


buttons : List ( String, String, Msg )
buttons =
    [ ( "run", "Create 1,000 rows", (Create 1000) )
    , ( "runlots", "Create 10,000 rows", (Create 10000) )
    , ( "add", "Append 1,000 rows", (Append 1000) )
    , ( "update", "Update every 10th row", (UpdateEvery 10) )
    , ( "clear", "Clear", Clear )
    , ( "swaprows", "Swap Rows", Swap )
    ]


tbody : List (Attribute msg) -> List ( String, Html msg ) -> Html msg
tbody attrs children =
    Html.Keyed.node "tbody" attrs children


btnPrimaryBlock : ( String, String, Msg ) -> Html Msg
btnPrimaryBlock ( buttonId, labelText, msg ) =
    div
        [ class "col-sm-6 smallpad" ]
        [ button
            [ type' "button"
            , class "btn btn-primary btn-block"
            , id buttonId
            , onClick msg
            , attribute "ref" "text"
            ]
            [ text labelText ]
        ]


rowView : Int -> Row -> ( String, Html Msg )
rowView index { id, label, selected } =
    ( toString id
    , tr
        [ classList [ ( "danger", selected ) ] ]
        [ td [ class "col-md-1" ] [ text (toString id) ]
        , td
            [ class "col-md-4" ]
            [ a
                [ href "#"
                , onClick (Select index)
                ]
                [ text label ]
            ]
        , td
            [ class "col-md-1" ]
            [ a
                [ href "#"
                , onClick (Remove index)
                ]
                [ span
                    [ class "glyphicon glyphicon-remove"
                    , attribute "aria-hidden" "true"
                    ]
                    []
                ]
            ]
        , td [ class "col-md-6" ] []
        ]
    )


view : Model -> Html Msg
view model =
    div
        [ class "container" ]
        [ div
            [ class "jumbotron" ]
            [ div
                [ class "row" ]
                [ div
                    [ class "col-md-6" ]
                    [ h1
                        []
                        [ text "Elm 0.17.1" ]
                    ]
                , div
                    [ class "col-md-6" ]
                    (List.map btnPrimaryBlock buttons)
                ]
            ]
        , table
            [ class "table table-hover table-striped test-data" ]
            [ tbody
                []
                (List.indexedMap rowView model.rows)
            ]
        , span
            [ class "preloadicon glyphicon glyphicon-remove"
            , attribute "aria-hidden" "true"
            ]
            []
        ]


createRandomBatch : Maybe Seed -> Int -> Int -> ( List Row, Seed )
createRandomBatch maybeSeed amount lastId =
    case maybeSeed of
        Just seed ->
            let
                ( list, seed ) =
                    Random.Pcg.step (batch amount) seed

                row =
                    createRow lastId
            in
                ( List.indexedMap row list, seed )

        Nothing ->
            Debug.crash "Attempting to create values without a seed!"


createRow : Int -> Int -> String -> Row
createRow lastId index label =
    { id = lastId + index
    , label = label
    , selected = False
    }


type Msg
    = Create Int
    | Append Int
    | UpdateEvery Int
    | Clear
    | Swap
    | Remove Int
    | Select Int
    | UpdateSeed Seed


get : Int -> Array a -> a
get id arr =
    case (Array.get id arr) of
        Just row ->
            row

        Nothing ->
            Debug.crash "Attempted to retrieve non-existant element from array"


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Create amount ->
            let
                ( newRows, seed ) =
                    createRandomBatch model.seed amount model.lastId
            in
                ( { model
                    | rows = newRows
                    , seed = Just seed
                    , lastId = model.lastId + amount
                  }
                , Cmd.none
                )

        Append amount ->
            let
                ( newRows, seed ) =
                    createRandomBatch model.seed amount model.lastId
            in
                ( { model
                    | rows = model.rows ++ newRows
                    , seed = Just seed
                    , lastId = model.lastId + amount
                  }
                , Cmd.none
                )

        UpdateEvery amount ->
            ( { model
                | rows =
                    List.indexedMap
                        (\index row ->
                            if (index % 10) == 0 then
                                { row | label = row.label ++ " !!!" }
                            else
                                row
                        )
                        model.rows
              }
            , Cmd.none
            )

        Clear ->
            ( { model | rows = [] }, Cmd.none )

        Swap ->
            if List.length model.rows >= 10 then
                let
                    arr =
                        model.rows
                            |> Array.fromList

                    from =
                        get 4 arr

                    to =
                        get 9 arr
                in
                    ( { model
                        | rows =
                            arr
                                |> Array.set 4 to
                                |> Array.set 9 from
                                |> Array.toList
                      }
                    , Cmd.none
                    )
            else
                ( model, Cmd.none )

        Remove id ->
            ( { model
                | rows =
                    List.take id model.rows
                        ++ List.drop (id + 1) model.rows
              }
            , Cmd.none
            )

        Select index ->
            ( { model
                | rows =
                    model.rows
                        |> List.map
                            (\row ->
                                if row.selected == True then
                                    { row | selected = False }
                                else
                                    row
                            )
                        |> Array.fromList
                        |> Array.Extra.update index
                            (\row ->
                                { row
                                    | selected = True
                                }
                            )
                        |> Array.toList
              }
            , Cmd.none
            )

        UpdateSeed seed ->
            ( { model | seed = Just seed }, Cmd.none )


type alias Model =
    { seed : Maybe Seed
    , rows : List Row
    , lastId : Int
    }


type alias Row =
    { id : Int
    , label : String
    , selected : Bool
    }


init : ( Model, Cmd Msg )
init =
    ( { seed = Nothing
      , rows = []
      , lastId = 1
      }
    , Random.Pcg.generate (UpdateSeed) (Random.Pcg.independentSeed)
    )


batch : Int -> Generator (List String)
batch n =
    Random.Pcg.list n generator


generator : Generator String
generator =
    Random.Pcg.map3
        (\a b c ->
            let
                adjective index =
                    adjectives
                        |> Array.get index
                        |> Maybe.withDefault ""

                colour index =
                    colours
                        |> Array.get index
                        |> Maybe.withDefault ""

                noun index =
                    nouns
                        |> Array.get index
                        |> Maybe.withDefault ""
            in
                String.join " "
                    [ adjective a
                    , colour b
                    , noun c
                    ]
        )
        (Random.Pcg.int 0 (Array.length adjectives - 1))
        (Random.Pcg.int 0 (Array.length colours - 1))
        (Random.Pcg.int 0 (Array.length nouns - 1))


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none
