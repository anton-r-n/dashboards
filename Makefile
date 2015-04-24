DEBUG_DIR = ./debug
DEBUG_HTML = $(DEBUG_DIR)/index.html

RELEASE_DIR = ./release
RELEASE_HTML = $(RELEASE_DIR)/index.html
RELEASE_CSS = $(RELEASE_DIR)/min.css
RELEASE_JS = $(RELEASE_DIR)/min.js

HTML_FILES = \
	app/app_html/common.html \
	app/widgets/chart_linear/chart_linear.html \
	app/widgets/menu/menu.html \
	
CSS_FILES = \
	app/app_css/reset.css \
	app/app_css/grid.css \
	app/app_css/header.css \
	app/widgets/chart_linear/chart_linear.css \
	app/widgets/menu/menu.css \

JS_FILES = \
	app/app_js/shortcuts.js \
	app/app_js/dates.js \
	app/app_js/numbers.js \
	app/app_js/templates.js \
	app/app_js/widget.js \
	app/app_js/app.js \
	app/widgets/chart_linear/chart_linear.js \
	app/widgets/menu/menu.js \
	app/mock_data/init.js \

.PHONY: all debug release clean lint

all: debug release

debug: $(DEBUG_HTML)

$(DEBUG_HTML):
	@cat ./app/app_html/header.html > $(DEBUG_HTML)
	@$(foreach f, $(CSS_FILES), \
		echo '<link rel="stylesheet" href="../$f" />' >> $(DEBUG_HTML);)
	@$(foreach f, $(JS_FILES), \
		echo '<script src="../$f"></script>' >> $(DEBUG_HTML);)
	@cat $(foreach f, $(HTML_FILES), $f) >> $(DEBUG_HTML)
	@echo 'Done:' $@

release: $(RELEASE_HTML) $(RELEASE_CSS) $(RELEASE_JS)

$(RELEASE_HTML): $(HTML_FILES) $(CSS_FILES) $(JS_FILES)
	@cat ./app/app_html/header.html > $(RELEASE_HTML)
	@echo '<link rel="stylesheet" href="./min.css" />' >> $(RELEASE_HTML)
	@echo '<script src="./min.js"></script>' >> $(RELEASE_HTML)
	@cat $(foreach f, $(HTML_FILES), $f) >> $(RELEASE_HTML)
	@echo 'Done:' $@

$(RELEASE_CSS): $(CSS_FILES)
	@cat $(foreach f, $(CSS_FILES), $f) > $(RELEASE_CSS)
	@echo 'Done:' $@

$(RELEASE_JS): $(JS_FILES)
	@echo "'use strict';" > $(RELEASE_JS)
	@cat $(foreach f, $(JS_FILES), $f) | sed -e "s/'use strict';//g" \
		>> $(RELEASE_JS)
	@echo 'Done:' $@

clean:
	rm -f $(DEBUG_HTML) $(RELEASE_HTML) $(RELEASE_JS) $(RELEASE_CSS)

lint:
	gjslint --nojsdoc --strict $(JS_FILES)
