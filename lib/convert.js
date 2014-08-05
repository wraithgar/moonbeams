//Generic static conversions

module.exports = {
    degreeToRadian: function (degrees) {
        //Convert decimal degrees to radians
        return degrees * 180 / Math.PI;
    },
    rightAscentionToDegree: function (hours, minutes, seconds) {
        //Convert right ascention (hours/minutes/seconds) into decimal degrees
        return (hours + (minutes / 60) + (seconds / 3600)) * 15;
    },
    julianToGregorian: function (jd) {
    },
    gregorianToJD: function (year, month, day) {
        //(Meeus chapter 7)  Convert gregorian to julian day
        var jd, A, B;
        if (month < 3) {
            //Consider Jan and Feb to be month 13 and 14 of previous year
            year = year - 1;
            month = month + 12;
        }
        A = Math.floor( year / 100 );
        console.log('A is' + A);
        B = 2 - A + Math.floor( A / 4 );
        console.log('B is' + B);
        jd = Math.floor( 365.25 * ( year + 4716 ) ) +
            Math.floor( 30.6001 * ( month + 1 ) ) +
            day + B - 1524.5;
        return jd;
    }
};
