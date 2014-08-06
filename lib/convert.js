//Generic static conversions
var INT = require('./util').INT;
var degreeToHMS = require('./util').degreeToHMS;

module.exports = {
    JDToCalendar: function (jd) {
        //(Meeus chapter 7)  Convert julian day to calendar date
        var alpha, A, B, C, D, E, F, Z;
        var year, month, day, dayFragments, result;
        if (jd < 0) {
            throw new Error('Cannot convert from negative Julian Day numbers');
        }
        jd = jd + 0.5;
        Z = INT(jd); //Integer part of jd
        F = jd - Z; //Fractional (decimal) part of jd
        A = Z;
        if (Z >= 2299161) {
            alpha = INT( ( Z - 1867216.25 ) / 36524.25 );
            A = Z + 1 + alpha - INT(alpha / 4);
        }
        B = A + 1524;
        C = INT( ( B - 122.1 ) / 365.25 );
        D = INT(365.25 * C);
        E = INT( ( B - D ) / 30.6001 );

        //DAY
        day = B - D - INT(30.6001 * E) + F;

        //MONTH
        if (E < 14) {
            month = E - 1;
        } else {
            month = E - 13;
        }

        //YEAR
        if (month > 2) {
            year = C - 4716;
        } else {
            year = C - 4715;
        }
        result = {year: year, month: month, fullDay: day, day: Math.floor(day)};

        dayFragments = degreeToHMS(day);
        result.hour = dayFragments.hour;
        result.minute = dayFragments.minute;
        result.second = dayFragments.second;
        return result;
    },
    calendarToJD: function (year, month, day) {
        //(Meeus chapter 7)  Convert calendar date to julian day
        var jd, A, B;
        if (year < -4712) {
            throw new Error('Cannot convert to negative Julian Day numbers');
        }
        if (month < 3) {
            //Consider Jan and Feb to be month 13 and 14 of previous year
            year = year - 1;
            month = month + 12;
        }
        A = INT( year / 100 );
        //if we're before 10/15/1582 we're julian
        if (
            ( year < 1582 ) ||
            ( year === 1582 && month < 10 ) ||
            ( year === 1582 && month === 10 && day < 15)
        ) {
            B = 0;
        } else {
            B = 2 - A + INT( A / 4 );
        }
        jd = INT( 365.25 * ( year + 4716 ) ) +
            INT( 30.6001 * ( month + 1 ) ) +
            day + B - 1524.5;
        return jd;
    }
};
