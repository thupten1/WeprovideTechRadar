
require('../images/radar_legend.png');
require('../images/wpsmall.png');
require('../src/stylesheets/base.scss');


// in your project, use the following line to include stylesheet information
// require('../node_modules/techradar/src/stylesheets/base.scss');
// make sure to proceess it to css as part of your build procedure, e.g. with webpack

const createRadar = require('../index'); 
//replace with require('techradar') when using the npm package 'techradar' in your project

var dataFile = './assets/data.json';
var googleSheet = 'https://spreadsheets.google.com/feeds/list/12bLoJGvq58xJtDdx_2dt88-MG6Di3VDvBcmKfYZOAeI/od6/public/values?alt=json-in-script&callback=JSON';
var dataTest = './assets/test.json';

fetch(dataFile)
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
        const radarData = data;
        createRadar(radarData);
      });  
    }  
  )  
  .catch(function(err) {  
    console.log('Fetch Error :-S', err);  
  }) ;

