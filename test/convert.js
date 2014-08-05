var Lab = require('lab');
var convert = require('../lib/convert');
//Test data from Meeus chapter 7
var table = [
    [1957, 10, 4.81, 2436116.31],
    [2000, 1, 1.5, 2451545.0],
    [1999, 1, 1, 2451179.5],
    [1987, 1, 27, 2446822.5],
    [1987, 6, 19.5, 2446966.0],
    [1988, 1, 27, 2447187.5],
    [1988, 6, 19.5, 2447332.0],
    [1900, 1, 1, 2415020.5],
    [1600, 1, 1, 2305447.5],
    [1600, 12, 31, 2305812.5],
    [837, 4, 10.3, 2026871.8],
    [333, 1, 27.5, 1842713],
    [-123, 12, 31, 1676496.5],
    [-122, 1, 1, 1676497.5],
    [-1000, 7, 12.5, 1356001],
    [-1000, 2, 29, 1355866.5],
    [-1001, 8, 17.9, 1355671.4],
    [-4712, 1, 1.5, 0]
];
Lab.experiment('conversion library', function () {
    Lab.test('Calendar Date to Julian Day', function (done) {
        table.forEach(function (tableItem) {
            var result = convert.JDToCalendar(tableItem[3]);
            Lab.expect(result, 'calendar date from julian day').to.include.keys('year', 'month', 'day');
            Lab.expect(result.year, 'year from julian day ' + tableItem[3]).to.equal(tableItem[0]);
            Lab.expect(result.month, 'month from julian day ' + tableItem[3]).to.equal(tableItem[1]);
            Lab.expect(Math.floor(result.day), 'day from julian day ' + tableItem[3]).to.equal(Math.floor(tableItem[2]));
        });
        done();
    });
    Lab.test('Julian Day to Calendar Date', function (done) {
        table.forEach(function (tableItem) {
            var result = convert.calendarToJD(tableItem[0], tableItem[1], tableItem[2]);
            Lab.expect(result, 'julian day from calendar date ' + tableItem[0] + '/' + tableItem[1] + '/' + tableItem[2]).to.equal(tableItem[3]);
        });
        done();
    });
});
