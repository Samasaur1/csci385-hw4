all: walk-thru-library.js walk-thru
	git restore geometry-3d.js
	git restore geometry-2d.js

walk-thru: SceneCamera.project.js.tmp
	gsed -e '/project(location)/{r SceneCamera.project.js.tmp' -e 'd}' _walk-thru.js > walk-thru.js

SceneCamera.project.js.tmp: SceneCamera.project.js
	gsed -n '/function/,$${s/function //;p}' $< > $@

%.js: %.ts
	-tsc $<

.PHONY: clean

clean:
	-rm walk-thru-library.js
	-rm SceneCamera.*.js
	-rm *.js.tmp
	git restore geometry-3d.js
	git restore geometry-2d.js
	-rm walk-thru.js
