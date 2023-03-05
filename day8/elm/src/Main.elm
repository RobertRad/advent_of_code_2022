module Main exposing (..)

import Array exposing (Array)
import Browser
import Html exposing (Html, div, span, text)
import Html.Attributes exposing (style)
import Html.Events exposing (onClick)
import Input
import Maybe exposing (withDefault)

-- MAIN

main : Program () Model Msg
main =
  Browser.sandbox { init = init, update = update, view = view }


-- MODEL

type alias Model =
  { trees : Array (Array Int)
  , calculated : Array (Array Bool)
  , visible : Int
  , selected : { x : Int, y : Int }
  , colors : Array (Array Color)
  }

type Color = None | Highlighted | Green | Red

input : Array (Array Int)
input =
  Input.values


init : Model
init =
  Model
    input
    calcVisible
    (countVisible calcVisible)
    { x = 1, y = 1 }
    (Array.repeat (Array.length input) (Array.repeat (Array.length (withDefault Array.empty (Array.get 0 input))) None))


getTreesAtRow : Int -> Array Int
getTreesAtRow y =
    withDefault Array.empty (Array.get y input)


getTreesAtColumn : Int -> Array Int
getTreesAtColumn x =
  Array.map (\row -> withDefault 0 (Array.get x row)) input


getTreeAt : Int -> Int -> Int
getTreeAt x y =
  let
    row = (withDefault Array.empty (Array.get y input))
  in withDefault 0 (Array.get x row)

calcVisibleValue : Int -> Int -> Int -> Bool
calcVisibleValue x y val =
  let
    areTreesAboveHigherOrEqual =
      Array.foldl (||) False (Array.indexedMap (\i cmp -> if i < y then (cmp >= val) else False) (getTreesAtColumn x))
    areTreesBelowHigherOrEqual =
      Array.foldl (||) False (Array.indexedMap (\i cmp -> if i > y then (cmp >= val) else False) (getTreesAtColumn x))
    areTreesLeftHigherOrEqual =
      Array.foldl (||) False (Array.indexedMap (\i cmp -> if i < x then (cmp >= val) else False) (getTreesAtRow y))
    areTreesRightHigherOrEqual =
      Array.foldl (||) False (Array.indexedMap (\i cmp -> if i > x then (cmp >= val) else False) (getTreesAtRow y))
  in
  areTreesAboveHigherOrEqual && areTreesBelowHigherOrEqual && areTreesLeftHigherOrEqual && areTreesRightHigherOrEqual


calcVisibleRow : Int -> Array Int -> Array Bool
calcVisibleRow y row =
  Array.indexedMap (\i val -> calcVisibleValue i y val) row


calcVisible : Array (Array Bool)
calcVisible =
  Array.indexedMap calcVisibleRow input


countVisible : Array (Array Bool) -> Int
countVisible grid =
  Array.foldl (+) 0 (Array.map (\inner -> Array.foldl (+) 0 (Array.map (\b -> if b then 0 else 1) inner)) grid)


calcColorValue : { x : Int, y : Int } -> Int -> Int -> Int -> Color
calcColorValue selected x y val =
  if (x == selected.x) && (y == selected.y) then
    Highlighted
  else if not (x == selected.x) && not (y == selected.y) then
    None
  else
    if val >= (getTreeAt selected.x selected.y) then
      Red
    else
      Green

calcColorRow : { x : Int, y : Int } -> Int -> Array Int -> Array Color
calcColorRow selected y row =
  Array.indexedMap (\i val -> calcColorValue selected i y val) row

calcColor : Array (Array Int) -> { x : Int, y : Int } -> Array (Array Color)
calcColor grid selected =
  Array.indexedMap (\y row -> calcColorRow selected y row) grid


getStyleColor : Array (Array Color) -> Int -> Int -> String
getStyleColor colors x y =
  case (withDefault None (Array.get x (withDefault Array.empty (Array.get y colors)))) of
    None ->
      "#FFFFFF"
    Highlighted ->
      "#d9d914"
    Green ->
      "#49fc08"
    Red ->
      "#db4655"

displayRow : Int -> Array a -> Array (Array Color) -> (a -> String) -> Html Msg
displayRow y row colors toString =
 div
  [
    style "display" "flex",
    style "flex-direction" "row"
  ]
  (Array.toList
    (Array.indexedMap
      (\x val ->
        span
          [
            onClick (Select x y),
            style "font-size" "14px",
            style "font-family" "monospace",
            style "padding" "2px",
            style "margin" "2px",
            style "border" "1px outset gray",
            style "cursor" "pointer",
            style "background-color" (getStyleColor colors x y)
          ]
          [
            text (toString val)
          ]
      )
      row
    )
  )


displayGrid : Array (Array a) -> Array (Array Color) -> (a -> String) -> Html Msg
displayGrid grid colors toString =
 div [ style "display" "flex", style "flex-direction" "column" ] (Array.toList (Array.indexedMap (\y row -> div [] [ displayRow y row colors toString ]) grid))



-- UPDATE


type Msg
  = Select Int Int
  | Calc


update : Msg -> Model -> Model
update msg model =
  case msg of
    Select newX newY ->
      { model | colors = calcColor model.trees { x = newX, y = newY }, selected = { x = newX, y = newY } }
    Calc ->
      model


-- VIEW

view : Model -> Html Msg
view model =
  div []
    [
      div [ style "font-weight" "bold"] [ text ("Result: " ++ (String.fromInt init.visible)) ]
      , div [] [ text ("selected: {x: " ++ String.fromInt model.selected.x ++ ", y: " ++ String.fromInt model.selected.y ++ "}") ]
      , div [ style "font-weight" "bold", style "font-size" "20px", style "margin-top" "10px" ] [ text "Trees:" ]
      , displayGrid model.trees model.colors String.fromInt
      , div [ style "font-weight" "bold", style "font-size" "20px", style "margin-top" "10px" ] [ text "Visible Trees:" ]
      , displayGrid model.calculated model.colors
        (\b -> if b then "H" else "V"  )
    ]
