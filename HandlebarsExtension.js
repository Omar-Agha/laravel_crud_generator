import Handlebars from 'handlebars';
import pluralize from 'pluralize';


export function registerHandlebarsHelpers() {

    Handlebars.registerHelper("ifEquals", function (arg1, arg2, options) {
        return arg1 == arg2 ? options.fn(this) : options.inverse(this);
    });

    Handlebars.registerHelper("camelCase", function (aString) {
        return snakeToCamel(aString);
    });
    Handlebars.registerHelper("pascalCase", function (aString) {
        return snakeToPascal(aString);
    });

    Handlebars.registerHelper("arrayToLaravelRules", function (arr) {
        return arr.join("|");
    });

    Handlebars.registerHelper("vueTranslate", function (text) {
        var result = "{{translate('" + text + "')}}";
        return new Handlebars.SafeString(result);
    });

    Handlebars.registerHelper("pluralize", function (text) {
        return pluralize(text, 20);
    });

    Handlebars.registerHelper("concat", function (arg1, arg2) {
        return arg1 + arg2;
    });

    Handlebars.registerHelper("surroundWithBrackets", function (aString) {
        return "{{" + aString + "}}";
    });

    function snakeToCamel(str) {
        return str.replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
    }
    function snakeToPascal(str) {
        return capitalize(
            str.replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
        );
    }

    function capitalize(s) {
        return s && s[0].toUpperCase() + s.slice(1);
    }

}
