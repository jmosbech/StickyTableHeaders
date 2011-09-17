(function ($) {
	$.StickyTableHeaders = function (el, options) {
		// To avoid scope issues, use 'base' instead of 'this'
		// to reference this class from internal events and functions.
		var base = this;

		// Access to jQuery and DOM versions of element
		base.$el = $(el);
		base.el = el;

		// Add a reverse reference to the DOM object
		base.$el.data("StickyTableHeaders", base);

		base.init = function () {
			base.options = $.extend({}, $.StickyTableHeaders.defaultOptions, options);

			base.$el.each(function () {
				$(this).wrap("<div class=\"divTableWithFloatingHeader\" style=\"position:relative\"></div>");

				var originalHeaderRow = $("tr:first", this);
				originalHeaderRow.before(originalHeaderRow.clone());
				var clonedHeaderRow = $("tr:first", this);

				clonedHeaderRow.addClass("tableFloatingHeader");
				clonedHeaderRow.css("position", "absolute");
				clonedHeaderRow.css("top", "0px");
				clonedHeaderRow.css("left", $(this).css("margin-left"));
				clonedHeaderRow.css("visibility", "hidden");

				originalHeaderRow.addClass("tableFloatingHeaderOriginal");
			});
			base.updateTableHeaders();
			$(window).scroll(base.updateTableHeaders);
			$(window).resize(base.updateTableHeaders);
		};

		// Sample Function, Uncomment to use
		// base.functionName = function(paramaters){
		// 
		// };

		base.updateTableHeaders = function () {
			base.$el.each(function () {
				var originalHeaderRow = $(".tableFloatingHeaderOriginal", this);
				var floatingHeaderRow = $(".tableFloatingHeader", this);
				var offset = $(this).offset();
				var scrollTop = $(window).scrollTop();
				if ((scrollTop > offset.top) && (scrollTop < offset.top + $(this).height())) {
					floatingHeaderRow.css("visibility", "visible");
					floatingHeaderRow.css("top", Math.min(scrollTop - offset.top, $(this).height() - floatingHeaderRow.height()) + "px");

					// Copy cell widths from original header
					$("th", floatingHeaderRow).each(function (index) {
						var cellWidth = $("th", originalHeaderRow).eq(index).css('width');
						$(this).css('width', cellWidth);
					});

					// Copy row width from whole table
					floatingHeaderRow.css("width", $(this).css("width"));
				}
				else {
					floatingHeaderRow.css("visibility", "hidden");
					floatingHeaderRow.css("top", "0px");
				}
			});
		}

		// Run initializer
		base.init();
	};

	$.StickyTableHeaders.defaultOptions = {
	};

	$.fn.stickyTableHeaders = function (options) {
		return this.each(function () {
			(new $.StickyTableHeaders(this, options));
		});
	};

})(jQuery);
