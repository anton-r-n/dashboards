PROJECT_DIR=.

CSS_DIR=$(PROJECT_DIR)/styles
CSS_DESTINATION=$(CSS_DIR)/project_min.css

JS_DIR=$(PROJECT_DIR)/scripts
JS_DESTINATION=$(JS_DIR)/project_min.js

CSS_FILENAMES = \
	reset.css \
	grid.css \
	header.css \
	chart_linear.css \

JS_FILENAMES = \
	lib/shortcuts.js \
	lib/templates.js \
	lib/numbers.js \
	lib/dates.js \
	lib/widget.js \
	\
	widgets/app.js \
	widgets/chart_linear.js \
	\
	init.js \

CSS_FILES = $(addprefix $(CSS_DIR)/css/, $(CSS_FILENAMES))
JS_FILES = $(addprefix $(JS_DIR)/, $(JS_FILENAMES))


all: css js

css: $(CSS_DESTINATION)

$(CSS_DESTINATION): $(CSS_FILES)
	cat $(foreach f, $(CSS_FILES), $f) > $(CSS_DESTINATION)

js: $(JS_DESTINATION)

$(JS_DESTINATION): $(JS_FILES)
	cat $(foreach f, $(JS_FILES), $f) > $(JS_DESTINATION)

clean: clean_css clean_js

clean_css:
	rm -f $(CSS_DESTINATION)

clean_js:
	rm -f $(JS_DESTINATION)

lint:
	gjslint --nojsdoc --strict $(JS_FILES)
