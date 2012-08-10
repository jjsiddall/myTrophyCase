var globalRacersObject = new Object();

// this function will run as soon as javascript is ready
$(function() {
    

	$('#test-Button').on('click', function() {
      var deleteme = "Jake Siddall (267) - 11:11:11"
      console.log(deleteme)
      
      console.log(deleteme.match(/\((.*?)\)/)[1]);

  });

  // $('#result_racerName').change( function() {
  //     console.log($('#result_racerName').val() + " change"); //.match("((.*?))")[1]);
  // });

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

      // if ($('#result_racerName').val().match("((.*?))")[1] != "") {
      //   console.log("found a bib")
      // }
   });

}); 

function getPageDataYQL(firstLetter){
  var container = $('#target');
  
  var url = "http://tracking.ironmanlive.com/newsearch.php?rid=175&letter=" + firstLetter //the is the website I want to pull from

  console.log(url);

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
  
  console.log(racers)
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
  // console.log(alpha3Country)

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