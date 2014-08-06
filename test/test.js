var Lab = require('lab');
var moonbeams = require('../');

Lab.experiment('test library', function () {
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
