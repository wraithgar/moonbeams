#Moonbeams

Javscript library for doing astronomical calculations

In a lot of flux while things are being initially written, stay tuned

##Use
```javascript
var moonbeams = require('moonbeams');

var spring95 = moonbeams.season(0, 1995);
```

## API reference

Only methods backed up by tests will be listed here

### calendarToJd `moonbeams.calendarToJd(year, month, day)`

Convert a given year, month, and day into a decimal julian day
Year and month should be integers, day can be a decimal.  To convert hours, minutes, and seconds into decimal see `hmsToDay

Cannot convert from a date that would result in a negative julian day

### jdToCalendar `moonbeams.jdToCalendar(jd)`

Convert a given decimal julian day into a calendar day.  Given julian day must be positive.  Returns an object with `year`, `month`, and `day` attributes.  `day` will be a decimal you can pass to `dayToHms` to get the hours, minutes, and 
seconds from.

### hmsToDay `moonbeams.hmsToDay(hour, minute, second)`

Convert a given hour, minute, and second to decimal.  Second can be a decimal to represent precision higher than 1 second.

```javascript
var day = 8;
var hour = 13;
var minute = 30;
var second = 45.2;
var fullDay = day + moonbeams.hmsToDay(hour, minute, second);
//fullDay will now be `8.563...`

### dayToHms `moonbeams.dayToHms(day)`

Retrieve the hour, minute, and second from the decimal portion of a day.  Returns an object with attributes `hour`, `minute`, and `second`.  Second may be a decimal number.

### INT `moonbeams.INT(number)`

Returns the integer portion of a given decimal number.  This is different than `Math.floor` as it doesn't round down, but rounds *towards zero*

So, `moonbeams.INT(4.999)` is `4` and `moonbeams.INT(-4.999)` is `-4`

### isLeapYear `moonbeams.isLeapYear(year)`

Takes an integer year and returns `true` if that year is a leap year

### season `moonbeams.season(seasonIndex, year)`

Find the decimal julian day that a given season starts in a given year.  `seasonIndex` is as follows

- 0 - March Equinox
- 1 - June Solstice
- 2 - September Equinox
- 3 - December Solstice

Year must be between -1000 and 3000.

###Notes
Years should be integers, positive or negative.  BC years are simply negative years, for example the year 585 BC is really -584.

#License
MIT

###Credit
Most of the calculations in this library are from [Astronomical Algorythms by John Meeus][meeus] without which libraries like this would likely never exist.

[meeus]: http://www.willbell.com/math/mc1.htm
