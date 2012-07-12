%.html: %.md
	markdown -o /tmp worker.md
	cat tools/style.html /tmp/worker.html > build/worker.html
	open -a /Applications/Safari.app build/$@
