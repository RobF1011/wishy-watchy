$(document).ready(function () {

    
    // Toggles the menu button between hamburger and arrow
    $('.hamburger, .arrow').click(function () {
		$(this).toggleClass('hamburger arrow');
		$('nav').toggle('slide', {direction:'left'}, 300);
	})

	//If window > 703, display sidebar
	$(window).resize(function () {
	    if ($(window).width() > 703) {
	      $('nav').show()
	    }
	    else {
	      $('nav').hide()
	      $('.arrow').removeClass('arrow').addClass('hamburger')
	    }
  	})

	// Read a page's GET URL variables and return them as an associative array.
	function getUrlVars() {
	    var vars = [], hash;
	    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	    for(var i = 0; i < hashes.length; i++)
	    {
	        hash = hashes[i].split('=');
	        vars.push(hash[0]);
	        vars[hash[0]] = hash[1];
	    }
	    return vars;
	}


	// Retrieves Wish List data via Amazon Wish Lister API by Justin Scarpetti, formats and inserts data onto page
	function getItems (ID, country, sort, filter) {
		$.getJSON('http://robf1011.github.io/wishy-watchy/amazon/src/wishlist.php?id=' + ID + '&tld=' + country + '&sort=' + sort + '&reveal=' + filter, function( data ) {
			$('section').empty()
			if (data == null) {
				$('section').append('<div class="full-text"><h2>No Wish List items found!</h2></div>')
				$('#loader').hide()
			} 
			else {
				$.each(data, function(i, item) {
					$('section').append('<article><div class="table-cell"><a href="' + data[i].link + '" target="_blank"><img src="' + data[i].largeimage + '"></a></div><div class="table-cell"><h4><a href="' + data[i].link + '" target="_blank">' + data[i].name + '</a></h4><h4>Current Price: <span class="green">' + data[i].newprice + '</span></h4><p>Price when added: ' + data[i].oldprice + '</p><p>Date added: ' + data[i].dateadded + '</p><p class="comment">Comments: ' + data[i].comment + '</p><a href="' + data[i].link + '" target="_blank" class="btn">BUY</a></div></article>' );
				});
	            $('#loader').hide()
        	}
		});
	}


	// On page load, check query strings and run getItems function
	var wishlistID = getUrlVars()['id'];
	if (wishlistID == undefined) {
		wishlistID = ''
	}
	$('#amazon_id').val(wishlistID)
	
	var country = getUrlVars()['tld'];
	if (country == undefined) {
		country = 'com'
	}
	$('#country').val(country)
	
	var sort = getUrlVars()['sortby'];
	if (sort == undefined) {
		sort = 'date'
	}
	$('#sort').val(sort)
	
	var filter = getUrlVars()['filterby'];
	if (filter == undefined) {
		filter = 'unpurchased'
	}
	$('#filter').val(filter)

	if (wishlistID == '') {
		$('section').append('<div class="full-text"><h5>Use the menu to enter an Amazon Wish List ID, select your options and hit Go!</h5><h5>To find the ID, go to any public wish list on amazon.com. In the url, copy the 12-character value after "wishlist/".</h5><h5>For example:</h5><h5>http://www.amazon.com/gp/registry/wishlist/<span style="background-color: yellow;">1LOD32NWDLJ1</span>/ref=cm_wl_list_o_6?</h5></div>')
		$('#loader').hide()
	}
	else {
		getItems(wishlistID, country, sort, filter)
	}


	// On submit, append query strings and redirect
	$('#wishlist-id').submit(function (event) {
		event.preventDefault()
		var wishlistID = $('#amazon_id').val()
		var country = $('#country').val()
		var sort = $('#sort').val()
		var filter = $('#filter').val()
		var url = 'http://robf1011.github.io/wishy-watchy/?id=' + wishlistID + '&tld=' + country + '&sortby=' + sort + '&filterby=' + filter
		$(location).attr('href', url )
		// var wishlistID = $('#amazon_id').val()
		// getItems(wishlistID)
	})


	// Bookmark script
	$('#bookmark-this').click(function(e) {
		var bookmarkURL = window.location.href;
	    var bookmarkTitle = document.title;

	    if ('addToHomescreen' in window && window.addToHomescreen.isCompatible) {
	      // Mobile browsers
	      addToHomescreen({ autostart: false, startDelay: 0 }).show(true);
	    } else if (window.sidebar && window.sidebar.addPanel) {
	      // Firefox version < 23
	      window.sidebar.addPanel(bookmarkTitle, bookmarkURL, '');
	    } else if ((window.sidebar && /Firefox/i.test(navigator.userAgent)) || (window.opera && window.print)) {
	      // Firefox version >= 23 and Opera Hotlist
	      $(this).attr({
	        href: bookmarkURL,
	        title: bookmarkTitle,
	        rel: 'sidebar'
	      }).off(e);
	      return true;
	    } else if (window.external && ('AddFavorite' in window.external)) {
	      // IE Favorite
	      window.external.AddFavorite(bookmarkURL, bookmarkTitle);
	    } else {
	      // Other browsers (mainly WebKit - Chrome/Safari)
	      alert('Press ' + (/Mac/i.test(navigator.userAgent) ? 'Cmd' : 'Ctrl') + '+D to bookmark this page.');
	    }

	    return false;
  	});

	// Refresh button
	$('#refresh').click (function () {
		location.reload();
	});



});
