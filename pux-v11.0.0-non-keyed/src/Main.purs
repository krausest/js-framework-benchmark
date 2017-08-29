module Main where

import Control.Monad.Eff (Eff)
import Control.Monad.Eff.Class (liftEff)
import Control.Monad.Eff.Console (CONSOLE, log)
import Control.Monad.Eff.Exception (EXCEPTION, stack)
import Control.Monad.Eff.Random (RANDOM, randomInt)
import Control.Monad.Rec.Class (Step(..), tailRecM2)
import Control.Safely as Safe
import DOM (DOM)
import DOM.Event.Event (eventPhase, preventDefault)
import Data.Array (cons, deleteAt, filter, findIndex, index, length, mapWithIndex, modifyAt, unsafeIndex, updateAt, (!!))
import Data.Monoid (class Monoid, mempty)
import Data.Traversable (traverse_)
import Data.Maybe (Maybe(..), fromMaybe)
import Debug.Trace as DT
import Prelude hiding (div,id)
import Pux (EffModel, noEffects, start)
import Pux.DOM.Events (DOMEvent, onClick)
import Pux.DOM.HTML (HTML, memoize)
import Pux.Renderer.React (renderToDOM)
import Signal.Channel (CHANNEL)
import Text.Smolder.HTML (a, button, div, h1, span, table, tbody, td, tr)
import Text.Smolder.HTML.Attributes (className, href, selected, type', id)
import Text.Smolder.Markup (attribute, text, (!), (#!))


----------
-- Main Entry

-- | Start and render the app
main :: Eff (dom :: DOM, channel :: CHANNEL, exception :: EXCEPTION, random :: RANDOM, console :: CONSOLE) Unit
main = do
  app <- start
    { initialState: init
    , view
    , foldp
    , inputs: []
    }

  renderToDOM "#app" app.markup app.input



----------
-- State

type State =
  { rows   :: Array Row
  , lastId :: Int }

type Row =
  { rid        :: Int
  , label      :: String
  , isSelected :: Boolean }

init :: State
init =
  { rows: [], lastId: 1 }



----------
-- Events

data Event
  = MergeRows MergeType (Array Row) Int
  | Create MergeType Int DOMEvent
  | UpdateEvery Int DOMEvent
  | Clear DOMEvent
  | Swap Int Int DOMEvent
  | Remove Int DOMEvent
  | Select Int DOMEvent

data MergeType
  = Replace
  | Append


----------
-- Updates

-- | Return a new state (and effects) from each event
foldp :: Event -> State -> EffModel State Event (dom :: DOM, random :: RANDOM, console :: CONSOLE)

-- Write the received N rows over the rows held by the state,
-- and update the last Id to the received index.
foldp (MergeRows Replace arr i) st =
  noEffects $ st { rows = arr, lastId = i }

-- Append the received N rows into the rows held by the state, and update
-- the last Id to the received index.
foldp (MergeRows Append arr i) st =
  noEffects $ st { rows = st.rows <> arr, lastId = i }

-- Clear all rows from the screen and reset the last id to 1
foldp (Clear ev) st =
  { state: st { rows = [], lastId = 1 }, effects: [ liftEff (preventDefault ev) *> pure Nothing] }

-- Create the specified number of rows and prevent the browser
-- from receiving the click event. Depending on the provided
-- merger type (append or replace), return the proper event.
foldp (Create merger i ev) st =
  { state: st
  , effects: [ liftEff $ do
                    preventDefault ev
                    rows <- createRandomNRows i st.lastId
                    pure $ Just $ MergeRows merger rows (st.lastId + i) ] }

-- Update every row at the specified interval by appending three
-- exclamation points.
foldp (UpdateEvery i ev) st =
  { state: st
  , effects: [ liftEff $ do
                    preventDefault ev
                    pure $ Just $ MergeRows Replace (mapWithIndex (updateRowLabel i) st.rows) st.lastId ] }

-- Swap two rows in the view array (standard set to index 4 and 9)
foldp (Swap i0 i1 ev) st =
  { state: st
  , effects: [ liftEff $ do
                  preventDefault ev
                  case swapRows st.rows i0 i1 of
                    Nothing  -> log "Failed to swap rows." *>
                                pure Nothing
                    Just arr -> pure $ Just $ MergeRows Replace arr st.lastId ] }

-- Toggle the selected status of the row at the given index
foldp (Select i ev) st =
  { state: st
  , effects: [ liftEff $ do
                  preventDefault ev
                  pure $ Just $ MergeRows Replace (fromMaybe st.rows $ updateRowSelected i st.rows) st.lastId ] }


-- Toggle the selected status of the row at the given index
foldp (Remove i ev) st =
  { state: st
  , effects: [ liftEff $ do
                  preventDefault ev
                  pure $ Just $ MergeRows Replace (deleteRow i st.rows) st.lastId ] }



-----
-- Update Helpers


-- | Create new batch of random rows
-- | Note: use `tailRecM` to ensure proper tail recursion in monadic code
createRandomNRows :: forall e. Int -> Int -> Eff ( random :: RANDOM | e) (Array Row)
createRandomNRows n lastId = tailRecM2 f [] n
  where
    f arr 0 = pure (Done arr)
    f arr n = do
      str <- selectConcatItems

      let str' = case str of
            Nothing -> ""
            Just s  -> s

      pure (Loop $ { a: (createAndAppendRow arr (n - 1) lastId str')
                   , b: (n - 1) })


-- | Create a single row
createAndAppendRow :: Array Row -> Int -> Int -> String -> Array Row
createAndAppendRow arr index lastId s =
  cons
  ({ rid: lastId + index
    , label: s
    , isSelected: false })
  arr



-- | Select a random element from each array of strings,
-- | and then concatenate them into a string value.
selectConcatItems :: forall e. Eff ( random :: RANDOM | e) (Maybe String)
selectConcatItems = do
  adj <- index adjectives <$> (randomInt 1 $ length adjectives - 1)
  clr <- index colours    <$> (randomInt 1 $ length colours - 1)
  non <- index nouns      <$> (randomInt 1 $ length nouns - 1)

  pure $ adj <> Just " " <> clr <> Just " " <> non


-- | For use in iterating through rows
updateRowLabel :: Int -> Int -> Row -> Row
updateRowLabel interval ix row =
  if ix `mod` interval == 0
  then row { label = row.label <> " !!!" }
  else row


-- | Update the status of a particular row.
--   Only one row is selected at any time
updateRowSelected :: Int -> Array Row -> Maybe (Array Row)
updateRowSelected pos arr = do
  let s' = findIndex (\x -> x.isSelected) arr
  case s' of
    Nothing -> do
      i <- findIndex (\x -> x.rid == pos) arr
      modifyAt i (\x -> x { isSelected = true }) arr
    Just s  -> do
      i <- findIndex (\x -> x.rid == pos) arr
      if s == i
         then pure arr
         else do
            deselect <- modifyAt s (\x -> x { isSelected = false }) arr
            modifyAt i (\x -> x { isSelected = true }) deselect


-- | Remove a status a particular row.
deleteRow :: Int -> Array Row -> Array Row
deleteRow pos arr =
  case rowIndex of
    Nothing -> arr
    Just i  ->
      case deleteAt i arr of
        Nothing   -> arr
        Just arr' -> arr'
  where
    rowIndex = findIndex (\x -> x.rid == pos) arr


-- | Swap two rows in an array, updating their ids
swapRows :: Array Row -> Int -> Int -> Maybe (Array Row)
swapRows arr index1 index2 = do
  rowA <- arr !! index1
  rowB <- arr !! index2

  let diff = index2 - index1
  arrA <- updateAt index1 rowB { rid = rowB.rid - diff } arr
  arrB <- updateAt index2 rowA { rid = rowA.rid + diff } arrA

  pure arrB


----------
-- View

-- | Return markup from the state
view :: State -> HTML Event
view = memoize \st ->
  div ! className "container" $ do

    div ! className "jumbotron" $ do
      div ! className "row" $ do
        div ! className "col-md-6" $ do
          h1 $ text "Pux 10.0.0"
        div ! className "col-md-6" $ do
          traverse_ viewButton buttons

    table ! className "table table-hover table-striped test-data" $ do
      tbody $ do
        Safe.traverse_ viewRow st.rows


viewRow :: Row -> HTML Event
viewRow { rid, label, isSelected } = do
  case isSelected of
    true  -> tr ! selected "true" ! className "danger"
    false -> tr ! selected ""

  $ do
      td ! className "col-md-1" $ text (show rid)
      td ! className "col-md-4" $
         a ! href "#" #! onClick (Select rid) $ text label
      td ! className "col-md-1" $ do
         a ! href "#" $ do
           span ! className "glyphicon glyphicon-remove"
                ! attribute "aria-hidden" "true"
                #! onClick (Remove rid)
                $ text ""
      td ! className "col-md-6" $ text ""



viewButton :: { bid :: String, str :: String, ev :: (DOMEvent -> Event) } -> HTML Event
viewButton { bid, str, ev } =
  div ! className "col-sm-6 smallpad" $ do
    button
      ! type' "button"
      ! className "btn btn-primary btn-block"
      ! id bid
      #! onClick ev
      $ text str


buttons :: Array { bid :: String, str :: String, ev :: (DOMEvent -> Event) }
buttons =
  [ { bid: "run",      str: "Create 1,000 Rows",     ev: Create Replace 1000  }
  , { bid: "runlots",  str: "Create 10,000 Rows",    ev: Create Replace 10000 }
  , { bid: "add",      str: "Append 1,000 Rows",     ev: Create Append  1000  }
  , { bid: "update",   str: "Update Every 10th Row", ev: UpdateEvery 10 }
  , { bid: "clear",    str: "Clear",                 ev: Clear }
  , { bid: "swaprows", str: "Swap Rows",             ev: Swap 4 9 } ]




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
