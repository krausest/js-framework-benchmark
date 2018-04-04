{-# LANGUAGE ScopedTypeVariables    #-}
{-# LANGUAGE BangPatterns    #-}
{-# LANGUAGE OverloadedStrings    #-}
{-# LANGUAGE ExtendedDefaultRules    #-}

module Main where

import           Data.Monoid         ((<>))

import qualified Data.Map            as M
import qualified Data.Vector         as V
import qualified Data.Vector.Mutable as MV
import           Miso
import           Miso.String         (MisoString)
import qualified Miso.String         as S
import           System.Random

data Row = Row
  { rowIdx :: !Int
  , rowTitle :: !MisoString
  } deriving (Eq)

data Model = Model
  { rows :: !(V.Vector Row)
  , selectedId :: !(Maybe Int)
  , lastId :: !Int
  } deriving (Eq)

data Action = Create !Int
            | Append !Int
            | Update !Int
            | Remove !Int
            | Clear
            | Swap
            | Select !Int
            | ChangeModel !Model
            | NoOp

adjectives :: V.Vector MisoString
adjectives = V.fromList [ "pretty"
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

colours :: V.Vector MisoString
colours = V.fromList  [ "red"
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

nouns :: V.Vector MisoString
nouns = V.fromList  [ "table"
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

main :: IO ()
main = startApp App
  { initialAction = NoOp
  , model = initialModel
  , update = updateModel
  , view = viewModel
  , events = M.singleton "click" True
  , subs = []
  , mountPoint = Nothing
  }

initialModel :: Model
initialModel = Model
  { rows = V.empty
  , selectedId = Nothing
  , lastId = 1
  }

updateModel :: Action -> Model -> Effect Action Model

updateModel (ChangeModel newModel) _ = noEff newModel

updateModel (Create n) model@Model{lastId=lastIdx} =
  model <# do
    newRows <- generateRows n lastIdx
    pure $ ChangeModel model  { rows = newRows
                              , lastId = lastIdx + n
                              }

updateModel (Append n) model@Model{rows=existingRows, lastId=lastIdx} =
  model <# do
    newRows <- generateRows n (lastId model)
    pure $ ChangeModel model  { rows=existingRows V.++ newRows
                              , lastId=lastIdx + n
                              }

updateModel Clear model = noEff model{ rows= V.empty }

updateModel (Update n) model =
  noEff model{ rows = updatedRows }
  where
      updatedRows = V.imap updateR (rows model)
      updateR i row = if mod i 10 == 0
                          then row{ rowTitle = rowTitle row <> " !!!" }
                          else row

updateModel Swap model =
  noEff newModel
  where
    currentRows = rows model
    from = V.indexed
    newModel = if V.length currentRows > 998
                  then model { rows = swappedRows }
                  else model
    swappedRows = V.modify (\v -> MV.swap v 1 998) currentRows

updateModel (Select idx) model = noEff model{selectedId=Just idx}

updateModel (Remove idx) model@Model{rows=currentRows} =
  noEff model { rows = firstPart V.++ V.drop 1 remainingPart }
  where
    (firstPart, remainingPart) = V.splitAt idx currentRows

updateModel NoOp model = noEff model

generateRows :: Int -> Int -> IO (V.Vector Row)
generateRows n lastIdx = V.generateM n $ \x -> do
  adjIdx <- randomRIO (0, V.length adjectives - 1)
  colorIdx <- randomRIO (0, V.length colours - 1)
  nounIdx <- randomRIO (0, V.length nouns - 1)
  pure Row
          { rowIdx=lastIdx + x
          , rowTitle= (adjectives V.! adjIdx)
                      <> S.pack " "
                      <> (colours V.! colorIdx)
                      <> S.pack " "
                      <> (nouns V.! nounIdx)
          }

viewModel :: Model -> View Action
viewModel m = div_ [id_ "main"]
  [ div_
      [class_ "container"]
      [ viewJumbotron
      , viewTable m
      , span_ [class_ "preloadicon glyphicon glyphicon-remove", textProp "aria-hidden" "true"] []
      ]
  ]

viewTable :: Model -> View Action
viewTable m@Model{selectedId=idx} =
  table_
    [class_ "table table-hover table-striped test-data"]
    [
      tbody_
        [id_ "tbody"]
        (V.toList $ V.imap viewRow (rows m))
    ]
  where
    viewRow i r@Row{rowIdx=rId} =
      trKeyed_ (toKey rId)
        (conditionalDanger i)
        [ td_
            [ class_ "col-md-1" ]
            [ text (S.ms rId) ]
        , td_
            [ class_ "col-md-4" ]
            [ a_ [class_ "lbl", onClick (Select i)] [text (rowTitle r)]
            ]
        , td_
            [ class_ "col-md-1" ]
            [ a_
              [ class_ "remove" ]
              [ span_
                  [class_ "glyphicon glyphicon-remove remove"
                  , onClick (Remove i)
                  ]
                  []
              ]
            ]
        , td_
            [class_ "col-md-6"]
            []
        ]

    conditionalDanger i = [class_ "danger" | Just i == idx]


viewJumbotron :: View Action
viewJumbotron =
  div_
    [ class_ "jumbotron" ]
    [ div_
      [ class_ "row" ]
      [ div_
        [ class_ "col-md-6" ]
        [ h1_
            []
            [ text "miso-0.18.0.0-keyed" ]
        ]
      , div_
          [ class_ "col-md-6" ]
          [ div_
              [ class_ "row" ]
              [ div_
                  [ class_ "col-sm-6 smallpad" ]
                  [ button_
                      [type_ "button"
                      , class_ "btn btn-primary btn-block"
                      , id_ "run"
                      , onClick (Create 1000)
                      ]
                      [text "Create 1,000 rows"]
                      ]
              , div_
                  [class_ "col-sm-6 smallpad"]
                  [
                    button_
                      [type_ "button"
                      , class_ "btn btn-primary btn-block"
                      , id_ "runlots"
                      , onClick (Create 10000)
                      ]
                      [text "Create 10,000 rows"]
                  ]
              , div_
                  [class_ "col-sm-6 smallpad"]
                  [
                    button_
                      [type_ "button"
                      , class_ "btn btn-primary btn-block"
                      , id_ "add"
                      , onClick (Append 1000)
                      ]
                      [text "Add 1,000 rows"]
                  ]
              , div_
                  [class_ "col-sm-6 smallpad"]
                  [ button_
                      [type_ "button"
                      , class_ "btn btn-primary btn-block"
                      , id_ "update"
                      , onClick (Update 10)
                      ]
                      [text "Update every 10th row"]
                  ]
              , div_
                  [class_ "col-sm-6 smallpad"]
                  [
                    button_
                      [ type_ "button"
                      , class_ "btn btn-primary btn-block"
                      , id_ "clear", onClick Clear
                      ]
                      [text "Clear"]
                  ]
              , div_
                  [class_ "col-sm-6 smallpad"]
                  [ button_
                    [type_ "button"
                    , class_ "btn btn-primary btn-block"
                    , id_ "swaprows"
                    , onClick Swap
                    ]
                    [text "Swap rows"]
                  ]
              ]
          ]
      ]
    ]
