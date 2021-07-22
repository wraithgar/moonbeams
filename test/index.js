'use strict'

const lab = (exports.lab = require('@hapi/lab').script())
const { describe, it } = lab
const { expect } = require('@hapi/code')
const Moonbeams = require('../')

describe('Main conversion functions', function () {
  // Test data from Meeus chapter 7
  // year, month, decimal day, jd, hour, minute, second
  const table = [
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
  ]
  it('Julian Day to Calendar Date', function () {
    table.forEach(function (testData) {
      const result = Moonbeams.jdToCalendar(testData[3])
      expect(result, 'calendar date from julian day').to.include(['year', 'month', 'day'])
      const hms = Moonbeams.dayToHms(result.day)
      expect(result.year, 'year from julian day ' + testData[3]).to.equal(testData[0])
      expect(result.month, 'month from julian day ' + testData[3]).to.equal(testData[1])
      expect(Moonbeams.INT(result.day), 'day from julian day ' + testData[3]).to.equal(Moonbeams.INT(testData[2]))
      expect(hms.hour, 'hour from julian day ' + testData[3]).to.equal(testData[4])
      expect(hms.minute, 'minute from julian day ' + testData[3]).to.equal(testData[5])
      expect(hms.second, 'second from julian day ' + testData[3]).to.equal(testData[6])
    })
  })
  it('Calendar Date to Julian Day', function () {
    table.forEach(function (testData) {
      const result = Moonbeams.calendarToJd(testData[0], testData[1], testData[2])
      expect(result, 'julian day from calendar date ' + testData[0] + '/' + testData[1] + '/' + testData[2]).to.equal(testData[3])
    })
  })
})

describe('season calculator', function () {
  // Test data from Meeus chapter 27
  // season, year, jd
  const table = [
    [1, 1962, 2437837.39245]
  ]
  it('Calculate julian day of season', function () {
    table.forEach(function (testData) {
      const result = Moonbeams.season(testData[0], testData[1])
      expect(Math.floor(result * 10000), 'julian day for ' + testData[0] + '/' + testData[1]).to.equal(Math.floor(testData[2] * 10000))
    })
  })
})

describe('helper functions', function () {
  it('INT', function () {
    // Examples from Meeus chapter 7
    // x, INT(x)
    const table = [
      [7 / 4, 1],
      [8 / 4, 2],
      [5.02, 5],
      [5.9999, 5],
      [-7.83, -7]
    ]
    table.forEach(function (testData) {
      const result = Moonbeams.INT(testData[0])
      expect(result, 'INT(' + testData[0] + ')').to.equal(testData[1])
    })
  })
  it('T', function () {
    // jd, T(jd)
    const table = [
      [2446895.5, -12729637]
    ]
    table.forEach(function (testData) {
      const result = Moonbeams.T(testData[0])
      expect(Moonbeams.INT(result * 100000000), 'T(' + testData[0] + ')').to.equal(testData[1])
    })
  })
  it('hms to decimal day', function () {
    // hour, minute, second, decimal day
    const table = [
      [12, 0, 0, 0.5],
      [19, 26, 24, 0.81],
      [18, 0, 0, 0.75],
      [19, 21, 0, 0.80625] // Floating error test
    ]
    table.forEach(function (testData) {
      let result = Moonbeams.hmsToDay(testData[0], testData[1], testData[2])
      expect(result, 'decimal of ' + testData[0] + ' ' + testData[1] + ' ' + testData[2]).to.equal(testData[3])
      result = Moonbeams.dayToHms(testData[3])
      expect(result, 'hms of ' + testData[3]).to.include(['hour', 'minute', 'second'])
      expect(result.hour, 'hour of ' + testData[3]).to.equal(testData[0])
      expect(result.minute, 'minute of ' + testData[3]).to.equal(testData[1])
      expect(result.second, 'second of ' + testData[3]).to.equal(testData[2])
    })
  })

  it('hms to right ascention', function () {
    // hour, minute, second, right ascention
    const table = [
      [9, 14, 55.8, 138.73250] // Example 1.a from Meeus
    ]
    table.forEach(function (testData) {
      let result = Moonbeams.hmsToRightAscention(testData[0], testData[1], testData[2])
      expect(result, 'right ascention of' + testData[0] + ' ' + testData[1] + ' ' + testData[2]).to.equal(testData[3])
      result = Moonbeams.rightAscentionToHms(testData[3])
      expect(result, 'hms of ' + testData[3]).to.include(['hour', 'minute', 'second'])
      expect(result.hour, 'hour of ' + testData[3]).to.equal(testData[0])
      expect(result.minute, 'minute of ' + testData[3]).to.equal(testData[1])
      expect(Math.floor(result.second), 'second of ' + testData[3]).to.equal(Math.floor(testData[2]))
    })
  })

  it('Leap year', function () {
    // year, is leap year
    const table = [
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
    ]
    table.forEach(function (testData) {
      const result = Moonbeams.isLeapYear(testData[0])
      expect(result, 'year ' + testData[0]).to.equal(testData[1])
    })
  })

  it('Day of week', function () {
    // jd, day of week
    const table = [
      [2434923.5, 3] // Example 7.e from Meeus
    ]
    table.forEach(function (testData) {
      const result = Moonbeams.dayOfWeek(testData[0])
      expect(result, 'day of week for julian day ' + testData[0]).to.equal(testData[1])
    })
  })

  it('Day of year', function () {
    // year, month, day, day of year
    const table = [
      [1978, 11, 14, 318], // Example7.f from Meeus
      [1988, 4, 22, 113] // Example7.g from Meeus
    ]
    table.forEach(function (testData) {
      const jd = Moonbeams.calendarToJd(testData[0], testData[1], testData[2])
      let result = Moonbeams.dayOfYear(jd)
      expect(result, 'day of year for ' + testData[0] + '/' + testData[1] + '/' + testData[2]).to.equal(testData[3])
      result = Moonbeams.yearDayToCalendar(testData[3], testData[0])
      expect(result, 'calendar date from day ' + testData[3] + ' of year ' + testData[0]).to.include(['year', 'month', 'day'])
      expect(result.year, 'year from day ' + testData[3] + ' of year ' + testData[0]).to.equal(testData[0])
      expect(result.month, 'month from day ' + testData[3] + ' of year ' + testData[0]).to.equal(testData[1])
      expect(result.day, 'month day from day ' + testData[3] + ' of year ' + testData[0]).to.equal(testData[2])
    })
  })

  it('Sidereal time', function () {
    // jd, mean hour, mean minute, mean second, apparent hour, apparent minute, apparent second
    const table = [
      [2446895.5, 13, 10, 46.3668], // Example 12.a from Meeus
      [2446896.30625, 8, 34, 57.0896] // Example 12.b from Meeus
    ]
    table.forEach(function (testData) {
      const result = Moonbeams.meanSiderealTime(testData[0])
      const hms = Moonbeams.rightAscentionToHms(result)
      expect(hms.hour, 'mean sidereal hour of ' + testData[0]).to.equal(testData[1])
      expect(hms.minute, 'mean sidereal minute of ' + testData[0]).to.equal(testData[2])
      expect(Moonbeams.INT(hms.second * 100), 'mean sidereal second of ' + testData[0]).to.equal(Moonbeams.INT(testData[3] * 100))
    })
  })
})

describe('trig functions', function () {
  it('tangent', function () {
    // Example 1.a from Meeus
    const result = Moonbeams.tangent(138.73250)
    expect(Math.floor(result * 1000000)).to.equal(-877517)
  })
})

describe('Interpolation functions', function () {
  it('third differences', function () {
    const table = [898013, 891109, 884226, 877366, 870531]
    expect(Moonbeams.differences(table, 1)).to.equal([-6904, -6883, -6860, -6835])
    expect(Moonbeams.differences(table, 2)).to.equal([21, 23, 25])
    expect(Moonbeams.differences(table, 3)).to.equal([2, 2])
  })
})
