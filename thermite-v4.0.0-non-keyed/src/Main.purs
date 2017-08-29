module Main where

import Prelude

import Control.Monad.Eff (Eff)
import Control.Monad.Eff.Class (liftEff)
import Control.Monad.Eff.Random (RANDOM, randomInt)
import Control.Monad.Rec.Class (Step(Loop, Done), tailRecM2)
import DOM (DOM)
import Data.Array as A
import Data.Foldable (fold)
import Data.Lens (Lens', Prism', lens, prism', over)
import Data.List as L
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Monoid (mempty)
import Data.Tuple (Tuple(..), uncurry)
import React.DOM as R
import React.DOM.Props as RP
import Thermite as T


----------
-- Main Entry

-- Start and run the application
main :: forall e. Eff ( dom :: DOM, random :: RANDOM | e ) Unit
main = T.defaultMain spec initialState unit


----------
-- State

type State =
  { selected :: Maybe Int
  , rows     :: L.List Row
  , lastId   :: Int }

-- | A `Lens` which corresponds to the `rows` property.
_rows :: Lens' State (L.List Row)
_rows = lens _.rows (_ { rows = _ })

initialState :: State
initialState =
  { selected: Nothing
  , rows: L.Nil
  , lastId: 1 }


----------
-- Actions

data Action
  = Create Int
  | Append Int
  | Clear
  | UpdateEvery Int
  | Swap Int Int
  | ItemAction Int RowAction

_ItemAction :: Prism' Action (Tuple Int RowAction)
_ItemAction = prism' (uncurry ItemAction) unwrap
  where
  unwrap (ItemAction i a) = Just (Tuple i a)
  unwrap _ = Nothing


----------
-- Main Component

spec :: forall t e. T.Spec ( random :: RANDOM | e ) State t Action
spec = container $ fold
  [ header
  , table $ T.withState \st -> T.focus _rows _ItemAction (T.foreach \_ -> row st) ]

header :: forall t e. T.Spec ( random :: RANDOM | e) State t Action
header = T.simpleSpec perform render
  where
  render :: T.Render State t Action
  render dispatch _ st _ =
      [ R.div [ RP.className "jumbotron" ]
        [ R.div [ RP.className "row" ]
          [ R.div [ RP.className "col-md-6" ]
            [ R.h1'
              [ R.text "Thermite 4.0.0" ] ]
          , R.div [ RP.className "col-md-6" ]
            $ map (renderButton dispatch) buttons
      ] ] ]

  perform :: T.PerformAction ( random :: RANDOM | e ) State t Action
  perform act _ st = case act of

    Create i -> void $ do
      rows <- liftEff $ createRandomNRows i st.lastId
      T.writeState $ st { rows = L.fromFoldable rows, lastId = st.lastId + i }

    Append i -> void $ do
      rows <- liftEff $ createRandomNRows i st.lastId
      T.writeState $ st { rows = st.rows <> L.fromFoldable rows, lastId = st.lastId + i }

    Clear -> void $ T.writeState initialState

    UpdateEvery i -> void $ T.modifyState
      \st -> st { rows = L.mapWithIndex (updateRowLabel i) st.rows }

    Swap i0 i1 -> void $ T.modifyState
      \st -> st { rows = fromMaybe st.rows (L.fromFoldable <$> swapRows (A.fromFoldable st.rows) i0 i1) }

    ItemAction i Select -> void $ T.modifyState
      \st -> st { selected = selectRow st.selected i (A.fromFoldable st.rows) }

    ItemAction i Remove -> void $ T.modifyState
      \st -> st { rows = fromMaybe st.rows (L.deleteAt i st.rows) }



----------
-- Table Container

container = over T._render \render d p s c ->
  [ R.div [ RP.className "container" ] (render d p s c) ]

table = over T._render \render dispatch p s c ->
  [ R.table
    [ RP.className "table table-striped test-data" ]
    [ R.tbody' $ render dispatch p s c ]
  ]


----------
-- Row Component

type Row =
  { rid   :: Int
  , label :: String }

initialRowState :: Int -> Row
initialRowState i =
  { rid: i, label: "" }

data RowAction = Select | Remove


row :: forall t0 t1. State -> T.Spec t0 Row t1 RowAction
row st = T.simpleSpec perform render
  where

    render :: T.Render Row t1 RowAction
    render dispatch _ state _ =
     [ R.tr
       ( case st.selected of
           Nothing -> mempty
           Just i  -> if i == state.rid
             then [ RP.className "danger"
                  , RP.selected true ]
             else mempty )
       [ R.td
           [ RP.className "col-md-1" ]
           [ R.text $ show state.rid ]
       , R.td
           [ RP.className "col-md-4" ]
           [ R.a
             [ RP.href "#"
             , RP.onClick \_ -> dispatch Select ]
             [ R.text state.label ] ]
       , R.td
           [ RP.className "col-md-1" ]
           [ R.a
             [ RP.href "#" ]
             [ R.span
               [ RP.className "glyphicon glyphicon-remove"
               , RP.aria { hidden: "true" }
               , RP.onClick \_ -> dispatch Remove ]
               [ R.text "" ] ]
           ]
       , R.td
           [ RP.className "col-md-6" ]
           [ R.text "" ] ]
       ]

    perform :: T.PerformAction t0 Row t1 RowAction
    perform _ _ _ = pure unit




----------
-- Helpers

buttons :: Array { bid :: String, str :: String, a :: Action }
buttons =
  [ { bid: "run",      str: "Create 1,000 Rows",     a: Create 1000    }
  , { bid: "runlots",  str: "Create 10,000 Rows",    a: Create 10000   }
  , { bid: "add",      str: "Append 1,000 Rows",     a: Append 1000    }
  , { bid: "update",   str: "Update Every 10th Row", a: UpdateEvery 10 }
  , { bid: "clear",    str: "Clear",                 a: Clear          }
  , { bid: "swaprows", str: "Swap Rows",             a: Swap 4 9       } ]

renderButton :: _
             -> { bid :: String, str :: String, a :: Action }
             -> _
renderButton dispatch { bid, str, a } =
  R.div
    [ RP.className "col-sm-6 smallpad" ]
    [ R.button
      [ RP._type "button"
      , RP.className "btn btn-primary btn-block"
      , RP._id bid
      , RP.onClick \_ -> dispatch a ]
      [ R.text str ] ]

----------
--

-----
-- Update Helpers

-- | Create new batch of random rows
-- | Note: use `tailRecM` to ensure proper tail recursion in monadic code
createRandomNRows :: forall e. Int -> Int -> Eff ( random :: RANDOM | e) (Array Row)
createRandomNRows n lastId = tailRecM2 f [] n
  where
    f xs 0 = pure $ Done xs
    f xs n = do
      str <- selectConcatItems
      let str' = fromMaybe "" str
      pure ( Loop
              $ { a: (createAndAppendRow xs n lastId str')
                , b: (n - 1) } )


-- | Create a single row
createAndAppendRow :: Array Row -> Int -> Int -> String -> Array Row
createAndAppendRow xs index lastId s =
  A.cons { rid: lastId + index, label: s } xs


-- | For use in iterating through rows
updateRowLabel :: Int -> Int -> Row -> Row
updateRowLabel interval ix row =
  if ix `mod` interval == 0
  then row { label = row.label <> " !!!" }
  else row


-- | Select a random element from each array of strings,
-- | and then concatenate them into a string value.
selectConcatItems :: forall e. Eff ( random :: RANDOM | e) (Maybe String)
selectConcatItems = do
  adj <- A.index adjectives <$> (randomInt 1 $ A.length adjectives - 1)
  clr <- A.index colours    <$> (randomInt 1 $ A.length colours - 1)
  non <- A.index nouns      <$> (randomInt 1 $ A.length nouns - 1)

  pure $ adj <> Just " " <> clr <> Just " " <> non


-- | Get the ID of a selected row.
selectRow :: Maybe Int -> Int -> Array Row -> Maybe Int
selectRow current pos arr = arr A.!! pos >>= \row ->
  case current of
    Nothing -> Just row.rid
    Just i  -> if row.rid == i then Nothing else Just row.rid


-- | Swap two rows in an array, updating their ids
swapRows :: Array Row -> Int -> Int -> Maybe (Array Row)
swapRows arr index1 index2 = do
  rowA <- arr A.!! index1
  rowB <- arr A.!! index2

  let diff = index2 - index1
  arrA <- A.updateAt index1 rowB { rid = rowB.rid - diff } arr
  arrB <- A.updateAt index2 rowA { rid = rowA.rid + diff } arrA

  pure arrB


----------
-- Supporting Data

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
