StickyTableHeaders
==================
So what's it good for? Well, let's say you want to display a long list of fairly uniform tabluar data, like [stock exchange listings](http://online.barrons.com/public/page/majormarket-nysecomposite-A.html) or [sport statistics](http://sports.yahoo.com/nba/stats/byposition?pos=PG,SG,G,GF,SF,PF,F,FC,C) but you don't want your users to get lost in the data as they scroll down on the page.

StickyTableHeaders to the rescue: By applying the StickyTableHeaders jQuery plugin to the table, the column headers will stick to the top of the viewport as you scroll down.

Go ahead and [try out a demo](http://jsfiddle.net/jmosbech/stFcx/).

The code is based on [this proof of concept](http://stackoverflow.com/questions/1030043/html-table-headers-always-visible-at-top-of-window-when-viewing-a-large-table/1041566#1041566).

Installation
------------
The best way to install is using [Bower](http://bower.io/):

```bash
bower install stickyTableHeaders
```

Alternatively, you can download the latest version from [jquery.stickytableheaders.min.js](https://raw.github.com/jmosbech/StickyTableHeaders/master/js/jquery.stickytableheaders.min.js) and add it to your page.

Usage
-----
Initializing the plugin is pretty straight forward:

```js
$('table').stickyTableHeaders();
```

###Tear down
To remove the plugin:

```js
$('table').stickyTableHeaders('destroy');
```

###Trigger an update manually
```js
$(window).trigger('resize.stickyTableHeaders');
```

###Options
The plugin supports one option, `fixedOffset`, which allows you to specify how much the sticky header should be offset from the top of the page. The `fixedOffset` parameter can either be a number or a jQuery object:

```js
$('table').stickyTableHeaders({fixedOffset: $('#header')});
```

As described in [pull request #33](https://github.com/jmosbech/StickyTableHeaders/pull/33) responsive pages might need to re-initialize the plugin when the user resizes his browser. This is can be done by calling the plugin with the new options:

```js
$('table').stickyTableHeaders({fixedOffset: [new-offset]});
```

Confused?
---------

If any of this is confusing, please check out the [/demo](https://github.com/jmosbech/StickyTableHeaders/tree/master/demo) folder. There are a couple of examples in there. E.g. you can see how to use it with Twitter Bootstrap.


Future Work
-----------
-   Writing a better readme :)

Known Issues
------------
-   Internet Explorer: You need to set the padding of the `<th>`s explicitly in the css in order to make the plugin work
-   Internet Explorer: Adding horizontal margin to the table causes the header to be misaligned when scrolling. (Issue #10)
-   `border-collapse: collapse` is not supported (issue #2)
-   Using the plugin together with [tablesorter](http://tablesorter.com/docs/) breaks in Internet Explorer 8


Browser Support
---------------
The plugin has been verified to work in:

-   Chrome 27
-   Firefox 20
-   Internet Explorer 8-10
-   Safari 5

NOTE: It does not work in Internet Explorer 7 (but it degrades nicely)
