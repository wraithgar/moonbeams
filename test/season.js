var Lab = require('lab');
var moonbeams = require('../');

//Test data from Meeus chapter 27
var table = [
    [1, 1962, 2437837.39245]
];

Lab.experiment('season calculator', function () {
    Lab.test('Calculate julian day of season', function (done) {
        table.forEach(function (tableItem) {
            var result = moonbeams.season(tableItem[0], tableItem[1]);
            Lab.expect(Math.floor(result * 10000), 'julian day for ' + tableItem[0] + '/' + tableItem[1]).to.equal(Math.floor(tableItem[2] * 10000));
        });
        done();
    });
});
