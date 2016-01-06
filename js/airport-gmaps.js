/*set up the airport map*/
var map;
var airportMarkers=[],unhidenAirportMarkers=[];
var airportMarker,i,clickedAirport;
var route,routeList=[],unhidenRoute=[];
var planeIcon = './images/airport_sm15.png';
    function loadResults (data) {
        //var items, markers_data = [];
    	var l=data.length;
        if (l> 0) {
          for (i = 0; i < l; i++) {
            var item = data[i];

            if (item.lat != undefined && item.lon != undefined) {
            	
            	airportMarker= new google.maps.Marker({
            	  position: new google.maps.LatLng(item.lat,item.lon),
            	  //map: map,
            	  visible:true,
            	  code: item.code,
              	  title : item.code+'\n'+item.city+', '+item.country,
              	  icon :  planeIcon
            	});
            	
       	
              google.maps.event.addListener(airportMarker,'click',function(){
            	  if(clickedAirport == undefined){
            		  clickedAirport=this;
            		  airportClicked();
            	  }
            	  else{
            		  showAllAirports();
            	  }
            	  
              });
              
              airportMarkers.push(airportMarker);
              /*
              google.maps.drawRoute({
            	 origin: markers[3].position,
            	 destination: markers[4].position,
            	 travelMode: 'driving'
              });
            	*/
            	
            }
            
          }
        }
        
          map.addMarkers(airportMarkers); 
          var routeData = $.getJSON('./data/route.json');
          routeData.done(loadRoutes);
          //alert(airportMarkers[0].position.lat());
          //alert("routes loaded!");
    }
    
    //load routes data
    function loadRoutes(data){
    	var l=data.length;
    	for(i=0;i<l;i++){
    		var item = data[i];
    		var oriIndex=getAirportIndexByCode(item.ori);
    		var destIndex=getAirportIndexByCode(item.des);
    		//alert('oriIndex: '+ oriIndex);
    		if(oriIndex!==-1 && destIndex!==-1){
    			//alert('oriIndex: '+ oriIndex+' destIndex: '+ destIndex);
    			alert('i:'+i+', l:'+l+', ori:'+airportMarkers[oriIndex].code+',lat:'+airportMarkers[oriIndex].position.lat()
    					+'lng:'+airportMarkers[oriIndex].position.lng()	
    					+'dest:'+airportMarkers[destIndex].code+',lat:'+airportMarkers[destIndex].position.lat()
    					+'lng:'+airportMarkers[destIndex].position.lng()	);
    			var AirportCoordinates=[
    			                        [
    			                        	airportMarkers[oriIndex].position.lat(),
    			                        	airportMarkers[oriIndex].position.lng()	
    			                        ],
    			                        [
    			                        	airportMarkers[destIndex].position.lat(),
       			                         	airportMarkers[destIndex].position.lng()		
    			                        ]
    			                        ];
    			alert(AirportCoordinates);
    			route = new google.maps.Polyline({
        			path:AirportCoordinates,
        			geodesic: false,
        			visible: false,
        			strokeColor: '#FF0000',
        			strokeWeight: 2,
        			origin:aiportMarkers[oriIndex].code,
        			destination:airportMarkers[destIndex].code	
        		});
    			route.setMap(map);
    			//alert("route.origin:"+route.origin+",route.destination:"+route.destination);
    			routeList.push(route);	
    		}
    		
    	}
    	//alert('Route number: '+ routeList.length);
    	//alert('routeList[0]:'+ routeList[0].origin+" to " + routeList[0].destination);
    	//routeList[0].setVisible(true);
    }
    
    function hideRoutes(){
    	var l=unhidenRoute.length;
    	for(i=0;i<l;i++){
    		unhidenRoute[i].setVisible(false);
    	}
    }
    
    function compareRoutes(route1,route2){
    	if(route1.origin.code < route2.origin.code)
    		return -1;
    	if(route1.origin.code > route2.origin.code)
    		return 1;
    	if(route1.destination.code < route2.destination.code)
    		return -1;
    	if(route1.destination.code > route2.destination.code)
    		return 1;
    	return 0;
    }
    
    
    function compareAirports(airportMarker1, airportMarker2){
    	if(airportMarker1.code < airportMarker.code)
    		return -1;
    	if(airportMarker1.code > airportMarker2.code)
    		return 1;
    	return 0;
    }
    
    
    function getAirportIndexByCode(codeIn){
    	var minIndex=0;
    	var maxIndex =  airportMarkers.length-1;
    	var currentIndex;
    	var currentAirport;
    	while(minIndex <= maxIndex){
    		currentIndex = (minIndex + maxIndex) / 2 | 0;
    		currentAirport = airportMarkers[currentIndex];
    		//alert('min:'+minIndex+", max:"+maxIndex+"\n current:"+currentAirport.code+", target:"+codeIn);
    		if(currentAirport.code.localeCompare(codeIn)<0 ){
    			minIndex=currentIndex+1 ;
    		}else if(currentAirport.code.localeCompare(codeIn)>0){
    			maxIndex = currentIndex-1 ;
    		}
    		else{//(currentAirport.code.localeCompare(codeIn)==0){
    			return currentIndex;
    		} 
    	}
    	return -1;
    }
    
    function unhideRoutes(codeIn){
    	var l=routeList;
    	for(i=0;i<l;i++){
    		route=routeList[i];
    		if(route.origin==codeIn || route.destination==codeIn){
    			route.setVisible(true);
    			unhidenRoute.push(route);
    		}
    	}
    }
    
    function getRouteIndexByCode(codeIn){
    	var minIndex=0;
    	var maxIndex =  routeList.length-1;
    	var currentIndex;
    	var currentRoute;
    	while(minIndex < maxIndex){
    		currentIndex=minIndex +(maxIndex - minIndex)/2;
    		currentRoute = routeList[currentIndex];
    		if(currentRoute.origin.code < codeIn){
    			minIndex=currentIndex;
    		}else if(currentRoute.origin.code > codeIn){
    			maxIndex = currentIndex;
    		}else{
    			return currentIndex;
    		}
    	}
    	return -1;
    }
    
    function airportClicked(){

    	var l=airportMarkers.length;
    	for(i=0;i<l;i++){
    		airportMarkers[i].setVisible(false);
    	}
    	clickedAirport.setIcon('./images/airport_sm15R.png');
    	clickedAirport.setVisible(true);
    	unhideRoutes(clickedAirport.code);
    	
    	
    }
    
    
    function showAllAirports(){
    	clickedAirport.setIcon(planeIcon);
    	clickedAirport=null;
    	var l=airportMarkers.length;
    	for(i=0;i<l;i++){
    		airportMarkers[i].setVisible(true);
    	}
    	
    }
    
 
    function initMap(){
      //prettyPrint();
      map = new google.maps.Map(document.getElementById('map'),{
        zoom: 8,
        //lat: markers[3].position.lat(),
        //lng:markers[3].position.lng()
        click: function(e){showAllAirports();hideRoutes();},
        center: {lat: 42.08,  lng: -87.72}
      });
      
      var airportData = $.getJSON('./data/airports2.json');
      loadResults(airportData);
      alert(airportData);
      //loadResults(airportData);
      
      //airportMarkers.sort(compareAirports);
      
      
      var routeData = $.getJSON('./data/route.json');
      loadRoutes(routeData);

    }