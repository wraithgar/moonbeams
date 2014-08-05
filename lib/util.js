//Common functions used everywhere

var util = module.exports = {
    degreeToRadian: function (degrees) {
        //Convert decimal degrees to radians
        return degrees * Math.PI / 180;
    },
    cosine: function (degree) {
        return Math.cos(util.degreeToRadian(degree));
    },
    rightAscentionToDegree: function (hours, minutes, seconds) {
        //Convert right ascention (hours/minutes/seconds) into decimal degrees
        return (hours + (minutes / 60) + (seconds / 3600)) * 15;
    },
    decimalToHoursMinutes: function (decimal) {
        //TODO decimal to hours minutes
    },
    INT: function (number) { //Meeus calls this INT so we do too
        if (number > 0) {
            return Math.floor(number);
        }
        if (number < 0) {
            return Math.ceil(number);
        }
        return number;
    }
};
