TSCFLAGS=-t esnext -m none

all: walk-thru-library.js walk-thru

walk-thru: SceneCamera.js.tmp SceneEdge.js.tmp WalkThru.js.tmp Shot.js.tmp
	gsed -e '/class SceneCamera/{r SceneCamera.js.tmp' -e 'd}' -e '/class SceneEdge/{r SceneEdge.js.tmp' -e 'd}' -e '/class WalkThru/{r WalkThru.js.tmp' -e 'd}' -e '/class Shot/{r Shot.js.tmp' -e 'd}' _walk-thru.js > walk-thru.js

%.js.tmp: %.js
	gsed -n -e '/exports/d' -e '/class/,$$p' $< > $@

%.js: %.ts
	-tsc $(TSCFLAGS) $<

.PHONY: clean

clean:
	-rm *.js.tmp
	-rm SceneCamera.js
	-rm SceneObject.js
	-rm Shot.js
	-rm _cg-object.js
	-rm _geometry-2d.js
	-rm _geometry-3d.js
	-rm walk-thru-library.js
	-rm walk-thru.js
