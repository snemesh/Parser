/*! Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.0.6
 * 
 * Requires: 1.2.2+
 */

(function($) {

var types = ['DOMMouseScroll', 'mousewheel'];

if ($.event.fixHooks) {
    for ( var i=types.length; i; ) {
        $.event.fixHooks[ types[--i] ] = $.event.mouseHooks;
    }
}

$.event.special.mousewheel = {
    setup: function() {
        if ( this.addEventListener ) {
            for ( var i=types.length; i; ) {
                this.addEventListener( types[--i], handler, false );
            }
        } else {
            this.onmousewheel = handler;
        }
    },
    
    teardown: function() {
        if ( this.removeEventListener ) {
            for ( var i=types.length; i; ) {
                this.removeEventListener( types[--i], handler, false );
            }
        } else {
            this.onmousewheel = null;
        }
    }
};

$.fn.extend({
    mousewheel: function(fn) {
        return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
    },
    
    unmousewheel: function(fn) {
        return this.unbind("mousewheel", fn);
    }
});


function handler(event) {
    var orgEvent = event || window.event, args = [].slice.call( arguments, 1 ), delta = 0, returnValue = true, deltaX = 0, deltaY = 0;
    event = $.event.fix(orgEvent);
    event.type = "mousewheel";
    
    // Old school scrollwheel delta
    if ( orgEvent.wheelDelta ) { delta = orgEvent.wheelDelta/120; }
    if ( orgEvent.detail     ) { delta = -orgEvent.detail/3; }
    
    // New school multidimensional scroll (touchpads) deltas
    deltaY = delta;
    
    // Gecko
    if ( orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
        deltaY = 0;
        deltaX = -1*delta;
    }
    
    // Webkit
    if ( orgEvent.wheelDeltaY !== undefined ) { deltaY = orgEvent.wheelDeltaY/120; }
    if ( orgEvent.wheelDeltaX !== undefined ) { deltaX = -1*orgEvent.wheelDeltaX/120; }
    
    // Add event and delta to the front of the arguments
    args.unshift(event, delta, deltaX, deltaY);
    
    return ($.event.dispatch || $.event.handle).apply(this, args);
}

})(jQuery);
;/*!
 * jScrollPane - v2.0.0beta12 - 2012-07-24
 * http://jscrollpane.kelvinluck.com/
 *
 * Copyright (c) 2010 Kelvin Luck
 * Dual licensed under the MIT and GPL licenses.
 */

// Script: jScrollPane - cross browser customisable scrollbars
//
// *Version: 2.0.0beta12, Last updated: 2012-07-24*
//
// Project Home - http://jscrollpane.kelvinluck.com/
// GitHub       - http://github.com/vitch/jScrollPane
// Source       - http://github.com/vitch/jScrollPane/raw/master/script/jquery.jscrollpane.js
// (Minified)   - http://github.com/vitch/jScrollPane/raw/master/script/jquery.jscrollpane.min.js
//
// About: License
//
// Copyright (c) 2012 Kelvin Luck
// Dual licensed under the MIT or GPL Version 2 licenses.
// http://jscrollpane.kelvinluck.com/MIT-LICENSE.txt
// http://jscrollpane.kelvinluck.com/GPL-LICENSE.txt
//
// About: Examples
//
// All examples and demos are available through the jScrollPane example site at:
// http://jscrollpane.kelvinluck.com/
//
// About: Support and Testing
//
// This plugin is tested on the browsers below and has been found to work reliably on them. If you run
// into a problem on one of the supported browsers then please visit the support section on the jScrollPane
// website (http://jscrollpane.kelvinluck.com/) for more information on getting support. You are also
// welcome to fork the project on GitHub if you can contribute a fix for a given issue. 
//
// jQuery Versions - tested in 1.4.2+ - reported to work in 1.3.x
// Browsers Tested - Firefox 3.6.8, Safari 5, Opera 10.6, Chrome 5.0, IE 6, 7, 8
//
// About: Release History
//
// 2.0.0beta12 - (In progress)
// 2.0.0beta11 - (2012-05-14)
// 2.0.0beta10 - (2011-04-17) cleaner required size calculation, improved keyboard support, stickToBottom/Left, other small fixes
// 2.0.0beta9 - (2011-01-31) new API methods, bug fixes and correct keyboard support for FF/OSX
// 2.0.0beta8 - (2011-01-29) touchscreen support, improved keyboard support
// 2.0.0beta7 - (2011-01-23) scroll speed consistent (thanks Aivo Paas)
// 2.0.0beta6 - (2010-12-07) scrollToElement horizontal support
// 2.0.0beta5 - (2010-10-18) jQuery 1.4.3 support, various bug fixes
// 2.0.0beta4 - (2010-09-17) clickOnTrack support, bug fixes
// 2.0.0beta3 - (2010-08-27) Horizontal mousewheel, mwheelIntent, keyboard support, bug fixes
// 2.0.0beta2 - (2010-08-21) Bug fixes
// 2.0.0beta1 - (2010-08-17) Rewrite to follow modern best practices and enable horizontal scrolling, initially hidden
//							 elements and dynamically sized elements.
// 1.x - (2006-12-31 - 2010-07-31) Initial version, hosted at googlecode, deprecated

(function($,window,undefined){

	$.fn.jScrollPane = function(settings)
	{
		// JScrollPane "class" - public methods are available through $('selector').data('jsp')
		function JScrollPane(elem, s)
		{
			var settings, jsp = this, pane, paneWidth, paneHeight, container, contentWidth, contentHeight,
				percentInViewH, percentInViewV, isScrollableV, isScrollableH, verticalDrag, dragMaxY,
				verticalDragPosition, horizontalDrag, dragMaxX, horizontalDragPosition,
				verticalBar, verticalTrack, scrollbarWidth, verticalTrackHeight, verticalDragHeight, arrowUp, arrowDown,
				horizontalBar, horizontalTrack, horizontalTrackWidth, horizontalDragWidth, arrowLeft, arrowRight,
				reinitialiseInterval, originalPadding, originalPaddingTotalWidth, previousContentWidth,
				wasAtTop = true, wasAtLeft = true, wasAtBottom = false, wasAtRight = false,
				originalElement = elem.clone(false, false).empty(),
				mwEvent = $.fn.mwheelIntent ? 'mwheelIntent.jsp' : 'mousewheel.jsp';

			originalPadding = elem.css('paddingTop') + ' ' +
								elem.css('paddingRight') + ' ' +
								elem.css('paddingBottom') + ' ' +
								elem.css('paddingLeft');
			originalPaddingTotalWidth = (parseInt(elem.css('paddingLeft'), 10) || 0) +
										(parseInt(elem.css('paddingRight'), 10) || 0);

			function initialise(s)
			{

				var /*firstChild, lastChild, */isMaintainingPositon, lastContentX, lastContentY,
						hasContainingSpaceChanged, originalScrollTop, originalScrollLeft,
						maintainAtBottom = false, maintainAtRight = false;

				settings = s;

				if (pane === undefined) {
					originalScrollTop = elem.scrollTop();
					originalScrollLeft = elem.scrollLeft();

					elem.css(
						{
							overflow: 'hidden',
							padding: 0
						}
					);
					// TODO: Deal with where width/ height is 0 as it probably means the element is hidden and we should
					// come back to it later and check once it is unhidden...
					paneWidth = elem.innerWidth() + originalPaddingTotalWidth;
					paneHeight = elem.innerHeight();

					elem.width(paneWidth);
					
					pane = $('<div class="jspPane" />').css('padding', originalPadding).append(elem.children());
					container = $('<div class="jspContainer" />')
						.css({
							'width': paneWidth + 'px',
							'height': paneHeight + 'px'
						}
					).append(pane).appendTo(elem);

					/*
					// Move any margins from the first and last children up to the container so they can still
					// collapse with neighbouring elements as they would before jScrollPane 
					firstChild = pane.find(':first-child');
					lastChild = pane.find(':last-child');
					elem.css(
						{
							'margin-top': firstChild.css('margin-top'),
							'margin-bottom': lastChild.css('margin-bottom')
						}
					);
					firstChild.css('margin-top', 0);
					lastChild.css('margin-bottom', 0);
					*/
				} else {
					elem.css('width', '');

					maintainAtBottom = settings.stickToBottom && isCloseToBottom();
					maintainAtRight  = settings.stickToRight  && isCloseToRight();

					hasContainingSpaceChanged = elem.innerWidth() + originalPaddingTotalWidth != paneWidth || elem.outerHeight() != paneHeight;

					if (hasContainingSpaceChanged) {
						paneWidth = elem.innerWidth() + originalPaddingTotalWidth;
						paneHeight = elem.innerHeight();
						container.css({
							width: paneWidth + 'px',
							height: paneHeight + 'px'
						});
					}

					// If nothing changed since last check...
					if (!hasContainingSpaceChanged && previousContentWidth == contentWidth && pane.outerHeight() == contentHeight) {
						elem.width(paneWidth);
						return;
					}
					previousContentWidth = contentWidth;
					
					pane.css('width', '');
					elem.width(paneWidth);

					container.find('>.jspVerticalBar,>.jspHorizontalBar').remove().end();
				}

				pane.css('overflow', 'auto');
				if (s.contentWidth) {
					contentWidth = s.contentWidth;
				} else {
					contentWidth = pane[0].scrollWidth;
				}
				contentHeight = pane[0].scrollHeight;
				pane.css('overflow', '');

				percentInViewH = contentWidth / paneWidth;
				percentInViewV = contentHeight / paneHeight;
				isScrollableV = percentInViewV > 1;

				isScrollableH = percentInViewH > 1;

				//console.log(paneWidth, paneHeight, contentWidth, contentHeight, percentInViewH, percentInViewV, isScrollableH, isScrollableV);

				if (!(isScrollableH || isScrollableV)) {
					elem.removeClass('jspScrollable');
					pane.css({
						top: 0,
						width: container.width() - originalPaddingTotalWidth
					});
					removeMousewheel();
					removeFocusHandler();
					removeKeyboardNav();
					removeClickOnTrack();
				} else {
					elem.addClass('jspScrollable');

					isMaintainingPositon = settings.maintainPosition && (verticalDragPosition || horizontalDragPosition);
					if (isMaintainingPositon) {
						lastContentX = contentPositionX();
						lastContentY = contentPositionY();
					}

					initialiseVerticalScroll();
					initialiseHorizontalScroll();
					resizeScrollbars();

					if (isMaintainingPositon) {
						scrollToX(maintainAtRight  ? (contentWidth  - paneWidth ) : lastContentX, false);
						scrollToY(maintainAtBottom ? (contentHeight - paneHeight) : lastContentY, false);
					}

					initFocusHandler();
					initMousewheel();
					initTouch();
					
					if (settings.enableKeyboardNavigation) {
						initKeyboardNav();
					}
					if (settings.clickOnTrack) {
						initClickOnTrack();
					}
					
					observeHash();
					if (settings.hijackInternalLinks) {
						hijackInternalLinks();
					}
				}

				if (settings.autoReinitialise && !reinitialiseInterval) {
					reinitialiseInterval = setInterval(
						function()
						{
							initialise(settings);
						},
						settings.autoReinitialiseDelay
					);
				} else if (!settings.autoReinitialise && reinitialiseInterval) {
					clearInterval(reinitialiseInterval);
				}

				originalScrollTop && elem.scrollTop(0) && scrollToY(originalScrollTop, false);
				originalScrollLeft && elem.scrollLeft(0) && scrollToX(originalScrollLeft, false);

				elem.trigger('jsp-initialised', [isScrollableH || isScrollableV]);
			}

			function initialiseVerticalScroll()
			{
				if (isScrollableV) {

					container.append(
						$('<div class="jspVerticalBar" />').append(
							$('<div class="jspCap jspCapTop" />'),
							$('<div class="jspTrack" />').append(
								$('<div class="jspDrag" />').append(
									$('<div class="jspDragTop" />'),
									$('<div class="jspDragBottom" />')
								)
							),
							$('<div class="jspCap jspCapBottom" />')
						)
					);

					verticalBar = container.find('>.jspVerticalBar');
					verticalTrack = verticalBar.find('>.jspTrack');
					verticalDrag = verticalTrack.find('>.jspDrag');

					if (settings.showArrows) {
						arrowUp = $('<a class="jspArrow jspArrowUp" />').bind(
							'mousedown.jsp', getArrowScroll(0, -1)
						).bind('click.jsp', nil);
						arrowDown = $('<a class="jspArrow jspArrowDown" />').bind(
							'mousedown.jsp', getArrowScroll(0, 1)
						).bind('click.jsp', nil);
						if (settings.arrowScrollOnHover) {
							arrowUp.bind('mouseover.jsp', getArrowScroll(0, -1, arrowUp));
							arrowDown.bind('mouseover.jsp', getArrowScroll(0, 1, arrowDown));
						}

						appendArrows(verticalTrack, settings.verticalArrowPositions, arrowUp, arrowDown);
					}

					verticalTrackHeight = paneHeight-6;
					container.find('>.jspVerticalBar>.jspCap:visible,>.jspVerticalBar>.jspArrow').each(
						function()
						{
							verticalTrackHeight -= $(this).outerHeight();
						}
					);


					verticalDrag.hover(
						function()
						{
							verticalDrag.addClass('jspHover');
						},
						function()
						{
							verticalDrag.removeClass('jspHover');
						}
					).bind(
						'mousedown.jsp',
						function(e)
						{
							// Stop IE from allowing text selection
							$('html').bind('dragstart.jsp selectstart.jsp', nil);

							verticalDrag.addClass('jspActive');

							var startY = e.pageY - verticalDrag.position().top;

							$('html').bind(
								'mousemove.jsp',
								function(e)
								{
									positionDragY(e.pageY - startY, false);
								}
							).bind('mouseup.jsp mouseleave.jsp', cancelDrag);
							return false;
						}
					);
					sizeVerticalScrollbar();
				}
			}

			function sizeVerticalScrollbar()
			{
				verticalTrack.height(verticalTrackHeight + 'px');
				verticalDragPosition = 0;
				scrollbarWidth = settings.verticalGutter + verticalTrack.outerWidth();

				// Make the pane thinner to allow for the vertical scrollbar
				pane.width(paneWidth - scrollbarWidth - originalPaddingTotalWidth);

				// Add margin to the left of the pane if scrollbars are on that side (to position
				// the scrollbar on the left or right set it's left or right property in CSS)
				try {
					if (verticalBar.position().left === 0) {
						pane.css('margin-left', scrollbarWidth + 'px');
					}
				} catch (err) {
				}
			}

			function initialiseHorizontalScroll()
			{
				if (isScrollableH) {

					container.append(
						$('<div class="jspHorizontalBar" />').append(
							$('<div class="jspCap jspCapLeft" />'),
							$('<div class="jspTrack" />').append(
								$('<div class="jspDrag" />').append(
									$('<div class="jspDragLeft" />'),
									$('<div class="jspDragRight" />')
								)
							),
							$('<div class="jspCap jspCapRight" />')
						)
					);

					horizontalBar = container.find('>.jspHorizontalBar');
					horizontalTrack = horizontalBar.find('>.jspTrack');
					horizontalDrag = horizontalTrack.find('>.jspDrag');

					if (settings.showArrows) {
						arrowLeft = $('<a class="jspArrow jspArrowLeft" />').bind(
							'mousedown.jsp', getArrowScroll(-1, 0)
						).bind('click.jsp', nil);
						arrowRight = $('<a class="jspArrow jspArrowRight" />').bind(
							'mousedown.jsp', getArrowScroll(1, 0)
						).bind('click.jsp', nil);
						if (settings.arrowScrollOnHover) {
							arrowLeft.bind('mouseover.jsp', getArrowScroll(-1, 0, arrowLeft));
							arrowRight.bind('mouseover.jsp', getArrowScroll(1, 0, arrowRight));
						}
						appendArrows(horizontalTrack, settings.horizontalArrowPositions, arrowLeft, arrowRight);
					}

					horizontalDrag.hover(
						function()
						{
							horizontalDrag.addClass('jspHover');
						},
						function()
						{
							horizontalDrag.removeClass('jspHover');
						}
					).bind(
						'mousedown.jsp',
						function(e)
						{
							// Stop IE from allowing text selection
							$('html').bind('dragstart.jsp selectstart.jsp', nil);

							horizontalDrag.addClass('jspActive');

							var startX = e.pageX - horizontalDrag.position().left;

							$('html').bind(
								'mousemove.jsp',
								function(e)
								{
									positionDragX(e.pageX - startX, false);
								}
							).bind('mouseup.jsp mouseleave.jsp', cancelDrag);
							return false;
						}
					);
					horizontalTrackWidth = container.innerWidth();
					sizeHorizontalScrollbar();
				}
			}

			function sizeHorizontalScrollbar()
			{
				container.find('>.jspHorizontalBar>.jspCap:visible,>.jspHorizontalBar>.jspArrow').each(
					function()
					{
						horizontalTrackWidth -= $(this).outerWidth();
					}
				);

				horizontalTrack.width(horizontalTrackWidth + 'px');
				horizontalDragPosition = 0;
			}

			function resizeScrollbars()
			{
				if (isScrollableH && isScrollableV) {
					var horizontalTrackHeight = horizontalTrack.outerHeight(),
						verticalTrackWidth = verticalTrack.outerWidth();
					verticalTrackHeight -= horizontalTrackHeight;
					$(horizontalBar).find('>.jspCap:visible,>.jspArrow').each(
						function()
						{
							horizontalTrackWidth += $(this).outerWidth();
						}
					);
					horizontalTrackWidth -= verticalTrackWidth;
					paneHeight -= verticalTrackWidth;
					paneWidth -= horizontalTrackHeight;
					horizontalTrack.parent().append(
						$('<div class="jspCorner" />').css('width', horizontalTrackHeight + 'px')
					);
					sizeVerticalScrollbar();
					sizeHorizontalScrollbar();
				}
				// reflow content
				if (isScrollableH) {
					pane.width((container.outerWidth() - originalPaddingTotalWidth) + 'px');
				}
				contentHeight = pane.outerHeight();
				percentInViewV = contentHeight / paneHeight;

				if (isScrollableH) {
					horizontalDragWidth = Math.ceil(1 / percentInViewH * horizontalTrackWidth);
					if (horizontalDragWidth > settings.horizontalDragMaxWidth) {
						horizontalDragWidth = settings.horizontalDragMaxWidth;
					} else if (horizontalDragWidth < settings.horizontalDragMinWidth) {
						horizontalDragWidth = settings.horizontalDragMinWidth;
					}
					horizontalDrag.width(horizontalDragWidth + 'px');
					dragMaxX = horizontalTrackWidth - horizontalDragWidth;
					_positionDragX(horizontalDragPosition); // To update the state for the arrow buttons
				}
				if (isScrollableV) {
					verticalDragHeight = Math.ceil(1 / percentInViewV * verticalTrackHeight);
					if (verticalDragHeight > settings.verticalDragMaxHeight) {
						verticalDragHeight = settings.verticalDragMaxHeight;
					} else if (verticalDragHeight < settings.verticalDragMinHeight) {
						verticalDragHeight = settings.verticalDragMinHeight;
					}
					verticalDrag.height(verticalDragHeight + 'px');
					dragMaxY = verticalTrackHeight - verticalDragHeight;
					_positionDragY(verticalDragPosition); // To update the state for the arrow buttons
				}
			}

			function appendArrows(ele, p, a1, a2)
			{
				var p1 = "before", p2 = "after", aTemp;
				
				// Sniff for mac... Is there a better way to determine whether the arrows would naturally appear
				// at the top or the bottom of the bar?
				if (p == "os") {
					p = /Mac/.test(navigator.platform) ? "after" : "split";
				}
				if (p == p1) {
					p2 = p;
				} else if (p == p2) {
					p1 = p;
					aTemp = a1;
					a1 = a2;
					a2 = aTemp;
				}

				ele[p1](a1)[p2](a2);
			}

			function getArrowScroll(dirX, dirY, ele)
			{
				return function()
				{
					arrowScroll(dirX, dirY, this, ele);
					this.blur();
					return false;
				};
			}

			function arrowScroll(dirX, dirY, arrow, ele)
			{
				arrow = $(arrow).addClass('jspActive');

				var eve,
					scrollTimeout,
					isFirst = true,
					doScroll = function()
					{
						if (dirX !== 0) {
							jsp.scrollByX(dirX * settings.arrowButtonSpeed);
						}
						if (dirY !== 0) {
							jsp.scrollByY(dirY * settings.arrowButtonSpeed);
						}
						scrollTimeout = setTimeout(doScroll, isFirst ? settings.initialDelay : settings.arrowRepeatFreq);
						isFirst = false;
					};

				doScroll();

				eve = ele ? 'mouseout.jsp' : 'mouseup.jsp';
				ele = ele || $('html');
				ele.bind(
					eve,
					function()
					{
						arrow.removeClass('jspActive');
						scrollTimeout && clearTimeout(scrollTimeout);
						scrollTimeout = null;
						ele.unbind(eve);
					}
				);
			}

			function initClickOnTrack()
			{
				removeClickOnTrack();
				if (isScrollableV) {
					verticalTrack.bind(
						'mousedown.jsp',
						function(e)
						{
							if (e.originalTarget === undefined || e.originalTarget == e.currentTarget) {
								var clickedTrack = $(this),
									offset = clickedTrack.offset(),
									direction = e.pageY - offset.top - verticalDragPosition,
									scrollTimeout,
									isFirst = true,
									doScroll = function()
									{
										var offset = clickedTrack.offset(),
											pos = e.pageY - offset.top - verticalDragHeight / 2,
											contentDragY = paneHeight * settings.scrollPagePercent,
											dragY = dragMaxY * contentDragY / (contentHeight - paneHeight);
										if (direction < 0) {
											if (verticalDragPosition - dragY > pos) {
												jsp.scrollByY(-contentDragY);
											} else {
												positionDragY(pos);
											}
										} else if (direction > 0) {
											if (verticalDragPosition + dragY < pos) {
												jsp.scrollByY(contentDragY);
											} else {
												positionDragY(pos);
											}
										} else {
											cancelClick();
											return;
										}
										scrollTimeout = setTimeout(doScroll, isFirst ? settings.initialDelay : settings.trackClickRepeatFreq);
										isFirst = false;
									},
									cancelClick = function()
									{
										scrollTimeout && clearTimeout(scrollTimeout);
										scrollTimeout = null;
										$(document).unbind('mouseup.jsp', cancelClick);
									};
								doScroll();
								$(document).bind('mouseup.jsp', cancelClick);
								return false;
							}
						}
					);
				}
				
				if (isScrollableH) {
					horizontalTrack.bind(
						'mousedown.jsp',
						function(e)
						{
							if (e.originalTarget === undefined || e.originalTarget == e.currentTarget) {
								var clickedTrack = $(this),
									offset = clickedTrack.offset(),
									direction = e.pageX - offset.left - horizontalDragPosition,
									scrollTimeout,
									isFirst = true,
									doScroll = function()
									{
										var offset = clickedTrack.offset(),
											pos = e.pageX - offset.left - horizontalDragWidth / 2,
											contentDragX = paneWidth * settings.scrollPagePercent,
											dragX = dragMaxX * contentDragX / (contentWidth - paneWidth);
										if (direction < 0) {
											if (horizontalDragPosition - dragX > pos) {
												jsp.scrollByX(-contentDragX);
											} else {
												positionDragX(pos);
											}
										} else if (direction > 0) {
											if (horizontalDragPosition + dragX < pos) {
												jsp.scrollByX(contentDragX);
											} else {
												positionDragX(pos);
											}
										} else {
											cancelClick();
											return;
										}
										scrollTimeout = setTimeout(doScroll, isFirst ? settings.initialDelay : settings.trackClickRepeatFreq);
										isFirst = false;
									},
									cancelClick = function()
									{
										scrollTimeout && clearTimeout(scrollTimeout);
										scrollTimeout = null;
										$(document).unbind('mouseup.jsp', cancelClick);
									};
								doScroll();
								$(document).bind('mouseup.jsp', cancelClick);
								return false;
							}
						}
					);
				}
			}

			function removeClickOnTrack()
			{
				if (horizontalTrack) {
					horizontalTrack.unbind('mousedown.jsp');
				}
				if (verticalTrack) {
					verticalTrack.unbind('mousedown.jsp');
				}
			}

			function cancelDrag()
			{
				$('html').unbind('dragstart.jsp selectstart.jsp mousemove.jsp mouseup.jsp mouseleave.jsp');

				if (verticalDrag) {
					verticalDrag.removeClass('jspActive');
				}
				if (horizontalDrag) {
					horizontalDrag.removeClass('jspActive');
				}
			}

			function positionDragY(destY, animate)
			{
				if (!isScrollableV) {
					return;
				}
				if (destY < 0) {
					destY = 0;
				} else if (destY > dragMaxY) {
					destY = dragMaxY;
				}

				// can't just check if(animate) because false is a valid value that could be passed in...
				if (animate === undefined) {
					animate = settings.animateScroll;
				}
				if (animate) {
					jsp.animate(verticalDrag, 'top', destY,	_positionDragY);
				} else {
					verticalDrag.css('top', destY);
					_positionDragY(destY);
				}

			}

			function _positionDragY(destY)
			{
				if (destY === undefined) {
					destY = verticalDrag.position().top;
				}

				container.scrollTop(0);
				verticalDragPosition = destY;

				var isAtTop = verticalDragPosition === 0,
					isAtBottom = verticalDragPosition == dragMaxY,
					percentScrolled = destY/ dragMaxY,
					destTop = -percentScrolled * (contentHeight - paneHeight);

				if (wasAtTop != isAtTop || wasAtBottom != isAtBottom) {
					wasAtTop = isAtTop;
					wasAtBottom = isAtBottom;
					elem.trigger('jsp-arrow-change', [wasAtTop, wasAtBottom, wasAtLeft, wasAtRight]);
				}
				
				updateVerticalArrows(isAtTop, isAtBottom);
				pane.css('top', destTop);
				elem.trigger('jsp-scroll-y', [-destTop, isAtTop, isAtBottom]).trigger('scroll');
			}

			function positionDragX(destX, animate)
			{
				if (!isScrollableH) {
					return;
				}
				if (destX < 0) {
					destX = 0;
				} else if (destX > dragMaxX) {
					destX = dragMaxX;
				}

				if (animate === undefined) {
					animate = settings.animateScroll;
				}
				if (animate) {
					jsp.animate(horizontalDrag, 'left', destX,	_positionDragX);
				} else {
					horizontalDrag.css('left', destX);
					_positionDragX(destX);
				}
			}

			function _positionDragX(destX)
			{
				if (destX === undefined) {
					destX = horizontalDrag.position().left;
				}

				container.scrollTop(0);
				horizontalDragPosition = destX;

				var isAtLeft = horizontalDragPosition === 0,
					isAtRight = horizontalDragPosition == dragMaxX,
					percentScrolled = destX / dragMaxX,
					destLeft = -percentScrolled * (contentWidth - paneWidth);

				if (wasAtLeft != isAtLeft || wasAtRight != isAtRight) {
					wasAtLeft = isAtLeft;
					wasAtRight = isAtRight;
					elem.trigger('jsp-arrow-change', [wasAtTop, wasAtBottom, wasAtLeft, wasAtRight]);
				}
				
				updateHorizontalArrows(isAtLeft, isAtRight);
				pane.css('left', destLeft);
				elem.trigger('jsp-scroll-x', [-destLeft, isAtLeft, isAtRight]).trigger('scroll');
			}

			function updateVerticalArrows(isAtTop, isAtBottom)
			{
				if (settings.showArrows) {
					arrowUp[isAtTop ? 'addClass' : 'removeClass']('jspDisabled');
					arrowDown[isAtBottom ? 'addClass' : 'removeClass']('jspDisabled');
				}
			}

			function updateHorizontalArrows(isAtLeft, isAtRight)
			{
				if (settings.showArrows) {
					arrowLeft[isAtLeft ? 'addClass' : 'removeClass']('jspDisabled');
					arrowRight[isAtRight ? 'addClass' : 'removeClass']('jspDisabled');
				}
			}

			function scrollToY(destY, animate)
			{
				var percentScrolled = destY / (contentHeight - paneHeight);
				positionDragY(percentScrolled * dragMaxY, animate);
			}

			function scrollToX(destX, animate)
			{
				var percentScrolled = destX / (contentWidth - paneWidth);
				positionDragX(percentScrolled * dragMaxX, animate);
			}

			function scrollToElement(ele, stickToTop, animate)
			{
				var e, eleHeight, eleWidth, eleTop = 0, eleLeft = 0, viewportTop, viewportLeft, maxVisibleEleTop, maxVisibleEleLeft, destY, destX;

				// Legal hash values aren't necessarily legal jQuery selectors so we need to catch any
				// errors from the lookup...
				try {
					e = $(ele);
				} catch (err) {
					return;
				}
				eleHeight = e.outerHeight();
				eleWidth= e.outerWidth();

				container.scrollTop(0);
				container.scrollLeft(0);
				
				// loop through parents adding the offset top of any elements that are relatively positioned between
				// the focused element and the jspPane so we can get the true distance from the top
				// of the focused element to the top of the scrollpane...
				while (!e.is('.jspPane')) {
					eleTop += e.position().top;
					eleLeft += e.position().left;
					e = e.offsetParent();
					if (/^body|html$/i.test(e[0].nodeName)) {
						// we ended up too high in the document structure. Quit!
						return;
					}
				}

				viewportTop = contentPositionY();
				maxVisibleEleTop = viewportTop + paneHeight;
				if (eleTop < viewportTop || stickToTop) { // element is above viewport
					destY = eleTop - settings.verticalGutter;
				} else if (eleTop + eleHeight > maxVisibleEleTop) { // element is below viewport
					destY = eleTop - paneHeight + eleHeight + settings.verticalGutter;
				}
				if (destY) {
					scrollToY(destY, animate);
				}
				
				viewportLeft = contentPositionX();
	            maxVisibleEleLeft = viewportLeft + paneWidth;
	            if (eleLeft < viewportLeft || stickToTop) { // element is to the left of viewport
	                destX = eleLeft - settings.horizontalGutter;
	            } else if (eleLeft + eleWidth > maxVisibleEleLeft) { // element is to the right viewport
	                destX = eleLeft - paneWidth + eleWidth + settings.horizontalGutter;
	            }
	            if (destX) {
	                scrollToX(destX, animate);
	            }

			}

			function contentPositionX()
			{
				return -pane.position().left;
			}

			function contentPositionY()
			{
				return -pane.position().top;
			}

			function isCloseToBottom()
			{
				var scrollableHeight = contentHeight - paneHeight;
				return (scrollableHeight > 20) && (scrollableHeight - contentPositionY() < 10);
			}

			function isCloseToRight()
			{
				var scrollableWidth = contentWidth - paneWidth;
				return (scrollableWidth > 20) && (scrollableWidth - contentPositionX() < 10);
			}

			function initMousewheel()
			{
				container.unbind(mwEvent).bind(
					mwEvent,
					function (event, delta, deltaX, deltaY) {
						var dX = horizontalDragPosition, dY = verticalDragPosition;
						jsp.scrollBy(deltaX * settings.mouseWheelSpeed, -deltaY * settings.mouseWheelSpeed, false);
						// return true if there was no movement so rest of screen can scroll
						return dX == horizontalDragPosition && dY == verticalDragPosition && settings.scrollScreen;
					}
				);
			}

			function removeMousewheel()
			{
				container.unbind(mwEvent);
			}

			function nil()
			{
				return false;
			}

			function initFocusHandler()
			{
				pane.find(':input,a').unbind('focus.jsp').bind(
					'focus.jsp',
					function(e)
					{
						scrollToElement(e.target, false);
					}
				);
			}

			function removeFocusHandler()
			{
				pane.find(':input,a').unbind('focus.jsp');
			}
			
			function initKeyboardNav()
			{
				var keyDown, elementHasScrolled, validParents = [];
				isScrollableH && validParents.push(horizontalBar[0]);
				isScrollableV && validParents.push(verticalBar[0]);
				
				// IE also focuses elements that don't have tabindex set.
				pane.focus(
					function()
					{
						elem.focus();
					}
				);
				
				elem.attr('tabindex', 0)
					.unbind('keydown.jsp keypress.jsp')
					.bind(
						'keydown.jsp',
						function(e)
						{
							if (e.target !== this && !(validParents.length && $(e.target).closest(validParents).length)){
								return;
							}
							var dX = horizontalDragPosition, dY = verticalDragPosition;
							switch(e.keyCode) {
								case 40: // down
								case 38: // up
								case 34: // page down
								case 32: // space
								case 33: // page up
								case 39: // right
								case 37: // left
									keyDown = e.keyCode;
									keyDownHandler();
									break;
								case 35: // end
									scrollToY(contentHeight - paneHeight);
									keyDown = null;
									break;
								case 36: // home
									scrollToY(0);
									keyDown = null;
									break;
							}

							elementHasScrolled = e.keyCode == keyDown && dX != horizontalDragPosition || dY != verticalDragPosition;
							return !elementHasScrolled;
						}
					).bind(
						'keypress.jsp', // For FF/ OSX so that we can cancel the repeat key presses if the JSP scrolls...
						function(e)
						{
							if (e.keyCode == keyDown) {
								keyDownHandler();
							}
							return !elementHasScrolled;
						}
					);
				
				if (settings.hideFocus) {
					elem.css('outline', 'none');
					if ('hideFocus' in container[0]){
						elem.attr('hideFocus', true);
					}
				} else {
					elem.css('outline', '');
					if ('hideFocus' in container[0]){
						elem.attr('hideFocus', false);
					}
				}
				
				function keyDownHandler()
				{
					var dX = horizontalDragPosition, dY = verticalDragPosition;
					switch(keyDown) {
						case 40: // down
							jsp.scrollByY(settings.keyboardSpeed, false);
							break;
						case 38: // up
							jsp.scrollByY(-settings.keyboardSpeed, false);
							break;
						case 34: // page down
						case 32: // space
							jsp.scrollByY(paneHeight * settings.scrollPagePercent, false);
							break;
						case 33: // page up
							jsp.scrollByY(-paneHeight * settings.scrollPagePercent, false);
							break;
						case 39: // right
							jsp.scrollByX(settings.keyboardSpeed, false);
							break;
						case 37: // left
							jsp.scrollByX(-settings.keyboardSpeed, false);
							break;
					}

					elementHasScrolled = dX != horizontalDragPosition || dY != verticalDragPosition;
					return elementHasScrolled;
				}
			}
			
			function removeKeyboardNav()
			{
				elem.attr('tabindex', '-1')
					.removeAttr('tabindex')
					.unbind('keydown.jsp keypress.jsp');
			}

			function observeHash()
			{
				if (location.hash && location.hash.length > 1) {
					var e,
						retryInt,
						hash = escape(location.hash.substr(1)) // hash must be escaped to prevent XSS
						;
					try {
						e = $('#' + hash + ', a[name="' + hash + '"]');
					} catch (err) {
						return;
					}

					if (e.length && pane.find(hash)) {
						// nasty workaround but it appears to take a little while before the hash has done its thing
						// to the rendered page so we just wait until the container's scrollTop has been messed up.
						if (container.scrollTop() === 0) {
							retryInt = setInterval(
								function()
								{
									if (container.scrollTop() > 0) {
										scrollToElement(e, true);
										$(document).scrollTop(container.position().top);
										clearInterval(retryInt);
									}
								},
								50
							);
						} else {
							scrollToElement(e, true);
							$(document).scrollTop(container.position().top);
						}
					}
				}
			}

			function hijackInternalLinks()
			{
				// only register the link handler once
				if ($(document.body).data('jspHijack')) {
					return;
				}

				// remember that the handler was bound
				$(document.body).data('jspHijack', true);

				// use live handler to also capture newly created links
				$(document.body).delegate('a[href*=#]', 'click', function(event) {
					// does the link point to the same page?
					// this also takes care of cases with a <base>-Tag or Links not starting with the hash #
					// e.g. <a href="index.html#test"> when the current url already is index.html
					var href = this.href.substr(0, this.href.indexOf('#')),
						locationHref = location.href,
						hash,
						element,
						container,
						jsp,
						scrollTop,
						elementTop;
					if (location.href.indexOf('#') !== -1) {
						locationHref = location.href.substr(0, location.href.indexOf('#'));
					}
					if (href !== locationHref) {
						// the link points to another page
						return;
					}

					// check if jScrollPane should handle this click event
					hash = escape(this.href.substr(this.href.indexOf('#') + 1));

					// find the element on the page
					element;
					try {
						element = $('#' + hash + ', a[name="' + hash + '"]');
					} catch (e) {
						// hash is not a valid jQuery identifier
						return;
					}

					if (!element.length) {
						// this link does not point to an element on this page
						return;
					}

					container = element.closest('.jspScrollable');
					jsp = container.data('jsp');

					// jsp might be another jsp instance than the one, that bound this event
					// remember: this event is only bound once for all instances.
					jsp.scrollToElement(element, true);

					if (container[0].scrollIntoView) {
						// also scroll to the top of the container (if it is not visible)
						scrollTop = $(window).scrollTop();
						elementTop = element.offset().top;
						if (elementTop < scrollTop || elementTop > scrollTop + $(window).height()) {
							container[0].scrollIntoView();
						}
					}

					// jsp handled this event, prevent the browser default (scrolling :P)
					event.preventDefault();
				});
			}
			
			// Init touch on iPad, iPhone, iPod, Android
			function initTouch()
			{
				var startX,
					startY,
					touchStartX,
					touchStartY,
					moved,
					moving = false;
  
				container.unbind('touchstart.jsp touchmove.jsp touchend.jsp click.jsp-touchclick').bind(
					'touchstart.jsp',
					function(e)
					{
						var touch = e.originalEvent.touches[0];
						startX = contentPositionX();
						startY = contentPositionY();
						touchStartX = touch.pageX;
						touchStartY = touch.pageY;
						moved = false;
						moving = true;
					}
				).bind(
					'touchmove.jsp',
					function(ev)
					{
						if(!moving) {
							return;
						}
						
						var touchPos = ev.originalEvent.touches[0],
							dX = horizontalDragPosition, dY = verticalDragPosition;
						
						jsp.scrollTo(startX + touchStartX - touchPos.pageX, startY + touchStartY - touchPos.pageY);
						
						moved = moved || Math.abs(touchStartX - touchPos.pageX) > 5 || Math.abs(touchStartY - touchPos.pageY) > 5;
						
						// return true if there was no movement so rest of screen can scroll
						return dX == horizontalDragPosition && dY == verticalDragPosition;
					}
				).bind(
					'touchend.jsp',
					function(e)
					{
						moving = false;
						/*if(moved) {
							return false;
						}*/
					}
				).bind(
					'click.jsp-touchclick',
					function(e)
					{
						if(moved) {
							moved = false;
							return false;
						}
					}
				);
			}
			
			function destroy(){
				var currentY = contentPositionY(),
					currentX = contentPositionX();
				elem.removeClass('jspScrollable').unbind('.jsp');
				elem.replaceWith(originalElement.append(pane.children()));
				originalElement.scrollTop(currentY);
				originalElement.scrollLeft(currentX);

				// clear reinitialize timer if active
				if (reinitialiseInterval) {
					clearInterval(reinitialiseInterval);
				}
			}

			// Public API
			$.extend(
				jsp,
				{
					// Reinitialises the scroll pane (if it's internal dimensions have changed since the last time it
					// was initialised). The settings object which is passed in will override any settings from the
					// previous time it was initialised - if you don't pass any settings then the ones from the previous
					// initialisation will be used.
					reinitialise: function(s)
					{
						s = $.extend({}, settings, s);
						initialise(s);
					},
					// Scrolls the specified element (a jQuery object, DOM node or jQuery selector string) into view so
					// that it can be seen within the viewport. If stickToTop is true then the element will appear at
					// the top of the viewport, if it is false then the viewport will scroll as little as possible to
					// show the element. You can also specify if you want animation to occur. If you don't provide this
					// argument then the animateScroll value from the settings object is used instead.
					scrollToElement: function(ele, stickToTop, animate)
					{
						scrollToElement(ele, stickToTop, animate);
					},
					// Scrolls the pane so that the specified co-ordinates within the content are at the top left
					// of the viewport. animate is optional and if not passed then the value of animateScroll from
					// the settings object this jScrollPane was initialised with is used.
					scrollTo: function(destX, destY, animate)
					{
						scrollToX(destX, animate);
						scrollToY(destY, animate);
					},
					// Scrolls the pane so that the specified co-ordinate within the content is at the left of the
					// viewport. animate is optional and if not passed then the value of animateScroll from the settings
					// object this jScrollPane was initialised with is used.
					scrollToX: function(destX, animate)
					{
						scrollToX(destX, animate);
					},
					// Scrolls the pane so that the specified co-ordinate within the content is at the top of the
					// viewport. animate is optional and if not passed then the value of animateScroll from the settings
					// object this jScrollPane was initialised with is used.
					scrollToY: function(destY, animate)
					{
						scrollToY(destY, animate);
					},
					// Scrolls the pane to the specified percentage of its maximum horizontal scroll position. animate
					// is optional and if not passed then the value of animateScroll from the settings object this
					// jScrollPane was initialised with is used.
					scrollToPercentX: function(destPercentX, animate)
					{
						scrollToX(destPercentX * (contentWidth - paneWidth), animate);
					},
					// Scrolls the pane to the specified percentage of its maximum vertical scroll position. animate
					// is optional and if not passed then the value of animateScroll from the settings object this
					// jScrollPane was initialised with is used.
					scrollToPercentY: function(destPercentY, animate)
					{
						scrollToY(destPercentY * (contentHeight - paneHeight), animate);
					},
					// Scrolls the pane by the specified amount of pixels. animate is optional and if not passed then
					// the value of animateScroll from the settings object this jScrollPane was initialised with is used.
					scrollBy: function(deltaX, deltaY, animate)
					{
						jsp.scrollByX(deltaX, animate);
						jsp.scrollByY(deltaY, animate);
					},
					// Scrolls the pane by the specified amount of pixels. animate is optional and if not passed then
					// the value of animateScroll from the settings object this jScrollPane was initialised with is used.
					scrollByX: function(deltaX, animate)
					{
						var destX = contentPositionX() + Math[deltaX<0 ? 'floor' : 'ceil'](deltaX),
							percentScrolled = destX / (contentWidth - paneWidth);
						positionDragX(percentScrolled * dragMaxX, animate);
					},
					// Scrolls the pane by the specified amount of pixels. animate is optional and if not passed then
					// the value of animateScroll from the settings object this jScrollPane was initialised with is used.
					scrollByY: function(deltaY, animate)
					{
						var destY = contentPositionY() + Math[deltaY<0 ? 'floor' : 'ceil'](deltaY),
							percentScrolled = destY / (contentHeight - paneHeight);
						positionDragY(percentScrolled * dragMaxY, animate);
					},
					// Positions the horizontal drag at the specified x position (and updates the viewport to reflect
					// this). animate is optional and if not passed then the value of animateScroll from the settings
					// object this jScrollPane was initialised with is used.
					positionDragX: function(x, animate)
					{
						positionDragX(x, animate);
					},
					// Positions the vertical drag at the specified y position (and updates the viewport to reflect
					// this). animate is optional and if not passed then the value of animateScroll from the settings
					// object this jScrollPane was initialised with is used.
					positionDragY: function(y, animate)
					{
						positionDragY(y, animate);
					},
					// This method is called when jScrollPane is trying to animate to a new position. You can override
					// it if you want to provide advanced animation functionality. It is passed the following arguments:
					//  * ele          - the element whose position is being animated
					//  * prop         - the property that is being animated
					//  * value        - the value it's being animated to
					//  * stepCallback - a function that you must execute each time you update the value of the property
					// You can use the default implementation (below) as a starting point for your own implementation.
					animate: function(ele, prop, value, stepCallback)
					{
						var params = {};
						params[prop] = value;
						ele.animate(
							params,
							{
								'duration'	: settings.animateDuration,
								'easing'	: settings.animateEase,
								'queue'		: false,
								'step'		: stepCallback
							}
						);
					},
					// Returns the current x position of the viewport with regards to the content pane.
					getContentPositionX: function()
					{
						return contentPositionX();
					},
					// Returns the current y position of the viewport with regards to the content pane.
					getContentPositionY: function()
					{
						return contentPositionY();
					},
					// Returns the width of the content within the scroll pane.
					getContentWidth: function()
					{
						return contentWidth;
					},
					// Returns the height of the content within the scroll pane.
					getContentHeight: function()
					{
						return contentHeight;
					},
					// Returns the horizontal position of the viewport within the pane content.
					getPercentScrolledX: function()
					{
						return contentPositionX() / (contentWidth - paneWidth);
					},
					// Returns the vertical position of the viewport within the pane content.
					getPercentScrolledY: function()
					{
						return contentPositionY() / (contentHeight - paneHeight);
					},
					// Returns whether or not this scrollpane has a horizontal scrollbar.
					getIsScrollableH: function()
					{
						return isScrollableH;
					},
					// Returns whether or not this scrollpane has a vertical scrollbar.
					getIsScrollableV: function()
					{
						return isScrollableV;
					},
					// Gets a reference to the content pane. It is important that you use this method if you want to
					// edit the content of your jScrollPane as if you access the element directly then you may have some
					// problems (as your original element has had additional elements for the scrollbars etc added into
					// it).
					getContentPane: function()
					{
						return pane;
					},
					// Scrolls this jScrollPane down as far as it can currently scroll. If animate isn't passed then the
					// animateScroll value from settings is used instead.
					scrollToBottom: function(animate)
					{
						positionDragY(dragMaxY, animate);
					},
					// Hijacks the links on the page which link to content inside the scrollpane. If you have changed
					// the content of your page (e.g. via AJAX) and want to make sure any new anchor links to the
					// contents of your scroll pane will work then call this function.
					hijackInternalLinks: $.noop,
					// Removes the jScrollPane and returns the page to the state it was in before jScrollPane was
					// initialised.
					destroy: function()
					{
							destroy();
					}
				}
			);
			
			initialise(s);
		}

		// Pluginifying code...
		settings = $.extend({}, $.fn.jScrollPane.defaults, settings);
		
		// Apply default speed
		$.each(['mouseWheelSpeed', 'arrowButtonSpeed', 'trackClickSpeed', 'keyboardSpeed'], function() {
			settings[this] = settings[this] || settings.speed;
		});

		return this.each(
			function()
			{
				var elem = $(this), jspApi = elem.data('jsp');
				if (jspApi) {
					jspApi.reinitialise(settings);
				} else {
					$("script",elem).filter('[type="text/javascript"]:not([type])').remove();
					jspApi = new JScrollPane(elem, settings);
					elem.data('jsp', jspApi);
				}
			}
		);
	};

	$.fn.jScrollPane.defaults = {
		showArrows					: false,
		maintainPosition			: true,
		stickToBottom				: false,
		stickToRight				: false,
		clickOnTrack				: true,
		autoReinitialise			: false,
		autoReinitialiseDelay		: 500,
		verticalDragMinHeight		: 0,
		verticalDragMaxHeight		: 99999,
		horizontalDragMinWidth		: 0,
		horizontalDragMaxWidth		: 99999,
		contentWidth				: undefined,
		animateScroll				: false,
		animateDuration				: 300,
		animateEase					: 'linear',
		hijackInternalLinks			: false,
		verticalGutter				: 4,
		horizontalGutter			: 4,
		mouseWheelSpeed				: 0,
		arrowButtonSpeed			: 0,
		arrowRepeatFreq				: 50,
		arrowScrollOnHover			: false,
		trackClickSpeed				: 0,
		trackClickRepeatFreq		: 70,
		verticalArrowPositions		: 'split',
		horizontalArrowPositions	: 'split',
		enableKeyboardNavigation	: true,
		hideFocus					: false,
		keyboardSpeed				: 0,
		initialDelay                : 300,        // Delay before starting repeating
		speed						: 30,		// Default speed when others falsey
		scrollPagePercent			: .8,		// Percent of visible area scrolled when pageUp/Down or track area pressed
                scrollScreen: true
	};

})(jQuery,this);

;$(document).ready(function() {
    $(window).on('tabChange', function(e) {
        dataLayer.push({'event': 'AJAXPageReady'});
    })
});(function( $ ){

    $.fn.cityAutocomplete = function(){

        var library = {};
        var intervals = {};
        var currentLetter = '';
        var currentPosition = -1;
        var elementsCount = 0;
        var that = $(this);
        var parent = that.parents('.pop-up-box');
        var elementOffset = that.offset();
        var elementHeight = that.height();

        var elementWidth = that.width() + parseInt(that.css('padding-left'),10)+parseInt(that.css('padding-right'),10);


        var keyupHandler = function(e){

            var letter = getFirstLetter();
            currentLetter = letter;

            if((e.keyCode == 38 || e.keyCode == 40)){
                var count = parent.find('#cities-popup ul li').size();
                if(!count) return;
                if(e.keyCode == 38) {//up
                    if(currentPosition>0){
                        currentPosition--;
                    }else{
                        currentPosition = count-1
                    }
                }
                if(e.keyCode == 40) {//down

                    if(currentPosition == count-1){
                        currentPosition = 0;
                    }
                    else if(currentPosition<count-1){
                        currentPosition++;
                    }
                }
                parent.find('#cities-popup ul li').removeAttr('style');
                parent.find('#cities-popup ul li:eq('+currentPosition+')').css({ 'background':'#FEF0BD'});


                //@todo ÓÔÚËÏËÁËÓ‚‡Ú¸
                var i = 0;
                var height = 0;
                parent.find('#cities-popup ul li').each(function(){
                    if(i<currentPosition - 5){
                        height+=jQuery(this).height()+11;
                    }
                    i++;
                });


                if(currentPosition>5){
                    parent.find('#cities-popup .dropdown').scrollTop(height);
                }else{
                    parent.find('#cities-popup .dropdown').scrollTop(0);
                }


                return ;
            }
            if(e.keyCode == 13) {
                if(currentPosition>-1){
                    parent.find('#cities-popup li').eq( currentPosition).click();
                }
                return;
            }

            currentPosition = -1;
            showList();
            if(letter == ''){
                parent.find('#cities-popup').hide();
            }else{
                if( typeof ( library[letter] ) == 'undefined' ){
                    getCitiesByLetter(letter);
                }else{
                    placeCities(letter);
                }
            }
        }

        var init = function(){
            that.keyup(keyupHandler);
            $('.pop-up-box').on('click','#cities-popup ul li.city',function(){
                var name = $(this).text();
                that.val(name);
                parent.find('#cities-popup').hide();
            });
        }

        var getValue = function(){
            return that.val();
        }

        var requestIsInProcess = function(letter){
            if( typeof ( intervals[letter] ) == 'undefined' ){
                return false;
            }
            return true;
        }

        var getFirstLetter = function(){
            var val = getValue();
            var letter = val.substr(0,1).toLocaleLowerCase();
            return letter;
        }

        var isCurrentLetter = function(letter){
            if(currentLetter == letter){
                return true;
            }
            return false;
        }

        var waitForCities = function(letter){
            /**
             * 10 ‡Á ‚ ÒÂÍÛÌ‰Û
             * */
             var dots = '.';
             intervals[letter] = setInterval(function(){
                if( typeof ( library[letter] ) != 'undefined' ){
                    /**
                     *  √ÓÓ‰‡ Á‡„ÛÁËÎËÒ¸
                     **/
                    if(isCurrentLetter(letter)){
                        placeCities(letter);
                    }
                    clearInterval(intervals[letter]);
                }else{
                    /**
                     * œÓÍ‡ ÌÂ Á‡„ÛÁËÎËÒ¸
                     **/
                    if(isCurrentLetter(letter)){
                        if(dots.length==3){
                            dots = '.';
                        }else{
                            dots+='.';
                        }
                        parent.find('#cities-popup ul li').replaceWith('<li>'+t('«‡„ÛÁÍ‡')+dots+'</li>');
                        //console.log('loading cities '+letter);
                    }
                }
            },100);
        }

        var requestCities = function(letter){
            if(requestIsInProcess(letter)){
                return ;
            }

            $.ajax({
                'url':'/aj/get-cities-json/',
                'dataType':'json',
                'data': { 'starts_from': letter },
                'success':function(cities){
                    library[letter] = cities;
                }
            });
            waitForCities(letter);
        }

        var getCitiesByLetter = function(letter){
            /**
             * «‡ÔÛÒÍ‡ÂÏ Ô‡‡ÎÂÎ¸ÌÛ˛ ÔÓ‚ÂÍÛ ÔÓÎÛ˜ÂÌËˇ „ÓÓ‰Ó‚ ÔÓ ·ÛÍ‚Â
             **/
            requestCities(letter);
        }

        var placeCities = function(letter){
            var value = getValue().toLocaleLowerCase();
            var found = false;
            parent.find('#cities-popup ul').empty();
            for(var k in library[letter]){
                var city = library[letter][k];
                if(city.name.toLocaleLowerCase().indexOf(value) == 0){
                    found = true;
                    parent.find('#cities-popup ul').append('<li class="city" data-id="'+city.city_id+'">'+city.name+'</li>');
                }
            }
            if(!found){
                parent.find('#cities-popup ul').append('<li>'+t('Õ‡ÒÂÎÂÌÌ˚È ÔÛÌÍÚ ÌÂ Ì‡È‰ÂÌ.<br/>œÓ‚Â¸ÚÂ Ì‡ÔËÒ‡ÌËÂ ËÎË ‚‚Â‰ËÚÂ ·ÎËÊ‡È¯ËÈ Í ‚‡Ï!')+'</li>');
            }
        }

        var showList = function(){
            parent.find('#cities-popup').remove();
            that.parents('.pop-up-box.rgn-box .br').append('<div id="cities-popup" class="selectbox"><div class="dropdown"><ul><li></li></ul></div></div>');

           var offset = that.position();

           parent.find('#cities-popup').css({
                'top':Math.round(offset.top+elementHeight+1)+'px',
                'left':Math.round(offset.left)+'px',
                'position':'absolute',
                'z-index':1003,
                'display':'block'
           });

            elementWidth = that.width() + parseInt(that.css('padding-left'),10)+parseInt(that.css('padding-right'),10);
            parent.find('#cities-popup .dropdown').css({
                'overflow-y'  : 'auto',
                'overflow-x'  : 'hidden',
                'display'     : 'block',
                'left'        : '0px',
                'max-height'  : '300px',
                'bottom'      : 'auto',
                'width'       : elementWidth+'px'
            });

           //that.
        }

        init();
    }
})(jQuery,this);

//jQuery(document).ready(function(){
//    jQuery('#city-autocomplete').cityAutocomplete();
//});
;jQuery(document).ready(function(){
    var region_popup_opened = false;
    var doubtfulness_popop_open = false;

    // for mobile version
    if (typeof(isUISmallVersion) == 'undefined')
    {
        var isUISmallVersion = function ()
        {
            return false;
        };
    }

    jQuery('.user-city-popup .close-x').disableSelection();
    jQuery(document).on('click','.user-city-popup .close-x',function(){
        region_popup_opened = false;
        jQuery('.user-city-popup,#cities-popup').hide();
    });

//    jQuery('.user-city-link').disableSelection().on('click',function(){
        /*if(!isUISmallVersion()){
            jQuery('#cities-popup').hide();

            if (doubtfulness_popop_open) {
                jQuery(".region-doubtfulness-popup .close").trigger('click');
            }
            if(region_popup_opened && region_link == this){
               region_popup_opened = false;
               jQuery('.user-city-popup,#cities-popup').hide();
            }else{
               region_popup_opened = true;
               jQuery('.user-city-popup').show();
            }
            region_link = this;
        }else{*/
//            region_popup_opened = (region_popup_opened)?false:true;
        /*}*/
//    });

    /*jQuery('.pop-up-box').on('click','#cities-popup li.city',function(e){
        if(region_popup_opened){
            var cityId = jQuery(this).data('id');
            jQuery.ajax({
                url:'/aj/set-city/'+cityId+'/',
                'success':function(){
                    setRegionPopupCookie(3);
                    document.location.reload();
                }
            });
        }

    });*/

//    if(!isUISmallVersion()){
//        jQuery('input[name="user-city-select"]:last').cityAutocomplete();
//    }else{
//        jQuery('input[name="user-city-select"]/*:first*/').cityAutocomplete();
//    }

    jQuery('input[name="user-city-select"]:last').cityAutocomplete();

    jQuery(".region-doubtfulness-popup .close-x").click(function(){
        jQuery(".region-doubtfulness-popup").hide();
        doubtfulness_popop_open = false;
    });

    jQuery(".region-doubtfulness-popup .another-city").click(function(){
        jQuery(".region-doubtfulness-popup").hide();
//        jQuery('.header .user-city-link').click();
        jQuery('[data-behavior=region-box][data-format=big]').click();

        doubtfulness_popop_open = false;
    });

    jQuery(".region-doubtfulness-popup .success").click(function(){
        setRegionPopupCookie(3);
        jQuery(".region-doubtfulness-popup").hide();
        doubtfulness_popop_open = false;
    });

    jQuery(window).resize(function(){
         if(region_popup_opened){
         }

        if(doubtfulness_popop_open){
            var offset = jQuery('.header .user-city-link').offset();
        }
    });

    var cook = getCookie('region_popup');
    var cookInt = cook? parseInt(cook,10) : 0;

    if(!isUISmallVersion() && cookInt<3){
        var offset = jQuery('.header .user-city-link').offset();
        doubtfulness_popop_open = true;
        setRegionPopupCookie(cookInt+1);

        jQuery(".region-doubtfulness-popup").css({
            'position':'absolute',
            'z-index':999,
            'display':'block'
        });

    }
});


function setRegionPopupCookie(count){
    var currentStamp = new Date().getTime();
    var cookieTime = currentStamp+(1000*60*60*24*60); // 60
    var cookieDate = new Date(cookieTime);
    var domain = hl_domain || '.hotline.ua';

    domain = domain.replace(/(^\.)/g, "");

    setCookie('region_popup',count,cookieDate, '/', '.'+domain, false);
};/*!
 * jQuery blockUI plugin
 * Version 2.50 (04-OCT-2012)
 * @requires jQuery v1.3 or later
 *
 * Examples at: http://malsup.com/jquery/block/
 * Copyright (c) 2007-2012 M. Alsup
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * Thanks to Amir-Hossein Sobhi for some excellent contributions!
 */

;(function() {
"use strict";

	function setup($) {
        // Old if condition
        //if (/^1\.(0|1|2)/
        //new if condition
        if (/^1\.2(\.|$)/.test($.fn.jquery)) {
			/*global alert:true */
			alert('blockUI requires jQuery v1.3 or later!  You are using v' + $.fn.jquery);
            return;
		}

		$.fn._fadeIn = $.fn.fadeIn;

		var noOp = $.noop || function() {};

		// this bit is to ensure we don't call setExpression when we shouldn't (with extra muscle to handle
		// retarded userAgent strings on Vista)
		var msie = /MSIE/.test(navigator.userAgent);
		var ie6  = /MSIE 6.0/.test(navigator.userAgent);
		var mode = document.documentMode || 0;
		// var setExpr = msie && (($.browser.version < 8 && !mode) || mode < 8);
		var setExpr = $.isFunction( document.createElement('div').style.setExpression );

		// global $ methods for blocking/unblocking the entire page
		$.blockUI   = function(opts) { install(window, opts); };
		$.unblockUI = function(opts) { remove(window, opts); };

		// convenience method for quick growl-like notifications  (http://www.google.com/search?q=growl)
		$.growlUI = function(title, message, timeout, onClose) {
			var $m = $('<div class="growlUI"></div>');
			if (title) $m.append('<h1>'+title+'</h1>');
			if (message) $m.append('<h2>'+message+'</h2>');
			if (timeout === undefined) timeout = 3000;
			$.blockUI({
				message: $m, fadeIn: 700, fadeOut: 1000, centerY: false,
				timeout: timeout, showOverlay: false,
				onUnblock: onClose,
				css: $.blockUI.defaults.growlCSS
			});
		};

		// plugin method for blocking element content
		$.fn.block = function(opts) {
			var fullOpts = $.extend({}, $.blockUI.defaults, opts || {});
			this.each(function() {
				var $el = $(this);
				if (fullOpts.ignoreIfBlocked && $el.data('blockUI.isBlocked'))
					return;
				$el.unblock({ fadeOut: 0 });
			});

			return this.each(function() {
				if ($.css(this,'position') == 'static')
					this.style.position = 'relative';
				this.style.zoom = 1; // force 'hasLayout' in ie
				install(this, opts);
			});
		};

		// plugin method for unblocking element content
		$.fn.unblock = function(opts) {
			return this.each(function() {
				remove(this, opts);
			});
		};

		$.blockUI.version = 2.50; // 2nd generation blocking at no extra cost!

		// override these in your code to change the default behavior and style
		$.blockUI.defaults = {
			// message displayed when blocking (use null for no message)
			message:  '<h1>Please wait...</h1>',

			title: null,		// title string; only used when theme == true
			draggable: true,	// only used when theme == true (requires jquery-ui.js to be loaded)

			theme: false, // set to true to use with jQuery UI themes

			// styles for the message when blocking; if you wish to disable
			// these and use an external stylesheet then do this in your code:
			// $.blockUI.defaults.css = {};
			css: {
				padding:	0,
				margin:		0,
				width:		'30%',
				top:		'40%',
				left:		'35%',
				textAlign:	'center',
				color:		'#000',
				border:		'2px solid #aaa',
				backgroundColor:'#fff',
				cursor:		'wait'
			},

			// minimal style set used when themes are used
			themedCSS: {
				width:	'30%',
				top:	'40%',
				left:	'35%'
			},

			// styles for the overlay
			overlayCSS:  {
				backgroundColor:	'#000',
				opacity:			0.6,
				cursor:				'wait'
			},

			// styles applied when using $.growlUI
			growlCSS: {
				width:		'350px',
				top:		'10px',
				left:		'',
				right:		'10px',
				border:		'none',
				padding:	'5px',
				opacity:	0.6,
				cursor:		'default',
				color:		'#fff',
				backgroundColor: '#000',
				'-webkit-border-radius':'10px',
				'-moz-border-radius':	'10px',
				'border-radius':		'10px'
			},

			// IE issues: 'about:blank' fails on HTTPS and javascript:false is s-l-o-w
			// (hat tip to Jorge H. N. de Vasconcelos)
			/*jshint scripturl:true */
			iframeSrc: /^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank',

			// force usage of iframe in non-IE browsers (handy for blocking applets)
			forceIframe: false,

			// z-index for the blocking overlay
			baseZ: 1000,

			// set these to true to have the message automatically centered
			centerX: true, // <-- only effects element blocking (page block controlled via css above)
			centerY: true,

			// allow body element to be stetched in ie6; this makes blocking look better
			// on "short" pages.  disable if you wish to prevent changes to the body height
			allowBodyStretch: true,

			// enable if you want key and mouse events to be disabled for content that is blocked
			bindEvents: true,

			// be default blockUI will supress tab navigation from leaving blocking content
			// (if bindEvents is true)
			constrainTabKey: true,

			// fadeIn time in millis; set to 0 to disable fadeIn on block
			fadeIn:  200,

			// fadeOut time in millis; set to 0 to disable fadeOut on unblock
			fadeOut:  400,

			// time in millis to wait before auto-unblocking; set to 0 to disable auto-unblock
			timeout: 0,

			// disable if you don't want to show the overlay
			showOverlay: true,

			// if true, focus will be placed in the first available input field when
			// page blocking
			focusInput: true,

			// suppresses the use of overlay styles on FF/Linux (due to performance issues with opacity)
			// no longer needed in 2012
			// applyPlatformOpacityRules: true,

			// callback method invoked when fadeIn has completed and blocking message is visible
			onBlock: null,

			// callback method invoked when unblocking has completed; the callback is
			// passed the element that has been unblocked (which is the window object for page
			// blocks) and the options that were passed to the unblock call:
			//	onUnblock(element, options)
			onUnblock: null,

			// don't ask; if you really must know: http://groups.google.com/group/jquery-en/browse_thread/thread/36640a8730503595/2f6a79a77a78e493#2f6a79a77a78e493
			quirksmodeOffsetHack: 4,

			// class name of the message block
			blockMsgClass: 'blockMsg',

			// if it is already blocked, then ignore it (don't unblock and reblock)
			ignoreIfBlocked: false
		};

		// private data and functions follow...

		var pageBlock = null;
		var pageBlockEls = [];

		function install(el, opts) {
			var css, themedCSS;
			var full = (el == window);
			var msg = (opts && opts.message !== undefined ? opts.message : undefined);
			opts = $.extend({}, $.blockUI.defaults, opts || {});

			if (opts.ignoreIfBlocked && $(el).data('blockUI.isBlocked'))
				return;

			opts.overlayCSS = $.extend({}, $.blockUI.defaults.overlayCSS, opts.overlayCSS || {});
			css = $.extend({}, $.blockUI.defaults.css, opts.css || {});
			themedCSS = $.extend({}, $.blockUI.defaults.themedCSS, opts.themedCSS || {});
			msg = msg === undefined ? opts.message : msg;

			// remove the current block (if there is one)
			if (full && pageBlock)
				remove(window, {fadeOut:0});

			// if an existing element is being used as the blocking content then we capture
			// its current place in the DOM (and current display style) so we can restore
			// it when we unblock
			if (msg && typeof msg != 'string' && (msg.parentNode || msg.jquery)) {
				var node = msg.jquery ? msg[0] : msg;
				var data = {};
				$(el).data('blockUI.history', data);
				data.el = node;
				data.parent = node.parentNode;
				data.display = node.style.display;
				data.position = node.style.position;
				if (data.parent)
					data.parent.removeChild(node);
			}

			$(el).data('blockUI.onUnblock', opts.onUnblock);
			var z = opts.baseZ;

			// blockUI uses 3 layers for blocking, for simplicity they are all used on every platform;
			// layer1 is the iframe layer which is used to supress bleed through of underlying content
			// layer2 is the overlay layer which has opacity and a wait cursor (by default)
			// layer3 is the message content that is displayed while blocking
			var lyr1, lyr2, lyr3, s;
			if (msie || opts.forceIframe)
				lyr1 = $('<iframe class="blockUI" style="z-index:'+ (z++) +';display:none;border:none;margin:0;padding:0;position:absolute;width:100%;height:100%;top:0;left:0" src="'+opts.iframeSrc+'"></iframe>');
			else
				lyr1 = $('<div class="blockUI" style="display:none"></div>');

			if (opts.theme)
				lyr2 = $('<div class="blockUI blockOverlay ui-widget-overlay" style="z-index:'+ (z++) +';display:none"></div>');
			else
				lyr2 = $('<div class="blockUI blockOverlay" style="z-index:'+ (z++) +';display:none;border:none;margin:0;padding:0;width:100%;height:100%;top:0;left:0"></div>');

			if (opts.theme && full) {
				s = '<div class="blockUI ' + opts.blockMsgClass + ' blockPage ui-dialog ui-widget ui-corner-all" style="z-index:'+(z+10)+';display:none;position:fixed">';
				if ( opts.title ) {
					s += '<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">'+(opts.title || '&nbsp;')+'</div>';
				}
				s += '<div class="ui-widget-content ui-dialog-content"></div>';
				s += '</div>';
			}
			else if (opts.theme) {
				s = '<div class="blockUI ' + opts.blockMsgClass + ' blockElement ui-dialog ui-widget ui-corner-all" style="z-index:'+(z+10)+';display:none;position:absolute">';
				if ( opts.title ) {
					s += '<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">'+(opts.title || '&nbsp;')+'</div>';
				}  
				s += '<div class="ui-widget-content ui-dialog-content"></div>';
				s += '</div>';
			}
			else if (full) {
				s = '<div class="blockUI ' + opts.blockMsgClass + ' blockPage" style="z-index:'+(z+10)+';display:none;position:fixed"></div>';
			}
			else {
				s = '<div class="blockUI ' + opts.blockMsgClass + ' blockElement" style="z-index:'+(z+10)+';display:none;position:absolute"></div>';
			}
			lyr3 = $(s);

			// if we have a message, style it
			if (msg) {
				if (opts.theme) {
					lyr3.css(themedCSS);
					lyr3.addClass('ui-widget-content');
				}
				else
					lyr3.css(css);
			}

			// style the overlay
			if (!opts.theme /*&& (!opts.applyPlatformOpacityRules)*/)
				lyr2.css(opts.overlayCSS);
			lyr2.css('position', full ? 'fixed' : 'absolute');

			// make iframe layer transparent in IE
			if (msie || opts.forceIframe)
				lyr1.css('opacity',0.0);

			//$([lyr1[0],lyr2[0],lyr3[0]]).appendTo(full ? 'body' : el);
			var layers = [lyr1,lyr2,lyr3], $par = full ? $('body') : $(el);
			$.each(layers, function() {
				this.appendTo($par);
			});

			if (opts.theme && opts.draggable && $.fn.draggable) {
				lyr3.draggable({
					handle: '.ui-dialog-titlebar',
					cancel: 'li'
				});
			}

			// ie7 must use absolute positioning in quirks mode and to account for activex issues (when scrolling)
			var expr = setExpr && (!$.support.boxModel || $('object,embed', full ? null : el).length > 0);
			if (ie6 || expr) {
				// give body 100% height
				if (full && opts.allowBodyStretch && $.support.boxModel)
					$('html,body').css('height','100%');

				// fix ie6 issue when blocked element has a border width
				if ((ie6 || !$.support.boxModel) && !full) {
					var t = sz(el,'borderTopWidth'), l = sz(el,'borderLeftWidth');
					var fixT = t ? '(0 - '+t+')' : 0;
					var fixL = l ? '(0 - '+l+')' : 0;
				}

				// simulate fixed position
				$.each(layers, function(i,o) {
					var s = o[0].style;
					s.position = 'absolute';
					if (i < 2) {
						if (full)
							s.setExpression('height','Math.max(document.body.scrollHeight, document.body.offsetHeight) - (jQuery.support.boxModel?0:'+opts.quirksmodeOffsetHack+') + "px"');
						else
							s.setExpression('height','this.parentNode.offsetHeight + "px"');
						if (full)
							s.setExpression('width','jQuery.support.boxModel && document.documentElement.clientWidth || document.body.clientWidth + "px"');
						else
							s.setExpression('width','this.parentNode.offsetWidth + "px"');
						if (fixL) s.setExpression('left', fixL);
						if (fixT) s.setExpression('top', fixT);
					}
					else if (opts.centerY) {
						if (full) s.setExpression('top','(document.documentElement.clientHeight || document.body.clientHeight) / 2 - (this.offsetHeight / 2) + (blah = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"');
						s.marginTop = 0;
					}
					else if (!opts.centerY && full) {
						var top = (opts.css && opts.css.top) ? parseInt(opts.css.top, 10) : 0;
						var expression = '((document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + '+top+') + "px"';
						s.setExpression('top',expression);
					}
				});
			}

			// show the message
			if (msg) {
				if (opts.theme)
					lyr3.find('.ui-widget-content').append(msg);
				else
					lyr3.append(msg);
				if (msg.jquery || msg.nodeType)
					$(msg).show();
			}

			if ((msie || opts.forceIframe) && opts.showOverlay)
				lyr1.show(); // opacity is zero
			if (opts.fadeIn) {
				var cb = opts.onBlock ? opts.onBlock : noOp;
				var cb1 = (opts.showOverlay && !msg) ? cb : noOp;
				var cb2 = msg ? cb : noOp;
				if (opts.showOverlay)
					//lyr2._fadeIn(opts.fadeIn, cb1);
                                        lyr2.show();
				if (msg)
					lyr3._fadeIn(opts.fadeIn, cb2);
			}
			else {
				if (opts.showOverlay)
					lyr2.show();
				if (msg)
					lyr3.show();
				if (opts.onBlock)
					opts.onBlock();
			}

			// bind key and mouse events
			bind(1, el, opts);

			if (full) {
				pageBlock = lyr3[0];
				pageBlockEls = $(':input:enabled:visible',pageBlock);
				if (opts.focusInput)
					setTimeout(focus, 20);
			}
			else
				center(lyr3[0], opts.centerX, opts.centerY);

			if (opts.timeout) {
				// auto-unblock
				var to = setTimeout(function() {
					if (full)
						$.unblockUI(opts);
					else
						$(el).unblock(opts);
				}, opts.timeout);
				$(el).data('blockUI.timeout', to);
			}
		}

		// remove the block
		function remove(el, opts) {
			var full = (el == window);
			var $el = $(el);
			var data = $el.data('blockUI.history');
			var to = $el.data('blockUI.timeout');
			if (to) {
				clearTimeout(to);
				$el.removeData('blockUI.timeout');
			}
			opts = $.extend({}, $.blockUI.defaults, opts || {});
			bind(0, el, opts); // unbind events

			if (opts.onUnblock === null) {
				opts.onUnblock = $el.data('blockUI.onUnblock');
				$el.removeData('blockUI.onUnblock');
			}

			var els;
			if (full) // crazy selector to handle odd field errors in ie6/7
				els = $('body').children().filter('.blockUI').add('body > .blockUI');
			else
				els = $el.find('>.blockUI');

			if (full)
				pageBlock = pageBlockEls = null;

			if (opts.fadeOut) {
				els.fadeOut(opts.fadeOut);
				setTimeout(function() { reset(els,data,opts,el); }, opts.fadeOut);
			}
			else
				reset(els, data, opts, el);
		}

		// move blocking element back into the DOM where it started
		function reset(els,data,opts,el) {
			els.each(function(i,o) {
				// remove via DOM calls so we don't lose event handlers
				if (this.parentNode)
					this.parentNode.removeChild(this);
			});

			if (data && data.el) {
				data.el.style.display = data.display;
				data.el.style.position = data.position;
				if (data.parent)
					data.parent.appendChild(data.el);
				$(el).removeData('blockUI.history');
			}

			if (typeof opts.onUnblock == 'function')
				opts.onUnblock(el,opts);

			// fix issue in Safari 6 where block artifacts remain until reflow
			var body = $(document.body), w = body.width(), cssW = body[0].style.width;
			body.width(w-1).width(w);
			body[0].style.width = cssW;
		}

		// bind/unbind the handler
		function bind(b, el, opts) {
			var full = el == window, $el = $(el);

			// don't bother unbinding if there is nothing to unbind
			if (!b && (full && !pageBlock || !full && !$el.data('blockUI.isBlocked')))
				return;

			$el.data('blockUI.isBlocked', b);

			// don't bind events when overlay is not in use or if bindEvents is false
			if (!opts.bindEvents || (b && !opts.showOverlay))
				return;

			// bind anchors and inputs for mouse and key events
			var events = 'mousedown mouseup keydown keypress touchstart touchend touchmove';
			if (b)
				$(document).bind(events, opts, handler);
			else
				$(document).unbind(events, handler);

		// former impl...
		//		var $e = $('a,:input');
		//		b ? $e.bind(events, opts, handler) : $e.unbind(events, handler);
		}

		// event handler to suppress keyboard/mouse events when blocking
		function handler(e) {
			// allow tab navigation (conditionally)
			if (e.keyCode && e.keyCode == 9) {
				if (pageBlock && e.data.constrainTabKey) {
					var els = pageBlockEls;
					var fwd = !e.shiftKey && e.target === els[els.length-1];
					var back = e.shiftKey && e.target === els[0];
					if (fwd || back) {
						setTimeout(function(){focus(back);},10);
						return false;
					}
				}
			}
			var opts = e.data;
			// allow events within the message content
			if ($(e.target).parents('div.' + opts.blockMsgClass).length > 0)
				return true;

			// allow events for content that is not being blocked
			return $(e.target).parents().children().filter('div.blockUI').length === 0;
		}

		function focus(back) {
			if (!pageBlockEls)
				return;
			var e = pageBlockEls[back===true ? pageBlockEls.length-1 : 0];
			if (e)
				e.focus();
		}

		function center(el, x, y) {
			var p = el.parentNode, s = el.style;
			var l = ((p.offsetWidth - el.offsetWidth)/2) - sz(p,'borderLeftWidth');
			var t = ((p.offsetHeight - el.offsetHeight)/2) - sz(p,'borderTopWidth');
			if (x) s.left = l > 0 ? (l+'px') : '0';
			if (y) s.top  = t > 0 ? (t+'px') : '0';
		}

		function sz(el, p) {
			return parseInt($.css(el,p),10)||0;
		}

	}


	/*global define:true */
	if (typeof define === 'function' && define.amd && define.amd.jQuery) {
		define(['jquery'], setup);
	} else {
		setup(jQuery);
	}

})();
;/**
 * –î–ª—è —ç–ª–µ–º–µ–Ω—Ç–∞, –∫–æ—Ç–æ—Ä—ã–π –ø–µ—Ä–µ–∫–ª—é—á–∞–µ—Ç —Å–æ—Å—Ç–æ—è–Ω–∏–µ popover'a –≤—ã–±—Ä–∞—Å—ã–≤–∞—é—Ç—Å—è —Å–æ–±—ã—Ç–∏—è:
 * popover.init - –≤—ã–∑—ã–≤–∞–µ—Ç—Å—è –ø–æ—Å–ª–µ –∏–Ω–∏—Ü–∏–∞–ª–∏–∑–∞—Ü–∏–∏ –ø–ª–∞–≥–∏–Ω–∞
 * popover.show - –≤—ã–∑—ã–≤–∞–µ—Ç—Å—è –ø–µ—Ä–µ–¥ –ø–æ–∫–∞–∑–æ–º popover'a (—Å–æ—Å—Ç–æ—è–Ω–∏–µ –µ—â–µ –Ω–µ –∏–∑–º–µ–Ω–µ–Ω–æ)
 * popover.showen - –≤—ã–∑—ã–≤–∞–µ—Ç—Å—è –ø–æ—Å–ª–µ –ø–æ–∫–∞–∑–æ–º popover'a (—Å–æ—Å—Ç–æ—è–Ω–∏–µ –∏–∑–º–µ–Ω–µ–Ω–æ)
 * popover.hide   - –≤—ã–∑—ã–≤–∞–µ—Ç—Å—è –ø–µ—Ä–µ–¥ —Å–∫—Ä—ã—Ç–∏–µ–º popover'a (—Å–æ—Å—Ç–æ—è–Ω–∏–µ –µ—â–µ –Ω–µ –∏–∑–º–µ–Ω–µ–Ω–æ)
 * popover.hidden - –≤—ã–∑—ã–≤–∞–µ—Ç—Å—è –ø–æ—Å–ª–µ —Å–∫—Ä—ã—Ç–∏—è popover'a (—Å–æ—Å—Ç–æ—è–Ω–∏–µ –∏–∑–º–µ–Ω–µ–Ω–æ)
 *
 * –î–ª—è popover'a –≤—ã–±—Ä–∞—Å—ã–≤–∞—é—Ç—Å—è —Å–æ–±—ã—Ç–∏—è:
 * popover.target.init - –≤—ã–∑—ã–≤–∞–µ—Ç—Å—è –ø–æ—Å–ª–µ –∏–Ω–∏—Ü–∏–∞–ª–∏–∑–∞—Ü–∏–∏ –ø–ª–∞–≥–∏–Ω–∞
 * popover.target.show - –≤—ã–∑—ã–≤–∞–µ—Ç—Å—è –ø–µ—Ä–µ–¥ –ø–æ–∫–∞–∑–æ–º popover'a (—Å–æ—Å—Ç–æ—è–Ω–∏–µ –µ—â–µ –Ω–µ –∏–∑–º–µ–Ω–µ–Ω–æ)
 * popover.target.showen - –≤—ã–∑—ã–≤–∞–µ—Ç—Å—è –ø–æ—Å–ª–µ –ø–æ–∫–∞–∑–æ–º popover'a (—Å–æ—Å—Ç–æ—è–Ω–∏–µ –∏–∑–º–µ–Ω–µ–Ω–æ)
 * popover.target.hide   - –≤—ã–∑—ã–≤–∞–µ—Ç—Å—è –ø–µ—Ä–µ–¥ —Å–∫—Ä—ã—Ç–∏–µ–º popover'a (—Å–æ—Å—Ç–æ—è–Ω–∏–µ –µ—â–µ –Ω–µ –∏–∑–º–µ–Ω–µ–Ω–æ)
 * popover.target.hidden - –≤—ã–∑—ã–≤–∞–µ—Ç—Å—è –ø–æ—Å–ª–µ —Å–∫—Ä—ã—Ç–∏—è popover'a (—Å–æ—Å—Ç–æ—è–Ω–∏–µ –∏–∑–º–µ–Ω–µ–Ω–æ)
 */

;(function ( $, window, document, undefined ) {
    "use strict";

    // default options and plugin function name
    var pluginName = "hlPopover",
        defaults = {
            strict: false,
            triggerState: 'click',
            targetCloseSelector: '.close-x',
            toggleClass: ''
        };

    var toggleClasses = function(){
        var plugin = this;
        if (!plugin.settings.toggleClass) return;
        var classList = plugin.settings.toggleClass.split(/\s+/);
        for (var i in classList) {
            plugin.$element.toggleClass(classList[i]);
        }
    };

    // The actual plugin constructor
    function Plugin ( element, options ) {
        this._name    = pluginName;
        this.settings = $.extend( {}, defaults, options );

        this.element  = element;
        this.$element = jQuery(element);

        if (!this.$element.data('popover-target')) {
            throw new Error('hlPopover error: attribute "data-popover-target" not specified');
        }

        this.$target = jQuery(this.$element.data('popover-target'));
        if (!this.$target.length) {
            throw 'hlPopover error: can\'t find target element';
        } else if (this.$target.length > 1) {
            throw new Error('hlPopover error: multiple targets found');
        }

        if (this.$element.data('popover-toggle-class')) {
            this.settings.toggleClass = this.$element.data('popover-toggle-class');
        }

        this.target          = this.$target.get();
        this.targetIsVisible = !this.$target.is(':hidden');

        this.init();
    }

    $.extend(Plugin.prototype, {

        init: function () {
            var plugin = this;

            if (typeof plugin.settings.targetCloseSelector == 'string') {
                plugin.$target.find(plugin.settings.targetCloseSelector).on('click', function (event) {
                    plugin.hide();
                });
            }

            if (typeof plugin.settings.triggerState == 'string') {
                plugin.$element.on(plugin.settings.triggerState, function (event) {
                    plugin.toggle();
                });
            }

            this._triggerEvent('init');
        },

        // –ø–µ—Ä–µ–∫–ª—é—á–∞–µ—Ç —Å–æ—Å—Ç–æ—è–Ω–∏–µ –ø–æ–ø–∞–ø–∞
        toggle: function () {
            this.targetIsVisible ? this.hide() : this.show();
        },

        // –ø–æ–∫–∞–∑—ã–≤–∞–µ—Ç –ø–æ–ø–∞–ø
        show: function () {
            if (this.targetIsVisible == false ) {
                this._triggerEvent('show');
                toggleClasses.apply(this);
                this.$target.show();
                this._triggerEvent('showen');
                this.targetIsVisible = true;
                this._setOutsideClickClose(true);
            }
        },

        // —Å–∫—Ä—ã–≤–∞–µ—Ç –ø–æ–ø–∞–ø
        hide: function () {
            if (this.targetIsVisible == true) {
                this._triggerEvent('hide');
                toggleClasses.apply(this);
                this.$target.hide();
                this._triggerEvent('hidden');
                this.targetIsVisible = false;
                this._setOutsideClickClose(false);
            }
        },

        _triggerEvent: function(eventName){
            var plugin = this,
                elementEventName = 'popover.' + eventName,
                targetEventName  = 'popover.target.' + eventName;
            setTimeout(function(){
                plugin.$element.trigger(elementEventName);
            }, 1);
            setTimeout(function(){
                plugin.$target.trigger(targetEventName);
            }, 1);
        },

        _setOutsideClickClose: function(enable) {
            var plugin = this;
            if (!!enable) {
                jQuery(document).on('click.popover.close', function(event){
                    if (!(jQuery(event.target).closest(plugin.target).length) && plugin.targetIsVisible) {
                        plugin.hide();
                    }
                });
            } else {
                jQuery(document).unbind('click.popover.close');
            }
        }
    });

    $.fn[ pluginName ] = function ( options ) {
        var args = arguments;
        return this.each(function() {
            if ( !$.data( this, "plugin_" + pluginName ) ) {
                $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
            }
            if (typeof options === 'string') {
                var plugin = $.data( this, "plugin_" + pluginName );
                if (typeof plugin[options] === 'function') {
                    return plugin[options].apply(plugin, Array.prototype.slice.call(args, 1));
                }
            }
        });
    };

    // –∏–Ω–∏—Ü–∏–∞–ª–∏–∑–∏—Ä—É–µ–º
    jQuery(document).on('click', '[data-popover-toggle]', function() {
        jQuery(this).hlPopover({triggerState: false})
        jQuery(this).hlPopover('toggle');
    });

})( jQuery, window, document );;(function(window, jQuery){
    jQuery(window.document).ready(function(){

        jQuery('body').on('click', '[data-outer-link]', function(){
            var $this = jQuery(this),
                url = $this.data('outer-link'),
                target = $this.data('outer-target');

            switch (true) {
                case !!(url && target):
                    window.open(url, target);
                    break;
                case !!url:
                    window.location = url;
                    break;
            }
        });

    });
})(window, jQuery);;jQuery(function($){

    var key = '',
    statistic_elts = jQuery('.g_statistic'),
    found = window.location.href.match("show_stats"),
    debug_statistic = window.location.href.match("debug_statistic"),
    win =   $(window),
    winDoc =   $(document);

    function setClickHandler(key){
        if(!statistic_elts.length){
            return;
        }

        var data = params_for_click[key],
            el =   statistic_elts.filter("[data-statistic-key="+key+"]"),
            clickHandler = function(e,_data){
//                e.preventDefault();
//                console.log(_data);
                dataLayer.push(_data);
                debug_statistic && jQuery.post("/aj/statistic/", { prop: key, data: _data } );
            };

        if( el.length !==0 ){
            if(found){
                jQuery(el).attr("data-statistic-value", JSON.stringify(data));
            }
//            checkDynamicProperties(el,data);
            winDoc.on('click', "[data-statistic-key="+key+"]",  function(e){ clickHandler(e,data) } );
        }
    }
    
    function setScrollHandler(key){
        if(!statistic_elts.length){
            return;
        }
        var data = params_for_scroll[key],
            el =  statistic_elts.filter("[data-statistic-key="+key+"]"),
            token = 'scroll.'+key;

        if( el.length !==0 ){
            win.on(token, function(){
                if(is_visible(el)){
//                    checkDynamicProperties(el,data);
//                    console.log(data);
                    dataLayer.push(data);
                    debug_statistic && jQuery.post("/aj/statistic/", { prop: key, data: data } );
                    win.off(token)
                }
            });

            if(found){
                jQuery(el).attr("data-statistic-value", JSON.stringify(data));
            }
        }
   }

    if(typeof params_for_click !== "undefined"){
        for(key in params_for_click){
            if( !params_for_click.hasOwnProperty(key) || !jQuery("[data-statistic-key="+key+"]").length){
//                console.log('ÔÓÔÛÒÍ‡ÂÏ ÍÎËÍ '+key);
                continue;
            }
            setClickHandler(key);
        }
    }

    if(typeof params_for_scroll !== "undefined"){
        for(key in params_for_scroll){
            if( !params_for_scroll.hasOwnProperty(key) || !jQuery("[data-statistic-key="+key+"]").length){
//                console.log('ÔÓÔÛÒÍ‡ÂÏ ÒÍÓÎ '+key);
                continue;
            }
            setScrollHandler(key);
        }
    }
      
    function is_visible($el){
        if ($el.length === 0 ) return false;
        var docViewTop = win.scrollTop();
        var docViewBottom = docViewTop + win.height();
        var elemTop = $el.offset().top;
        var elemBottom = elemTop + $el.height();

        return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    }

    /*function checkDynamicProperties(domEl,statisticObj){
        for(var prop in statisticObj){
            if( !statisticObj.hasOwnProperty(prop)){
                continue;
            }
            var attr = domEl.attr('data-'+prop);
            if(attr !== undefined && attr !== false){
                statisticObj[prop] = attr;
            }
        }
    }*/
});
;function moveImgToToolBar(dataType, img){
       var src = img.attr('src'),
       clonImg = jQuery("<img src='"+src+"'>"),
     imgOffset = img.offset(),
     winHeight = jQuery(window).height(),
 toolbarHeight = 23,
        winTop = winHeight + jQuery(window).scrollTop(),
isSmallToolbar = (jQuery('.small-toolbar').css('display') !== 'none');

    if(isSmallToolbar){
        var buyInOne = jQuery('div.small-toolbar'),
             needFly = (buyInOne.length) ? 1 : 0,
       buyInOneWidth = toolbarHeight,
              winTop = (needFly)?(buyInOne.hasClass('top'))?buyInOne.offset().top:(winTop-50-toolbarHeight):0;
    }else{
        var buyInOne = jQuery('div.toolbar-user .div-float .title-span[data-type='+dataType+']'),
             needFly = (buyInOne.length)?1: 0,
      buyInOneWidth  = buyInOne.width(),
              winTop = (needFly)?(jQuery('div.toolbar-user').hasClass('top-position'))?buyInOne.offset().top:winTop-toolbarHeight:0;
    }

    if(needFly){
        var buyInOneOffset = buyInOne.offset();

        clonImg.css({ 'position' : 'absolute', 'z-index': 9999, 'opacity': 0.5 , top: imgOffset.top, left: imgOffset.left }).appendTo('body').animate({
            height: toolbarHeight,
            top: winTop,
            left: buyInOneOffset.left + (buyInOneWidth/2 - toolbarHeight/2)
        }, 1000, 'easeOutQuint', function() { jQuery(this).remove(); });
    }
}
;/**
 * Ì‡ÔÓÏÌËÚ¸, ÍÓ„‰‡ ÚÓ‚‡ ÔÓˇ‚ËÚÒˇ ‚ Ì‡ÎË˜ËË, ÍÓ„‰‡ ˆÂÌ‡ Ì‡ ÚÓ‚‡ ËÁÏÂÌËÚÒˇ
 * **/
(function( $ ){

    $.fn.cardNotifications = function( data ){

        var _this = this;
        _this.notificationsUrl = '/profile/notifications/add/';
        _this.movementTimeout = null;
        _this.opened = false;
        /**
         * handlers
         * **/
        function onScroll(){

            if(_this.opened){
                clearInterval(_this.movementTimeout);
                _this.movementTimeout = window.setTimeout(function(){
                    _this.scrollTop = $(window).scrollTop();
                    $(_this.formSelector).animate({'top':_this.windowHeight / 2 + _this.scrollTop - _this.formHeight / 2 },500);
                },200);
            }
        }

        function onResize(){
            if(_this.opened){
                setWindowDimensions();
                setFormPosition();
            }
        }

        function onClick(){
            //applying form values
            _this.scrollTop = $(window).scrollTop();
            _this.cardId = $(this).attr('data-card_id');
            _this.email = $(this).attr('data-email');
            _this.type = $(this).attr('data-type');
            _this.formSelector = '.card-notifications-'+_this.type+'-form';
            //form values
            $(_this.formSelector+' input[name="email"]').val(_this.email);
            $(_this.formSelector+' input[name="card_id"]').val(_this.cardId);

            validateData();

            _this.form = $(_this.formSelector);

            //move form to the document tag
            $('body').append(_this.form);

            setFormDimensions();
            setWindowDimensions();

            //form handlers
            $(_this.formSelector+':not(.processed-form) span.close-x').click(formClose);
            $(_this.formSelector+':not(.processed-form) button.notify_card_popup_cancel').click(formClose);
            $(_this.formSelector+':not(.processed-form) button[type="submit"]').click(formSubmit);
            $(_this.formSelector+':not(.processed-form) form').submit(function(){return false;});

            $(_this.formSelector).addClass('processed-form');

            setFormPosition();

            $(_this.formSelector).show();
            _this.opened = true;
        }

        /**
         * form handlers
         * **/
        function formClose(){
            _this.opened = false;
            $(_this.formSelector).hide();
            return false;
        }

        function formSubmit(){

            if(validateForm()){
                //send request
                var price = _this.form.find('input[name="summ"]').val();
                price = parseInt(price,10);
                var email = _this.form.find('input[name="email"]').val();
                var card_id = parseInt(_this.form.find('input[name="card_id"]').val(),10);

                var requestData = {
                    'type':_this.type,
                    'price':price,
                    'email':email,
                    'card_id':card_id
                };
                sendForm(requestData);
                showSuccessMessage()
            }
            return false;
        }

        function showSuccessMessage () {
            var addPopupText = t('—Ô‡ÒË·Ó, ‚‡¯‡ Á‡ˇ‚Í‡ ÔËÌˇÚ‡!'); 
            jQuery('#js-add-popup-text').empty().html(addPopupText);
                jQuery('#js-add-popup').fadeIn(2000).delay(5000).fadeOut(2000);
                jQuery('#js-add-popup .close-x').click(function(){
                    jQuery('#js-add-popup').css({'display':'none'});
                    return false;
            });
        }
        
        function sendForm(data){

            _this.form.hide();

            $.ajax({
                'url' : _this.notificationsUrl,
                'type' : 'POST',
                'dataType' : 'json',
                'data': data,
                'success': function(response){

                },
                'error':function(){

                }
            });
        }

        function validateForm(){
            return validators[_this.type]();
        }

        /**
         * validation for types
         * **/
        var validators = {
            'lowerprice':function(){
                //validate price
                var price = _this.form.find('input[name="summ"]').val();
                price = parseInt(price,10);

                if(isNaN(price) || price == 0){
                    alert(t('÷ÂÌ‡ ‰ÓÎÊÌ‡ ·˚Ú¸ ˆÂÎ˚Ï ˜ËÒÎÓÏ'));
                    return false;
                }

                //validate email
                var email = _this.form.find('input[name="email"]').val();

                if(email == ''){
                    alert(t('¬‚Â‰ËÚÂ email'));
                    return false;
                }

                return true;
            },
            'existence':function(){
                var email = _this.form.find('input[name="email"]').val();

                if(email == ''){
                    alert(t('¬‚Â‰ËÚÂ email'));
                    return false;
                }
                return true;
            }
        };




        /**
         * private
         * */
        function setFormDimensions(){
            _this.formWidth  = $(_this.formSelector).width();
            _this.formHeight = $(_this.formSelector).height();
        }

        function setWindowDimensions(){
            _this.windowWidth  = $(window).width();
            _this.windowHeight = $(window).height();
        }

        function validateData(){
            _this.cardId = parseInt(_this.cardId,10);
            if(isNaN(_this.cardId) || _this.cardId == 0){
                $.error('Card id must be valid');
            }

            if(_this.type!='existence' && _this.type!="lowerprice"){
                $.error('Unknown type '+_this.type);
            }

            if(!$(_this.formSelector).size()){
                $.error('Form was not found');
            }
        }

        function setFormPosition(){
            $(_this.formSelector).css({
                'left': _this.windowWidth / 2 - _this.formWidth / 2,
                'top' : _this.windowHeight / 2 + _this.scrollTop - _this.formHeight / 2
            });
        }

        /**
         *
         * **/
        var methods = {
            'init':function(options){
                if($(this).data('attached')) return ;
                $(this).data('attached',true);

                $(this).click(onClick);
                $(window).resize(onResize);
                $(window).scroll(onScroll);

            }
        };




        if ( methods[data] ) {
            return methods[ data ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof data === 'object' || ! data ) {
            return methods.init.apply( this , arguments );
        } else {
            $.error('Undefined method');
        }

    }

})(jQuery,this);

;var qf = (function(){

//==============================================================================
    var JSON = JSON || {};

    // implement JSON.stringify serialization
    JSON.stringify = JSON.stringify || function (obj) {
        var t = typeof (obj);
        if (t != "object" || obj === null) {
            // simple data type
            if (t == "string") obj = '"'+obj+'"';
            return String(obj);
        }
        else {
            // recurse array or object
            var n, v, json = [], arr = (obj && obj.constructor == Array);
            for (n in obj) {
                v = obj[n];
                t = typeof(v);
                if (t == "string") v = '"'+v+'"';
                else if (t == "object" && v !== null) v = JSON.stringify(v);
                json.push((arr ? "" : '"' + n + '":') + String(v));
            }
            return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
        }
    };
    // implement JSON.parse de-serialization
    JSON.parse = JSON.parse || function (str) {
        if (str === "") str = '""';
        eval("var p=" + str + ";");
        return p;
    };


//==============================================================================

            var Cacher = function()
            {
                this.data = {};
                
                this.expire_time = 60*1000;
                
                this.expires = {};
                
                this.get = function(hash_id){
                    
                    var result = false;
                    
                    if( this.data[hash_id] && this.expires[hash_id])
                    {
                        if ( (new Date()).getTime() < this.expires[hash_id] )
                            {
                                result = this.data[hash_id];
                            }
                    }
                    
                    return result;
                }
                
                this.set = function(hash_id,data){
                    this.data[hash_id] = data;
                    this.expires[hash_id] = (new Date()).getTime()+this.expire_time;
                    
                }
            }
            
            var cacher = new Cacher();
            
            //==========[  M A N A G E R  ]=====================================
            
            var Manager =   function(params,data){
                var params = params||{};
                this.default_params = {};
                this.sid = 0;
                this.search_token = false;
                this.params = jQuery.extend(this.params,this.default_params,params);
                
                this.groupsContainer = false;
                this.filtersContainer = false;
                
                this.groups = {};
                this.fg_hash = {};
                
                this.active_group = false;
                this.is_active = false;

                this.objToArr = function(obj,get_values)
                {
                    var get_values = get_values||false;
                    
                    var arr = [];
                    
                    for(var i in obj)
                        {
                            if (!obj.hasOwnProperty(i)) return;
                            
                            arr.push(get_values?obj[i]:i);
                        }
                        
                    return arr;    
                }
                
                this.getData = function(){
                    
                    var self = this;
                    
                    var sf = this.objToArr(this.selectedFilters);
                    
                    /*for(var i in this.selectedFilters)
                        {
                            if (!this.selectedFilters.hasOwnProperty(i)) return;
                            
                            sf.push(this.selectedFilters[i]);
                        }*/
                    
                    sf.sort(function(a,b){return a-b;});
                    
                    var req_data = {f:sf,sid:this.sid,s_t:this.search_token};
                    var cache_id = JSON.stringify(req_data);
                    
                    var data = cacher.get(cache_id);
                    
                    if ( data )
                    {
                    	
                    	this.populateData(data);
                    	
                    }
                    else
                    {
	                    jQuery.ajax({data:req_data,
	                                 cache:false,
	                                 type:"POST",
	                                 dataType:"json"
	                             }).done(function(data){self.populateData(data);cacher.set(JSON.stringify(req_data),data);});
                    }         
                };
                
                this.populateData = function(data)
                {
                        var groups = this.groups;
                        for (var i in groups)
                            {
                                if ( !groups.hasOwnProperty(i) ) continue;
                                
                                groups[i].pub('data:change',data);
                            }                    
                }
                
                
                
                this.selectedFilters = {};
                
                this.init   =   function(){
                    GroupView.prototype.container = jQuery(this.params.selectors.groups);
                    GroupFiltersView.prototype.container = jQuery(this.params.selectors.filters);
                    
                    GroupView.prototype.template = jQuery(this.params.selectors.group_tpl)[0];
                    FilterView.prototype.template = jQuery(this.params.selectors.filter_tpl)[0];
                    GroupFiltersView.prototype.template = jQuery(this.params.selectors.filters_group_tpl)[0];
                    if (data)
                        {
                            if (data.groups) {this.initGroups(data.groups);};
                            if (data.filters) {this.initFilters(data.filters)
                                                    .initScroll()
                                                    .initFirstGroup()
                                                    .initGroupsVisibility()
                                                    .initGroupsSelectedFiltersCnt();};
                            if (data.sid) this.sid = data.sid;
                            if (data.section_title) this.section_title = data.section_title;
                            if (data.search_token) this.search_token = data.search_token;
                        }
                    
                    this.initDom();
                };
                
                this.initFirstGroup = function()
                {
                    var first_group = this.getFirstGroup();
                    
                    this.active_group = first_group;
                    
                    if(first_group)
                        {
                            first_group.pub('state:change','active');
                        }
                    else
                        {

                        }
                        
                    return this;    
                }
                
                this.initGroups = function(g_init_data){
                    
                    var i = 0,container_no = 0;
                    
                    for(var id in g_init_data)
                        {
                           if (!g_init_data.hasOwnProperty(id)) continue;
                           var group_data = g_init_data[id];
                           container_no = Math.floor(i/this.params.groups_per_col);
                           
                           if(group_data.filters_cnt==0) continue;
                           
                           i++;
                           this.groups[group_data.id] = new Group(group_data.id,group_data.title,group_data.type,container_no);
                           this.first_group || (this.first_group = this.groups[group_data.id]); 
                           //i++;
                        }
                    //hide second groups container
                    if ( i<=this.params.groups_per_col )
                        {
                            GroupView.prototype.container.eq(1).hide();
                        }
                };
                
                this.initFilters = function(f_init_data){
                    var selected_group_ids = {};
                    
                    for(var id in f_init_data)
                        {
                           if (!f_init_data.hasOwnProperty(id)) continue;
                           var filter_data = f_init_data[id];
                           var group = this.groups[filter_data.gid];
                           var filter = new Filter(filter_data.id,filter_data.title,filter_data.ru_title,filter_data.type||0,filter_data.cnt||0,group.filters_container);
                           group.addFilter(filter);
                           
                           if (filter_data.checked)
                               {
                                   this.addSelectedFilter(filter_data.id,filter_data.title, filter_data.ru_title,true);
                                   filter.setChecked(true);
                                   group.selected_filters_cnt++;
                                   selected_group_ids[filter_data.gid] = filter_data.gid;
                               }
                           
                           this.fg_hash[id] = filter_data.gid;
                        }
                     for (var gid in selected_group_ids)
                         {
                            if (!selected_group_ids.hasOwnProperty(gid)) continue;
                            this.groups[gid].pub('filters:group:selected',true);
                         }
                     
                     
                     return this;   
                };
                
                this.initScroll = function()
                {
                    
                    for(var i in this.groups)
                        {
                            if (!this.groups.hasOwnProperty(i)) return;
                            var group = this.groups[i];
                            if (group.filters_cnt >= this.params.amount_scroll )
                                {
                                   var p = group.filters_container.parent();
                                   var scroll_container = jQuery("<div></div>").addClass("qf-scrollbar");
                                   var wrap = jQuery("<div class=\"viewport\"></div>");
                                   group.filters_container.addClass("overview").appendTo(wrap);
                                   scroll_container.append("<div class=\"scrollbar\"><div class=\"track\"><div class=\"thumb\"><div class=\"end\"></div></div></div></div>")
                                   				   .append(wrap);
                                   				   
                                   scroll_container.appendTo(p).tinyscrollbar();
                                   				   
                                   p.hide();	
                                }
                            else
                                {
                                    group.filters_container.parent().hide();
                                }
                        }
                        
                    return this;    
                    
                }

                this.initGroupsVisibility = function()
                {
                    
                    for(var i in this.groups)
                        {
                            if (!this.groups.hasOwnProperty(i)) return;
                            this.groups[i].cnangeVisibleFiltersCnt(0);

                        }
                        
                    return this;    
                    
                }
                
                this.initGroupsSelectedFiltersCnt = function()
                {
                    
                    for(var i in this.groups)
                        {
                            if (!this.groups.hasOwnProperty(i)) return;
                            var group = this.groups[i];
                            if ( group.selected_filters_cnt )
                                {
                                    group.pub('group:change:selected',group.selected_filters_cnt)
                                }
                        }
                        
                    return this;    
                    
                }
                
                this.getFirstGroup = function()
                {
                    if (this.first_group) return this.first_group;
                    
                    var first_group = false;
                    
                    for (var i in this.groups )
                        {
                            if (!this.groups.hasOwnProperty(i)) return;
                            if (first_group = this.groups[i]) break;
                        }
                        
                    return first_group;    
                }
                
                this.initObserve = function()
                {
                    var self = this;
                    jQuery(document).on('filter:selected',function(event,id,title,ru_title){self.addSelectedFilter(id,title,ru_title);});
                    jQuery(document).on('filter:unselected',function(event,id){self.removeSelectedFilter(id);});
                    jQuery(document).on('group:set:active',function(event,id){
                        
                        var groups = self.groups;
                        
                        self.active_group = groups[id];
                        
                        for (var i in groups)
                            {
                                if ( !groups.hasOwnProperty(i) || (i==id) ) continue;
                                
                                groups[i].pub('state:change','inactive');
                            }
                        
                    });
                }
                
                this.addSelectedFilter = function(id,title,ru_title,silent){
                    //alert('new filter selected:'+id);
                    silent = silent||false;
                    this.selectedFilters[id] = new Array(title, ru_title);
                    
                    if (!silent)
                        {
                           this.getData(); 
                        }

                }

                this.removeSelectedFilter = function(id,silent){
                    //alert('filter unselected:'+id);
                    delete this.selectedFilters[id];
                    if (!silent)
                        {
                           this.getData(); 
                        }                   
                }
                
                this.initDom = function()
                {
                    var self = this;
                    this.main_container = jQuery(this.params.selectors.main_container);
                    this.ctrl_closers = this.main_container.find(this.params.selectors.main_container_closer);
                    this.ctrl_go = this.main_container.find(this.params.selectors.choose_n_go);
                    this.ctrl_show_hide = jQuery(this.params.selectors.show_hide);
                    this.ctrl_reset = jQuery(this.params.selectors.reset);                    
                    
                    this.ctrl_show_hide.click(function(){ self.is_active = !self.is_active; 
                                                     self.main_container.toggle();

                                                     if(self.is_active){
                                                         self.active_group&&self.active_group.pub('show:refresh');
                                                     }
                                                    
                                                   });
                    
                    this.ctrl_closers.click(function(){ self.close();self.main_container.hide();self.is_active = false;  });
                    
                    this.ctrl_go.click(function(){self.go()});
                    
                    this.ctrl_reset.click(function(){self.reset()})
                    
                }

                this.close = function()
                {
                    var groups = this.groups;
                    var href = document.location.href;
                    var regexp = /((http:\/\/(www\.)?)?\w+\.[\w-]+(\.[\w-]+)?\/[\w-]+\/([\w-]+)\/)([\d-]*)(\?.*)?/;//console.log('found:',regexp.exec(href));
                    var clean_location = regexp.exec(href)[1];//console.log('clean_location',clean_location);
                    var get_params = regexp.exec(href)[6]; // console.log(regexp.exec(href)[5]);console.log(regexp.exec(href)[6]);console.log(regexp.exec(href)[7]);
                    if(get_params.length > 0) {
                        get_params = get_params.split('-');
                    }
                    //console.log(groups);
                    var just_selected = {};

                    for(var i in this.selectedFilters)
                    {
                        if(jQuery.inArray(i,get_params) == -1)
                        {
                            just_selected[i] = this.selectedFilters[i];
                            this.removeSelectedFilter(i);
                        }
                    }
                    console.log(just_selected);
                    for (var i in groups)
                    {
                        if ( !groups.hasOwnProperty(i) ) continue;

                        groups[i].pub('group:filters:reset',just_selected);
                    }



                    console.log(this.selectedFilters);
                }
                
                this.reset = function()
                {
                    var groups = this.groups;
                    var href = document.location.href;
                    var regexp = /((http:\/\/(www\.)?)?\w+\.[\w-]+(\.[\w-]+)?\/[\w-]+\/([\w-]+)\/)[\d-\/]*(\?.*)?/;//console.log('found:',regexp.exec(href));
                    var clean_location = regexp.exec(href)[1];//console.log(clean_location);
                    document.location = clean_location;
                    for (var i in groups)
                        {
                            if ( !groups.hasOwnProperty(i) ) continue;

                            groups[i].pub('group:filters:reset',this.selectedFilters);
                        }
                    this.selectedFilters = {};
                    this.getData();                        
                }
                
                
                this.go = function()
                {
                    this.registerGAEvents();

                    var href = document.location.href;
                    var regexp = /((http:\/\/(www\.)?)?\w+\.[\w-]+(\.[\w-]+)?\/[\w-]+\/([\w-]+)\/)[\d-\/]*(\?.*)?/;//console.log('found:',regexp.exec(href));
                    var clean_location = regexp.exec(href)[1];//console.log('clean_location',clean_location);
                    var get_params = regexp.exec(href)[6]||''; // console.log('get_params',get_params);
                    if(get_params.length > 0) {
                        get_params = get_params.replace(/&*p=[0-9]+/, '');
                    }
                    var filters_seg = this.objToArr(this.selectedFilters).join('-');
                    var location = clean_location+filters_seg+(filters_seg?'/':'')+get_params;//console.log('location',location);return;
                    window.setTimeout(function(){document.location = location;},100);

                }
                
                this.getSection = function()
                {
                    if (!this.section)
                        {
                            var section_r = /http:\/\/(www\.)?\w+\.[\w-]+(\.[\w-]+)?\/[\w-]+\/([\w-]+)\/.*/;
                            var href = document.location.href;
                            this.section = section_r.exec(href)[3];
                        }
                    return this.section;    
                }
                
                this.registerGAEvents = function()
                {
                    var section = this.getSection()||this.sid;
                    var filters = this.objToArr(this.selectedFilters,true)||[];
                    for(var i=0;i<filters.length;i++)
                        {
                           filters[i][0]=filters[i][0].replace(/&quot;/g, '"');
						   _gaq.push(['_trackEvent', 'filters', section, filters[i][0]+' - quick']);
                        }

                    for(var i in this.selectedFilters)
                        {
                            if(this.selectedFilters[i][1] !== undefined){
                            this.selectedFilters[i][1]=this.selectedFilters[i][1]
                            .replace(/&quot;/g, '"')
                            .replace(/&amp;/g, '&')
                            .replace(/&ldquo;/g, '‚Äú')
                            .replace(/&deg;/g, '¬∞')
                            .replace(/&lsquo;/g, '‚Äò');
							dataLayer.push({ 'event':'OWOX', 'eventCategory': 'Filters', 'eventAction': this.section_title, 'eventLabel': this.selectedFilters[i][1]+' ['+i+']', 'eventContext': 'Quick' });
                            }
                        }  
                }
                
                this.init();
                this.initObserve();
                
            };
            
            
            
            //==========[  M O D E L S  ]=======================================
            //               <<<<< PROTO >>>>>>

            var Model = function(){ return {setId:function(id){ this.data.id = id;},
                                            setTitle : function(title){ this.data.title = title;},
                                            setRuTitle : function(title){ this.data.ru_title = title;},
                                            pub : function( topic, args ) {

                                                    if ( !this.topics[topic] ) {
                                                        return false;
                                                    }

                                                    var subscribers = this.topics[topic],
                                                        len = subscribers ? subscribers.length : 0;

                                                    while (len--) {
                                                        subscribers[len].func(topic, args);
                                                    }
                                                    return true;
                                                },
                                            sub : function( topic, func ) {

                                                    if (!this.topics[topic]) {
                                                        this.topics[topic] = [];
                                                    }

                                                    var token = (++this.subUid).toString();
                                                    this.topics[topic].push({
                                                        token: token,
                                                        func: func
                                                    });
                                                    return token;
                                                },
                                            unsub : function( token ) {
                                                    for ( var m in this.topics ) {
                                                        if ( this.topics[m] ) {
                                                            for (var i = 0, j = this.topics[m].length; i < j; i++) {
                                                                if (this.topics[m][i].token === token) {
                                                                    this.topics[m].splice(i, 1);
                                                                    return token;
                                                                }
                                                            }
                                                        }
                                                    }
                                                    return false;
                                               }
                                                
                                            } 
                                    
                                  };              
            //----------| Filter |----------------------------------------------
            var Filter  =   function(id,title, ru_title,type_id,cnt,dom_container){
                
                this.data = {};
                this.topics = {};
                this.setId(id);
                this.setTitle(title||this.default_prefix+id);
                this.setRuTitle(ru_title||this.default_prefix+id);
                this.setType(type_id);
                this.data.cnt = cnt||0;
                this.initObserve();
                this.state = 'active';
                this.checked = false;                
                var view = new FilterView(this,dom_container); 
                //this.setChecked(checked);
                this.checkState();
                
            };
            
            Filter.prototype = new Model();
            Filter.prototype.default_prefix = 'Filter';
            Filter.prototype.obj_name = 'filter';
            Filter.prototype.types = ['undefined','joint','disjoint'];            
            Filter.prototype.setChecked = function(checked){
                if (this.checked == checked) return;
                
                this.checked = checked;
                this.pub('filter:checked',checked);
            }
            Filter.prototype.setType = function(type_id){
                
                type_id = type_id || 0;
                this.type = this.types[type_id];
                
            }            
            
            Filter.prototype.setState = function(state){
                                          				
                                          				if(this.state !== state)
                                          				{
                                          					this.state = state;
                                          					this.pub('view:state:change',state);
                                          				}
                                          		
                                          			} 
            
            Filter.prototype.initObserve = function()
            {
                var self = this;
                this.sub('state:change',function(topic,state){  if (state=='active' && self.data.cnt==0) state = 'inactive' ;self.setState(state)   });
                this.sub('view:filter:checked',function(topic,is_checked){
                                                    
                                                    self.checked = is_checked;

                                                    if ( is_checked )
                                                        {
                                                          jQuery(document).trigger('filter:selected',[self.data.id,self.data.title,self.data.ru_title]); 
                                                        }
                                                    else
                                                        {
                                                          jQuery(document).trigger('filter:unselected',self.data.id);    
                                                        }
                });
                this.sub('data:change',function(topic,data){
                    var prev_cnt = self.data.cnt;
                    self.data.cnt = data[self.data.id] || 0;
                    self.pub('view:cnt:change',self.data.cnt);
                    
                    if (prev_cnt!=self.data.cnt)
                        {
                            if (self.data.cnt==0)
                                {
                                  jQuery(document).trigger('filter:disappeared',self.data.id);
                                }
                                
                            if (prev_cnt == 0)
                                {
                                   jQuery(document).trigger('filter:appeared',self.data.id);   
                                }
                        }
                    
                    
                    self.checkState();
                      
                });
                
                this.sub('filter:reset',function(topic,data){
                    var prev_cnt = self.data.cnt;
                    if ( data[self.data.id] ){
                        self.checked = false;
                        self.pub('filter:checked',self.checked)
                    };
                      
                });                
                
            }
            Filter.prototype.checkState = function()
            {
                    if ( (this.data.cnt==0) && !this.checked)
                        {
                            this.setState('inactive');
                        }
                    if (this.data.cnt && this.state=='inactive' )
                        {
                            this.setState('active');
                        }                 
            }
            //----------| Group |-----------------------------------------------
            var Group   =   function(id,title,type,container_no){
                this.data = {};
                this.topics = {};
                this.state = 0;
                this.setId(id);
                this.setTitle(title||this.default_prefix+id);
                this.type = type?this.types[type]:this.default_type;
                this.state = 'inactive';
                this.filters = {};
                this.filters_cnt = 0;
                this.selected_filters_cnt = 0;
                this.visible_filters_cnt = 0;
                this.initObserve();
                
                this.filters_container = jQuery((new GroupFiltersView(this)).dom_node.children()[0]);
                
                var viewList = new GroupView(this,container_no);

            };
            Group.prototype = new Model();            
            Group.prototype.default_prefix = 'Group';
            Group.prototype.obj_name = 'group';
            
            Group.prototype.types = ['disjoint','joint'];
            Group.prototype.default_type = Group.prototype.types[0];
            Group.prototype.addFilter = function(filter){
                    var self = this;
                    this.filters[filter.data.id] = filter;
                    this.filters_cnt++;
                    if(filter.data.cnt) this.visible_filters_cnt++;
                    this.sub('filters:state:change',function(topic,state){filter.pub('state:change',state)});
                    this.sub('filters:data:change',function(topic,data){filter.pub('data:change',data)});
                    this.sub('filters:reset',function(topic,data){filter.pub('filter:reset',data)});
                    this.sub('filters:group:selected',function(topic,refresh_data){
                                                                                   filter.pub('group:selected',refresh_data?filter.data:false);
                                                                                   });
                    this.sub('filters:group:unselected',function(topic,refresh_data){filter.pub('group:unselected',refresh_data?filter.data:false)});
                }

            Group.prototype.active_group_id = false;
            Group.prototype.initObserve = function()
            {
                var self = this;
                this.sub('state:change',function(topic,state){self.setState(state)});
                this.sub('data:change',function(topic,data){ 
                                                             self.pub('filters:data:change',data) });

                this.sub('group:filters:reset',function(topic,data){console.log('cought reset'); 
                                                             self.pub('filters:reset',data);self.cnangeSelectedCnt(false); });

                jQuery(document).on('filter:selected',function(event,id,title){if (self.filters[id]){self.cnangeSelectedCnt(1);} });
                jQuery(document).on('filter:unselected',function(event,id){if (self.filters[id]){self.cnangeSelectedCnt(-1);}});

                jQuery(document).on('filter:disappeared',function(event,id){if (self.filters[id]){self.cnangeVisibleFiltersCnt(-1);}});
                jQuery(document).on('filter:appeared',function(event,id){if (self.filters[id]){self.cnangeVisibleFiltersCnt(1);}});                
            }
            
            
            Group.prototype.cnangeSelectedCnt = function(val)
                                                            {
                                                                if ( val) this.selected_filters_cnt += val;
                                                                else this.selected_filters_cnt = 0;

                                                                this.pub('group:change:selected',this.selected_filters_cnt);
                                                                
                                                                if (this.selected_filters_cnt == 0)
                                                                    {
                                                                       this.pub('filters:group:unselected');
                                                                    }
                                                                if ( ((this.selected_filters_cnt == 1)&&(val == 1)) || val>1)
                                                                    {
                                                                       this.pub('filters:group:selected');  
                                                                    }
                                                            }

            Group.prototype.cnangeVisibleFiltersCnt = function(val)
                                                            {
                                                                this.visible_filters_cnt += val;                                                             
                                                                
                                                                if (this.visible_filters_cnt == 0)
                                                                    {
                                                                       this.pub('group:view:hide');
                                                                    }
                                                                if ( ((this.visible_filters_cnt == 1)&&(val == 1)) || val>1)
                                                                    {
                                                                       this.pub('group:view:show');  
                                                                    }
                                                            }

            Group.prototype.setState = function(state){
                                          				
                                          				if(this.state !== state)
                                          				{
                                          					this.state = state;
                                          					this.pub('view:state:change',state);
                                          					//this.pub('filters:state:change',state);
                                                            
                                                            if (state=='active')
                                                                {
                                                                    jQuery(document).trigger(this.obj_name+':set:active',this.data.id);
                                                                }
                                          				}
                                          		
                                          			}   
                                                    
                                                    
                                                    
            //============[  V I E W S  ]=======================================
            //               <<<<< PROTO >>>>>>            
            var View = function(){return{
                                            initElement:function(container_no)
                                                                {this.dom_node = jQuery(jQuery(this.template).html().replace(/^\s+|\s+$/gm,''));
                                                                   container_no = container_no || 0;
                                                                   
                                                                   var container = this.container[container_no];
                                                                   
                                                                   jQuery(container).append(this.dom_node);
                                                                   //this.dom_node.hide();
                                                                   return this.dom_node;
                                                                },
                                                                
                                            setModel: function(model){
                                                        this.model = model;
                                            },
                                            
                                            dataFill: function(d){
                                               
                                                for(var i in d)
                                                    {
                                                        if(!d.hasOwnProperty(i)) return;
                                                        var selector = '.'+this.data_prefix+'-'+i;

                                                        var content = this.prepare?this.prepare(i,d[i]):d[i];
                                                        
                                                        this.dom_node.find(selector).html(content);
                                                    }
                                            }
                                        }
            }            

            //----------| Group View |------------------------------------------
            var GroupView   =   function(model,container_no){
                this.initElement(container_no);
                this.setModel(model);
                this.dataFill(this.model.data);
                this.setEvents();
                this.initObserve();                
            };
            GroupView.prototype = new View();
            GroupView.prototype.data_prefix = 'g';
            GroupView.prototype.setEvents  = function()
            {
            	var self = this;
            	this.dom_node.click(function(){ //self.model.setState('active')
                                                 self.model.pub('state:change','active');   
                                                });
            }
             	
            GroupView.prototype.initObserve = function(){
                var self = this;

                this.model.sub('view:state:change',function(topic,state){ self.setState(state) });
                this.model.sub('group:view:hide',function(){ self.dom_node.hide() });
                this.model.sub('group:view:show',function(){ self.dom_node.show() });
                this.model.sub('group:change:selected',function(topic,cnt)
                                                                {
                                                                    cnt = cnt?'+'+cnt:'';
                                                                    self.dataFill({selected_cnt:cnt})
                                                                
                                                                });                
            }
            
            GroupView.prototype.setState = function(state){
            	if( state=='active' )  
            		{	this.dom_node.addClass('none');} 
            	else 
            		{	this.dom_node.removeClass('none');}
            } 
            //----------| Group`s filters container View |----------------------
            var GroupFiltersView   =   function(model){
                this.initElement();
                this.setModel(model);
                this.initObserve();                
            };
            GroupFiltersView.prototype = new View();
             	
            GroupFiltersView.prototype.initObserve = function(){
                var self = this;
                this.model.sub('view:state:change',function(topic,state){ self.setState(state) });
                this.model.sub('show:refresh',function(){ var scroll = self.dom_node.find('.qf-scrollbar')[0];scroll&&jQuery(scroll).tinyscrollbar_update(); });
//                this.model.sub('filters:data:change',function(){ var scroll = self.dom_node.find('.qf-scrollbar')[0];scroll&&jQuery(scroll).tinyscrollbar_update(); });
                this.model.sub('');
            }
            
            GroupFiltersView.prototype.setState = function(state){
                if( state=='active' )  
            		{	this.dom_node.show();var scroll = this.dom_node.find('.qf-scrollbar')[0];scroll&&jQuery(scroll).tinyscrollbar_update();} 
            	else 
            		{	this.dom_node.hide();}
            }             
            
            
            
            //----------| Filter View |-----------------------------------------            
            var FilterView  =   function(model,container){
                this.prefix = '';
                this.setPrefix(model.type);
                this.show_prefix = false;
                this.container = container;
                this.checker = this.initElement().find('input');
                this.setModel(model);
                this.dataFill(this.model.data);
                this.initObserve();
                this.setEvents();
                
            };
            FilterView.prototype = new View();
            FilterView.prototype.data_prefix = 'f';
            FilterView.prototype.prepare_cnt = function(val){ return '('+val+')'; }
            FilterView.prototype.setPrefix = function(type){ switch(type)
                                                                    {case 'joint': 
                                                                            this.prefix='+';
                                                                            break; 
                                                                     default:
                                                                         this.prefix='';} 

                                                            }           
            FilterView.prototype.prepare = function(field,val)
            { 

                switch(field){
                    case 'cnt':
                        result = '('+(this.show_prefix?this.prefix:'')+val+')';
                    break
                    
                    default:
                        result = val;
                }
                
                return result; 
            
            }
            FilterView.prototype.initObserve = function(){
                var self = this;

                this.model.sub('view:state:change',function(topic,state){ self.setState(state) });
                this.model.sub('view:cnt:change',function(topic,cnt){ self.dataFill({cnt:cnt}) });
                this.model.sub('filter:checked',function(topic,checked){ self.setChecked(checked) });
                
                this.model.sub('group:selected',function(topic,data){ self.show_prefix=true;if(data) self.dataFill(data); });
                this.model.sub('group:unselected',function(topic,data){ self.show_prefix=false;if(data) self.dataFill(data); });                 
            }             

            FilterView.prototype.setState = function(state){
            	if(state=='active')  
            		{ this.dom_node.show(); } 
            	else 
            		{ this.dom_node.hide(); }
            	
            }

            FilterView.prototype.setChecked = function(checked){
            	
                if ( checked != this.checker.is(':checked') )
                    {
                       this.checker.prop('checked',checked); 
                    }
            	
            }

            FilterView.prototype.setEvents = function()
            {
                var self = this;
                this.checker.click(function(){ self.model.pub('view:filter:checked',self.checker.is(':checked')) });
            }
            //==============================
        return { 
                 Manager:Manager
               }    
   
    
}());



jQuery(function(){

    var params = {selectors:{groups:'.qf-groups',
                             filters:'#qf-filters',
                             group_tpl:'#qf-group-tpl',
                             filter_tpl:'#qf-filter-tpl',
                             filters_group_tpl:'#qf-filters-group-tpl',
                             main_container:'.quick-filtr-box',
                             main_container_closer:'.clos,.close',
                             choose_n_go:'.button_orng',
                             show_hide:'.more-filtr>span',
                             reset:'.clean'
                            },
                 groups_per_col:16,
                 amount_scroll:16
                };
    var data = {};
    
    var qfm = new qf.Manager(params,window.qfdata);
    //console.log(qfm);

})


