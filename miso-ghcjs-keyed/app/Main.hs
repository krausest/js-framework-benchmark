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
import Data.List as L

-- foreign import javascript unsafe "Math.floor(Math.random() * ($2 - $1 + 1)) + $1" 
--   getRandomInt :: Int -> Int -> IO Int

data RowData = RowData
  {
    rowIdx :: Int
  , rowTitle :: MisoString
  } deriving (Show, Eq)


data Model = Model
  {
    modelRows :: [RowData]
  , modelHighlightedRowIndex :: Maybe Int
  , modelLastIdx :: Int
  , modelRandomSeed :: Int
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
main = do
  gen <- R.getStdGen
  let (seed, _) = R.random gen
  startApp App
    {
      initialAction = ClearRows
    , model = Model{modelRows=[], modelHighlightedRowIndex=Nothing, modelLastIdx=1, modelRandomSeed=seed}
    , update = updateModel
    , view = viewModel
    , events = defaultEvents
    , subs = []
    }




updateModel :: Action -> Model -> Effect Model Action

--
updateModel (ChangeModel newModel) _ = noEff newModel

--
updateModel (CreateRows n) model@Model{modelLastIdx=lastIdx, modelRandomSeed=seed} =
  let (newSeed, newRows) = generateRows seed n lastIdx
  in noEff model{modelRows=newRows, modelLastIdx=(lastIdx + n), modelRandomSeed=newSeed}

--
updateModel (AppendRows n) model@Model{modelRows=existingRows, modelLastIdx=lastIdx, modelRandomSeed=seed} =
  let (newSeed, newRows) = generateRows seed n lastIdx
  in noEff model{modelRows=(existingRows ++ newRows), modelLastIdx=(lastIdx + n), modelRandomSeed=newSeed}

--
updateModel (ClearRows) model = noEff model{modelRows=[]}

--
updateModel (UpdateRows n) model@Model{modelRows=currentRows} = noEff model{modelRows=updatedRows}
  where
    updatedRows = L.zipWith (\r i -> if (rem i n ==0) then (updateRow r) else (r)) currentRows [1..]
    updateRow r@RowData{rowTitle=rt} = r{rowTitle=(rt <> (MS.pack " !!!"))}

--
updateModel (SwapRows) model@Model{modelRows=currentRows} =
  let rowVector = V.fromList currentRows
      swappedRows = V.toList $ V.modify (\v -> MV.swap v 4 9) rowVector
  in if (V.length rowVector >=10)
     then noEff model{modelRows=swappedRows}
     else noEff model

--
updateModel (HighlightRow idx) model = noEff model{modelHighlightedRowIndex=Just idx}

--
updateModel (RemoveRow idx) model@Model{modelRows=currentRows} = noEff model{modelRows=(firstPart ++ (L.drop 1 remainingPart))}
  where
    (firstPart, remainingPart) = L.splitAt idx currentRows

generateRows :: Int -> Int -> Int -> (Int, [RowData])
generateRows seed n lastIdx = (newSeed, L.reverse newRows)
  where
    (gen, newRows) = L.foldl' appendRow (R.mkStdGen seed, []) [1..n]
    (newSeed, _) = R.random gen
    appendRow :: (StdGen, [RowData]) -> Int -> (StdGen, [RowData])
    appendRow (g, rs) x = let (adjIdx, g1) = R.randomR (0, (V.length adjectives) - 1) g
                              (colorIdx, g2) = R.randomR  (0, (V.length colours) - 1) g1
                              (nounIdx, g3) = R.randomR (0, (V.length nouns) - 1) g2
                          in (g3, (RowData{rowIdx=(lastIdx + x)
                                          ,rowTitle=(adjectives V.! adjIdx) <> (MS.pack " ") <> (colours V.! colorIdx) <> (MS.pack " ") <> (nouns V.! nounIdx)}):rs)



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
    tbody_ [id_ "tbody"] (L.zipWith viewRow (modelRows m) [1..])
  ]
  where
    viewRow r i = tr_ (conditionalDanger i)
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
