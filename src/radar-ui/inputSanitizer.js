const sanitizeHtml = require('sanitize-html');
const _ = {
  forOwn: require('lodash/forOwn')
}

const InputSanitizer = function () {
    var relaxedOptions = {
        allowedTags: ['b', 'i', 'em', 'strong', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'ul',
            'br', 'p', 'u'],
        allowedAttributes: {
            'a': ['href']
        }
    };

    var restrictedOptions = {
        allowedTags: [],
        allowedAttributes: {},
        textFilter: function(text) {
              return text.replace(/&amp;/, '&');
            }
    };

    function trimWhiteSpaces(blip) {
      var processedBlip = {};
      _.forOwn(blip, function(value, key) {
        if (typeof(key) != "undefined") {
            if (typeof(value) != "undefined") {
                if (typeof(value) === "string") {
                      processedBlip[key.trim()] = value.trim();
                } else {
                    processedBlip[key.trim()] = value;
                }
            }                           
        }
      });
      return processedBlip;
    }

    function castBoolean(value) {
        switch (typeof value) {
            case "boolean":
                return value;
                break;
            case "string":
                return (value.toLowerCase() === 'true');                
                break;
            default:
                throw new TypeError('Unexpected type');
        }        
    }


    var self = {};
    self.sanitize = function (rawBlip) {
      var blip = trimWhiteSpaces(rawBlip);
      blip.description = sanitizeHtml(blip.description, relaxedOptions);
      blip.name = sanitizeHtml(blip.name, restrictedOptions);
      blip.isNew = castBoolean(sanitizeHtml(blip.isNew, restrictedOptions));
      blip.ring = sanitizeHtml(blip.ring, restrictedOptions);
      blip.quadrant = sanitizeHtml(blip.quadrant, restrictedOptions);

      return blip;
    };

    return self;
};

module.exports = InputSanitizer;
