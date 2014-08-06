var Lab = require('lab');
var moonbeams = require('../');

Lab.experiment('Main conversion functions', function () {
    //Test data from Meeus chapter 7
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
        [-1001, 8, 17.9, 1355671.4, 21, 35, 59],
        [-4712, 1, 1.5, 0, 12, 0, 0]
    ];
    Lab.test('Julian Day to Calendar Date', function (done) {
        table.forEach(function (tableItem) {
            var hms;
            var result = moonbeams.jdToCalendar(tableItem[3]);
            Lab.expect(result, 'calendar date from julian day').to.include.keys('year', 'month', 'day');
            hms = moonbeams.dayToHms(result.day);
            Lab.expect(result.year, 'year from julian day ' + tableItem[3]).to.equal(tableItem[0]);
            Lab.expect(result.month, 'month from julian day ' + tableItem[3]).to.equal(tableItem[1]);
            Lab.expect(moonbeams.INT(result.day), 'day from julian day ' + tableItem[3]).to.equal(moonbeams.INT(tableItem[2]));
            Lab.expect(hms.hour, 'hour from julian day ' + tableItem[3]).to.equal(tableItem[4]);
            Lab.expect(hms.minute, 'minute from julian day ' + tableItem[3]).to.equal(tableItem[5]);
            Lab.expect(hms.second, 'second from julian day ' + tableItem[3]).to.equal(tableItem[6]);
        });
        done();
    });
    Lab.test('Calendar Date to Julian Day', function (done) {
        table.forEach(function (tableItem) {
            var result = moonbeams.calendarToJd(tableItem[0], tableItem[1], tableItem[2]);
            Lab.expect(result, 'julian day from calendar date ' + tableItem[0] + '/' + tableItem[1] + '/' + tableItem[2]).to.equal(tableItem[3]);
        });
        done();
    });
});

Lab.experiment('season calculator', function () {
    //Test data from Meeus chapter 27
    var table = [
        [1, 1962, 2437837.39245]
    ];
    Lab.test('Calculate julian day of season', function (done) {
        table.forEach(function (tableItem) {
            var result = moonbeams.season(tableItem[0], tableItem[1]);
            Lab.expect(Math.floor(result * 10000), 'julian day for ' + tableItem[0] + '/' + tableItem[1]).to.equal(Math.floor(tableItem[2] * 10000));
        });
        done();
    });
});

Lab.experiment('helper functions', function () {
    Lab.test('INT', function (done) {
        //Examples from Meeus chapter 7
        var table = [
            [7/4, 1],
            [8/4, 2],
            [5.02, 5],
            [5.9999, 5],
            [-7.83, -7]
        ];
        table.forEach(function (tableItem) {
            var result = moonbeams.INT(tableItem[0]);
            Lab.expect(result).to.equal(tableItem[1]);
        });
        done();
    });
    Lab.test('hms to decimal day', function (done) {
        var table = [
            [12, 0, 0, 0.5],
            [19, 26, 24, 0.81],
            [18, 0, 0, 0.75]
        ];
        table.forEach(function (tableItem) {
            var result = moonbeams.hmsToDay(tableItem[0], tableItem[1], tableItem[2]);
            Lab.expect(result, 'decimal of ' + tableItem[0] + ' ' + tableItem[1] + ' ' + tableItem[2]).to.equal(tableItem[3]);
            result = moonbeams.dayToHms(tableItem[3]);
            Lab.expect(result, 'hms of ' + tableItem[3]).to.include.keys('hour', 'minute', 'second');
            Lab.expect(result.hour, 'hour of ' + tableItem[3]).to.equal(tableItem[0]);
            Lab.expect(result.minute, 'minute of ' + tableItem[3]).to.equal(tableItem[1]);
            Lab.expect(result.second, 'second of ' + tableItem[3]).to.equal(tableItem[2]);
        });
        done();
    });

    Lab.test('hms to right ascention', function (done) {
        //Example 1.a from Meeus
        var table = [
            [9, 14, 55.8, 138.73250]
        ];
        table.forEach(function (tableItem) {
            var result = moonbeams.hmsToRightAscention(tableItem[0], tableItem[1], tableItem[2]);
            Lab.expect(result, 'right ascention of' + tableItem[0] + ' ' + tableItem[1] + ' ' + tableItem[2]).to.equal(tableItem[3]);
            result = moonbeams.rightAscentionToHms(tableItem[3]);
            Lab.expect(result, 'hms of ' + tableItem[3]).to.include.keys('hour', 'minute', 'second');
            Lab.expect(result.hour, 'hour of ' + tableItem[3]).to.equal(tableItem[0]);
            Lab.expect(result.minute, 'minute of ' + tableItem[3]).to.equal(tableItem[1]);
            Lab.expect(Math.floor(result.second), 'second of ' + tableItem[3]).to.equal(Math.floor(tableItem[2]));
        });
        done();
    });

    Lab.test('Leap year', function (done) {
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
        table.forEach(function (tableItem) {
            var result = moonbeams.isLeapYear(tableItem[0]);
            Lab.expect(result, 'year ' + tableItem[0]).to.equal(tableItem[1]);
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
