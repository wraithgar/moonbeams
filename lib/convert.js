//Generic static conversions

function realFloor(number) {
    if (number > 0) {
        return Math.floor(number);
    }
    if (number < 0) {
        return Math.ceil(number);
    }
    return number;
}

module.exports = {
    degreeToRadian: function (degrees) {
        //Convert decimal degrees to radians
        return degrees * 180 / Math.PI;
    },
    rightAscentionToDegree: function (hours, minutes, seconds) {
        //Convert right ascention (hours/minutes/seconds) into decimal degrees
        return (hours + (minutes / 60) + (seconds / 3600)) * 15;
    },
    julianToCalendar: function (jd) {
    },
    calendarToJD: function (year, month, day) {
        //(Meeus chapter 7)  Convert calendar date to julian day
        var jd, A, B;
        if (month < 3) {
            //Consider Jan and Feb to be month 13 and 14 of previous year
            year = year - 1;
            month = month + 12;
        }
        A = realFloor( year / 100 );
        //if we're before 10/15/1582 we're julian
        if (
            ( year < 1582 ) ||
            ( year === 1582 && month < 10 ) ||
            ( year === 1582 && month === 10 && day < 15)
        ) {
            B = 0;
        } else {
            B = 2 - A + realFloor( A / 4 );
        }
        jd = realFloor( 365.25 * ( year + 4716 ) ) +
            realFloor( 30.6001 * ( month + 1 ) ) +
            day + B - 1524.5;
        return jd;
    }
};
