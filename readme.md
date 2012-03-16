StickyTableHeaders
==================
So what's it good for? Well, let's say you want to display a long list of fairly uniform tabluar data, like [stock exchange listings](http://online.barrons.com/public/page/majormarket-nysecomposite-A.html) or [sport statistics](http://sports.yahoo.com/nba/stats/byposition?pos=PG,SG,G,GF,SF,PF,F,FC,C) but you don't want your users to get lost in the data as they scroll down on the page.

StickyTableHeaders to the rescue: By applying the StickyTableHeaders jQuery plugin to the table, the column headers will stick to the top of the viewport as you scroll down.

Go ahead and [try out a demo](http://jsfiddle.net/jmosbech/stFcx/).

The code is based on [this proof of concept](http://stackoverflow.com/questions/1030043/html-table-headers-always-visible-at-top-of-window-when-viewing-a-large-table/1041566#1041566).

Future Work
-----------
-   Writing a better readme :)


Known Issues
------------
-   You need to set the padding of the `<th>`s explicitly in the css in order to make the plugin work in Internet Explorer
-   Internet Explorer: Adding horizontal margin to the table causes the header to be misaligned when scrolling. (Issue #10)


Browser Support
---------------
The plugin has been verified to work in:

-   Chrome 14
-   Firefox 7
-   Internet Explorer 9
-   Internet Explorer 8
-   Safari 5

NOTE: It does not currently work in Internet Explorer 7 (but it degrades nicely)