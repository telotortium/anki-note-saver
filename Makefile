.PHONY: all clean anki-note-saver.zip

all: anki-note-saver.zip

clean:
	rm -f anki-note-saver.zip

anki-note-saver.zip:
	git ls-files | \
		grep -v -E -e '^(\.|screen-shot-)' -e '^(LICENSE|Makefile|README.md)$$' | \
		zip --filesync --must-match -@ anki-note-saver.zip
