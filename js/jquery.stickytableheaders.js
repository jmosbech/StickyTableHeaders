/*! Copyright (c) 2011 by Jonas Mosbech - https://github.com/jmosbech/StickyTableHeaders 
    MIT license info: https://github.com/jmosbech/StickyTableHeaders/blob/master/license.txt */

(function ($) {
	$.StickyTableHeaders = function (el, options) {
		// To avoid scope issues, use 'base' instead of 'this'
		// to reference this class from internal events and functions.
		var base = this;

		// Access to jQuery and DOM versions of element
		base.$el = $(el);
		base.el = el;

		// Add a reverse reference to the DOM object
		base.$el.data('StickyTableHeaders', base);

		base.init = function () {
			base.options = $.extend({}, $.StickyTableHeaders.defaultOptions, options);

			base.$el.each(function () {
				var $this = $(this);
				$this.wrap('<div class="divTableWithFloatingHeader" style="position:relative"></div>');

				var originalHeader = $('thead:first', this);
				var clonedHeader = originalHeader.clone()

				clonedHeader.addClass('tableFloatingHeader');
				clonedHeader.css({
					'position': 'fixed',
					'top': 0,
					'left': $this.css('margin-left'),
					'display': 'none'
				});

				originalHeader.addClass('tableFloatingHeaderOriginal');
				
				originalHeader.before(clonedHeader);

				// enabling support for jquery.tablesorter plugin
				// forward clicks on clone to original
				$('th', clonedHeader).click(function(e){
					var index = $('th', clonedHeader).index(this);
					$('th', originalHeader).eq(index).click();
				});
				$this.bind('sortEnd', function (e) { base.updateCloneFromOriginal(originalHeader, clonedHeader); });
			});

			base.updateTableHeaders();
			$(window).scroll(base.updateTableHeaders);
			$(window).resize(base.updateTableHeaders);
		};

		base.updateTableHeaders = function () {
			base.$el.each(function () {
				var $this = $(this);
				var $window = $(window);

				var fixedHeaderHeight = isNaN(base.options.fixedOffset) ? base.options.fixedOffset.height() : base.options.fixedOffset;

				var originalHeader = $('.tableFloatingHeaderOriginal', this);
				var floatingHeader = $('.tableFloatingHeader', this);
				var offset = $this.offset();
				var scrollTop = $window.scrollTop() + fixedHeaderHeight;
				var scrollLeft = $window.scrollLeft();

				if ((scrollTop > offset.top) && (scrollTop < offset.top + $this.height())) {
					floatingHeader.css({
						'top': fixedHeaderHeight,
						'margin-top': 0,
						'left': offset.left - scrollLeft,
						'display': 'block'
					});

					base.updateCloneFromOriginal(originalHeader, floatingHeader);
				}
				else {
					floatingHeader.css('display', 'none');
				}
			});
		};

		base.updateCloneFromOriginal = function (originalHeader, floatingHeader) {
			// Copy cell widths and classes from original header
			$('th', floatingHeader).each(function (index) {
				var $this = $(this);
				var origCell = $('th', originalHeader).eq(index);
				$this.removeClass().addClass(origCell.attr('class'));
				$this.css('width', origCell.width());
			});

			// Copy row width from whole table
			floatingHeader.css('width', originalHeader.width());
		};

		// Run initializer
		base.init();
	};

	$.StickyTableHeaders.defaultOptions = {
		fixedOffset: 0
	};

	$.fn.stickyTableHeaders = function (options) {
		return this.each(function () {
			(new $.StickyTableHeaders(this, options));
		});
	};

})(jQuery);
