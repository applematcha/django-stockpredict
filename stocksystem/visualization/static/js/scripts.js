/* Template: Sena - Business Landing Page Template
   Author: InovatikThemes
   Created: Feb 2018
   Description: Custom JS file
*/


(function($) {
    "use strict"; 
	
	/* Preloader */
	$(window).on('load', function() {
		var preloaderFadeOutTime = 500;
		function hidePreloader() {
			var preloader = $('.spinner-wrapper');
			setTimeout(function() {
				preloader.fadeOut(preloaderFadeOutTime);
			}, 500);
		}
		hidePreloader();
	});

	
	/* Navbar Scripts */
	// jQuery to collapse the navbar on scroll
	$(window).scroll(function() {
		if ($(".navbar").offset().top > 60) {
			$(".fixed-top").addClass("top-nav-collapse");
		} else {
			$(".fixed-top").removeClass("top-nav-collapse");
		}
	});

	// jQuery for page scrolling feature - requires jQuery Easing plugin
	$(function() {
		$(document).on('click', 'a.page-scroll', function(event) {
			var $anchor = $(this);
			$('html, body').stop().animate({
				scrollTop: $($anchor.attr('href')).offset().top
			}, 600, 'easeInOutExpo');
			event.preventDefault();
		});
	});

    // closes the responsive menu on menu item click
    $(".navbar-nav li a").on("click", function(event) {
    if (!$(this).parent().hasClass('dropdown'))
        $(".navbar-collapse").collapse('hide');
	});
	

	/* Image Header Background Slider Swiper */
	var swiper1 = new Swiper('.imageHeaderBgSlider', {
		loop: true,
		autoplayDisableOnInteraction: false,
		autoplay: 3500,
	});
    

    /* Lightbox Details & Lightbox Form Magnific Popup */
	$('.popup-with-move-anim').magnificPopup({
		type: 'inline',
		fixedContentPos: false, /* keep it false to avoid html tag shift with margin-right: 17px */
		fixedBgPos: true,
		overflowY: 'auto',
		closeBtnInside: true,
		preloader: false,
		midClick: true,
		removalDelay: 300,
		mainClass: 'my-mfp-slide-bottom'
	});


	/* Image Slider Swiper */
	var imageSlider = new Swiper('.imageSlider', {
		loop: false,
		autoplayDisableOnInteraction: false,
        autoplay: 3500,
		nextButton: '.swiper-button-next',
		prevButton: '.swiper-button-prev'
	});


	/* Image Slider Magnific Popup */
	$('.popup-link').magnificPopup({
		removalDelay: 300,
		type: 'image',
		callbacks: {
			beforeOpen: function() {
				this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure ' + this.st.el.attr('data-effect'));
			},
			beforeClose: function() {
				$('.mfp-figure').addClass('fadeOut');
			}
		},
		gallery:{
			enabled:true //enable gallery mode
		}
	});
	

	/* Cards Slider Swiper */
	var cardsSlider = new Swiper('.cardsSlider', {
		autoplayDisableOnInteraction: false,
		autoplay: 4000,
        loop: true,
        pagination: '.swiper-pagination',
        paginationClickable: true,
		slidesPerView: 1
    });


    /* Big Numbers CountTo Counter */
	var a = 0;
	$(window).scroll(function() {
		if ($('#counter').length) { // checking if CountTo section exists in the page, if not it will not run the script and avoid errors	
			var oTop = $('#counter').offset().top - window.innerHeight;
			if (a == 0 && $(window).scrollTop() > oTop) {
			$('.counter-value').each(function() {
				var $this = $(this),
				countTo = $this.attr('data-count');
				$({
				countNum: $this.text()
				}).animate({
					countNum: countTo
				},
				{
					duration: 2000,
					easing: 'swing',
					step: function() {
					$this.text(Math.floor(this.countNum));
					},
					complete: function() {
					$this.text(this.countNum);
					//alert('finished');
					}
				});
			});
			a = 1;
			}
		}
	});
	

	/* Filtered Grid Isotope */
	$('.grid').imagesLoaded( function() {
		var $grid = $('.grid').isotope({
			// options
			itemSelector: '.element-item',
			layoutMode: 'fitRows'
		});
		
		// filter items on button click
		$('.filters-button-group').on( 'click', 'a', function() {
			var filterValue = $(this).attr('data-filter');
			$grid.isotope({ filter: filterValue });
		});
		// change is-checked class on buttons
		$('.button-group').each( function( i, buttonGroup ) {
			var $buttonGroup = $( buttonGroup );
			$buttonGroup.on( 'click', 'a', function() {
				$buttonGroup.find('.is-checked').removeClass('is-checked');
				$( this ).addClass('is-checked');
			});	
		});
	});


	/* Back To Top Button */
    // create the back to top button
    $('body').prepend('<a href="body" class="back-to-top page-scroll">Back to Top</a>');
    var amountScrolled = 700;
    $(window).scroll(function() {
        if ($(window).scrollTop() > amountScrolled) {
            $('a.back-to-top').fadeIn('500');
        } else {
            $('a.back-to-top').fadeOut('500');
        }
    });


	/* Removes Long Focus On Buttons */
	$(".button, a, button").mouseup(function() {
		$(this).blur();
	});


	/* Registration Form */
    $("#RegistrationForm").validator().on("submit", function(event) {
    	if (event.isDefaultPrevented()) {
            // handle the invalid form...
            formError();
            submitMSG(false, "Please fill all fields!");
        } else {
            // everything looks good!
            event.preventDefault();
            submitForm();
        }
    });

    function submitForm() {
        // initiate variables with form content
		var name = $("#name").val();
		var phone = $("#phone").val();
		var email = $("#email").val();
        var select = $("#select").val();
        
        $.ajax({
            type: "POST",
            url: "php/registrationform-process.php",
            data: "name=" + name + "&phone=" + phone + "&email=" + email + "&select=" + select, 
            success: function(text) {
                if (text == "success") {
                    formSuccess();
                } else {
                    formError();
                    submitMSG(false, text);
                }
            }
        });
	}

    function formSuccess() {
        $("#RegistrationForm")[0].reset();
        submitMSG(true, "Message Submitted!")
    }

    function formError() {
        $("#RegistrationForm").removeClass().addClass('shake animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
            $(this).removeClass();
        });
	}

    function submitMSG(valid, msg) {
        if (valid) {
            var msgClasses = "h3 text-center tada animated text-success";
        } else {
            var msgClasses = "h3 text-center text-danger";
        }
        $("#msgSubmit").removeClass().addClass(msgClasses).text(msg);
	}


	/* Contact Form */
    $("#ContactForm").validator().on("submit", function(event) {
    	if (event.isDefaultPrevented()) {
            // handle the invalid form...
            formCError();
            submitCMSG(false, "Please fill all fields!");
        } else {
            // everything looks good!
            event.preventDefault();
            submitCForm();
        }
    });

    function submitCForm() {
        // initiate variables with form content
		var name = $("#cname").val();
		var email = $("#cemail").val();
        var message = $("#cmessage").val();
        
        $.ajax({
            type: "POST",
            url: "php/contactform-process.php",
            data: "name=" + name + "&email=" + email + "&message=" + message, 
            success: function(text) {
                if (text == "success") {
                    formCSuccess();
                } else {
                    formCError();
                    submitCMSG(false, text);
                }
            }
        });
	}

    function formCSuccess() {
        $("#ContactForm")[0].reset();
        submitCMSG(true, "Message Submitted!")
    }

    function formCError() {
        $("#ContactForm").removeClass().addClass('shake animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
            $(this).removeClass();
        });
	}

    function submitCMSG(valid, msg) {
        if (valid) {
            var msgClasses = "h3 text-center tada animated";
        } else {
            var msgClasses = "h3 text-center";
        }
        $("#msgCSubmit").removeClass().addClass(msgClasses).text(msg);
	}

})(jQuery);