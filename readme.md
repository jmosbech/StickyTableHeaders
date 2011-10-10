StickyTableHeaders
==================
So what's it good for? Well, let's say you want to display a long list of fairly uniform tabluar data, like [stock exchange listings](http://online.barrons.com/public/page/majormarket-nysecomposite-A.html) or [sport statistics](http://sports.yahoo.com/nba/stats/byposition?pos=PG,SG,G,GF,SF,PF,F,FC,C) your users may easily get lost in the data as they scroll down on the page.

StickyTableHeaders to the rescue: By applying the StickyTableHeaders jQuery plugin to the table, the column headers will stick to the top of the viewport as you scroll down.

Go ahead and try it out for yourself.


Future Work
-----------
-   Writing a better readme :)
-   Implementing support for making the entire `<thead>` section sticky


Known Issues
------------
-   You need to set the padding of the `<th>`s explicitly in the css in order to make the plugin work in Internet Explorer


Browser Support
---------------
The plugin has been verified to work in:
-   Chrome 14
-   Firefox 7
-   Internet Explorer 9
-   Internet Explorer 8

NOTE: It does not currently work in Internet Explorer 7 (but it degrades nicely)