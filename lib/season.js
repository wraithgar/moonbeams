//Season (equinox/solstice) calculator.
//Season is 0-3, so you can cast that into the proper season for your hemisphere later
//Returns julian day
var cosine = require('./util').cosine;

//-1000 to 1000
var tableA = [
    [1721139.29189, 365242.13740, 0.06134, 0.00111, 0.00071],
    [1721233.25401, 365241.72562, 0.05323, 0.00907, 0.00025],
    [1721325.70455, 365242.49558, 0.11677, 0.00297, 0.00075],
    [1721414.39987, 365242.88257, 0.00769, 0.00933, 0.00006]
];

//1000 to 3000
var tableB = [
    [2451623.80984, 365242.37404, 0.05169, 0.00411, 0.00057],
    [2451716.56767, 365241.62603, 0.00325, 0.00888, 0.00030],
    [2451810.21715, 365242.01767, 0.11575, 0.00337, 0.00078],
    [2451900.05952, 365242.74049, 0.06223, 0.00823, 0.00032]
];

var tableC = [
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
];

function periodicSum(T) {
    var periodicTerm;
    var sum = 0;
    for( var i=0; i<24; i++ ) {
        periodicTerm = tableC[i];
        sum = sum + periodicTerm[0] * cosine(periodicTerm[1] + ( periodicTerm[2] * T ));
    }
    return sum;
}
function meanEquinox(season, year) {
    //(Meeus chapter 27) Calculate mean equinox
    var Y, jd;
    var table = tableA;
    if (year > 1000) {
        table = tableB;
        year = year - 2000;
    }
    Y = year / 1000;
    table = table[season];
    jd = table[0] +
        ( table[1] * Y ) +
        ( table[2] * Math.pow(Y, 2) ) -
        ( table[3] * Math.pow(Y, 3) ) -
        ( table[4] * Math.pow(Y, 4) );
    return jd;
}

module.exports = function calculateSeason(season, year) {
    var jde0, jde, T, W, dl, S;
    if (year < -1000 || year > 3000) {
        throw new Error('Cannot calculate season for years not between -1000 and 3000');
    }
    if (season < 0 || season > 3) {
        throw new Error('Season must be one of: 0, 1, 2, 3');
    }
    jde0 = meanEquinox(season, year);
    T = (jde0 - 2451545.0) / 36525;
    W = (35999.373 * T) - 2.47;
    dl = 1 +
        ( 0.0334 * cosine(W) ) +
        ( 0.0007 * cosine(W * 2) );
    S = periodicSum(T);
    jde = jde0 + ( (0.00001 * S) / dl );
    return jde;
};
