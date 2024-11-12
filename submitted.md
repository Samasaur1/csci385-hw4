# building the project

I wrote my solutions to this project in Typescript. To generate the Javascript solution, run `make`. You will need the Typescript compiler (`tsc`) installed, as well as a GNU-compatible `sed` implementation available under the name `gsed`. I have also provided a pre-generated version of my solutions in the `generated.zip` file.

The reason that I chose to implement this project in Typescript was because we were dealing with classes with a whole number of defined functions on them. After I added type annotations to them (see `_geometry-2d.ts`, `_geometry-3d.ts`, `_cg-object.ts`), my editor was able to show the available functions on all the arguments passed to the methods I needed to implement, and check to make sure that I was returning the correct types.

There are three categories of Typescript files that I created:
1. `_geometry-2d.ts`, `_geometry-3d.ts`, `_cg-object.ts`, `SceneObject.ts`
    
    These files only exist to give type annotations to the types defined in the non-underscore-prefixed js files (`Point2d`, `Vector3d`, `Face`, etc.). The js files that are output from compiling them are unused

2. `walk-thru-library.ts`

    This file is compiled to `walk-thru-library.js` and is used as=is

3. `SceneEdge.ts`, `SceneCamera.ts`

    These files are compiled to js, and then the js is injected into `_walk-thru.js`, producing `walk-thru.js`. This is probably overcomplicated, but I wanted to be as unintrusive as possible, and doing it this way meant that the `SceneEdge` and `SceneCamera` classes were right where the starter code expected them

# status of project

I followed the math pretty closely, though when I got to implementing `isSegmentVisible` I was getting `NaN`s (which I simply filtered out) and in `draw` I ended up with some edges going farther than they should have (visible in the flipbook)
