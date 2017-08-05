module Main where

import Prelude

import Control.Monad.Aff (Aff)
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.Console (CONSOLE, log)
import Control.Monad.Eff.Random (RANDOM, randomInt)
import Control.Monad.Rec.Class (Step(..), tailRecM2)
import DOM.HTML.Indexed.ButtonType (ButtonType(..))
import Data.Array hiding (init)
import Data.Maybe (Maybe(..), fromMaybe)
import Halogen as H
import Halogen.Aff as HA
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Halogen.VDom.Driver (runUI)


-----------
-- Main Entry

-- Start and run the application
main :: Eff (HA.HalogenEffects (random :: RANDOM, console :: CONSOLE)) Unit
main = HA.runHalogenAff $ do
  body <- HA.awaitBody
  runUI app unit body

-- The top level component to render to the <body> element
app :: forall eff. H.Component HH.HTML Query Unit Void (Aff (random :: RANDOM, console :: CONSOLE | eff))
app =
  H.component
    { initialState: const init
    , render
    , eval
    , receiver: const Nothing
    }


----------
-- State

type State =
  { rows     :: Array Row
  , selected :: Maybe Int
  , lastId   :: Int }

type Row =
  { rid        :: Int
  , label      :: String }

init :: State
init =
  { rows: [], selected: Nothing, lastId: 1 }



----------
-- Queries

data Query a
  = Create Int a
  | Append Int a
  | UpdateEvery Int a
  | Clear a
  | Swap Int Int a
  | Remove Int a
  | Select Int a


eval :: forall eff. Query ~> H.ComponentDSL State Query Void (Aff (random :: RANDOM, console :: CONSOLE | eff))
eval = case _ of

  Clear next -> do
    H.put init
    pure next

  Create i next -> do
    st   <- H.get
    rows <- H.liftEff $ createRandomNRows i st.lastId
    H.modify (\st -> st { rows = rows, lastId = st.lastId + i })
    pure next

  Append i next -> do
    st   <- H.get
    rows <- H.liftEff $ createRandomNRows i st.lastId
    H.modify (\st -> st { rows = st.rows <> rows, lastId = st.lastId + i})
    pure next

  UpdateEvery i next -> do
    st  <- H.get
    let rows = mapWithIndex (updateRowLabel i) st.rows
    H.modify (\st -> st { rows = rows } )
    pure next

  Swap i0 i1 next -> do
    st <- H.get
    case swapRows st.rows i0 i1 of
      Nothing  ->
        H.liftEff $ log "Failed to swap rows."
      Just arr ->
        H.modify (\st -> st { rows = arr })
    pure next

  -- If the row is already selected, deselect, else set it as the selected row.
  Select i next -> do
    st <- H.get
    H.modify (\st -> st { selected = if (Just i) == st.selected then Nothing else Just i })
    pure next

  Remove i next -> do
    st <- H.get
    H.modify (\st -> st { rows = deleteRow i st.rows })
    pure next



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
   , label: s })
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
-- Rendering Views

render :: State -> H.ComponentHTML Query
render state =
  let
    label = show state.lastId
  in
    HH.div
      [ HP.classes [ HH.ClassName "container" ] ]
      [ HH.div
        [ HP.classes [ HH.ClassName "jumbotron" ] ]
        [ HH.div
          [ HP.classes [ HH.ClassName "row" ] ]
          [ HH.div
            [ HP.classes [ HH.ClassName "col-md-6" ] ]
            [ HH.h1_
              [ HH.text "Halogen 2.1.0" ] ]
          , HH.div
            [ HP.classes [ HH.ClassName "col-md-6" ] ]
            $ map renderButton buttons
          ]
        ]
      , HH.table
        [ HP.classes [ HH.ClassName "table table-hover table-striped test-data" ] ]
        [ HH.tbody_
          $ map (renderRow state.selected) state.rows ]
      ]


renderRow :: Maybe Int -> Row -> H.ComponentHTML Query
renderRow mi { rid, label } =
  let
    checkSelected =
      case mi of
        Nothing -> HH.tr_
        Just i  ->
          if rid == i
          then HH.tr [ HP.classes [ HH.ClassName "danger"]
                     , HP.attr (HH.AttrName "selected") "true" ]
          else HH.tr_
  in
   checkSelected
     [
       HH.td
         [ HP.classes [ HH.ClassName "col-md-1" ] ]
         [ HH.text $ show rid ]
     , HH.td
         [ HP.classes [ HH.ClassName "col-md-4" ] ]
         [ HH.a
           [ HP.href "#", HE.onClick (HE.input_ $ Select rid) ]
           [ HH.text label ] ]
     , HH.td
         [ HP.classes [ HH.ClassName "col-md-1" ] ]
         [ HH.a
           [ HP.href "#" ]
           [ HH.span
             [ HP.classes [ HH.ClassName "glyphicon glyphicon-remove" ]
             , HP.attr (HH.AttrName "aria-hidden") "true"
             , HE.onClick (HE.input_ $ Remove rid) ]
             [ HH.text "" ] ] ]
     , HH.td
         [ HP.classes [ HH.ClassName "col-md-6" ] ]
         [ HH.text "" ]
     ]


renderButton ::
  { bid :: String, str :: String, q :: (Unit -> Query Unit) }
  -> H.ComponentHTML Query
renderButton { bid, str, q } =
  HH.div
    [ HP.classes [ HH.ClassName "col-sm-6 smallpad" ] ]
    [ HH.button
      [ HP.type_ ButtonButton
      , HP.classes [ HH.ClassName "btn btn-primary btn-block" ]
      , HP.id_ bid
      , HE.onClick (HE.input_ q) ]
      [ HH.text str ]
    ]


buttons :: Array { bid :: String, str :: String, q :: (Unit -> Query Unit) }
buttons =
  [ { bid: "run",      str: "Create 1,000 Rows",     q: Create 1000    }
  , { bid: "runlots",  str: "Create 10,000 Rows",    q: Create 10000   }
  , { bid: "add",      str: "Append 1,000 Rows",     q: Append 1000    }
  , { bid: "update",   str: "Update Every 10th Row", q: UpdateEvery 10 }
  , { bid: "clear",    str: "Clear",                 q: Clear          }
  , { bid: "swaprows", str: "Swap Rows",             q: Swap 4 9       } ]



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
