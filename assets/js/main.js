/*
	Big Picture by HTML5 UP (Refactored for Daniele Maiellaro Portfolio)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$header = $('#header');

	// Breakpoints.
	breakpoints({
		xxlarge: [ '1681px',  '1920px' ],
		xlarge:  [ '1281px',  '1680px' ],
		large:   [ '1001px',  '1280px' ],
		medium:  [ '737px',   '1000px' ],
		small:   [ '481px',   '736px'  ],
		xsmall:  [ null,      '480px'  ]
	});

	// Play initial animations on page load.
	$window.on('load', function() {
		setTimeout(function() {
			$body.removeClass('is-preload');
		}, 100);
	});

	// Touch mode.
	if (browser.mobile)
		$body.addClass('is-touch');
	else {
		breakpoints.on('<=small', function() {
			$body.addClass('is-touch');
		});
		breakpoints.on('>small', function() {
			$body.removeClass('is-touch');
		});
	}

	// Gallery (Poptrox fallback for non-ignored items).
	$window.on('load', function() {
		var $gallery = $('.gallery');
		if ($gallery.length && $.fn.poptrox) {
			$gallery.poptrox({
				selector: 'a:not([data-poptrox="ignore"])',
				baseZIndex: 10001,
				useBodyOverflow: false,
				usePopupEasyClose: false,
				overlayColor: '#0f1316',
				overlayOpacity: 0.75,
				usePopupDefaultStyling: false,
				usePopupCaption: true,
				popupLoaderText: '',
				windowMargin: 50,
				usePopupNav: true
			});
		}
	});

	// Events & Scrolly per link interni non legati al carosello.
	var resizeTimeout;
	$window
		.on('resize', function() {
			$body.addClass('is-resizing');
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(function() {
				$('a[href^="#"]:not([data-carousel-target])').scrolly({
					speed: 900,
					offset: $header.outerHeight() - 1
				});
				setTimeout(function() {
					$body.removeClass('is-resizing');
					$window.trigger('scroll');
				}, 0);
			}, 100);
		})
		.on('load', function() {
			$window.trigger('resize');
		});

	// =========================================================================
	// Controller Carosello Hero (3 Card) & Sincronizzazione Menu / Bottom Bar
	// =========================================================================
	document.addEventListener('DOMContentLoaded', function() {
		var track = document.getElementById('hero-track');
		if (!track) return;

		var slides = Array.prototype.slice.call(track.querySelectorAll('.carousel-slide'));
		var tabs = Array.prototype.slice.call(document.querySelectorAll('.carousel-tab'));
		var dots = Array.prototype.slice.call(document.querySelectorAll('.carousel-dot'));
		var headerLinks = Array.prototype.slice.call(document.querySelectorAll('#header nav a[data-carousel-target]'));
		var prevBtn = document.querySelector('.carousel-arrow.prev');
		var nextBtn = document.querySelector('.carousel-arrow.next');
		var currentIndex = 0;

		function updateIndicators(index) {
			currentIndex = index;

			tabs.forEach(function(tab, i) {
				var isActive = i === index;
				tab.classList.toggle('active', isActive);
				tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
			});

			dots.forEach(function(dot, i) {
				dot.classList.toggle('active', i === index);
			});

			headerLinks.forEach(function(link) {
				var targetIdx = parseInt(link.getAttribute('data-carousel-target'), 10);
				link.classList.toggle('active-slide-link', targetIdx === index);
			});
		}

		function goToSlide(index, smoothScrollToHero) {
			var total = slides.length;
			var normalized = (index + total) % total;
			var targetSlide = slides[normalized];

			if (targetSlide) {
				track.scrollTo({
					left: targetSlide.offsetLeft,
					behavior: 'smooth'
				});
				updateIndicators(normalized);
			}

			if (smoothScrollToHero) {
				var heroSection = document.getElementById('hero-carousel');
				if (heroSection) {
					window.scrollTo({
						top: 0,
						behavior: 'smooth'
					});
				}
			}
		}

		// Frecce Precedente / Successivo
		if (prevBtn) {
			prevBtn.addEventListener('click', function() {
				goToSlide(currentIndex - 1, false);
			});
		}

		if (nextBtn) {
			nextBtn.addEventListener('click', function() {
				goToSlide(currentIndex + 1, false);
			});
		}

		// Click su Tab, Dots, Menu Header e Bottom Bar Mobile
		var allCarouselTriggers = document.querySelectorAll('[data-carousel-target]');
		Array.prototype.forEach.call(allCarouselTriggers, function(trigger) {
			trigger.addEventListener('click', function(e) {
				e.preventDefault();
				var targetIndex = parseInt(this.getAttribute('data-carousel-target'), 10);
				var isNavTrigger = this.tagName.toLowerCase() === 'a';
				goToSlide(targetIndex, isNavTrigger);
			});
		});

		// Aggiornamento indicatori durante lo swipe touch / scroll nativo del carosello
		var scrollTimer;
		track.addEventListener('scroll', function() {
			clearTimeout(scrollTimer);
			scrollTimer = setTimeout(function() {
				var slideWidth = track.clientWidth;
				if (slideWidth > 0) {
					var newIndex = Math.round(track.scrollLeft / slideWidth);
					if (newIndex >= 0 && newIndex < slides.length && newIndex !== currentIndex) {
						updateIndicators(newIndex);
					}
				}
			}, 60);
		});
// Sincronizzazione stato attivo della Bottom Bar Mobile e Top Nav Desktop durante lo scroll verticale
		var workSection = document.getElementById('work');
		var contactSection = document.getElementById('contact');
		var allMobileItems = Array.prototype.slice.call(document.querySelectorAll('#mobile-bottom-nav .mobile-nav-item'));
		var allDesktopItems = Array.prototype.slice.call(document.querySelectorAll('#header nav ul li a'));

		window.addEventListener('scroll', function() {
			var scrollPos = window.scrollY + window.innerHeight * 0.35;

			if (contactSection && scrollPos >= contactSection.offsetTop) {
				allMobileItems.forEach(function(item) {
					item.classList.toggle('active', item.getAttribute('href') === '#contact');
				});
				allDesktopItems.forEach(function(item) {
					item.classList.toggle('active-slide-link', item.getAttribute('href') === '#contact');
				});
			} else if (workSection && scrollPos >= workSection.offsetTop) {
				allMobileItems.forEach(function(item) {
					item.classList.toggle('active', item.getAttribute('href') === '#work');
				});
				allDesktopItems.forEach(function(item) {
					item.classList.toggle('active-slide-link', item.getAttribute('href') === '#work');
				});
			} else {
				allMobileItems.forEach(function(item) {
					var targetAttr = item.getAttribute('data-carousel-target');
					item.classList.toggle('active', targetAttr !== null && parseInt(targetAttr, 10) === currentIndex);
				});
				allDesktopItems.forEach(function(item) {
					var targetAttr = item.getAttribute('data-carousel-target');
					item.classList.toggle('active-slide-link', targetAttr !== null && parseInt(targetAttr, 10) === currentIndex);
				});
			}
		});
		});
})(jQuery);
