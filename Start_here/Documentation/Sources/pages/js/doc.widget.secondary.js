(function($) {

  $(document).ready( function() {
    documentation.init();
  });

  var documentation = {

    init: function() {

      this.headerHeading = document.querySelector('.js-heading');
      this.scrollWrapper = document.querySelector('.scroll-wrapper');
      this.LongLoadOverlay = document.querySelector('.long-loading');
      this.menuScroll;

      this.initNavigation();
      this.startAnimation($('.main-nav > .main-nav__item'));
    },


    initNavigation: function() {
      var ajaxLinks = $('.main-nav__link');
      this.mainNavigation(ajaxLinks);
      
      var $navContainer = $('.navigation-wrapper');

      if ( $navContainer.length > 0 ) {
        var $toggleBtn = $navContainer.find('.js-open-btn');
        var _this = this;

        $toggleBtn.click(function() {
          _this.toggleNavigation($navContainer);
          if ( !_this.menuScroll ) {
            _this.menuScroll = global.createScrollbar(_this.scrollWrapper, {
              touchScrollSpeed: 1,
              preventDefaultScroll: true
            });
          }
        });
      }
    },

    mainNavigation: function($navLinks) {
      if ( $navLinks.length === 0 ) {
        return 0;
      }
    
      var _this = this;

      $navLinks.click(function(e) {
        var $targetLink = $(e.currentTarget); 
        var $dropdownContainer = $targetLink.closest('.main-nav__item');
        var $navContainer = $targetLink.closest('.navigation-wrapper');
        var openedDropdown = $navContainer.find('.has-dropdown.show');
        e.preventDefault();

        if ( $dropdownContainer.hasClass('show') ){
          _this.showHideDropdown($targetLink.parent('.show'));
        } else if ( $targetLink.parent().hasClass('has-dropdown') && openedDropdown.length > 0 ) {
          _this.showHideDropdown(openedDropdown);
          _this.showHideDropdown($targetLink.parent());
        } else if ( $targetLink.parent().hasClass('has-dropdown') ) {
           _this.showHideDropdown($targetLink.parent());
        } else {
          location.href = $targetLink[0].href;
        }

      });
    },

    toggleNavigation: function($navContainer) {
      if ( $navContainer.length === 0 ) {
        return 0;
      }

      if ( $navContainer.hasClass('open') ) {
        $navContainer.removeClass('open').addClass('close');
        this.enableScroll();
        this.addClassAfterAnimation($('.js-heading'), 'display-none');
      } else {
        $navContainer.removeClass('close').addClass('open');
        this.disableScroll();
        this.removeClassAfterAnimation($('.js-heading'), 'display-none');
        if (this.menuScroll) {
          this.menuScroll.resize();
        }
      }
    },

    showHideDropdown: function($dropdownContainer) {
      if ( $dropdownContainer.length === 0 ) {
        return 0;
      }

      var $dropdown = $dropdownContainer.find('.main-nav__secondary');
      var _this = this;

      if ( $dropdownContainer.hasClass('show') ) {
        $dropdownContainer.removeClass('show');
        $dropdown.slideUp(300, function() {
          if (_this.menuScroll) {
            _this.menuScroll.resize();
          }
        });
      } else {
        $dropdownContainer.addClass('show');
        $dropdown.slideDown(300, function() {
          if (_this.menuScroll) {
            _this.menuScroll.resize();
          }
        });
      }

    },

    startAnimation: function($animElem) {
      if ( $animElem.length === 0 ) {
        return 0;
      }

      var topPointFirstElement = $($animElem[0]).offset().top - $(window).outerHeight() + 150;

      if ( $(window).scrollTop() > topPointFirstElement ) {
        addAnimClass($animElem);
      }

      $(window).on('scroll', function animation(){
        y = $(window).scrollTop();

        if (y > topPointFirstElement) {
          $(window).off('scroll', animation);
          addAnimClass($animElem);
        }

      });

      function addAnimClass ($animElem) {
        var i = 0;
        var animInterval = setInterval(function(){
          $($animElem[i]).addClass('fadeUp');

          if ( i === ($animElem.length - 1) ) {
            clearInterval(animInterval);
          }

          i++
        }, 80);
      }
    },

    addClassAfterAnimation: function($elem, clases){
      if ( $elem.length === 0 ) {
        return 0;
      }

      if ( !($elem instanceof jQuery) ) {
        $elem = $($elem);
      }

      $elem.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function addClasses() {
        $elem.addClass(clases);
        $elem.off('webkitAnimationEnd oanimationend msAnimationEnd animationend', addClasses);
      });
    },

    removeClassAfterAnimation: function($elem, clases){
      if ( $elem.length === 0 ) {
        return 0;
      }

      if ( !($elem instanceof jQuery) ) {
        $elem = $($elem);
      }

      $elem.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function addClasses() {
        $elem.removeClass(clases);
        $elem.off('webkitAnimationEnd oanimationend msAnimationEnd animationend', addClasses);
      });
    },

    // http://stackoverflow.com/questions/4770025/how-to-disable-scrolling-temporarily
    disableScroll: function () {
      if (window.addEventListener) // older FF
          window.addEventListener('DOMMouseScroll', this.preventDefault, false);
      window.onwheel = this.preventDefault; // modern standard
      window.onmousewheel = document.onmousewheel = this.preventDefault; // older browsers, IE
      window.ontouchmove  = this.preventDefault; // mobile
    },

    enableScroll: function () {
        if (window.removeEventListener)
            window.removeEventListener('DOMMouseScroll', this.preventDefault, false);
        window.onmousewheel = document.onmousewheel = null; 
        window.onwheel = null; 
        window.ontouchmove = null;    
    },

    preventDefault: function (e) {
      e = e || window.event;
      if (e.preventDefault)
          e.preventDefault();
      e.returnValue = false;  
    }
  };

})($);