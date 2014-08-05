//Date related test functions

module.exports = {
    leapYear: function (year) {
        if (year % 4 !== 0) {
            //Not divisible by 4, common year
            return false;
        }
        if (year % 100 !== 0) {
            return true;
        }
        if (year % 400 !== 0) {
            //Not divisible by 400, common year
            return false;
        }
        return true;
    }
};
