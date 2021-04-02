export const toRad = (Value) => {
	return Value * Math.PI / 180;
}

export const toDeg = (Value) => {
	return Value * 180 / Math.PI;
}

export const getAngle = (lat1, lon1, lat2, lon2) => {
	var dLat = toRad(lat2-lat1);
	var dLon = toRad(lon2-lon1);
	lat1 = toRad(lat1);
	lat2 = toRad(lat2);
	var y = Math.sin(dLon)*Math.cos(lat2);
	var x = Math.cos(lat1)*Math.sin(lat2) - Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
	var angle = toDeg(Math.atan2(y, x));
	if (angle < 0){
		angle = 360+angle;
	}
	return Math.abs(angle).toFixed(0);
}

export const convSpeedUnits = (val, from, to) => {
	return Math.floor(convDistanceUnits(val, from, to));
}

export const convDistanceUnits = (val, from, to) => {
	if (from == 'km'){
		if (to == 'mi'){
			val = val * 0.621371;
		}
		else if (to == 'nm'){
			val = val * 0.539957;
		}
	}
	else if (from == 'mi'){
		if (to == 'km'){
			val = val * 1.60934;
		}
		else if (to == 'nm'){
			val = val * 0.868976;
		}
	}
	else if (from == 'nm'){
		if (to == 'km'){
			val = val * 1.852;
		}
		else if (to == 'nm'){
			val = val * 1.15078;
		}
	}
	
	return val;	
}

export const getAreaFromLatLngs = (latlngs) => {
	var pointsCount = latlngs.length,
		area = 0.0,
		d2r = 0.017453292519943295,
		p1, p2;
                
	if (pointsCount > 2){
		for (var i = 0; i < pointsCount; i++){                        
			p1 = latlngs[i];
			p2 = latlngs[(i + 1) % pointsCount];
			area += ((p2.lng - p1.lng) * d2r) *
					(2 + Math.sin(p1.lat * d2r) + Math.sin(p2.lat * d2r));
		}
                
		area = area * 6378137.0 * 6378137.0 / 2.0;
	}

	return Math.abs(area); // sq meters
}

export const getLengthFromLatLngs = (latlngs) => {
    var dist = 0;
    
    for (var i = 0; i < latlngs.length-1; i++){
	    var latlng1 = latlngs[i];
	    var latlng2 = latlngs[i+1];
	    
	    dist += getLengthBetweenCoordinates(latlng1.lat, latlng1.lng, latlng2.lat, latlng2.lng);
    }
    
    return dist;
}

export const getLengthBetweenCoordinates = (lat1, lng1, lat2, lng2) => {
	var R = 6371; // Radius of the earth in km
	var dLat = toRad(lat2-lat1);  // deg2rad below
	var dLon = toRad(lng2-lng1); 
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
		Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
		Math.sin(dLon/2) * Math.sin(dLon/2)
		; 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c; // Distance in km
	
	return d;
}