module Main where

import Prim hiding (Row)
import Prelude

import Data.Array as Array
import Data.Maybe (Maybe(..))
import Effect (Effect)
import Effect.Aff (Aff)
import Effect.Uncurried (EffectFn5, runEffectFn5)
import Halogen as H
import Halogen.Aff as HA
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Halogen.VDom.Driver (runUI)

main :: Effect Unit
main = HA.runHalogenAff do
  body <- HA.awaitBody
  runUI app unit body

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

app :: forall q i o. H.Component q i o Aff
app = H.mkComponent
  { initialState
  , render
  , eval: H.mkEval $ H.defaultEval { handleAction = handleAction }
  }
  where
  initialState :: _ -> State 
  initialState _ = { rows: [], lastId: 0, selectedId: 0 }

  render :: forall ps. State -> H.ComponentHTML Action ps Aff
  render state = 
    HH.div
      [ class_ "container" ]
      [ jumbotron 
      , HH.table
          [ class_ "table table-hover table-striped test-data" ]
          [ HH.tbody_ do
              map (renderRow state.selectedId) state.rows
          ]
      , footer
      ]

  handleAction :: forall ps. Action -> H.HalogenM State Action ps o Aff Unit
  handleAction = case _ of
    Create amount -> do
      state <- H.get
      newRows <- H.liftEffect $ createRandomNRows amount state.lastId
      H.modify_ _ { rows = newRows, lastId = state.lastId + amount }
    
    AppendOneThousand -> do
      state <- H.get
      let amount = 1000
      newRows <- H.liftEffect $ createRandomNRows amount state.lastId
      H.modify_ _ { rows = state.rows <> newRows, lastId = state.lastId + amount }
    
    UpdateEveryTenth -> do
      let 
        updateLabel ix row =
          if ix `mod` 10 == 0 then row { label = row.label <> " !!!" } else row

      H.modify_ \state -> state { rows = Array.mapWithIndex updateLabel state.rows }
    
    Clear ->
      H.modify_ _ { rows = [] }
    
    Swap -> do
      state <- H.get
      case swapRows state.rows 1 998 of 
        Nothing -> pure unit
        Just rows -> H.modify_ _ { rows = rows }
    
    Remove id ->
      H.modify_ \state -> 
        state { rows = Array.filter (\r -> r.id /= id) state.rows }
    
    Select id -> do
      state <- H.get
      if state.selectedId == id then
        pure unit
      else
        H.modify_ _ { selectedId = id }
        
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

renderActionButton :: forall ps. ActionButton -> H.ComponentHTML Action ps Aff
renderActionButton { id, label, action } = 
  HH.div
    [ class_ "col-sm-6 smallpad" ]
    [ HH.button 
        [ HP.type_ HP.ButtonButton
        , class_ "btn btn-primary btn-block"
        , HP.id id
        , HP.attr (HH.AttrName "ref") "text"
        , HE.onClick \_ -> action
        ]
        [ HH.text label ]
    ]

renderRow :: forall ps. Int -> Row -> H.ComponentHTML Action ps Aff
renderRow selectedId row =
  HH.tr
    (if selectedId == row.id then
      [ class_ "danger"
      , HP.attr (HH.AttrName "selected") "true" 
      ]
    else
      [ ]
    )
    [ HH.td colMd1 [ HH.text (show row.id) ]
    , HH.td colMd4 [ HH.a [ HE.onClick \_ -> Select row.id ] [ HH.text row.label ] ]
    , HH.td colMd1 [ HH.a [ HE.onClick \_ -> Remove row.id ] removeIcon ]
    , spacer
    ]

removeIcon :: forall ps. Array (H.ComponentHTML Action ps Aff)
removeIcon =
  [ HH.span
      [ class_ "glyphicon glyphicon-remove"
      , HP.attr (HH.AttrName "aria-hidden") "true"
      ]
      []
  ]

class_ :: forall r i. String -> HH.IProp ( class :: String | r ) i
class_ = HP.class_ <<< HH.ClassName

colMd1 :: forall r i. Array (HH.IProp ( class :: String | r ) i)
colMd1 = [ class_ "col-md-1" ]

colMd4 :: forall r i. Array (HH.IProp ( class :: String | r) i)
colMd4 = [ class_ "col-md-4" ]

spacer :: forall p i. HH.HTML p i
spacer = HH.td [ class_ "col-md-6" ] []

footer :: forall ps. H.ComponentHTML Action ps Aff
footer =
  HH.span
    [ class_ "preloadicon glyphicon glyphicon-remove"
    , HP.attr (HH.AttrName "aria-hidden") "true"
    ]
    []

jumbotron :: forall ps. H.ComponentHTML Action ps Aff
jumbotron =
  HH.div
    [ class_ "jumbotron" ]
    [ HH.div
        [ class_ "row" ]
        [ HH.div
            [ class_ "col-md-6" ]
            [ HH.h1_ [ HH.text "Halogen 7.0.0 (non-keyed)" ] ]
            , HH.div [ class_ "col-md-6" ] do
                map (HH.lazy renderActionButton) buttons
            ]
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