'use strict'
// Moonbeams.js
// (c) 2014 Michael Garvin
// Moonbeams may be freely distributed under the MIT license.
//
// Unless specifically stated otherwise, all julian days are in dynamical time

const Moonbeams = {}

module.exports = Moonbeams

// Data stores
// -----------

// mean equinox/solstice expression table for years -1000 to 1000
const meanSeasonTableA = [
  [1721139.29189, 365242.13740, 0.06134, 0.00111, 0.00071],
  [1721233.25401, 365241.72562, 0.05323, 0.00907, 0.00025],
  [1721325.70455, 365242.49558, 0.11677, 0.00297, 0.00075],
  [1721414.39987, 365242.88257, 0.00769, 0.00933, 0.00006]
]

// mean equinox/solstice expression table for years 1000 to 3000
const meanSeasonTableB = [
  [2451623.80984, 365242.37404, 0.05169, 0.00411, 0.00057],
  [2451716.56767, 365241.62603, 0.00325, 0.00888, 0.00030],
  [2451810.21715, 365242.01767, 0.11575, 0.00337, 0.00078],
  [2451900.05952, 365242.74049, 0.06223, 0.00823, 0.00032]
]

// Periodic terms for calculating solstice/equinox from mean
const periodicTermTableA = [
  [485, 324.96, 1934.136],
  [203, 337.23, 32964.467],
  [199, 342.08, 20.186],
  [182, 27.85, 445267.112],
  [156, 73.14, 45036.886],
  [136, 171.52, 22518.443],
  [77, 222.54, 65928.934],
  [74, 296.72, 3034.906],
  [70, 243.58, 9037.513],
  [58, 119.81, 33718.147],
  [52, 297.17, 150.678],
  [50, 21.02, 2281.226],
  [45, 247.54, 29929.562],
  [44, 325.15, 31555.956],
  [29, 60.93, 4443.417],
  [18, 155.12, 67555.328],
  [17, 288.79, 4562.452],
  [16, 198.04, 62894.029],
  [14, 199.76, 31436.921],
  [12, 95.39, 14577.848],
  [12, 287.11, 31931.756],
  [12, 320.81, 34777.259],
  [9, 227.73, 1222.114],
  [8, 15.45, 16859.074]
]

// Helper functions
// ----------------

// Convert decimal degrees to radians
Moonbeams.degreeToRadian = function (degrees) {
  return degrees * Math.PI / 180
}

// Returns cosine of decimal degrees
const cosine = Moonbeams.cosone = function (degree) {
  return Math.cos(Moonbeams.degreeToRadian(degree))
}

// Returns tangent of decimal degrees
Moonbeams.tangent = function (degree) {
  return Math.tan(Moonbeams.degreeToRadian(degree))
}

// Returns INT of given decimal number
// INT is the integer portion *closest to zero*
// Meeus calls this INT so we do too
const INT = Moonbeams.INT = function (number) {
  return Math[number < 0 ? 'ceil' : 'floor'](number)
}

// Returns julian cycle since Jan 1, 2000
// Meeus calls this T so we do too
const T = Moonbeams.T = function (jd) {
  return (jd - 2451545.0) / 36525
}

// Converts given hours, minutes, and arcseconds right ascention
const hmsToRightAscention = Moonbeams.hmsToRightAscention = function (hours, minutes, arcseconds) {
  return (hours + (minutes / 60) + (arcseconds / 3600)) * 15
}

Moonbeams.rightAscentionToHms = function (ra) {
  const degrees = ra / 15
  const hour = INT(degrees)
  const minute = INT((degrees - hour) * 60.0)
  const second = (((degrees - hour) * 60.0) - minute) * 60.0
  return { hour: hour, minute: minute, second: second }
}

// Converts given hours, minutes, and seconds into decimal of a day
Moonbeams.hmsToDay = function (hours, minutes, seconds) {
  return (hmsToRightAscention(hours, minutes, seconds) / 360)
}

// Converts given decimal day to hours, minutes, and (arc)seconds
Moonbeams.dayToHms = function (degree) {
  // Return the hours, minutes, seconds from the decimal portion of given degree
  const dayFragment = degree - INT(degree)
  let hour = INT(dayFragment * 24.0)
  let minute = INT((dayFragment * 24.0 - hour) * 60.0)
  let second = ((dayFragment * 24.0 - hour) * 60.0 - minute) * 60.0
  if (second > 59.999) {
    second = 0
    minute = minute + 1
  }
  if (minute > 59.999) {
    minute = 0
    hour = hour + 1
  }
  return { hour: hour, minute: minute, fullSecond: second, second: INT(second) }
}

// Returns true if given year is a leap year
const isLeapYear = Moonbeams.isLeapYear = function (year) {
  if (year % 4 !== 0) {
    // Not divisible by 4, common year
    return false
  }
  if (year % 100 !== 0) {
    return true
  }
  if (year % 400 !== 0) {
    // Not divisible by 400, common year
    return false
  }
  return true
}

// (Meeus chapter 12)
// Calculate mean sidereal time at Greenwich of a given julian day
Moonbeams.meanSiderealTime = function (jd) {
  let mean
  const cycle = T(jd)
  mean = 280.46061837 +
    (360.98564736629 * (jd - 2451545.0)) +
    (0.000387933 * cycle * cycle) -
    (cycle * cycle * cycle / 38710000)
  if (mean < 0 || mean > 360) {
    mean = mean - Math.floor(mean / 360) * 360
  }
  return mean
}

// (Meeus chapter 12)
// Calculate apparent sidereal time at Greenwich of a given julian day
Moonbeams.apparentSiderealTime = function (jd) {

  // See chapter 22 for nutation
}

// Main conversion functions
// -------------------------

// (Meeus chapter 7)
// Convert given decimal julian day into calendar object with year, month,
// fullDay (decimal day), day (integer day), hour, minute, fullSecond (decimal
// second), second (integer second)
const jdToCalendar = Moonbeams.jdToCalendar = function (jd) {
  if (jd < 0) {
    throw new Error('Cannot convert from negative Julian Day numbers')
  }
  jd = jd + 0.5
  const Z = INT(jd) // Integer part of jd
  const F = jd - Z // Fractional (decimal) part of jd
  let A = Z
  if (Z >= 2299161) {
    const alpha = INT((Z - 1867216.25) / 36524.25)
    A = Z + 1 + alpha - INT(alpha / 4)
  }
  const B = A + 1524
  const C = INT((B - 122.1) / 365.25)
  const D = INT(365.25 * C)
  const E = INT((B - D) / 30.6001)

  // DAY
  const day = B - D - INT(30.6001 * E) + F

  // MONTH
  let month
  if (E < 14) {
    month = E - 1
  } else {
    month = E - 13
  }

  // YEAR
  let year
  if (month > 2) {
    year = C - 4716
  } else {
    year = C - 4715
  }

  const result = { year: year, month: month, day: day }

  return result
}

// (Meeus chapter 7)
// Convert given year, month, day to decimal julian day
// Day can be decimal
// (Use hmsToDay if you have hours, minutes, and seconds to add to a day)
Moonbeams.calendarToJd = function (year, month, day) {
  if (year < -4712) {
    throw new Error('Cannot convert to negative Julian Day numbers')
  }
  if (month < 0 || month > 12) {
    throw new Error('Month must be 1 through 12')
  }
  if (day < 0) {
    throw new Error('Day must be positive')
  }
  if (month < 3) {
    // Consider Jan and Feb to be month 13 and 14 of previous year
    year = year - 1
    month = month + 12
  }
  const A = INT(year / 100)
  let B
  // if we're before 10/15/1582 we're julian
  if (
    (year < 1582) ||
      (year === 1582 && month < 10) ||
        (year === 1582 && month === 10 && day < 15)
  ) {
    B = 0
  } else {
    B = 2 - A + INT(A / 4)
  }
  const jd = INT(365.25 * (year + 4716)) +
    INT(30.6001 * (month + 1)) +
    day + B - 1524.5
  return jd
}

// Calculation functions
// ---------------------

// (Meeus chapter 27)
// Calculate the mean equinox or solstice for a year
const meanSeason = Moonbeams.meanSeason = function (seasonIndex, year) {
  if (year < -1000 || year > 3000) {
    throw new Error('Can only calculate season for years between -1000 and 3000')
  }
  if (seasonIndex < 0 || seasonIndex > 3) {
    throw new Error('seasonIndex must be one of: 0, 1, 2, 3')
  }
  let table
  if (year > 1000) {
    table = meanSeasonTableB[seasonIndex]
    year = year - 2000
  } else {
    table = meanSeasonTableA[seasonIndex]
  }
  const Y = year / 1000
  // TODO shorthand this
  const jd = table[0] +
    (table[1] * Y) +
    (table[2] * Math.pow(Y, 2)) -
    (table[3] * Math.pow(Y, 3)) -
    (table[4] * Math.pow(Y, 4))
  return jd
}

// (Meeus chapter 27)
// Calculate time of given equinox/solstice for a year
// seasonIndex can be
//   0 - March equinox
//   1 - June solstice
//   2 - September equinox
//   3 - December solstice
//   Returns a julian day in dynamical time
Moonbeams.season = function (seasonIndex, year) {
  const jde0 = meanSeason(seasonIndex, year)

  const cycle = T(jde0)
  const W = (35999.373 * cycle) - 2.47
  const dl = 1 +
    (0.0334 * cosine(W)) +
    (0.0007 * cosine(W * 2))
  let S = 0
  for (let i = 0; i < 24; i++) {
    S = S + periodicTermTableA[i][0] * cosine(periodicTermTableA[i][1] + (periodicTermTableA[i][2] * cycle))
  }
  const jde = jde0 + ((0.00001 * S) / dl)
  return jde
}

// (Meeus chapter 7)
// Return day of week (0-6) of a given julian day
Moonbeams.dayOfWeek = function (jd) {
  return (jd + 1.5) % 7
}

// (Meeus chapter 7)
// Return day of the year for given julian day
Moonbeams.dayOfYear = function (jd) {
  const calendar = jdToCalendar(jd)
  const leapYear = isLeapYear(calendar.year)
  let K
  if (leapYear) {
    K = 1
  } else {
    K = 2
  }
  const N = INT((275 * calendar.month) / 9) - (K * INT((calendar.month + 9) / 12)) + calendar.day - 30
  return N
}

// (Meeus chapter 7)
// Return calendar object for a given day of year
// Algorithm found by A. Pouplier, of the Société Astronomique do Liège, Belgium
Moonbeams.yearDayToCalendar = function (yearDay, year) {
  const leapYear = isLeapYear(year)
  let K
  if (leapYear) {
    K = 1
  } else {
    K = 2
  }
  let month
  if (yearDay < 32) {
    month = 1
  } else {
    month = INT(((9 * (K + yearDay)) / 275) + 0.98)
  }
  const day = yearDay - INT((275 * month) / 9) + (K * INT((month + 9) / 12)) + 30
  return { year: year, month: month, day: day }
}

// (Meeus chapter 3)
// Find nth order differences in tabular values
Moonbeams.differences = function (values, order) {
  if (values.length < (order * 2) - 1) {
    throw new Error('Not enough values to calculate order ' + order)
  }
  // TODO order determines how many values we need
  // at least (2 * order) - 1?
  let differences = values
  for (let o = 0; o < order; o++) {
    differences = differences.reduce((acc, cur, index) => { acc[index - 1] = cur - acc[index - 1]; acc[index] = cur; return acc }, []).slice(0, -1)
  }
  return differences
}

// (Meeus chapter 3)
// Interpolation from three or from five tabular values
// Deciding if interpolation from 3 value is permitted is outside the scope of
// this function
Moonbeams.iterpolate = function (values, point) {
  if (values.length === 3) {
  }
  if (values.length === 5) {
  }
  throw new Error('Can only interpolate from 3 or 5 tabular values')
}
