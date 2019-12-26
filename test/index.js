'use strict';

var Code = require('@hapi/code');
var Lab = require('@hapi/lab');
var Moonbeams = require('../');

var lab = exports.lab = Lab.script();

lab.experiment('Main conversion functions', function () {

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
  lab.test('Julian Day to Calendar Date', function () {

    table.forEach(function (testData) {

      var hms;
      var result = Moonbeams.jdToCalendar(testData[3]);
      Code.expect(result, 'calendar date from julian day').to.include(['year', 'month', 'day']);
      hms = Moonbeams.dayToHms(result.day);
      Code.expect(result.year, 'year from julian day ' + testData[3]).to.equal(testData[0]);
      Code.expect(result.month, 'month from julian day ' + testData[3]).to.equal(testData[1]);
      Code.expect(Moonbeams.INT(result.day), 'day from julian day ' + testData[3]).to.equal(Moonbeams.INT(testData[2]));
      Code.expect(hms.hour, 'hour from julian day ' + testData[3]).to.equal(testData[4]);
      Code.expect(hms.minute, 'minute from julian day ' + testData[3]).to.equal(testData[5]);
      Code.expect(hms.second, 'second from julian day ' + testData[3]).to.equal(testData[6]);
    });
  });
  lab.test('Calendar Date to Julian Day', function () {

    table.forEach(function (testData) {

      var result = Moonbeams.calendarToJd(testData[0], testData[1], testData[2]);
      Code.expect(result, 'julian day from calendar date ' + testData[0] + '/' + testData[1] + '/' + testData[2]).to.equal(testData[3]);
    });
  });
});

lab.experiment('season calculator', function () {

  //Test data from Meeus chapter 27
  //season, year, jd
  var table = [
    [1, 1962, 2437837.39245]
  ];
  lab.test('Calculate julian day of season', function () {

    table.forEach(function (testData) {

      var result = Moonbeams.season(testData[0], testData[1]);
      Code.expect(Math.floor(result * 10000), 'julian day for ' + testData[0] + '/' + testData[1]).to.equal(Math.floor(testData[2] * 10000));
    });
  });
});

lab.experiment('helper functions', function () {

  lab.test('INT', function () {

    //Examples from Meeus chapter 7
    //x, INT(x)
    var table = [
      [7 / 4, 1],
      [8 / 4, 2],
      [5.02, 5],
      [5.9999, 5],
      [-7.83, -7]
    ];
    table.forEach(function (testData) {

      var result = Moonbeams.INT(testData[0]);
      Code.expect(result, 'INT(' + testData[0] + ')').to.equal(testData[1]);
    });
  });
  lab.test('T', function () {

    //jd, T(jd)
    var table = [
      [2446895.5, -12729637]
    ];
    table.forEach(function (testData) {

      var result = Moonbeams.T(testData[0]);
      Code.expect(Moonbeams.INT(result * 100000000), 'T(' + testData[0] + ')').to.equal(testData[1]);
    });
  });
  lab.test('hms to decimal day', function () {

    //hour, minute, second, decimal day
    var table = [
      [12, 0, 0, 0.5],
      [19, 26, 24, 0.81],
      [18, 0, 0, 0.75],
      [19, 21, 0, 0.80625] //Floating error test
    ];
    table.forEach(function (testData) {

      var result = Moonbeams.hmsToDay(testData[0], testData[1], testData[2]);
      Code.expect(result, 'decimal of ' + testData[0] + ' ' + testData[1] + ' ' + testData[2]).to.equal(testData[3]);
      result = Moonbeams.dayToHms(testData[3]);
      Code.expect(result, 'hms of ' + testData[3]).to.include(['hour', 'minute', 'second']);
      Code.expect(result.hour, 'hour of ' + testData[3]).to.equal(testData[0]);
      Code.expect(result.minute, 'minute of ' + testData[3]).to.equal(testData[1]);
      Code.expect(result.second, 'second of ' + testData[3]).to.equal(testData[2]);
    });
  });

  lab.test('hms to right ascention', function () {

    //hour, minute, second, right ascention
    var table = [
      [9, 14, 55.8, 138.73250] //Example 1.a from Meeus
    ];
    table.forEach(function (testData) {

      var result = Moonbeams.hmsToRightAscention(testData[0], testData[1], testData[2]);
      Code.expect(result, 'right ascention of' + testData[0] + ' ' + testData[1] + ' ' + testData[2]).to.equal(testData[3]);
      result = Moonbeams.rightAscentionToHms(testData[3]);
      Code.expect(result, 'hms of ' + testData[3]).to.include(['hour', 'minute', 'second']);
      Code.expect(result.hour, 'hour of ' + testData[3]).to.equal(testData[0]);
      Code.expect(result.minute, 'minute of ' + testData[3]).to.equal(testData[1]);
      Code.expect(Math.floor(result.second), 'second of ' + testData[3]).to.equal(Math.floor(testData[2]));
    });
  });

  lab.test('Leap year', function () {

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

      var result = Moonbeams.isLeapYear(testData[0]);
      Code.expect(result, 'year ' + testData[0]).to.equal(testData[1]);
    });
  });

  lab.test('Day of week', function () {

    //jd, day of week
    var table = [
      [2434923.5, 3] //Example 7.e from Meeus
    ];
    table.forEach(function (testData) {

      var result = Moonbeams.dayOfWeek(testData[0]);
      Code.expect(result, 'day of week for julian day ' + testData[0]).to.equal(testData[1]);
    });
  });

  lab.test('Day of year', function () {

    //year, month, day, day of year
    var table = [
      [1978, 11, 14, 318], //Example7.f from Meeus
      [1988, 4, 22, 113] //Example7.g from Meeus
    ];
    table.forEach(function (testData) {

      var jd = Moonbeams.calendarToJd(testData[0], testData[1], testData[2]);
      var result = Moonbeams.dayOfYear(jd);
      Code.expect(result, 'day of year for ' + testData[0] + '/' + testData[1] + '/' + testData[2]).to.equal(testData[3]);
      result = Moonbeams.yearDayToCalendar(testData[3], testData[0]);
      Code.expect(result, 'calendar date from day ' + testData[3] + ' of year ' + testData[0]).to.include(['year', 'month', 'day']);
      Code.expect(result.year, 'year from day ' + testData[3] + ' of year ' + testData[0]).to.equal(testData[0]);
      Code.expect(result.month, 'month from day ' + testData[3] + ' of year ' + testData[0]).to.equal(testData[1]);
      Code.expect(result.day, 'month day from day ' + testData[3] + ' of year ' + testData[0]).to.equal(testData[2]);
    });
  });

  lab.test('Sidereal time', function () {

    //jd, mean hour, mean minute, mean second, apparent hour, apparent minute, apparent second
    var table = [
      [2446895.5, 13, 10, 46.3668], //Example 12.a from Meeus
      [2446896.30625, 8, 34, 57.0896] //Example 12.b from Meeus
    ];
    table.forEach(function (testData) {

      var result = Moonbeams.meanSiderealTime(testData[0]);
      var hms = Moonbeams.rightAscentionToHms(result);
      Code.expect(hms.hour, 'mean sidereal hour of ' + testData[0]).to.equal(testData[1]);
      Code.expect(hms.minute, 'mean sidereal minute of ' + testData[0]).to.equal(testData[2]);
      Code.expect(Moonbeams.INT(hms.second * 100), 'mean sidereal second of ' + testData[0]).to.equal(Moonbeams.INT(testData[3] * 100));
    });
  });
});

lab.experiment('trig functions', function () {

  lab.test('tangent', function () {

    //Example 1.a from Meeus
    var result = Moonbeams.tangent(138.73250);
    Code.expect(Math.floor(result * 1000000)).to.equal(-877517);
  });
});
