module Main exposing (main)

import Array exposing (Array)
import Browser
import Html exposing (Attribute, Html, a, button, div, h1, span, table, td, text, tr)
import Html.Attributes exposing (attribute, class, classList, href, id, type_)
import Html.Events exposing (onClick)
import Html.Keyed
import Html.Lazy exposing (lazy, lazy2)
import Random exposing (Generator, Seed)
import String


main : Program Int Model Msg
main =
    Browser.element
        { view = view
        , update = update
        , init = init
        , subscriptions = subscriptions
        }


adjectives : Generator String
adjectives =
    Random.uniform
        "pretty"
        [ "large"
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


colours : Generator String
colours =
    Random.uniform
        "red"
        [ "yellow"
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


nouns : Generator String
nouns =
    Random.uniform
        "table"
        [ "chair"
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
    [ ( "run", "Create 1,000 rows", Create 1000 )
    , ( "runlots", "Create 10,000 rows", Create 10000 )
    , ( "add", "Append 1,000 rows", AppendOneThousand )
    , ( "update", "Update every 10th row", UpdateEveryTenth )
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
            [ type_ "button"
            , class "btn btn-primary btn-block"
            , id buttonId
            , onClick msg
            , attribute "ref" "text"
            ]
            [ text labelText ]
        ]


viewKeyedRow : Int -> Row -> ( String, Html Msg )
viewKeyedRow selectedId row =
    ( String.fromInt row.id, lazy2 viewRow (selectedId == row.id) row )


viewRow : Bool -> Row -> Html Msg
viewRow isSelected { id, label } =
    tr
        [ classList [ ( "danger", isSelected ) ] ]
        [ td colMd1
            [ text (String.fromInt id) ]
        , td colMd4
            [ a [ onClick (Select id) ] [ text label ] ]
        , td colMd1
            [ a [ onClick (Remove id) ] removeIcon ]
        , spacer
        ]


removeIcon : List (Html msg)
removeIcon =
    [ span
        [ class "glyphicon glyphicon-remove"
        , attribute "aria-hidden" "true"
        ]
        []
    ]


colMd1 : List (Attribute msg)
colMd1 =
    [ class "col-md-1" ]


colMd4 : List (Attribute msg)
colMd4 =
    [ class "col-md-4" ]


spacer : Html msg
spacer =
    td [ class "col-md-6" ] []


view : Model -> Html Msg
view model =
    div containerClasses
        [ jumbotron
        , table tableClasses
            [ tbody []
                (Array.foldr (viewRowHelp model.selectedId) [] model.rows)
            ]
        , footer
        ]


containerClasses : List (Attribute msg)
containerClasses =
    [ class "container" ]


tableClasses : List (Attribute msg)
tableClasses =
    [ class "table table-hover table-striped test-data" ]


footer : Html msg
footer =
    span
        [ class "preloadicon glyphicon glyphicon-remove"
        , attribute "aria-hidden" "true"
        ]
        []


jumbotron : Html Msg
jumbotron =
    div
        [ class "jumbotron" ]
        [ div
            [ class "row" ]
            [ div
                [ class "col-md-6" ]
                [ h1 [] [ text "Elm 0.19.0 (keyed)" ] ]
            , div
                [ class "col-md-6" ]
                (List.map btnPrimaryBlock buttons)
            ]
        ]


viewRowHelp : Int -> Row -> List ( String, Html Msg ) -> List ( String, Html Msg )
viewRowHelp selectedId row elems =
    viewKeyedRow selectedId row :: elems


appendRandomEntries : Int -> Int -> ( Array Row, Seed ) -> ( Array Row, Seed )
appendRandomEntries amount lastId pair =
    if amount == 0 then
        pair

    else
        let
            ( array, seed ) =
                pair

            ( label, newSeed ) =
                Random.step generator seed

            id =
                lastId + 1

            newArray =
                Array.push
                    { id = id
                    , label = label
                    }
                    array
        in
        appendRandomEntries (amount - 1) id ( newArray, newSeed )


type Msg
    = Create Int
    | AppendOneThousand
    | UpdateEveryTenth
    | Clear
    | Swap
    | Remove Int
    | Select Int


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Create amount ->
            let
                ( newRows, seed ) =
                    appendRandomEntries amount model.lastId ( Array.empty, model.seed )
            in
            ( { model
                | rows = newRows
                , seed = seed
                , lastId = model.lastId + amount
              }
            , Cmd.none
            )

        AppendOneThousand ->
            let
                amount =
                    1000

                ( newRows, seed ) =
                    appendRandomEntries amount model.lastId ( model.rows, model.seed )
            in
            ( { model
                | rows = newRows
                , seed = seed
                , lastId = model.lastId + amount
              }
            , Cmd.none
            )

        UpdateEveryTenth ->
            ( { model | rows = updateEveryTenth 0 model.rows }, Cmd.none )

        Clear ->
            ( { model | rows = Array.empty }, Cmd.none )

        Swap ->
            let
                rows =
                    model.rows
            in
            if Array.length rows > 998 then
                case ( Array.get 1 rows, Array.get 998 rows ) of
                    ( Just from, Just to ) ->
                        ( { model
                            | rows =
                                rows
                                    |> Array.set 1 to
                                    |> Array.set 998 from
                          }
                        , Cmd.none
                        )

                    ( _, _ ) ->
                        ( model, Cmd.none )

            else
                ( model, Cmd.none )

        Remove id ->
            ( { model | rows = Array.filter (\r -> r.id /= id) model.rows }, Cmd.none )

        Select id ->
            ( { model | selectedId = id }, Cmd.none )


updateEveryTenth : Int -> Array Row -> Array Row
updateEveryTenth index rows =
    case Array.get index rows of
        Just row ->
            rows
                |> Array.set index { row | label = row.label ++ " !!!" }
                |> updateEveryTenth (index + 10)

        Nothing ->
            rows


type alias Model =
    { seed : Seed
    , rows : Array Row
    , lastId : Int
    , selectedId : Int
    }


type alias Row =
    { id : Int
    , label : String
    }


init : Int -> ( Model, Cmd Msg )
init systemTime =
    ( { seed = Random.initialSeed systemTime
      , rows = Array.empty
      , lastId = 0
      , selectedId = 0
      }
    , Cmd.none
    )


generator : Generator String
generator =
    Random.map3 (\a c n -> a ++ " " ++ c ++ " " ++ n) adjectives colours nouns


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none
