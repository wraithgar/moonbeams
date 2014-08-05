#Moonbeams

Javscript library for doing astronomical calculations

In a lot of flux while things are being initially written, stay tuned

##Use
```javascript
var moonbeams = require('moonbeams');

moonbeams.season(0, 1995); //Gives first equinox of 1995 as julian day;
moonbeams.convert.JDToCalendar(2436116.31); //Converts julian day 2436116.31 to object w/ year, month, day
```

#License
MIT

###Credit
Most of the calculations in this library are from [Astronomical Algorythms by John Meeus][meeus] without which libraries like this would likely never exist.

[meeus]: http://www.willbell.com/math/mc1.htm
