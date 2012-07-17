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

		// Cache DOM refs for performance reasons
		base.$window = $(window);
		base.$clonedHeader = null;
		base.$originalHeader = null;

		// Add a reverse reference to the DOM object
		base.$el.data('StickyTableHeaders', base);

		base.init = function () {
			base.options = $.extend({}, $.StickyTableHeaders.defaultOptions, options);

			base.$el.each(function () {
				var $this = $(this);

				// remove padding on <table> to fix issue #7
				$this.css('padding', 0);

				$this.wrap('<div class="divTableWithFloatingHeader"></div>');

				base.$originalHeader = $('thead:first', this);
				base.$clonedHeader = base.$originalHeader.clone();

				base.$clonedHeader.addClass('tableFloatingHeader');
				base.$clonedHeader.css({
					'position': 'fixed',
					'top': 0,
					'left': $this.css('margin-left'),
					'display': 'none'
				});

				base.$originalHeader.addClass('tableFloatingHeaderOriginal');
				
				base.$originalHeader.after(base.$clonedHeader);

				// enabling support for jquery.tablesorter plugin
				// forward clicks on clone to original
				$('th', base.$clonedHeader).click(function(e){
					var index = $('th', base.$clonedHeader).index(this);
					$('th', base.$originalHeader).eq(index).click();
				});
				$this.bind('sortEnd', base.updateCloneFromOriginal );
			});

			base.updateTableHeaders();
			base.$window.scroll(base.updateTableHeaders);
			base.$window.resize(base.updateTableHeaders);
		};

		base.updateTableHeaders = function () {
			base.$el.each(function () {
				var $this = $(this);

				var fixedHeaderHeight = isNaN(base.options.fixedOffset) ? base.options.fixedOffset.height() : base.options.fixedOffset;

				var offset = $this.offset();
				var scrollTop = base.$window.scrollTop() + fixedHeaderHeight;
				var scrollLeft = base.$window.scrollLeft();

				if ((scrollTop > offset.top) && (scrollTop < offset.top + $this.height())) {
					base.$clonedHeader.css({
						'top': fixedHeaderHeight,
						'margin-top': 0,
						'left': offset.left - scrollLeft,
						'display': 'block'
					});
					base.$originalHeader.css('visibility', 'hidden');
					base.updateCloneFromOriginal();
				}
				else {
					base.$clonedHeader.css('display', 'none');
					base.$originalHeader.css('visibility', 'visible');
				}
			});
		};

		base.updateCloneFromOriginal = function () {
			var needCompensation = false;
			$origTh = $('th', base.$originalHeader);
			
			if( $origTh.css('border-collapse') == 'collapse') {
				needCompensation = true;
			}
			
			// Copy cell widths and classes from original header
			$('th', base.$clonedHeader).each(function (index) {
				var borderCompensation = 0;
				if (needCompensation) {
					if ($(this).next().css("border-left-width") != undefined && $(this).prev().css("border-right-width") != undefined)
						borderCompensation = Math.floor(
							parseInt($(this).next().css("border-left-width").match(/^\d+/)) / 2
							+ parseInt($(this).prev().css("border-right-width").match(/^\d+/)) / 2
						);
					else if ($(this).next().css("border-left-width") != undefined)
						borderCompensation = Math.ceil(parseInt($(this).next().css("border-left-width").match(/^\d+/)) / 2);
					else if ($(this).prev().css("border-right-width") != undefined)
						borderCompensation = Math.floor(parseInt($(this).prev().css("border-right-width").match(/^\d+/)) / 2);
				}
				var $this = $(this);
				var origCell = $('th', base.$originalHeader).eq(index);
				$this.removeClass().addClass(origCell.attr('class'));
				$this.css('width', origCell.width() + borderCompensation);
			});
			base.$clonedHeader.css('width', base.$originalHeader.width());
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
