TSCFLAGS=-t esnext -m none

all: walk-thru-library.js walk-thru
	git restore geometry-3d.js
	git restore geometry-2d.js

walk-thru: SceneCamera.js.tmp
	gsed -e '/class SceneCamera/{r SceneCamera.js.tmp' -e 'd}' _walk-thru.js > walk-thru.js

SceneCamera.js.tmp: SceneCamera.js
	gsed -n '/class/,$$p' $< > $@

%.js: %.ts
	-tsc $(TSCFLAGS) $<

.PHONY: clean

clean:
	-rm walk-thru-library.js
	-rm SceneCamera.js
	-rm *.js.tmp
	-rm walk-thru.js
	git restore geometry-3d.js
	git restore geometry-2d.js
