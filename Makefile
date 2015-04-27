DEBUG_DIR := ./debug
DEBUG_HTML := $(DEBUG_DIR)/index.html

RELEASE_DIR := ./release
RELEASE_HTML := $(RELEASE_DIR)/index.html
RELEASE_CSS := $(RELEASE_DIR)/min.css
RELEASE_JS := $(RELEASE_DIR)/min.js

HTML_FILES := \
	app/app_html/common.html \
	app/widgets/bar_chart/bar_chart.html \
	app/widgets/linear_chart/linear_chart.html \
	app/widgets/menu/menu.html \
	
CSS_FILES := \
	app/app_css/reset.css \
	app/app_css/grid.css \
	app/app_css/header.css \
	app/app_css/widget.css \
	app/widgets/bar_chart/bar_chart.css \
	app/widgets/linear_chart/linear_chart.css \
	app/widgets/menu/menu.css \

JS_FILES := \
	app/app_js/shortcuts.js \
	app/app_js/dates.js \
	app/app_js/numbers.js \
	app/app_js/templates.js \
	app/app_js/widget.js \
	app/app_js/app.js \
	app/widgets/bar_chart/bar_chart.js \
	app/widgets/linear_chart/linear_chart.js \
	app/widgets/menu/menu.js \
	app/mock_data/init.js \

LINK_STRING := '<link rel="stylesheet" href="%s" />\n'
SCRIPT_STRING := '<script src="%s"></script>\n'

.PHONY: all debug release clean lint

all: debug release

debug: $(DEBUG_HTML)

$(DEBUG_HTML): $(HTML_FILES) $(CSS_FILES) $(JS_FILES)
	@cat ./app/app_html/header.html > $@
	@printf $(LINK_STRING) $(foreach f, $(CSS_FILES), ../$f) >> $@
	@printf $(SCRIPT_STRING) $(foreach f, $(JS_FILES), ../$f) >> $@
	@for f in $(HTML_FILES); do echo '\n' >> $@; cat $$f >> $@; done
	@echo 'Done:' $@

release: $(RELEASE_HTML) $(RELEASE_CSS) $(RELEASE_JS)

$(RELEASE_HTML): $(HTML_FILES) $(CSS_FILES) $(JS_FILES)
	@cat ./app/app_html/header.html > $@
	@printf $(LINK_STRING) './min.css' >> $@
	@printf $(SCRIPT_STRING) './min.js' >> $@
	@for f in $(HTML_FILES); do echo '\n' >> $@; cat $$f >> $@; done
	@echo 'Done:' $@

$(RELEASE_CSS): $(CSS_FILES)
	@cat $(foreach f, $^, $f) > $@
	@echo 'Done:' $@

$(RELEASE_JS): $(JS_FILES)
	@echo "'use strict';" > $@
	@cat $(foreach f, $^, $f) | sed -e "s/^'use strict';//g" >> $@
	@echo 'Done:' $@

clean:
	rm -f $(DEBUG_HTML) $(RELEASE_HTML) $(RELEASE_JS) $(RELEASE_CSS)

lint:
	gjslint --nojsdoc --strict $(JS_FILES)
