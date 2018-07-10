StickyTableHeaders
==================
So what's it good for? Well, let's say you want to display a long list of fairly uniform tabluar data, like [stock exchange listings](http://online.barrons.com/public/page/majormarket-nysecomposite-A.html) or [sport statistics](https://sports.yahoo.com/nfl/stats/weekly/?sortStatId=PASSING_YARDS&selectedTable=7) but you don't want your users to get lost in the data as they scroll down on the page.

StickyTableHeaders to the rescue: By applying the StickyTableHeaders jQuery plugin to the table, the column headers will stick to the top of the viewport as you scroll down.

Go ahead and [try out a demo](http://jsfiddle.net/jmosbech/stFcx/).

The code is based on [this proof of concept](http://stackoverflow.com/questions/1030043/html-table-headers-always-visible-at-top-of-window-when-viewing-a-large-table/1041566#1041566).

Installation
------------
The best way to install is using [npm](https://www.npmjs.com/):

```bash
npm install sticky-table-headers
```

or [Bower](http://bower.io/):

```bash
bower install StickyTableHeaders
```

or by loading it directly from the [unpkg CDN](https://unpkg.com/sticky-table-headers):

```
<script src="https://unpkg.com/sticky-table-headers"></script>
```

Usage
-----
Initializing the plugin is pretty straight forward:

```js
$('table').stickyTableHeaders();
```

### Tear down
To remove the plugin:

```js
$('table').stickyTableHeaders('destroy');
```

### Trigger an update manually
```js
$(window).trigger('resize.stickyTableHeaders');
```

### Options
You can initialize the plugin with an options map to tweak the behavior. The following options are supported:

#### `fixedOffset`
A number or jQuery object specifying how much the sticky header should be offset from the top of the page:

```js
$('table').stickyTableHeaders({fixedOffset: $('#header')});
```

#### `scrollableArea`
A DOM element or jQuery object. Allows you to overwrite which surrounding element is scrolling. Defaults to `window`. [Check this demo for an example](/demo/scrollable-div.html):

```js
$('table').stickyTableHeaders({scrollableArea: $('.scrollable-area')});
```

#### `cacheHeaderHeight`
Performance tweak: When set to `true` the plugin will only recalculate the height of the header cells when the width of the table changes.

Default value: `false`

```js
$('table').stickyTableHeaders({cacheHeaderHeight: true});
```

#### horizontalWrapper
A DOM element or jQuery object. An optional element used to function as a wrapper to allow horizontal scrolling of tables with widths wider than the screen.

```js
$('table').stickyTableHeaders({horizontalWrapper:$('.horizontal-scroll-area')});
```

#### z-index
The plugin uses z-index to make the thead overlay the body. You can override the z-index value by passing in a `zIndex` option:

```js
$('table').stickyTableHeaders({zIndex: 999});
```

### Reinitialize
As described in [pull request #33](https://github.com/jmosbech/StickyTableHeaders/pull/33) responsive pages might need to reinitialize the plugin when the user resizes his browser. This is can be done by calling the plugin with the new options:

```js
$('table').stickyTableHeaders({fixedOffset: [new-offset]});
```

### Events
The plugin triggers the following events on the targeted `<table>` element:

 - `clonedHeader.stickyTableHeaders`: When the header clone is created.
 - `enabledStickiness.stickyTableHeaders`: When the sticky header is enabled.
 - `disabledStickiness.stickyTableHeaders`: When the sticky header is disabled.

Confused?
---------

If any of this is confusing, please check out the [/demo](/demo) folder. There are a couple of examples in there. E.g. you can see how to use it with Twitter Bootstrap.

Known Issues
------------
-   Internet Explorer: You need to set the padding of the `<th>`s explicitly in the css in order to make the plugin work
-   Internet Explorer: Adding horizontal margin to the table causes the header to be misaligned when scrolling. (Issue #10)
-   Using the plugin together with [tablesorter](http://tablesorter.com/docs/) breaks in Internet Explorer 8


Browser Support
---------------
The plugin has been verified to work in:

-   Chrome 35
-   Firefox 29
-   Internet Explorer 8-11
-   Safari 5

NOTE: It does not work in Internet Explorer 7 (but it degrades nicely)
