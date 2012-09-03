var globalRacersObject = new Object();
var map;

// this function will run as soon as javascript is ready
$(function() {
  
  //initializeGoogleMap();

  ///////////////////////////
  //Start: for testing
  
  //fetchResultsStoredByMTC();

  //End: for testing
  ///////////////////////////
  
  $("#fetchIronmanRaces").on('click', function() {
    var savedRaces = getSavedRaces();
    findIronmanRaces(savedRaces);
  });



  $("#testButton").on('click', function(){ fetchResultsStoredByMTC(); });


  //used for trophy set up - drag 'em around and drop'em where ever
  $( ".draggable" ).draggable({ containment: ".trophyHolder", snap: ".ui-widget-header", snapMode: "inner" });
  


  $('#result_racerName').bind("change keypress keyup", function(event){
  
      var racerName = $('#result_racerName').val();
      // If valu e has changed...of only the first letter in the last name, query for last names starting with that letter for that race
      if (racerName.length === 1) {
        getPageDataYQL(racerName);
      }
      
      //this is where we look for the bib in the "(xxx)" format - we are looking for something inside the parens
      var isMatchArray = racerName.match(/\((.*?)\)/);
      if (isMatchArray != null) { 
        //its not null, so we found a bib which means we have info!  SWEET... lets add stuff to the page that we have from the original array of stuff 
        //(this will make it look like we are slicker than we are as we populate in waves - we put in stuff we have and call to go out and get more: the 
        // "details" page)
        populateGeneralRaceData(globalRacersObject[isMatchArray[1]]);
      }


   });

}); 

function fetchResultsStoredByMTC(){
  racesObj = $("#raceData").data('races')
  
  chosenRace = $("#race_search").val();
  //chosenRace = 'IRONMAN 70.3 Raleigh';

  $("#raceData").children().remove()
  var resultYearButtonId = 0
  var iLen=racesObj.length;
  for(var i=0; i<iLen; i++) 
  {
    if (racesObj[i].race_name === chosenRace)
    {
      var newListItem = document.createElement("li");
      newListItem.setAttribute('class', 'resultFound');
      var newLink = document.createElement("a");
      newLink.setAttribute('class', 'btn btn-success btn-large resultFound');
      newLink.setAttribute('href', racesObj[i].raceResultURL);
    //  newLink.setAttribute('type', 'hidden');
      
      resultYearButtonId++
      newLink.setAttribute('id', 'result_Button_id_' + resultYearButtonId);

      newLink.innerText = racesObj[i].year;
      newListItem.appendChild(newLink);

      $("#raceData").append(newListItem);

    }
//    $('#result_Button_id_' + resultYearButtonId).effect( 'slide', {}, 50000,{});
  }

  $('#raceData').effect( 'slide', {}, 500);
  
  
  codeAddress();

}

function initializeGoogleMap() {
  var mapOptions = {
    center: new google.maps.LatLng(-34.397, 150.644),
    zoom: 8,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

}   

function codeAddress() {
  var address = "chicago, il";
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);
      // var marker = new google.maps.Marker({
      //     map: map,
      //     position: results[0].geometry.location
      // });
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
}

function getPageDataYQL(firstLetter){
  var container = $('#target');
  
  var url = "http://tracking.ironmanlive.com/newsearch.php?rid=175&letter=" + firstLetter //the is the website I want to pull from


    //YQL allows me to get the website as a JSON and then I can parse it
    $.getJSON("http://query.yahooapis.com/v1/public/yql?"+  
              "q=select%20*%20from%20html%20where%20url%3D%22"+
              encodeURIComponent(url)+
              "%22&format=xml'&callback=?",
      function(data){
        if(data.results[0]){

//TODO: get some a Pub/Sub model working here  (massive refactoring needed...)
          globalRacersObject = filterForNamesArray(data.results[0]);
          
          //container.html(data);
        } else {
          var errormsg = '<p>Error: could not load the page.</p>';
          container.html(errormsg);
        }
      }
    );
}

  //The data parsing of top level names happens here, returns: overall time, name, country, and BIB <-- Bib is key as it will allow us to figure out the individual information to put on the page
function filterForNamesArray(data){
  
  var racers = new Object() //this is what we will hold all the racer data in
  
  //The following "cleans" the returned page and gives back an array from the table list of racers (not pretty, but works)
  var namesString = data.replace(/\s+/g, '').replace(/<\/td>/g, '').replace(/class=\"right\"/g, '')//take out white space and end of table data tags
  namesString = namesString.split('<tbody>')[1].split('</tbody>')[0]; //split out all non-table elements
  var namesArray = namesString.split("<tr>"); //Break out individuals 
  namesArray.shift(); //get rid of non-person array entries
  
  //we have an array of racers as a string of info and we need to break it into usable pieces  
  var iLen=namesArray.length;
    for(var i=0; i<iLen; i++) { //take the array and pull out only the names and the href associated with it

      namesArray[i] = namesArray[i].split("<td>");

      namesArray[i][0] = namesArray[i][1].match("\">(.*?)<\/a>")[1]; //LastName,FirstName
      
      nextRacer = new Object(); //We have the next racer, now add it to the object and fill in the fields for that object

      nextRacer.firstName = capitalizeFirstLetterOnly(namesArray[i][0].split(",")[1]);
      nextRacer.lastName = capitalizeFirstLetterOnly(namesArray[i][0].split(",")[0]);
      nextRacer.bib = namesArray[i][1].match("bib=(.*?)&amp")[1]; //Bib
      nextRacer.country = namesArray[i][2].match("<p>(.*?)<\/p>")[1]; //Country
      nextRacer.swimTime = namesArray[i][3].match("<p>(.*?)<\/p>")[1]; //Swim Time
      nextRacer.bikeTime = namesArray[i][4].match("<p>(.*?)<\/p>")[1]; //Bike Time
      nextRacer.runTime = namesArray[i][5].match("<p>(.*?)<\/p>")[1]; //Run Time
      nextRacer.totalTime = namesArray[i][6].match("<p>(.*?)<\/p>")[1]; //Total Time
      nextRacer.divRank = namesArray[i][7].match("<p>(.*?)<\/p>")[1]; //Division Rank
      nextRacer.overallRank = namesArray[i][8].match("<p>(.*?)<\/p>")[1]; //Overall Rank
      
      //fill up the "racers" hash with each nextRacer object
      racers[nextRacer.bib] = nextRacer;

    }
  
//TODO: This should NOT all be here in this function...but for now its what I have (this is really hacky bullshit on my part...)

  //We have a bunch of racers, now we need to put them into an array that the "bootstrap typeahead" can read and use
  namesArray = namesAndBibsOnly(racers); //we'll reuse the namesArray from above, its the same thing, but in a useable format
  //update the "bootstrap typeahead" with racer names and bib#s
  var autocomplete = $('#result_racerName').typeahead();
  autocomplete.data('typeahead').source = namesArray;

  //now going to return the hash of "racer" objects back
  return racers;
}

function namesAndBibsOnly(racers){
  var namesAndBibsArray = new Array();
  for (nextRacer in racers){
    namesAndBibsArray.push(racers[nextRacer].lastName + ", " + racers[nextRacer].firstName + " (" + racers[nextRacer].bib + ") - " + racers[nextRacer].totalTime)
  }
  return namesAndBibsArray;
}

function capitalizeFirstLetterOnly(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function populateGeneralRaceData(racer){
  //populate the various textboxes with the basic stored values

  // var alpha3Country = new Locale("en", "US").getISO3Country();

  $('#result_racerName').val(racer.lastName + ", " + racer.firstName)
  $("#result_totalTime").val(racer.totalTime)
  $("#result_bib").val(racer.bib)
  $("#result_country").val(racer.country)

  $(".flag").attr("class", "flag flag-" + racer.country.toUpperCase());
  $(".flag").css("visibility", "visible")

  $("#result_divisionRank").val(racer.divRank)
  $("#result_overallRank").val(racer.overallRank)
  $("#result_swimTime").val(racer.swimTime)
  $("#result_bikeTime").val(racer.bikeTime)
  $("#result_runTime").val(racer.runTime)
}

//find races that are currently loaded
function getSavedRaces(){
  var savedRace;
  var savedRacesArray = Array();
  $('#savedRacesTable tbody tr').each(function() {
    savedRace = $(this).find("td").eq(3).find("a").attr('href');
    if(savedRace != undefined){
      savedRacesArray.push(savedRace);
    }
  });
  return savedRacesArray;
}


function findIronmanRaces(savedRaces){
  var container = $('#target');
  
  var url = "http://ironman.com/results"

    //YQL allows me to get the website as a JSON and then I can parse it
    $.getJSON("http://query.yahooapis.com/v1/public/yql?"+  
              "q=select%20*%20from%20html%20where%20url%3D%22"+
              encodeURIComponent(url)+
              "%22&format=xml'&callback=?",
      function(data){
        if(data.results[0]){

//TODO: get some a Pub/Sub model working here  (massive refactoring needed...)
          //filterForNamesArray(data.results[0]);
          
          pullInIronmanRaceData(data.results[0], savedRaces)

          //container.html(data);
        } else {
          var errormsg = '<p>Error: could not load the page.</p>';
          container.html(errormsg);
        }
      }
    );
}


// This function is used to find Ironman races and populate an Array with "race" objects that have: Race Name, Race URL, and URLs to each of the results sets for that race
function pullInIronmanRaceData(data, savedRaces){
  var checkCounter = 0;
  
  var races = new Array(); //this is what we will hold all the race data in
  
  var racesString = data.replace(/['"]/g,''); //.replace(/»/g, '').replace(/\./g, '').replace(/\|/g, '');

//  racesString = data.replace(/\s+/g, '').replace(/<\/td>/g, '').replace(/class=\"right\"/g, '');//take out white space and end of table data tags
  var racesArray = racesString.split('inline'); //split up array based on races only and remove first item (as it contains nothing useful)
  racesArray.shift();  

  //we have an array of races as a string of info and we need to break it into usable pieces  

  var iLen=racesArray.length;
  for(var i=0; i<iLen; i++) { //take the array and pull out only the names and the href associated with it

    var raceYearURLs = new Array();
    if (i%2 === 0) 
    {
      checkCounter = checkCounter + 1
      var raceName = racesArray[i].split('alt=')[1].split(' Logo')[0]  //*****put this into Race Object!
      var raceLocation =racesArray[i].split('<span class=location>')[1].split('</span>')[0];  //*****put this into Race Object!
      if (raceName.indexOf("Ironman Asia-Pacific Championship Melbourne") > -1){ raceName = "Ironman Asia-Pacific Championship Melbourne" }
      
    }
    else
    {


      //racesArray[i] = racesArray[i].replace(/\s+/g, ''); //take all the white space out of that section of the array
      if (racesArray[i].indexOf("Go to tracker »") > -1)//check to see if there are results available for this race
      {
        racesArray[i] = racesArray[i].split("<tbody>");
        
        //pulls out the offical race URL
        var raceURL = racesArray[i][0].split("<a href=")[1].split(" title")[0] //*****put this into Race Object!

        racesArray[i] = racesArray[i][1].split("<a href=");


        var jLen=racesArray[i].length;
        for(var j=0; j<jLen; j++) {
           // racesArray[i] = racesArray[i][j].split("Go to tracker »");
          if (racesArray[i][j].indexOf("Go to tracker »") > -1){
            
            raceYearURL = "http://ironman.com" + racesArray[i][j].split(" title")[0].replace(/amp;/g, '');

            if ($.inArray(raceYearURL, savedRaces) ===-1){            
              raceYearURLs.push(raceYearURL);
            }
          }
        }

      }
      else
      {
        racesArray[i] = ""
      }

      if (raceYearURLs.length > 0)
      {        
        var race = new Object(); //this is what we will hold all the race data in
        race.raceName = raceName;
        race.raceLocation = raceLocation;
        race.raceURL = raceURL;
        race.results = raceYearURLs;
        races.push(race);

      }
    }   
  }


  var newRaceNumber = 0; //use this to attach the form to the table using unique ID

  var kLen=races.length;
  for(var k=0; k<kLen; k++) 
  {
    if(races[k].results != undefined)
    {
      var htmlRaceName = races[k].raceName;
      var htmlRaceLocation = races[k].raceLocation;
      var htmlraceURL = races[k].raceURL;

      var htmlRaceType = 'Tri';
      if(htmlRaceName.indexOf("70.3") > -1)
      {
        var htmlRaceDistance = '70.3';
      }
      else
      {
        var htmlRaceDistance = '140.6';
      }
      var resultsArray = races[k].results;
      var mLen=resultsArray.length;
      for(var m=0; m<mLen; m++) 
      {
        var htmlYear = resultsArray[m].substr(resultsArray[m].length-4);
        var htmlRaceResultYearURL = resultsArray[m];


//////////////////////////////////
// Here I create a hidden form that I will use to submit new race info

        var newRaceForm = document.createElement("form");
        newRaceForm.action="/races";
        newRaceForm.method="post";
        newRaceForm.setAttribute("data-remote", "true");
              
        //Race Name
        var hiddenRaceInfoField = document.createElement("input");
        hiddenRaceInfoField.setAttribute("name", "race[race_name]");
        hiddenRaceInfoField.setAttribute("value", htmlRaceName);
        hiddenRaceInfoField.setAttribute("type", "hidden");
        newRaceForm.appendChild(hiddenRaceInfoField);
              
        //Race Location
        var hiddenRaceInfoField = document.createElement("input");
        hiddenRaceInfoField.setAttribute("name", "race[location]");
        hiddenRaceInfoField.setAttribute("value", htmlRaceLocation);
        hiddenRaceInfoField.setAttribute("type", "hidden");
        newRaceForm.appendChild(hiddenRaceInfoField);

        //Race Type
        var hiddenRaceInfoField = document.createElement("input");
        hiddenRaceInfoField.setAttribute("name", "race[race_type]");
        hiddenRaceInfoField.setAttribute("value", htmlRaceType);
        hiddenRaceInfoField.setAttribute("type", "hidden");
        newRaceForm.appendChild(hiddenRaceInfoField);

        //Race Distance
        var hiddenRaceInfoField = document.createElement("input");
        hiddenRaceInfoField.setAttribute("name", "race[distance]");
        hiddenRaceInfoField.setAttribute("value", htmlRaceDistance);
        hiddenRaceInfoField.setAttribute("type", "hidden");
        newRaceForm.appendChild(hiddenRaceInfoField);

        //Race Year
        var hiddenRaceInfoField = document.createElement("input");
        hiddenRaceInfoField.setAttribute("name", "race[year]");
        hiddenRaceInfoField.setAttribute("value", htmlYear);
        hiddenRaceInfoField.setAttribute("type", "hidden");
        newRaceForm.appendChild(hiddenRaceInfoField);
        
        //Main Race URL
        var hiddenRaceInfoField = document.createElement("input");
        hiddenRaceInfoField.setAttribute("name", "race[raceMainURL]");
        hiddenRaceInfoField.setAttribute("value", htmlraceURL);
        hiddenRaceInfoField.setAttribute("type", "hidden");
        newRaceForm.appendChild(hiddenRaceInfoField);

        //Race Result URL
        var hiddenRaceInfoField = document.createElement("input");
        hiddenRaceInfoField.setAttribute("name", "race[raceResultURL]");
        hiddenRaceInfoField.setAttribute("value", htmlRaceResultYearURL);
        hiddenRaceInfoField.setAttribute("type", "hidden");
        newRaceForm.appendChild(hiddenRaceInfoField);

        //Submit Button
        var hiddenRaceInfoField = document.createElement("input");
        hiddenRaceInfoField.setAttribute("class", "btn");
        hiddenRaceInfoField.setAttribute("value", "Add Race");
        hiddenRaceInfoField.setAttribute("name", "commit");        
        hiddenRaceInfoField.setAttribute("type", "submit");

   
        newRaceForm.appendChild(hiddenRaceInfoField);
    

        newRaceNumber = newRaceNumber+1;
        
        $('#newRacesTable tbody').after('<tr>'+
            '<td><a href='+htmlraceURL+' target="_blank">'+htmlRaceName+'</a></td>' +
            '<td>'+htmlRaceType+'</td>' +
            '<td>'+htmlRaceDistance+'</td>' +
            '<td><a href='+htmlRaceResultYearURL+' target="_blank">'+htmlYear+'</a></td>' +
            '<td></td>' +
            '<td>'+htmlRaceLocation+'</td>' +
            '<td></td>' +
            '<td></td>' +
            '<td id=td_'+newRaceNumber+'></td>' +
            '<td></td>' +
            '<td></td>' +
          '</tr>'
        );
        $('#td_'+newRaceNumber).append(newRaceForm);

        var tableData = $('#td_'+newRaceNumber)
        showButtonHasBeenPressed(tableData);            
      }
    }
  }
  $('#numberOfNewRaces').html(newRaceNumber);
}

function showButtonHasBeenPressed(tableDataCell){
  tableDataCell.find(".btn").on('click', function() {
    tableDataCell.find(".btn").attr('class', "btn-success").attr('value', 'Added');
    tableDataCell.parent().slideUp();
  });

}