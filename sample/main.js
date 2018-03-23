
require('../images/radar_legend.png');
require('../images/wpsmall.png');
require('../src/stylesheets/base.scss');


// in your project, use the following line to include stylesheet information
// require('../node_modules/techradar/src/stylesheets/base.scss');
// make sure to proceess it to css as part of your build procedure, e.g. with webpack

const createRadar = require('../index'); 
//replace with require('techradar') when using the npm package 'techradar' in your project

var googleSheet = 'https://spreadsheets.google.com/feeds/list/1WUOYCyYV1ulzU8Fe_2cxXB9BVJT6qX40k8AQ12vAoCU/od6/public/basic?alt=json';

fetch(googleSheet)
  .then(  
    function(response) {  
      if (response.status !== 200) {  
        console.log('Looks like there was a problem. Status Code: ' +  
          response.status);  
        return;  
      }

      // Examine the text in the response  
      response.json().then(function(data) {  
        console.log(data);
        //const radarData = data;

        var mappedArray = [];

        for(var i = 0; i < data.feed.entry.length; i++) {

            var title = data.feed.entry[i].title.$t;


            var content = data.feed.entry[i].content.$t;
            var contentSplitted  = content.split(', ');

            var ring  = '';
            var quadrant = '';
            var isnew = '';
            var description = '';

            for(var j = 0; j < contentSplitted.length; j++) {
                var contentSplittedSub  = contentSplitted[j].split(': ');

                if(contentSplittedSub[0] === 'ring') {
                    ring = contentSplittedSub[1]
                }

                if(contentSplittedSub[0] === 'quadrant') {
                    quadrant = contentSplittedSub[1]
                }

                if(contentSplittedSub[0] === 'isnew') {
                    isnew = contentSplittedSub[1]
                }

                if(contentSplittedSub[0] === 'description') {
                    description = contentSplittedSub[1]
                }

            }

            mappedArray.push({
                "name": title,
                "ring": ring,
                "quadrant": quadrant,
                "isNew": (isnew === 'TRUE'),
                "description": description
            });

        }


        createRadar(mappedArray);
      });  
    }  
  )  
  .catch(function(err) {  
    console.log('Fetch Error :-S', err);  
  }) ;

