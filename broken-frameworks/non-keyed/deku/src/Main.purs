module Main where

import Prelude
import Prim hiding (Row)

import Data.Array as Array
import Data.Maybe (Maybe(..))
import Data.Tuple (Tuple(..))
import Data.Tuple.Nested ((/\))
import Deku.Core (Nut)
import Deku.DOM as D
import Deku.DOM.Attributes as DA
import Deku.DOM.Listeners as DL
import Deku.Do as Do
import Deku.Hooks (useState, (<#~>))
import Deku.SPA as Deku.SPA
import Effect (Effect)
import Effect.Class (liftEffect)
import Effect.Uncurried (EffectFn5, runEffectFn5)
import FRP.Poll (Poll)

-- Main application component
app :: Nut
app = Do.do
  setRows /\ rowsPoll <- useState []
  setLastId /\ lastIdPoll <- useState 0
  setSelectedId /\ selectedIdPoll <- useState 0

  let
    -- Action handlers
    create :: Int -> Int -> Effect Unit
    create lastId amount = do
      newRows <- liftEffect $ createRandomNRows amount lastId
      setRows newRows
      setLastId (lastId + amount)

    appendOneThousand :: Int -> Array Row -> Effect Unit
    appendOneThousand lastId existingRows = do
      newRows <- liftEffect $ createRandomNRows 1000 lastId
      setRows $ existingRows <> newRows
      setLastId (lastId + 1000)

    updateEveryTenth' :: Array Row -> Effect Unit
    updateEveryTenth' existingRows = do
      setRows $
        Array.mapWithIndex
          ( \ix row ->
              if ix `mod` 10 == 0 then row { label = row.label <> " !!!" }
              else row
          )
          existingRows

    clear :: Effect Unit
    clear = setRows []

    swap :: Array Row -> Effect Unit
    swap rows = do
      case swapRows rows 1 998 of
        Just swappedRows -> setRows swappedRows
        Nothing -> pure unit

    remove :: Int -> Array Row -> Effect Unit
    remove id existingRows =
      setRows $ Array.filter (\r -> r.id /= id) existingRows

    select :: Int -> Int -> Effect Unit
    select id selectedId =
      if selectedId == id then pure unit
      else setSelectedId id

    renderRow :: Row -> Nut
    renderRow row =
      D.tr
        [ DA.klass $ selectedIdPoll <#> \selectedId -> if selectedId == row.id then "danger" else "" ]
        [ D.td
            [ DA.klass_ "col-md-1" ]
            [ D.text_ $ show row.id ]
        , D.td
            [ DA.klass_ "col-md-4" ]
            [ D.a
                [ DL.runOn DL.click $ selectedIdPoll <#> select row.id ]
                [ D.text_ row.label ]
            ]
        , D.td
            [ DA.klass_ "col-md-1" ]
            [ D.a
                [ DL.runOn DL.click $ rowsPoll <#> remove row.id ]
                [ D.span
                    [ DA.klass_ "glyphicon glyphicon-remove" ]
                    []
                ]
            ]
        , D.td
            [ DA.klass_ "col-md-6" ]
            []
        ]

  D.div_
    [ D.div
        [ DA.klass_ "jumbotron" ]
        [ D.div
            [ DA.klass_ "row" ]
            [ D.div
                [ DA.klass_ "col-md-6" ]
                [ D.h1_ [ D.text_ "Deku Performance Demo" ] ]
            , D.div
                [ DA.klass_ "col-md-6" ]
                [ actionButtons
                    { create: \amount -> lastIdPoll <#> \lastId -> create lastId amount
                    , appendOneThousand: (Tuple <$> lastIdPoll <*> rowsPoll) <#> \(Tuple lastId rows) -> appendOneThousand lastId rows
                    , updateEveryTenth: rowsPoll <#> updateEveryTenth'
                    , clear: pure clear
                    , swap: rowsPoll <#> swap
                    }
                ]
            ]
        ]
    , D.table
        [ DA.klass_ "table table-hover table-striped test-data" ]
        [ rowsPoll <#~> \rows -> D.tbody_ $ map renderRow rows
        ]
    , footer
    ]

footer :: Nut
footer =
  D.span
    [ DA.klass_ "preloadicon glyphicon glyphicon-remove"
    , DA.ariaHidden_ "true"
    ]
    []

-- Action buttons component
actionButtons
  :: { create :: Int -> Poll (Effect Unit)
     , appendOneThousand :: Poll (Effect Unit)
     , updateEveryTenth :: Poll (Effect Unit)
     , clear :: Poll (Effect Unit)
     , swap :: Poll (Effect Unit)
     }
  -> Nut
actionButtons actions =
  D.div_
    [ actionButton "run" "Create 1,000 rows" (actions.create 1000)
    , actionButton "runlots" "Create 10,000 rows" (actions.create 10000)
    , actionButton "add" "Append 1,000 rows" actions.appendOneThousand
    , actionButton "update" "Update every 10th row" actions.updateEveryTenth
    , actionButton "clear" "Clear" actions.clear
    , actionButton "swaprows" "Swap Rows" actions.swap
    ]
  where
  actionButton :: String -> String -> Poll (Effect Unit) -> Nut
  actionButton id label action =
    D.div
      [ DA.klass_ "col-sm-6 smallpad" ]
      [ D.button
          [ DA.id_ id
          , DA.klass_ "btn btn-primary btn-block"
          , DL.runOn DL.click $ action
          ]
          [ D.text_ label ]
      ]

-- Main entry point
main :: Effect Unit
main = void $ Deku.SPA.runInBody app

-----------------------------------------------------------

data Action
  = Create Int
  | AppendOneThousand
  | UpdateEveryTenth
  | Clear
  | Swap
  | Remove Int
  | Select Int

type State =
  { rows :: Array Row
  , lastId :: Int
  , selectedId :: Int
  }

type Row =
  { id :: Int
  , label :: String
  }

type ActionButton = { id :: String, label :: String, action :: Action }

buttons :: Array ActionButton
buttons =
  [ { id: "run", label: "Create 1,000 rows", action: Create 1000 }
  , { id: "runlots", label: "Create 10,000 rows", action: Create 10000 }
  , { id: "add", label: "Append 1,000 rows", action: AppendOneThousand }
  , { id: "update", label: "Update every 10th row", action: UpdateEveryTenth }
  , { id: "clear", label: "Clear", action: Clear }
  , { id: "swaprows", label: "Swap Rows", action: Swap }
  ]

updateEveryTenth :: Array Row -> Array Row
updateEveryTenth =
  Array.mapWithIndex updateRowLabel
  where
  updateRowLabel ix row =
    if ix `mod` 10 == 0 then row { label = row.label <> " !!!" } else row

swapRows :: Array Row -> Int -> Int -> Maybe (Array Row)
swapRows arr index1 index2 = do
  rowA <- arr Array.!! index1
  rowB <- arr Array.!! index2
  arrA <- Array.updateAt index1 rowB arr
  arrB <- Array.updateAt index2 rowA arrA
  pure arrB

foreign import createRandomNRowsImpl :: EffectFn5 (Array String) (Array String) (Array String) Int Int (Array Row)

createRandomNRows :: Int -> Int -> Effect (Array Row)
createRandomNRows n lastId = runEffectFn5 createRandomNRowsImpl adjectives colours nouns n lastId

adjectives :: Array String
adjectives =
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

colours :: Array String
colours =
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

nouns :: Array String
nouns =
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
