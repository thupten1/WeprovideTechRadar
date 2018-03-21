
require('../images/radar_legend.png');
require('../images/colourssmall.jpg');
require('../src/stylesheets/base.scss');


// in your project, use the following line to include stylesheet information
// require('../node_modules/techradar/src/stylesheets/base.scss');
// make sure to proceess it to css as part of your build procedure, e.g. with webpack

const createRadar = require('../index'); 
//replace with require('techradar') when using the npm package 'techradar' in your project


fetch('./assets/data.json')  
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
        const radarData = data 
        createRadar(radarData);
      });  
    }  
  )  
  .catch(function(err) {  
    console.log('Fetch Error :-S', err);  
  }) ;

