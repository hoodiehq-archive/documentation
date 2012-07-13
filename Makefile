%.html: %.md
	cat tools/style.html > build/$@
	multimarkdown $< >> build/$@
	open -a /Applications/Safari.app build/$@
