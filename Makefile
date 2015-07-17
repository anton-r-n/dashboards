DEV_DIR := ./dev
DEV_HTML := $(DEV_DIR)/index.html

PROD_DIR := ./prod
PROD_HTML := $(PROD_DIR)/index.html
PROD_CSS := $(PROD_DIR)/min.css
PROD_JS := $(PROD_DIR)/min.js

HTML_FILES := \
	app/app_html/common.html \
	app/widgets/chart/chart.html \
	app/widgets/chart_highlight/chart_highlight.html \
	app/widgets/bar_chart/bar_chart.html \
	app/widgets/linear_chart/linear_chart.html \
	app/widgets/geo_chart/geo_chart.html \
	app/widgets/pie_chart/pie_chart.html \
	app/widgets/menu/menu.html \
	
CSS_FILES := \
	app/app_css/reset.css \
	app/app_css/buttons.css \
	app/app_css/colors.css \
	app/app_css/grid.css \
	app/app_css/header.css \
	app/app_css/widget.css \
	app/widgets/chart/chart.css \
	app/widgets/chart_highlight/chart_highlight.css \
	app/widgets/bar_chart/bar_chart.css \
	app/widgets/linear_chart/linear_chart.css \
	app/widgets/geo_chart/geo_chart.css \
	app/widgets/pie_chart/pie_chart.css \
	app/widgets/menu/menu.css \

JS_FILES := \
	app/app_js/shortcuts.js \
	app/app_js/dates.js \
	app/app_js/numbers.js \
	app/app_js/templates.js \
	app/app_js/widget.js \
	app/app_js/app.js \
	app/widgets/chart/chart.js \
	app/widgets/bar_chart/bar_chart.js \
	app/widgets/linear_chart/linear_chart.js \
	app/widgets/geo_chart/geo_chart.js \
	app/widgets/pie_chart/pie_chart.js \
	app/widgets/menu/menu.js \
	app/mock_data/init.js \

LINK_STRING := '<link rel="stylesheet" href="%s" />\n'
SCRIPT_STRING := '<script src="%s"></script>\n'

.PHONY: all debug release clean lint

all: debug release

debug: $(DEV_DIR) $(DEV_HTML)

$(DEV_DIR):
	@mkdir -p $@

$(DEV_HTML): $(HTML_FILES) $(CSS_FILES) $(JS_FILES)
	@cat ./app/app_html/header.html > $@
	@printf $(LINK_STRING) $(foreach f, $(CSS_FILES), ../$f) >> $@
	@printf $(SCRIPT_STRING) $(foreach f, $(JS_FILES), ../$f) >> $@
	@for f in $(HTML_FILES); do echo '\n' >> $@; cat $$f >> $@; done
	@echo 'Done:' $@

release: $(PROD_DIR) $(PROD_HTML) $(PROD_CSS) $(PROD_JS)

$(PROD_DIR):
	@mkdir -p $@

$(PROD_HTML): $(HTML_FILES) $(CSS_FILES) $(JS_FILES)
	@cat ./app/app_html/header.html > $@
	@printf $(LINK_STRING) './min.css' >> $@
	@printf $(SCRIPT_STRING) './min.js' >> $@
	@for f in $(HTML_FILES); do echo '\n' >> $@; cat $$f >> $@; done
	@echo 'Done:' $@

$(PROD_CSS): $(CSS_FILES)
	@cat $(foreach f, $^, $f) > $@
	@echo 'Done:' $@

$(PROD_JS): $(JS_FILES)
	@echo "'use strict';" > $@
	@cat $(foreach f, $^, $f) | sed -e "s/^'use strict';//g" >> $@
	@echo 'Done:' $@

clean:
	rm -rf $(DEV_DIR) $(PROD_DIR)

lint:
	gjslint --nojsdoc --strict $(JS_FILES)
