# Getting Started with Create React App

Steps to start

1. `npm install`
2. `npm run build`
3. `serve -s build`
4. open `localhost:3000` on browser (port might differ if 3000 is already in use)

# Optimizations

## 1
Used `React.memo` to check if the status of a cell has changed to prevent unchanged cell from rerendering

## 2
Placing game board outside of state, i used `React.useRef` instead of `React.useState` to store the game board.

The reason is because state will trigger a render when reference changes but not when a value inside changes, 
which means i need to create a new game board object to update the state, this can be very costly when game board is large

The issue with using ref is it doesn't cause the page to rerender, which is why i added a time state to trigger a rerender
when i finish updating the game board.

This is very bad practice but i think the performance boost is worth it

There is another method i thought of which uses 2 states, one current and one next, everytime the board changes i would update the next state, 
and after update finishes, i set the state to next state, and use current as next state, this way i can keep switching between the two states,
the change in reference would allow react to rerender and i dont need to generate any new game boards. The reason i didn't use this approach is 
there are extra work needed to keep the two states in sync, otherwise some data might be lost during the switch, the original method has a single source of truth 
avoiding this issue.

# Worst cases

w = width, l = length, m = number of mines

creating empty game board O(w * l), each cell will be visited once and place a default object

simple fill average should be around O(m), but its random so worst case can be infinite but very unlikely to happen

complex fill is O(w * l), each cell needs to be visited once to create the hashmap

expanding empty spaces is O(w * l), in worst case all cells will be pushed to queue

## 

# Unimplemented thoughts

## Canvas vs Elements

The advantages of using a canvas is you can easily repaint only the section that was changed, making optimization much easier, 
where react needs extra time calculating diff. For development, all you would need a mapping function from xy coords to pixels on canvas.

Large amount of elements in dom can also cause browser to lag, canvas can avoid this issue

## Using ref to change class

I thought about using ref to directly change class based on a cell's state so react doesn't need to run diff when cell status updates, which should improve the performance,
but this is against data-driven design of react and might cause data and ui to be out of sync

