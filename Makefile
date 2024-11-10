all: walk-thru-library.js
	git restore geometry-3d.js

%.js: %.ts
	-tsc $<

.PHONY: clean

clean:
	rm walk-thru-library.js
