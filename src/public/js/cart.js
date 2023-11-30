import handlebars from 'handlebars';

handlebars.registerHelper('multiply', function (a, b) {
    return a * b;
});