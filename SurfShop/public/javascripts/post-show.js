
mapboxgl.accessToken = 'pk.eyJ1IjoiYm9uYTlqYSIsImEiOiJja3o0bGc0NzYwZmRyMnZtZXo3ajZienBuIn0._gyNE8Ji8lR1-BlKawySvw';
const map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/light-v10',
center: post.geometry.coordinates,
zoom: 3
});
// code from the next step will go here!

// add markers to map
// create a HTML element for each feature
const el = document.createElement('div');
el.className = 'marker';
// make a marker for each feature and add to the map
new mapboxgl.Marker(el).setLngLat(post.geometry.coordinates)
.setPopup(
  new mapboxgl.Popup({ offset: 25 }) // add popups
    .setHTML(
      `<h3>${post.title}</h3><p>${post.location}</p>`
    )
)
.addTo(map);



//Post Reviews Edit form script
$(".formBtn").click(function(e){
  $(this).text()=="Edit"?$(this).text("Cancel"):$(this).text("Edit");
 $(this).next('.toggleForm').toggle()
})
