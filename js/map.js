// create map with Mapbox Streets tilelayer
L.mapbox.accessToken = 'pk.eyJ1IjoidG9kZGdsZWFua3kiLCJhIjoiY2ltcW16OXdzMDBqb3Vwa2toNm9pb200NiJ9.hwTEGkXsOWDrBgFO8jzQfQ';
// Replace 'mapbox.streets' with your map id.
var mapboxTiles = L.tileLayer('https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=' + L.mapbox.accessToken, {
    attribution: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

//Add empty variable for data 
var sitePoints = null;

//Sets the color for each Program Type
//more Program Types can be added by following the pattern below
//the last color without a type label is the color that anything with a type that isn't listed will be colored 
function setColor(type) {
	return type == 'one' ? "#134600" :
	       type == 'two' ? "#467900" : 
	       type == 'three' ? "#79AC00" : 
	                     "#F8FF7F";
}

function style(feature) {
    return {
        fillColor: setColor(feature.properties.program_type),
        color: "white",
        fillOpacity: 0.9,
        width: 0.2
    };
}

var activePoint;

function highlightFeature(e) {
	if (activePoint) {
		activePoint.setStyle(style(activePoint.feature));
	};
	
	var layer = e.target;
	activePoint = e.target;
	
	
	activePoint.setStyle({
		fillColor: '#f6630f',
	});
}


//get geoJSON and put it on the map
$.getJSON("data/map.geojson",function(data){
	// Create data layer
	sitePoints = L.geoJson(data, {
		pointToLayer: function (feature, latlng) {
        return L.circleMarker (latlng, style(feature));
		},
		
		
	 onEachFeature: function(feature, layer) {            
        var props = layer.feature.properties;
        
        layer.bindPopup("<h2>"+props.organization+"</h2>"+
		        "<dl>"+
			        "<dt>"+"Address: "+"</dt><dd>"+props.address+"<br>"+ props.website+"</dd>"+
			        "<dt>"+"Contact: "+"</dt><dd>"+props.contact+"<br>"+props.email+"<br>"+props.phone+"</dd>"+
			        "<dt>"+"Hours of Operation: "+"</dt><dd>"+props.hours+"</dd>"+
			        "<dt>"+"Storage Capacity: "+"</dt><dd>"+props.storage_cap+"</dd>"+
			        "<dt>"+"Type of Program: "+"</dt><dd>"+props.program_type+"</dd>"+
			        "<dt>"+"Food Education Offered: "+"</dt><dd>"+props.food_ed+"</dd>"+
			        "<dt>"+"Regular Gleaning Donation: "+"</dt><dd>"+props.reg_donation+"</dd>"+
			        "<dt>"+"Produce Restrictions: "+"</dt><dd>"+props.produce_restrictions + "</dd>"+
		        "</dl>");
	
	    layer.on({
	        click: highlightFeature
	    });
	    
    }
	
		// onEachFeature: function(feature, layer) {
		//     var props = layer.feature.properties;
		//     layer.on({
		//         click: function populate(e) {
		//         document.getElementById('poptext').innerHTML = "<h2>"+props.organization+"</h2>"+
		//         "<dl>"+
		// 	        "<dt>"+"Address: "+"</dt><dd>"+props.address+"<br>"+ props.website+"</dd>"+
		// 	        "<dt>"+"Contact: "+"</dt><dd>"+props.contact+"<br>"+props.email+"<br>"+props.phone+"</dd>"+
		// 	        "<dt>"+"Hours of Operation: "+"</dt><dd>"+props.hours+"</dd>"+
		// 	        "<dt>"+"Storage Capacity: "+"</dt><dd>"+props.storage_cap+"</dd>"+
		// 	        "<dt>"+"Type of Program: "+"</dt><dd>"+props.program_type+"</dd>"+
		// 	        "<dt>"+"Food Education Offered: "+"</dt><dd>"+props.food_ed+"</dd>"+
		// 	        "<dt>"+"Regular Gleaning Donation: "+"</dt><dd>"+props.reg_donation+"</dd>"+
		// 	        "<dt>"+"Produce Restrictions: "+"</dt><dd>"+props.produce_restrictions + "</dd>"+
		//         "</dl>";
		//         highlightFeature(e)
		        	
		//         },
		        
		//     });
	 //   }
});

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend');
    //this is the title for the legend
    div.innerHTML += "<b>"+ 'Program Type'+ "</b>"+ "<br>";
    
    //type is the content of the Program Type field, labels is what you want the label on the legend to actually say
    //there need to be the same number of types as labels and listed in the same order
    type = ['one', 'two', 'three'];
    labels = ['One','Two','Three'];
    
    for (var i = 0; i < type.length; i++) {
        div.innerHTML +=
            '<i class="circle" style="background:' + setColor(type[i]) + '"></i> ' +
             (type[i] ? labels[i] + '<br>' : '+');
    }
    
    return div;
};

var map = L.map('map', {maxZoom: 17}).fitBounds(sitePoints.getBounds());
	mapboxTiles.addTo(map);
	sitePoints.addTo(map);
	legend.addTo(map);

}); 
