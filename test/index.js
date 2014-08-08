var Lab = require('lab');
var moonbeams = require('../');

Lab.experiment('Main conversion functions', function () {
    //Test data from Meeus chapter 7
    //year, month, decimal day, jd, hour, minute, second
    var table = [
        [1957, 10, 4.81, 2436116.31, 19, 26, 24],
        [2000, 1, 1.5, 2451545.0, 12, 0, 0],
        [1999, 1, 1, 2451179.5, 0, 0, 0],
        [1987, 1, 27, 2446822.5, 0, 0, 0],
        [1987, 6, 19.5, 2446966.0, 12, 0, 0],
        [1988, 1, 27, 2447187.5, 0, 0, 0],
        [1988, 6, 19.5, 2447332.0, 12, 0, 0],
        [1900, 1, 1, 2415020.5, 0, 0, 0],
        [1600, 1, 1, 2305447.5, 0, 0, 0],
        [1600, 12, 31, 2305812.5, 0, 0, 0],
        [837, 4, 10.3, 2026871.8, 7, 12, 0],
        [333, 1, 27.5, 1842713, 12, 0, 0],
        [-123, 12, 31, 1676496.5, 0, 0, 0],
        [-122, 1, 1, 1676497.5, 0, 0, 0],
        [-584, 5, 28.63, 1507900.13, 15, 7, 11],
        [-1000, 7, 12.5, 1356001, 12, 0, 0],
        [-1000, 2, 29, 1355866.5, 0, 0, 0],
        [-1001, 8, 17.9, 1355671.4, 21, 36, 0],
        [-4712, 1, 1.5, 0, 12, 0, 0]
    ];
    Lab.test('Julian Day to Calendar Date', function (done) {
        table.forEach(function (testData) {
            var hms;
            var result = moonbeams.jdToCalendar(testData[3]);
            Lab.expect(result, 'calendar date from julian day').to.include.keys('year', 'month', 'day');
            hms = moonbeams.dayToHms(result.day);
            Lab.expect(result.year, 'year from julian day ' + testData[3]).to.equal(testData[0]);
            Lab.expect(result.month, 'month from julian day ' + testData[3]).to.equal(testData[1]);
            Lab.expect(moonbeams.INT(result.day), 'day from julian day ' + testData[3]).to.equal(moonbeams.INT(testData[2]));
            Lab.expect(hms.hour, 'hour from julian day ' + testData[3]).to.equal(testData[4]);
            Lab.expect(hms.minute, 'minute from julian day ' + testData[3]).to.equal(testData[5]);
            Lab.expect(hms.second, 'second from julian day ' + testData[3]).to.equal(testData[6]);
        });
        done();
    });
    Lab.test('Calendar Date to Julian Day', function (done) {
        table.forEach(function (testData) {
            var result = moonbeams.calendarToJd(testData[0], testData[1], testData[2]);
            Lab.expect(result, 'julian day from calendar date ' + testData[0] + '/' + testData[1] + '/' + testData[2]).to.equal(testData[3]);
        });
        done();
    });
});

Lab.experiment('season calculator', function () {
    //Test data from Meeus chapter 27
    //season, year, jd
    var table = [
        [1, 1962, 2437837.39245]
    ];
    Lab.test('Calculate julian day of season', function (done) {
        table.forEach(function (testData) {
            var result = moonbeams.season(testData[0], testData[1]);
            Lab.expect(Math.floor(result * 10000), 'julian day for ' + testData[0] + '/' + testData[1]).to.equal(Math.floor(testData[2] * 10000));
        });
        done();
    });
});

Lab.experiment('helper functions', function () {
    Lab.test('INT', function (done) {
        //Examples from Meeus chapter 7
        //x, INT(x)
        var table = [
            [7/4, 1],
            [8/4, 2],
            [5.02, 5],
            [5.9999, 5],
            [-7.83, -7]
        ];
        table.forEach(function (testData) {
            var result = moonbeams.INT(testData[0]);
            Lab.expect(result, 'INT(' + testData[0] + ')').to.equal(testData[1]);
        });
        done();
    });
    Lab.test('T', function (done) {
        //jd, T(jd)
        var table = [
            [2446895.5, -12729637]
        ];
        table.forEach(function (testData) {
            var result = moonbeams.T(testData[0]);
            Lab.expect(moonbeams.INT(result * 100000000), 'T(' + testData[0] + ')').to.equal(testData[1]);
        });
        done();
    });
    Lab.test('hms to decimal day', function (done) {
        //hour, minute, second, decimal day
        var table = [
            [12, 0, 0, 0.5],
            [19, 26, 24, 0.81],
            [18, 0, 0, 0.75],
            [19, 21, 0, 0.80625] //Floating error test
        ];
        table.forEach(function (testData) {
            var result = moonbeams.hmsToDay(testData[0], testData[1], testData[2]);
            Lab.expect(result, 'decimal of ' + testData[0] + ' ' + testData[1] + ' ' + testData[2]).to.equal(testData[3]);
            result = moonbeams.dayToHms(testData[3]);
            Lab.expect(result, 'hms of ' + testData[3]).to.include.keys('hour', 'minute', 'second');
            Lab.expect(result.hour, 'hour of ' + testData[3]).to.equal(testData[0]);
            Lab.expect(result.minute, 'minute of ' + testData[3]).to.equal(testData[1]);
            Lab.expect(result.second, 'second of ' + testData[3]).to.equal(testData[2]);
        });
        done();
    });

    Lab.test('hms to right ascention', function (done) {
        //hour, minute, second, right ascention
        var table = [
            [9, 14, 55.8, 138.73250] //Example 1.a from Meeus
        ];
        table.forEach(function (testData) {
            var result = moonbeams.hmsToRightAscention(testData[0], testData[1], testData[2]);
            Lab.expect(result, 'right ascention of' + testData[0] + ' ' + testData[1] + ' ' + testData[2]).to.equal(testData[3]);
            result = moonbeams.rightAscentionToHms(testData[3]);
            Lab.expect(result, 'hms of ' + testData[3]).to.include.keys('hour', 'minute', 'second');
            Lab.expect(result.hour, 'hour of ' + testData[3]).to.equal(testData[0]);
            Lab.expect(result.minute, 'minute of ' + testData[3]).to.equal(testData[1]);
            Lab.expect(Math.floor(result.second), 'second of ' + testData[3]).to.equal(Math.floor(testData[2]));
        });
        done();
    });

    Lab.test('Leap year', function (done) {
        // year, is leap year
        var table = [
            [900, false],
            [1236, true],
            [1429, false],
            [750, false],
            [1700, false],
            [1800, false],
            [1900, false],
            [2100, false],
            [1600, true],
            [2000, true],
            [2400, true]
        ];
        table.forEach(function (testData) {
            var result = moonbeams.isLeapYear(testData[0]);
            Lab.expect(result, 'year ' + testData[0]).to.equal(testData[1]);
        });
        done();
    });

    Lab.test('Day of week', function (done) {
        //jd, day of week
        var table = [
            [2434923.5, 3] //Example 7.e from Meeus
        ];
        table.forEach(function (testData) {
            var result = moonbeams.dayOfWeek(testData[0]);
            Lab.expect(result, 'day of week for julian day ' + testData[0]).to.equal(testData[1]);
        });
        done();
    });

    Lab.test('Day of year', function (done) {
        //year, month, day, day of year
        var table = [
            [1978, 11, 14, 318], //Example7.f from Meeus
            [1988, 4, 22, 113] //Example7.g from Meeus
        ];
        table.forEach(function (testData) {
            var jd = moonbeams.calendarToJd(testData[0], testData[1], testData[2]);
            var result = moonbeams.dayOfYear(jd);
            Lab.expect(result, 'day of year for ' + testData[0] + '/' + testData[1] + '/' + testData[2]).to.equal(testData[3]);
            result = moonbeams.yearDayToCalendar(testData[3], testData[0]);
            Lab.expect(result, 'calendar date from day ' + testData[3] + ' of year ' + testData[0]).to.include.keys('year', 'month', 'day');
            Lab.expect(result.year, 'year from day ' + testData[3] + ' of year ' + testData[0]).to.equal(testData[0]);
            Lab.expect(result.month, 'month from day ' + testData[3] + ' of year ' + testData[0]).to.equal(testData[1]);
            Lab.expect(result.day, 'month day from day ' + testData[3] + ' of year ' + testData[0]).to.equal(testData[2]);
        });
        done();
    });

    Lab.test('Sidereal time', function (done) {
        //jd, mean hour, mean minute, mean second, apparent hour, apparent minute, apparent second
        var table = [
            [2446895.5, 13, 10, 46.3668], //Example 12.a from Meeus
            [2446896.30625, 8, 34, 57.0896] //Example 12.b from Meeus
        ];
        table.forEach(function (testData) {
            var result = moonbeams.meanSiderealTime(testData[0]);
            var hms = moonbeams.rightAscentionToHms(result);
            Lab.expect(hms.hour, 'mean sidereal hour of ' + testData[0]).to.equal(testData[1]);
            Lab.expect(hms.minute, 'mean sidereal minute of ' + testData[0]).to.equal(testData[2]);
            Lab.expect(moonbeams.INT(hms.second * 100), 'mean sidereal second of ' + testData[0]).to.equal(moonbeams.INT(testData[3] * 100));
        });
        done();
    });
});

Lab.experiment('trig functions', function () {
    Lab.test('tangent', function (done) {
        //Example 1.a from Meeus
        var result = moonbeams.tangent(138.73250);
        Lab.expect(Math.floor(result * 1000000)).to.equal(-877517);
        done();
    });
});
