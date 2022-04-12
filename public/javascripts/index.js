if (document.querySelector('#search-input')) {
	const searchInput = document.querySelector('#search-input');
	// create a google place search box widget
	const searchBox = new google.maps.places.SearchBox(searchInput);
}
