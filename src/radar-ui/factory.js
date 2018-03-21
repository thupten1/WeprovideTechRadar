/* flow weak */

const d3 = require('d3');
const _ = {
    map: require('lodash/map'),
    uniqBy: require('lodash/uniqBy'),
    capitalize: require('lodash/capitalize'),
    each: require('lodash/each'),
    remove: require('lodash/remove')
};

const InputSanitizer = require('./inputSanitizer');
const Radar = require('../models/radar');
const Quadrant = require('../models/quadrant');
const Ring = require('../models/ring');
const Blip = require('../models/blip');
const GraphingRadar = require('./radar');
const MalformedDataError = require('../exceptions/malformedDataError');
const SheetNotFoundError = require('../exceptions/sheetNotFoundError');
const ExceptionMessages = require('../exceptions/exceptionMessages');


function sanitize(blips) {        
    _.remove(blips, function(blip) {
        return blip.name === undefined || blip.name == "";
    });    
    _.map(blips, new InputSanitizer().sanitize);    
};

function createRadar (blips) {
    try { 
        sanitize(blips);       
        d3.selectAll(".loading").remove();

        const rings = _.map(_.uniqBy(blips, 'ring'), 'ring');

        const ringMap = {};
        const maxRings = 4;

        _.each(rings, function (ringName, i) {
            if (i == maxRings) {
                throw new MalformedDataError(ExceptionMessages.TOO_MANY_RINGS);
            }
            ringMap[ringName] = new Ring(ringName, i);
        });

        const quadrants = {};
        _.each(blips, function (blip) {
            if (!quadrants[blip.quadrant]) {
                quadrants[blip.quadrant] = new Quadrant(_.capitalize(blip.quadrant));
            }
            quadrants[blip.quadrant].add(new Blip(blip.name, ringMap[blip.ring], blip.isNew, blip.topic, blip.description))
        });

        const radar = new Radar();
        _.each(quadrants, function (quadrant) {
            radar.addQuadrant(quadrant)
        });
        // Adjust ring size;
       //const size = (window.innerHeight - 133) < 400 ? 400 : window.innerHeight - 133;
        const size = 550;

        new GraphingRadar(size, radar).init().plot();

    } catch (exception) {
        displayErrorMessage(exception);
    }
}

function displayErrorMessage(exception) {
    d3.selectAll(".loading").remove();
    var message = 'Oops! It seems like there are some problems with loading your data. ';

    if (exception instanceof MalformedDataError) {
        message = message.concat(exception.message);
    } else if (exception instanceof SheetNotFoundError) {
        message = exception.message;
    } else {
        console.error(exception);
    }

    message = message.concat('<br/>', 'Please check <a href="https://info.thoughtworks.com/visualize-your-tech-strategy-guide.html#faq">FAQs</a> for possible solutions.');

    d3.select('body')
        .append('div')
        .attr('class', 'error-container')
        .append('div')
        .attr('class', 'error-container__message')
        .append('p')
        .html(message);
}

module.exports = createRadar;
