{-# LANGUAGE ScopedTypeVariables    #-}
{-# LANGUAGE OverloadedStrings    #-}
{-# LANGUAGE ExtendedDefaultRules    #-}

module Main where

import Miso
import qualified Data.Vector as V
import qualified Data.Vector.Mutable as MV
import System.Random as R
import Miso.String as MS
import Data.Monoid ((<>))

data RowData = RowData
  {
    rowIdx :: Int
  , rowTitle :: MisoString
  } deriving (Show, Eq)

data Model = Model
  {
    modelRows :: V.Vector RowData
  , modelHighlightedRowIndex :: Maybe Int
  , modelLastIdx :: Int
  } deriving (Show, Eq)

data Action = CreateRows Int
            | AppendRows Int
            | UpdateRows Int
            | ClearRows
            | SwapRows
            | NoOp
            | HighlightRow Int
            | RemoveRow Int
            | ChangeModel Model
            deriving (Show, Eq)

adjectives :: V.Vector MisoString
adjectives = V.fromList ["pretty", "large", "big", "small", "tall", "short", "long", "handsome",
                         "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful",
                         "mushy", "odd", "unsightly", "adorable", "important", "inexpensive",
                         "cheap", "expensive", "fancy"];

colours :: V.Vector MisoString
colours = V.fromList ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];

nouns :: V.Vector MisoString
nouns = V.fromList ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

main :: IO ()
main = startApp App
  {
    initialAction = ClearRows
  , model = Model{modelRows=V.empty, modelHighlightedRowIndex=Nothing, modelLastIdx=1}
  , update = updateModel
  , view = viewModel
  , events = defaultEvents
  , subs = []
  }




updateModel :: Action -> Model -> Effect Model Action

--
updateModel (ChangeModel newModel) _ = noEff newModel

--
updateModel (CreateRows n) model@Model{modelLastIdx=lastIdx} = model <# do
  newRows <- generateRows n lastIdx
  pure $ ChangeModel model{modelRows=(newRows), modelLastIdx=(lastIdx + n)}

--
updateModel (AppendRows n) model@Model{modelRows=existingRows, modelLastIdx=lastIdx} = model <# do
  newRows <- generateRows n (modelLastIdx model)
  pure $ ChangeModel model{modelRows=(existingRows V.++ newRows), modelLastIdx=(lastIdx + n)}

--
updateModel (ClearRows) model = noEff model{modelRows=V.empty}

--
updateModel (UpdateRows n) model@Model{modelRows=currentRows} = noEff model{modelRows=updatedRows}
  where
    updatedRows = V.accumulate
      (\r@RowData{rowTitle=rt} s -> r{rowTitle=(rt <> s)})
      currentRows
      (V.generate (quot (V.length currentRows) n) (\x -> (x*n, MS.pack " !!!")))

--
updateModel (SwapRows) model@Model{modelRows=currentRows} =
  if (V.length currentRows >=10)
  then noEff model{modelRows=swappedRows}
  else noEff model
  where
    swappedRows = V.modify (\v -> MV.swap v 4 9) currentRows

--
updateModel (HighlightRow idx) model = noEff model{modelHighlightedRowIndex=Just idx}

--
updateModel (RemoveRow idx) model@Model{modelRows=currentRows} = noEff model{modelRows=(firstPart V.++ (V.drop 1 remainingPart))}
  where
    (firstPart, remainingPart) = V.splitAt idx currentRows

generateRows :: Int -> Int -> IO (V.Vector RowData)
generateRows n lastIdx = V.generateM n $ \x -> do
  adjIdx <- R.randomRIO (0, (V.length adjectives) - 1)
  colorIdx <- R.randomRIO (0, (V.length colours) - 1)
  nounIdx <- R.randomRIO (0, (V.length nouns) - 1)
  pure RowData{rowIdx=(lastIdx + x), rowTitle=(adjectives V.! adjIdx) <> (MS.pack " ") <> (colours V.! colorIdx) <> (MS.pack " ") <> (nouns V.! nounIdx)}


viewModel :: Model -> View Action
viewModel m = div_ [id_ "main"]
  [
    div_ [class_ "container"]
    [
      viewJumbotron
    , (viewTable m)
    , span_ [class_ "preloadicon glyphicon glyphicon-remove", textProp "aria-hidden" "true"] []
    ]
  ]

viewTable :: Model -> View Action
viewTable m@Model{modelHighlightedRowIndex=idx} =
  table_ [class_ "table table-hover table-striped test-data"]
  [
    tbody_ [id_ "tbody"] (V.toList $ V.imap viewRow (modelRows m))
  ]
  where
    viewRow i r = tr_ (conditionalDanger i)
      [
        td_ [class_ "col-md-1"] [text (show $ rowIdx r)]
      , td_ [class_ "col-md-4"]
        [
          a_ [class_ "lbl", onClick (HighlightRow i)] [text (rowTitle r)]
        ]
      , td_ [class_ "col-md-1"]
        [
          a_ [class_ "remove"]
          [
            span_ [class_ "glyphicon glyphicon-remove remove", onClick (RemoveRow i)] []
          ]
        ]
      , td_ [class_ "col-md-6"] []
      ]

    conditionalDanger i = if (Just i==idx) then [class_ "danger"] else []


viewJumbotron :: View Action
viewJumbotron =
  div_ [class_ "jumbotron"]
  [
    div_ [class_ "row"]
    [
      div_ [class_ "col-md-6"]
      [
        h1_ [] [text "MisoJS"]
      ]
    , div_ [class_ "col-md-6"]
      [
        div_ [class_ "row"]
        [
          div_ [class_ "col-sm-6 smallpad"]
          [
            button_ [type_ "button", class_ "btn btn-primary btn-block", id_ "run", onClick (CreateRows 1000)] [text "Create 1,000 rows"]
          ]
        , div_ [class_ "col-sm-6 smallpad"]
          [
            button_ [type_ "button", class_ "btn btn-primary btn-block", id_ "runlots", onClick (CreateRows 10000)] [text "Create 10,000 rows"]
          ]
        , div_ [class_ "col-sm-6 smallpad"]
          [
            button_ [type_ "button", class_ "btn btn-primary btn-block", id_ "add", onClick (AppendRows 1000)] [text "Add 1,000 rows"]
          ]
        , div_ [class_ "col-sm-6 smallpad"]
          [
            button_ [type_ "button", class_ "btn btn-primary btn-block", id_ "update", onClick (UpdateRows 10)] [text "Update every 10th row"]
          ]
        , div_ [class_ "col-sm-6 smallpad"]
          [
            button_ [type_ "button", class_ "btn btn-primary btn-block", id_ "clear", onClick ClearRows] [text "Clear"]
          ]
        , div_ [class_ "col-sm-6 smallpad"]
          [
            button_ [type_ "button", class_ "btn btn-primary btn-block", id_ "swaprows", onClick SwapRows] [text "Swap rows"]
          ]
        ]
      ]
    ]
  ]
