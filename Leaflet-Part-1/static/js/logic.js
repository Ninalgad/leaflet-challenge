let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

let myMap = L.map("map", {
    center: [40.8813324, -122.2173309],
    zoom: 3
});

function chooseColor(depth) {
    if (depth < 10) return "#F24B4B";
    else if (depth < 45) return "#F27A5E";
    else if (depth < 70) return "#F2994B";
    else if (depth < 300) return "#05AFF2";
    else return "#0597F2"
}

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

d3.json(url).then(function(response) {
    data = response.features

    for (let i = 0; i < data.length; i++) {

        let d = data[i]
        let latlon = [d.geometry.coordinates[1], d.geometry.coordinates[0]]
        let depth = d.geometry.coordinates[2]
        let magnitude = d.properties.mag
        let location = d.properties.place

        if (location) {
            L.circle(latlon, {
                    opacity: 0,
                    fillColor: chooseColor(depth),
                    fillOpacity: 0.5,
                    radius: Math.log(magnitude + 10) * 20000
                }).bindTooltip(`<h2> ${location} </h2> <h4>Magnitude ${magnitude} <br> Location ${latlon} <br> Depth ${depth} </h4>`)
                .addTo(myMap)
        }

    }
})


var legend = L.control({
    position: 'bottomright'
})
legend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'info legend')
    var depths = [0, 10, 45, 70, 300]

    // Add legend header
    let legendInfo = "<h1>Depth of an <br><br> Earthquake</h1><h2>(kilometers)</h2>"

    div.innerHTML = legendInfo;
    
    // Add legend levels
    for (var i = 0; i < depths.length; i++) {
        div.innerHTML +=
            '<i style="background:' + chooseColor(depths[i] + 1) + '"></i> ' +
            depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br><br>' : '+');
    }

    return div;
}
legend.addTo(myMap)