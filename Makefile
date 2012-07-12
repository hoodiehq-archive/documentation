%.html: %.md
	cat tools/style.html > build/$@
	multimarkdown $< >> build/$@
	open build/$@
