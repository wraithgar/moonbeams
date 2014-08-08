#Moonbeams
====

[![NPM](https://nodei.co/npm/moonbeams.png)](https://nodei.co/npm/moonbeams/)

Javscript library for doing astronomical calculations


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

Convert a given decimal julian day into a calendar day.  Given julian day must be positive.  Returns an object with `year`, `month`, and `day` attributes.  `day` will be a decimal you can pass to `dayToHms` to get the hours, minutes, and seconds from.

### hmsToDay `moonbeams.hmsToDay(hour, minute, second)`

Convert a given hour, minute, and second to decimal.  Second can be a decimal to represent precision higher than 1 second.

```javascript
var day = 8;
var hour = 13;
var minute = 30;
var second = 45.2;
var fullDay = day + moonbeams.hmsToDay(hour, minute, second);
//fullDay will now be `8.563...`
```

### dayToHms `moonbeams.dayToHms(day)`

Retrieve the hour, minute, and second from the decimal portion of a day.  Returns an object with attributes `hour`, `minute`, and `second`.  Second may be a decimal number.

### hmsToRightAscention `moonbeams.hmsToRightAscention(hour, minute, arcsecond)`

Convert a given hour, minute, and arcsecond to right ascention.  Second can be a decimal to represent precision higher than 1 arcsecond.

### rightAscentionToHms `moonbeams.rightAscentionToHms(rightAscention)`

Convert a given decimal right ascention into hours, minutes, and (arc)seconds.  Returns an object with attributes for `hour`, `minute`, and `second`.  Second may be a decimal number.

### INT `moonbeams.INT(number)`

Returns the integer portion of a given decimal number.  This is different than `Math.floor` as it doesn't round down, but rounds *towards zero*

### T `moonbeams.T(jd)`

Returns the current julian cycle, aka the julian cycle since Jan 1, 2000

So, `moonbeams.INT(4.999)` is `4` and `moonbeams.INT(-4.999)` is `-4`

### isLeapYear `moonbeams.isLeapYear(year)`

Takes an integer year and returns `true` if that year is a leap year

### season `moonbeams.season(seasonIndex, year)`

### dayOfWeek `moonbeams.dayOfWeek(jd)`

Returns integer day of week (0-6 where 0 is Sunday) for given julian day

### dayOfYear `moonbeams.dayOfYear(jd)`

Returns integer day of year (1-365 or 366) for given julian day

### yearDayToCalendar `moonbeams.yearDayToCalendar(yearDay, year)`

Calculate the calendar day of a given day of the year and year.  Returns an object with `year`, `month`, and `day` attributes.

### meanSiderealTime `moonbeams.meanSiderealTime(jd)`

Returns the mean sidereal Time at Greenwich for given julian day

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

Unless specifically stated otherwise, all julian days are in dynamical time and can be decimal

[meeus]: http://www.willbell.com/math/mc1.htm
