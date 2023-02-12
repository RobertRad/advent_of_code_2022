module Main exposing (..)

import Array
import Maybe exposing (withDefault)
import Test
import Input
import Browser
import Html exposing (Html, button, div, span, text)
import Html.Events exposing (onClick)
import Html.Attributes exposing (style)

-- MAIN
main =
  Browser.sandbox { init = init, update = update, view = view }


-- MODEL
type alias Model =
  { trees: List(List(Int))
  , selected: { x: Int, y: Int}
  , calculated: List(List(Bool))
  ,visible: Int
  }

input : List (List Int)
input = Input.values

init : Model
init = Model
  input
  { x = 0, y = 0}
  (calcInput)
  (countVisible (calcInput))

getTreesAtRow : Int -> List Int
getTreesAtRow y = withDefault [] (Array.get y (Array.fromList input))
getTreesAtColumn : Int -> List Int
getTreesAtColumn x = List.map (\l -> withDefault 0 (Array.get x (Array.fromList l))) input
areTreesAboveHigherOrEqual : Int -> Int -> Int -> Bool
areTreesAboveHigherOrEqual x y val = List.foldl (||) False (List.indexedMap (\i cmp -> if i < y then (if cmp >= val then True else False) else False) (getTreesAtColumn x)) 
areTreesBelowHigherOrEqual : Int -> Int -> Int -> Bool
areTreesBelowHigherOrEqual x y val = List.foldl (||) False (List.indexedMap (\i cmp -> if i > y then (if cmp >= val then True else False) else False) (getTreesAtColumn x)) 
areTreesLeftHigherOrEqual : Int -> Int -> Int -> Bool
areTreesLeftHigherOrEqual x y val = List.foldl (||) False (List.indexedMap (\i cmp -> if i < x then (if cmp >= val then True else False) else False) (getTreesAtRow y))
areTreesRightHigherOrEqual : Int -> Int -> Int -> Bool
areTreesRightHigherOrEqual x y val = List.foldl (||) False (List.indexedMap (\i cmp -> if i > x then (if cmp >= val then True else False) else False) (getTreesAtRow y))

calcValue : Int -> Int -> Int -> Bool
calcValue  x y val = (areTreesAboveHigherOrEqual x y val) && (areTreesBelowHigherOrEqual x y val) && (areTreesLeftHigherOrEqual x y val) && (areTreesRightHigherOrEqual x y val)

calcRow : Int -> List Int -> List Bool
calcRow y innerList = List.indexedMap (\i val -> calcValue i y val) innerList

calcInput : List (List Bool)
calcInput = List.indexedMap calcRow input

countVisible : List (List Bool) -> Int
countVisible grid = List.sum(List.map (\inner -> List.sum (List.map (\b -> if b then 0 else 1) inner )) grid)


displayRow : List a -> (a -> String) -> Html msg
displayRow row toString = div [ style "display" "flex", style "flex-direction" "row" ]  (List.map (\inner -> span [ style "margin-right" "2px"] [ text ( toString inner) ] ) row)

displayGrid : List (List a) -> (a -> String) -> Html msg
displayGrid grid toString = div [ style "display" "flex", style "flex-direction" "column"]  (List.map (\row -> div [] [ displayRow row toString ]) grid)

-- UPDATE

type Msg
  = Nothing
  | Calc

update : Msg -> Model -> Model
update msg model =
  case msg of
    Nothing ->
      model
    Calc ->
      model

-- VIEW
view : Model -> Html Msg
view model =
  div []
    [ span [] [ text "Input:" ]
    , displayGrid model.trees String.fromInt
    , button [ onClick Calc ] [ text "Calc" ]
    , div [] [ text "Output:"]
    , displayGrid model.calculated (\b -> if b then "H" else "V")
    , div [  ] [ text ("x: " ++ (String.fromInt model.selected.x) ++ ", y: " ++ (String.fromInt model.selected.y)) ]
    , div [ ] [ text (String.fromInt init.visible) ]
    ]
