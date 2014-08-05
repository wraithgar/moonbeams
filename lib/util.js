//Common functions used everywhere

module.exports = {
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
