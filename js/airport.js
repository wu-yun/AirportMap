/*set up the airport map*/
var map;
var airportMarkers=[],unhidenAirportMarkers=[];
var airportMarker,i,clickedAirport;
var route,routeList=[],unhidenRoute=[];
var planeIcon = './images/airport_sm15.png';
var airportInfos=[];
var initLat,initLong;

    function loadAirports (data) {
        //var items, markers_data = [];
    	var l=data.length;
        if (l> 0) {
          for (i = 0; i < l; i++) {
            var item = data[i];

            if (item.lat != undefined && item.lon != undefined) {
            	
            	airportMarker= new google.maps.Marker({
            	  position: new google.maps.LatLng(item.lat,item.lon),
            	  map: map,
            	  visible:true,
            	  code: item.code,
            	  city: item.city,
            	  country: item.country,
              	  title : item.code+'\n'+item.city+', '+item.country,
              	  icon :  planeIcon
            	});
            	
       	
              google.maps.event.addListener(airportMarker,'click',function(){
            	  if(clickedAirport == undefined || clickedAirport==null){
            		  clickedAirport=this;
            		  airportClicked();
            	  }
            	  else if(this.code!=clickedAirport.code){
            		  showAllAirports();
            		  hideRoutes();
            		  clickedAirport=this;
            		  airportClicked();
            	  }
            	  else{
            		  showAllAirports();
            		  hideRoutes();
            	  }
              });
              //airportCodes.push(airportMarker.code);
              //airportCities.push(airportMarker.city+','+airportMarker.country);
              airportInfos.push(item.code+','+item.city+','+item.country);
              airportMarkers.push(airportMarker);
            }  
          }
        }
        
          //map.addMarkers(airportMarkers); 
          //alert("total airport :"+l);
          //alert(airportMarkers[0].position.lat());
          var routeData = $.getJSON('./data/route.json');
          //loadRoutes(routeData);
          routeData.done(loadRoutes);
          //alert("routes loaded!");
    }
    
    //load routes data
    function loadRoutes(data){
    	var l=data.length;
    	for(i=0;i<l;i++){
    		var item = data[i];
    		var oriIndex=getAirportIndexByCode(item.ori);
    		var destIndex=getAirportIndexByCode(item.des);
    		if(oriIndex!==-1 && destIndex!==-1){
    			var AirportCoordinates=[
    			                        {
    			                        	lat: airportMarkers[oriIndex].position.lat(),
    			                        	lng: airportMarkers[oriIndex].position.lng()	
    			                        },
    			                        {
    			                        	lat: airportMarkers[destIndex].position.lat(),
       			                         	lng: airportMarkers[destIndex].position.lng()		
    			                        }
    			                        ];
    			
    			route = new google.maps.Polyline({
        			path:AirportCoordinates,
        			geodesic: true,
        			visible: false,
        			strokeOpacity: 1.0,
        			strokeColor: '#FF0000',
        			strokeWeight: 2,
        			origin:airportMarkers[oriIndex].code,
        			destination:airportMarkers[destIndex].code	
        		});
    			route.setMap(map);
    			routeList.push(route);	
    		}
    	}
    }
    
    function hideRoutes(){
    	var l=unhidenRoute.length;
    	for(i=0;i<l;i++){
    		unhidenRoute[i].setVisible(false);
    	}
    	unhidenRoute=[];
    }
    
    
    /*
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
    */
    
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
    	unhidenRoute=[];
    	//alert('unhideRoutes() called!');
    	var l=routeList.length;
    	for(i=0;i<l;i++){
    		route=routeList[i];
    		if(route.origin==codeIn){
    			unhideAirport(route.destination);
    			route.setVisible(true);
    			unhidenRoute.push(route);
    		}else if(route.destination==codeIn){
    			unhideAirport(route.origin);
    			route.setVisible(true);
    			unhidenRoute.push(route);
    		} 
    	}
    }
    
    
    function unhideAirport(codeIn){
    	airportMarker=airportMarkers[getAirportIndexByCode(codeIn)];
    	airportMarker.setVisible(true);
    	unhidenAirportMarkers.push(airportMarker);
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
    	//alert("airportClicked() called!");
    	var l=airportMarkers.length;
    	for(i=0;i<l;i++){
    		airportMarkers[i].setVisible(false);
    	}
    	clickedAirport.setIcon('./images/airport_sm15R.png');
    	clickedAirport.setVisible(true);
    	map.setCenter(clickedAirport.position);
    	map.setZoom(6);
    	unhideRoutes(clickedAirport.code);
    	//alert(clickedAirport.code);
    	
    }
    
    function airportSelected(){
    	var airportInfo=document.getElementById("airportToSearch").value;
    	var codeIn=airportInfo.split(",")[0];
    	var selectedIndex=getAirportIndexByCode(codeIn);
    	if(selectedIndex!=-1){
    		if(clickedAirport == undefined || clickedAirport==null){
    	  		  clickedAirport=airportMarkers[selectedIndex];
    	  		  airportClicked();
    	  	  }
    	  	  else if(codeIn!=clickedAirport.code){
    	  		  showAllAirports();
    	  		  hideRoutes();
    	  		  clickedAirport=airportMarkers[selectedIndex];
    	  		  airportClicked();
    	  	  }
    	  	  else{
    	  		  showAllAirports();
    	  		  hideRoutes();
    	  	  }
    	}
    }
    
    function showAllAirports(){
    	clickedAirport.setIcon(planeIcon);
    	clickedAirport=null;
    	var l=airportMarkers.length;
    	for(i=0;i<l;i++){
    		airportMarkers[i].setVisible(true);
    	}
    	unhidenAirportMarkers=[];
    }

    
    function completeAirport(){
    	$("#airportToSearch").autocomplete({
      		source:airportInfos
      	});
    }
    
    function initMap(){
    	 map = new google.maps.Map(document.getElementById('map'),{
    	        zoom: 8, 
    	        center: {lat: 42.1,  lng: -87.8}
    	      });
    	 
    	if(navigator.geolocation){
    		navigator.geolocation.getCurrentPosition(function (position){
    			initialLocation=new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
    			map.setCenter(initialLocation);
    		});		
    	}

      var airportData = $.getJSON('./data/airports2.json');
      airportData.done(loadAirports);
      
      completeAirport();

      google.maps.event.addListener(map,'click',function(){
    	  showAllAirports();
    	  hideRoutes();
    	  });

    }
    
    
    
    
    