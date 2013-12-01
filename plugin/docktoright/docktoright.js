//** jQuery Scroll to Top Control script- (c) Dynamic Drive DHTML code library: http://www.dynamicdrive.com.
//** Available/ usage terms at http://www.dynamicdrive.com (March 30th, 09')
//** v1.1 (April 7th, 09'):
//** 1) Adds ability to scroll to an absolute position (from top of page) or specific element on the page instead.
//** 2) Fixes scroll animation not working in Opera. 


/***
 * implement a jQuery Plugin to dock any element to right of window
 *
 * @author QiangYu
 *
 */

(function ($) {

    $.fn.extend({

        dockToRight: function (options) {

            var defaults = {
                startline: 100,
                scrollto: 0,
                right_offsetx: 5,
                right_offsety: 5,
                dockToObject: null,
                dockToObjectOffsetX: 0,
                forceDockToObject: false,
                clickCallBack: null
            };

            var options = $.extend(defaults, options);

            return this.each(function () {

                var dockToRightObject = {

                    setting: {startline: options.startline, scrollto: options.scrollto, scrollduration: 1000, fadeduration: [500, 100]},
                    controlattrs: {offsetx: options.right_offsetx, offsety: options.right_offsety}, //offset of control relative to right/ bottom of window corner
                    dockx: 0,  // dock to offsetx
                    state: {isvisible: false, shouldvisible: false},

                    scrollup: function () {
                        var dest = isNaN(this.setting.scrollto) ? this.setting.scrollto : parseInt(this.setting.scrollto)
                        if (typeof dest == "string" && jQuery('#' + dest).length == 1) //check element set by string exists
                            dest = jQuery('#' + dest).offset().top
                        else
                            dest = 0
                        this.$body.animate({scrollTop: dest}, this.setting.scrollduration);
                    },

                    keepfixed: function () {
                        var $window = jQuery(window)
                        var controlx = $window.scrollLeft() + $window.width() - this.$control.width() - this.controlattrs.offsetx
                        var controly = $window.scrollTop() + $window.height() - this.$control.height() - this.controlattrs.offsety

                        // if window is very large, we want the button to dock to the edge of body
                        if (this.dockx > 0) {
                            controlx = this.dockx;
                        }

                        this.$control.css({left: controlx + 'px', top: controly + 'px'})
                    },

                    togglecontrol: function () {
                        var scrolltop = jQuery(window).scrollTop();
                        if (!this.cssfixedsupport)
                            this.keepfixed()
                        this.state.shouldvisible = (scrolltop >= this.setting.startline) ? true : false
                        if (this.state.shouldvisible && !this.state.isvisible) {
                            this.$control.stop().animate({opacity: 1}, this.setting.fadeduration[0])
                            this.state.isvisible = true
                        }
                        else if (this.state.shouldvisible == false && this.state.isvisible) {
                            this.$control.stop().animate({opacity: 0}, this.setting.fadeduration[1])
                            this.state.isvisible = false
                        }
                    },

                    init: function ($dockElem, $dockToElem) {

                        var iebrws = document.all
                        dockToRightObject.cssfixedsupport = !iebrws || iebrws && document.compatMode == "CSS1Compat" && window.XMLHttpRequest; //not IE or IE7+ browsers in standards mode
                        dockToRightObject.$body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body');
                        dockToRightObject.$control = $dockElem
                            .css({position: dockToRightObject.cssfixedsupport ? 'fixed' : 'absolute', bottom: dockToRightObject.controlattrs.offsety, right: dockToRightObject.controlattrs.offsetx, opacity: 0, cursor: 'pointer'});
                        if (document.all && !window.XMLHttpRequest && dockToRightObject.$control.text() != '') //loose check for IE6 and below, plus whether control contains any text
                            dockToRightObject.$control.css({width: dockToRightObject.$control.width()}) //IE6- seems to require an explicit width on a DIV containing text
                        dockToRightObject.togglecontrol()

                        $(window).bind('scroll resize', function (e) {
                            dockToRightObject.togglecontrol()
                        })

                        if ($dockToElem) {
                            // if window is very large, we want the button to dock to the edge of body
                            var controlx = jQuery(window).scrollLeft() + jQuery(window).width() - dockToRightObject.$control.width() - dockToRightObject.controlattrs.offsetx
                            var dockX = parseInt($dockToElem.offset().left + $dockToElem.width() + options.dockToObjectOffsetX);
                            dockX = isNaN(dockX) ? 0 : dockX;

                            if (dockX > 0 && (dockX < controlx || options.forceDockToObject)) {
                                dockToRightObject.$control.css('right', null);
                                dockToRightObject.$control.css('left', dockX);
                                dockToRightObject.dockx = dockX;
                            }
                        }

                        if (options.clickCallBack) {
                            dockToRightObject.$control.click(function () {
                                if ('scrollup' == options.clickCallBack) {
                                    return dockToRightObject.scrollup();
                                }
                                return options.clickCallBack();
                            });
                        }
                    }
                }

                dockToRightObject.init($(this), options.dockToObject);
            });
        }

    });

})(jQuery);


