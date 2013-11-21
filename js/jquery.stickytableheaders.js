/*! Copyright (c) 2011 by Jonas Mosbech - https://github.com/jmosbech/StickyTableHeaders
	MIT license info: https://github.com/jmosbech/StickyTableHeaders/blob/master/license.txt */

;(function ($, window, undefined) {
	'use strict';

	var name = 'stickyTableHeaders',
		id = 0,
		defaults = {
			fixedOffset: 0,
			leftOffset: 0,
			scrollableArea: window
		};

	function Plugin (el, options) {
		// To avoid scope issues, use 'base' instead of 'this'
		// to reference this class from internal events and functions.
		var base = this;

		// Access to jQuery and DOM versions of element
		base.$el = $(el);
		base.el = el;
		base.id = id++;

		// Listen for destroyed, call teardown
		base.$el.bind('destroyed',
			$.proxy(base.teardown, base));

		// Cache DOM refs for performance reasons
		base.$clonedHeader = null;
		base.$originalHeader = null;

		// Keep track of state
		base.isSticky = false;
		base.hasBeenSticky = false;
		base.leftOffset = null;
		base.topOffset = null;

		base.init = function () {
			base.options = $.extend({}, defaults, options);

			base.$el.each(function () {
				var $this = $(this);

				// remove padding on <table> to fix issue #7
				$this.css('padding', 0);

				base.$scrollableArea = $(base.options.scrollableArea);

				base.$originalHeader = $('thead:first', this);
				base.$clonedHeader = base.$originalHeader.clone();
				$this.trigger('clonedHeader.' + name, [base.$clonedHeader]);

				base.$clonedHeader.addClass('tableFloatingHeader');
				base.$clonedHeader.css('display', 'none');

				base.$originalHeader.addClass('tableFloatingHeaderOriginal');

				base.$originalHeader.after(base.$clonedHeader);

				base.$printStyle = $('<style type="text/css" media="print">' +
					'.tableFloatingHeader{display:none !important;}' +
					'.tableFloatingHeaderOriginal{position:static !important;}' +
					'</style>');
				$('head').append(base.$printStyle);
			});

			base.updateWidth();
			base.toggleHeaders();

			base.bind();
		};

		base.destroy = function (){
			base.$el.unbind('destroyed', base.teardown);
			base.teardown();
		};

		base.teardown = function(){
			if (base.isSticky) {
				base.$originalHeader.css('position', 'static');
			}
			$.removeData(base.el, 'plugin_' + name);
			base.unbind();

			base.$clonedHeader.remove();
			base.$originalHeader.removeClass('tableFloatingHeaderOriginal');
			base.$originalHeader.css('visibility', 'visible');
			base.$printStyle.remove();

			base.el = null;
			base.$el = null;
		};

		base.bind = function(){
			base.$scrollableArea.on('scroll.' + name, base.toggleHeaders);
			if (base.$scrollableArea[0] !== window) {
				$(window).on('scroll.' + name + base.id, base.setPositionValues);
				$(window).on('resize.' + name + base.id, base.toggleHeaders);
			}
			base.$scrollableArea.on('resize.' + name, base.toggleHeaders);
			base.$scrollableArea.on('resize.' + name, base.updateWidth);
		};

		base.unbind = function(){
			// unbind window events by specifying handle so we don't remove too much
			base.$scrollableArea.off('.' + name, base.toggleHeaders);
			if (base.$scrollableArea[0] !== window) {
				$(window).off('.' + name + base.id, base.setPositionValues);
				$(window).off('.' + name + base.id, base.toggleHeaders);
			}
			base.$scrollableArea.off('.' + name, base.updateWidth);
			base.$el.off('.' + name);
			base.$el.find('*').off('.' + name);
		};

		base.toggleHeaders = function () {
			if (base.$el) {
				base.$el.each(function () {
					var $this = $(this),
						newLeft,
						newTopOffset = base.$scrollableArea[0] === window ? (
									isNaN(base.options.fixedOffset) ?
									base.options.fixedOffset.height() :
									base.options.fixedOffset
								) :
								base.$scrollableArea.offset().top + (!isNaN(base.options.fixedOffset) ? base.options.fixedOffset : 0),
						offset = $this.offset(),

						scrollTop = base.$scrollableArea.scrollTop() + newTopOffset,
						scrollLeft = base.$scrollableArea.scrollLeft(),

						scrolledPastTop = base.$scrollableArea[0] === window ?
								scrollTop > offset.top :
								newTopOffset > offset.top,
						notScrolledPastBottom = (base.$scrollableArea[0] === window ? scrollTop : 0) <
								(offset.top + $this.height() - base.$clonedHeader.height() - (base.$scrollableArea[0] === window ? 0 : newTopOffset));

					if (scrolledPastTop && notScrolledPastBottom) {
						newLeft = offset.left - scrollLeft + base.options.leftOffset;
						base.setPositionValues();
						base.$originalHeader.css({
							'position': 'fixed',
							'margin-top': 0,
							'left': newLeft,
							'z-index': 1 // #18: opacity bug
						});
						base.isSticky = true;
						base.leftOffset = newLeft;
						base.topOffset = newTopOffset;
						base.$clonedHeader.css('display', '');

						// make sure the width is correct: the user might have resized the browser while in static mode
						base.updateWidth();
					} else if (base.isSticky) {
						base.$originalHeader.css('position', 'static');
						base.$clonedHeader.css('display', 'none');
						base.isSticky = false;
						base.resetWidth($("td,th", base.$clonedHeader), $("td,th", base.$originalHeader));
					}

				});
			}
		};

		base.setPositionValues = function () {
			var winScrollTop = $(window).scrollTop(),
				winScrollLeft = $(window).scrollLeft();
			if (!base.isSticky ||
					winScrollTop < 0 || winScrollTop + $(window).height() > $(document).height() ||
					winScrollLeft < 0 || winScrollLeft + $(window).width() > $(document).width()) {
				return;
			}
			base.$originalHeader.css({
				'top': base.topOffset - (base.$scrollableArea[0] === window ? 0 : winScrollTop),
				'left': base.leftOffset - (base.$scrollableArea[0] === window ? 0 : winScrollLeft)
			});
		};

		base.updateWidth = function () {
			if (!base.isSticky) {
				return;
			}
			// Copy cell widths from clone
			var $origHeaders = $('th,td', base.$originalHeader);
			var $clonedHeaders = $('th,td', base.$clonedHeader);
			base.cellWidths = [];
			base.getWidth($clonedHeaders);
			base.setWidth($clonedHeaders, $origHeaders);

			// Copy row width from whole table
			base.$originalHeader.css('width', base.$clonedHeader.width());
		};

		base.getWidth = function ($clonedHeaders) {
			$clonedHeaders.each(function (index) {
				var width, $this = $(this);

				if ($this.css('box-sizing') === 'border-box') {
					width = $this.outerWidth(); // #39: border-box bug
				} else {
					width = $this.width();
				}

				base.cellWidths[index] = width;
			});
		};

		base.setWidth = function ($clonedHeaders, $origHeaders) {
			$clonedHeaders.each(function (index) {
				var width = base.cellWidths[index];
				$origHeaders.eq(index).css({
					'min-width': width,
					'max-width': width
				});
			});
		};

		base.resetWidth = function ($clonedHeaders, $origHeaders) {
			$clonedHeaders.each(function (index) {
				var $this = $(this);
				$origHeaders.eq(index).css({
					'min-width': $this.css("min-width"),
					'max-width': $this.css("max-width")
				});
			});
		};

		base.updateOptions = function(options) {
			base.options = $.extend({}, defaults, options);
			base.updateWidth();
			base.toggleHeaders();
		};

		// Run initializer
		base.init();
	}

	// A plugin wrapper around the constructor,
	// preventing against multiple instantiations
	$.fn[name] = function ( options ) {
		return this.each(function () {
			var instance = $.data(this, 'plugin_' + name);
			if (instance) {
				if (typeof options === "string") {
					instance[options].apply(instance);
				} else {
					instance.updateOptions(options);
				}
			} else if(options !== 'destroy') {
				$.data(this, 'plugin_' + name, new Plugin( this, options ));
			}
		});
	};

})(jQuery, window);
