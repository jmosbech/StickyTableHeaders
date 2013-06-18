/*! Copyright (c) 2011 by Jonas Mosbech - https://github.com/jmosbech/StickyTableHeaders
    MIT license info: https://github.com/jmosbech/StickyTableHeaders/blob/master/license.txt */

;(function ($, window, undefined) {
	'use strict';

	var name = 'stickyTableHeaders';
	var defaults = {
			fixedOffset: 0
		};

	function Plugin (el, options) {
		// To avoid scope issues, use 'base' instead of 'this'
		// to reference this class from internal events and functions.
		var base = this;

		// Access to jQuery and DOM versions of element
		base.$el = $(el);
		base.el = el;

		// Listen for destroyed, call teardown
		base.$el.bind('destroyed',
			$.proxy(base.teardown, base));

		// Cache DOM refs for performance reasons
		base.$window = $(window);
		base.$clonedHeader = null;
		base.$originalHeader = null;

		// Keep track of state
		base.isCloneVisible = false;
		base.leftOffset = null;
		base.topOffset = null;

		base.init = function () {
			base.options = $.extend({}, defaults, options);

			base.$el.each(function () {
				var $this = $(this);

				// remove padding on <table> to fix issue #7
				$this.css('padding', 0);

				base.$originalHeader = $('thead:first', this);
				base.$clonedHeader = base.$originalHeader.clone();

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
			base.$window.on('scroll.' + name, base.toggleHeaders);
			base.$window.on('resize.' + name, base.toggleHeaders);
			base.$window.on('resize.' + name, base.updateWidth);
			// TODO: move tablesorter bindings here
		};

		base.unbind = function(){
			// unbind window events by specifying handle so we don't remove too much
			base.$window.off('.' + name, base.toggleHeaders);
			base.$window.off('.' + name, base.updateWidth);
			base.$el.off('.' + name);
			base.$el.find('*').off('.' + name);
		};

		base.toggleHeaders = function () {
			base.$el.each(function () {
				var $this = $(this);

				var newTopOffset = isNaN(base.options.fixedOffset) ?
					base.options.fixedOffset.height() : base.options.fixedOffset;

				var offset = $this.offset();
				var scrollTop = base.$window.scrollTop() + newTopOffset;
				var scrollLeft = base.$window.scrollLeft();

				if ((scrollTop > offset.top) && (scrollTop < offset.top + $this.height() - base.$clonedHeader.height())) {
					var newLeft = offset.left - scrollLeft;
					if (base.isCloneVisible && (newLeft === base.leftOffset) && (newTopOffset === base.topOffset)) {
						return;
					}

					base.$originalHeader.css({
						'position': 'fixed',
						'top': newTopOffset,
						'margin-top': 0,
						'left': newLeft,
						'z-index': 1
					});
					base.$clonedHeader.css('display', '');
					base.isCloneVisible = true;
					base.leftOffset = newLeft;
					base.topOffset = newTopOffset;
					base.updateWidth();
				}
				else if (base.isCloneVisible) {
					base.$originalHeader.css('position', 'static');
					base.$clonedHeader.css('display', 'none');
					base.isCloneVisible = false;
					base.updateWidth();
				}
			});
		};

		base.updateWidth = function () {
			// Copy cell widths and classes from original header
			var widths = new Array();
			var $staticHeader = base.isCloneVisible ? base.$clonedHeader : base.$originalHeader;
			$('th,td', $staticHeader).each(function (index) {
				// use min/max-width to fix overflow issue (#30)
				widths[index] = $(this).width();
			});

			if (base.isCloneVisible) {
				$('th,td', base.$clonedHeader).each(function (index) {
					var $this = $(this);
					var $origCell = $('th,td', base.$originalHeader).eq(index);
					this.className = $origCell.attr('class') || '';
					// use min/max-width to fix overflow issue (#30)
					$origCell.css({
						'min-width': widths[index],
						'max-width': widths[index]
					});
				});

				// Copy row width from whole table
				base.$originalHeader.css('width', $staticHeader.width());
			} else {
				$('th,td', base.$originalHeader).each(function (index) {
					// reset min/max-width to allow table to shrink
					$(this).css({
						'min-width': '',
						'max-width': ''
					});
				});
				base.$originalHeader.css('width', '');
			}
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
				}
			} else if(options !== 'destroy') {
				$.data(this, 'plugin_' + name, new Plugin( this, options ));
			}
		});
	};

})(jQuery, window);
