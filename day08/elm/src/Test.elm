module Test exposing (values)

import Array exposing (Array, fromList)


values : Array (Array Int)
values =
    fromList
        [ fromList [ 3, 0, 3, 7, 3 ]
        , fromList [ 2, 5, 5, 1, 2 ]
        , fromList [ 6, 5, 3, 3, 2 ]
        , fromList [ 3, 3, 5, 4, 9 ]
        , fromList [ 3, 5, 3, 9, 0 ]
        ]
