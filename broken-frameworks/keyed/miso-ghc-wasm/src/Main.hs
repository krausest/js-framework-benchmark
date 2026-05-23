-----------------------------------------------------------------------------
{-# LANGUAGE CPP                  #-}
{-# LANGUAGE LambdaCase           #-}
{-# LANGUAGE RecordWildCards      #-}
{-# LANGUAGE ScopedTypeVariables  #-}
{-# LANGUAGE BangPatterns         #-}
{-# LANGUAGE OverloadedStrings    #-}
{-# LANGUAGE ExtendedDefaultRules #-}
-----------------------------------------------------------------------------
module Main where
-----------------------------------------------------------------------------
import           Data.Monoid ((<>))
import           Control.Arrow
import           Data.IntMap.Strict (IntMap)
import qualified Data.IntMap.Strict as IM
import qualified Data.Map as M
import qualified Data.Vector as V
import           System.Random
-----------------------------------------------------------------------------
import           Miso
import           Miso.Html
import           Miso.Html.Property
import           Miso.String (MisoString)
import qualified Miso.String as S
-----------------------------------------------------------------------------
data Row
  = Row
  { rowIdx   :: {-# UNPACK #-} !Int
  , rowTitle :: {-# UNPACK #-} !MisoString
  } deriving (Eq)
-----------------------------------------------------------------------------
data Model = Model
  { rows       :: {-# UNPACK #-} !(IM.IntMap Row)
  , selectedId :: {-# UNPACK #-} !(Maybe Int)
  , lastId     :: {-# UNPACK #-} !Int
  , seed       :: {-# UNPACK #-} !StdGen
  } deriving (Eq)
-----------------------------------------------------------------------------
data Action
  = Create !Int
  | Append !Int
  | Update !Int
  | Remove !Int
  | Clear
  | Swap
  | Select !Int
  | NoOp
-----------------------------------------------------------------------------
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
-----------------------------------------------------------------------------
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
-----------------------------------------------------------------------------
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
-----------------------------------------------------------------------------
#ifdef WASM
foreign export javascript "hs_start" main :: IO ()
#endif
-----------------------------------------------------------------------------
main :: IO ()
main = do
  seed <- newStdGen
  startApp (M.singleton "click" CAPTURE) (vcomp seed)
    where
      vcomp seed = component (initialModel seed) updateModel viewModel
-----------------------------------------------------------------------------
initialModel :: StdGen -> Model
initialModel seed = Model
  { rows = mempty
  , selectedId = Nothing
  , lastId = 0
  , seed = seed
  }
-----------------------------------------------------------------------------
createRows :: Int -> Int -> StdGen -> (StdGen, IntMap Row)
createRows n lastIdx seed = go seed mempty [0..n]
    where
      go seed intMap [] = (seed, intMap)
      go s0 intMap (x:xs) = do
        let (adjIdx, s1)   = randomR (0, V.length adjectives - 1) s0
            (colorIdx, s2) = randomR (0, V.length colours - 1) s1
            (nounIdx, s3)  = randomR (0, V.length nouns - 1) s2
            title = S.intercalate " "
              [ adjectives V.! adjIdx
              , colours V.! colorIdx
              , nouns V.! nounIdx
              ]
        go s3 (IM.insert (x + lastIdx) (Row (x + lastIdx) title) intMap) xs
-----------------------------------------------------------------------------
updateModel :: Action -> Effect parent Model Action
updateModel = \case
  Create n -> do
    Model {..} <- get
    let (newSeed, intMap) = createRows n lastId seed
    modify $ \model ->
      model { lastId = lastId + n
            , rows = intMap
            , seed = newSeed
            }

  Append n -> do
    Model {..} <- get
    let (newSeed, newRows) = createRows n lastId seed
    modify $ \m -> m { lastId = lastId + n
                     , rows = rows <> newRows
                     , seed = newSeed
                     }

  Clear -> modify $ \model -> model { rows = mempty }

  Update n ->  do
    model@Model{..} <- get
    let
      newRows =
        flip IM.mapWithKey rows $ \i row ->
                                    if i `mod` n == 0
                                    then row { rowTitle = rowTitle row <> " !!!" }
                                    else row
    put model { rows = newRows }

  Swap -> do
    model <- get
    let
      len = IM.size (rows model)
      newModel =
        if len > 998
        then model { rows = swappedRows }
        else model
      swappedRows =
        case fst $ IM.findMin (rows model) of
          minKey ->
            let
              x = rows model IM.! (minKey + 1)
              y = rows model IM.! (minKey + 998)
            in
              IM.insert (minKey + 1) y (IM.insert (minKey + 998) x (rows model))
    put newModel

  Select idx -> modify $ \m -> m { selectedId = Just idx }

  Remove idx ->
    modify $ \m -> m { rows = IM.delete idx (rows m) }

  NoOp -> pure ()
-----------------------------------------------------------------------------
viewModel :: Model -> View Model Action
viewModel m = div_ [id_ "main"]
  [ div_
      [class_ "container"]
      [ viewJumbotron
      , viewTable m
      , span_ [class_ "preloadicon glyphicon glyphicon-remove", textProp "aria-hidden" "true"] []
      ]
  ]
-----------------------------------------------------------------------------
viewTable :: Model -> View Model Action
viewTable m@Model{selectedId=idx} =
  table_
    [class_ "table table-hover table-striped test-data"]
    [
      tbody_
        [id_ "tbody"]
        (IM.elems $ IM.mapWithKey viewRow (rows m))
    ]
  where
    viewRow i r@Row{rowIdx=rId} =
      tr_
        [ key_ (toKey rId) 
        , classList_ [ ("danger", Just i == idx) ]
        ]
        [ td_
            [ class_ "col-md-1" ]
            [ text (S.ms (rId + 1)) ]
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
                  , textProp "aria-hidden" "true"
                  ]
                  []
              ]
            ]
        , td_
            [class_ "col-md-6"]
            []
        ]
-----------------------------------------------------------------------------
viewJumbotron :: View Model Action
viewJumbotron =
  div_
    [ class_ "jumbotron" ]
    [ div_
      [ class_ "row" ]
      [ div_
        [ class_ "col-md-6" ]
        [ h1_
            []
            [ text "miso-ghc-wasm-1.9.0.0-keyed" ]
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
-----------------------------------------------------------------------------
