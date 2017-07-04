
var VBAnimationTemplateLib = function( options ){

    var self = this,
        pfx = ['webkit', 'moz', 'MS', 'o', ''],
        animStarted = [],
        animEnded = [];
    this.options = {
        runOnReady: false,
        logging: false,
        elements: [],
        delay: 0
    };
    this.isPaused = false;
    this.iteration = 0;
    this.iterationStarted = false;

    /** Initialize */
    this.init = function(){

        this.extend( this.options, options );

        if( this.options.runOnReady ){
            this.onReady(this.run.bind(this));
        }
    };

    /** Run */
    this.run = function(){
        this.log( 'OPTIONS', this.options );
        animStarted = [];
        animEnded = [];
        this.options.elements.forEach(function(selector){
            var element = document.querySelector(selector);
            if( element ){
                self.prefixedEvent(element, 'AnimationStart', self.animationListener.bind(self), false);
                self.prefixedEvent(element, 'AnimationIteration', self.animationListener.bind(self), false);
                self.prefixedEvent(element, 'AnimationEnd', self.animationListener.bind(self), false);
            }
        });
    };

    /** Extend */
    this.extend = function(out) {
        out = out || {};
        for (var i = 1; i < arguments.length; i++) {
            if (!arguments[i])
                continue;
            for (var key in arguments[i]) {
                if (arguments[i].hasOwnProperty(key))
                    out[key] = arguments[i][key];
            }
        }
        return out;
    };

    /** On ready */
    this.onReady = function(fn) {
        if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    };

    /** Apply prefixed event handlers */
    this.prefixedEvent = function(element, type, callback){
        for (var p = 0; p < pfx.length; p++) {
            if (!pfx[p]) type = type.toLowerCase();
            element.addEventListener(pfx[p]+type, callback, false);
        }
    };

    /** Handle animation events */
    this.animationListener = function(e) {
        this.log('ANIMATION "' + e.animationName + '" type "' + e.type + '" at ' + e.elapsedTime.toFixed(2) + ' seconds');
        if( e.type.toLowerCase().indexOf('animationstart') > -1 ){
            animStarted.push( e.animationName );
        }
        if( e.type.toLowerCase().indexOf('animationiteration') > -1 ){
            if( !this.iterationStarted ){
                //this.onAnimationIterationStartPause();
            }
        }
        if ( e.type.toLowerCase().indexOf('animationend') > -1 ) {
            animEnded.push( e.animationName );
            if( animStarted.length === animEnded.length ){
                this.onAnimationFinishedPause();
            }
        }
    };

    /** On all animations finished */
    this.onAnimationFinishedPause = function(){
        this.log('onAnimationFinished');
        this.iterationStarted = false;
        if( !this.isPaused ){
            this.iteration++;
            if( this.iteration === 1 ){
                self.addClass(document.body, 'vba-reverse');
                this.addClass(document.body, 'vba-state-stopped');
                setTimeout(function(){
                    self.removeClass(document.body, 'vba-state-stopped');
                    self.isPaused = false;
                }, this.options.delay);
                this.isPaused = true;
            }
        }
    };

    /**
     * On new iteration start
     */
    this.onAnimationIterationStartPause = function(){
        this.iterationStarted = true;
        this.log('ITERATION START');
        if( !this.isPaused ){
            this.iteration++;
            this.addClass(document.body, 'vba-state-paused');
            this.isPaused = true;
            setTimeout(function(){
                self.removeClass(document.body, 'vba-state-paused');
                self.isPaused = false;
                self.iterationStarted = false;
            }, this.options.delay);
        }
    };

    /**
     * Get style
     * @param el
     * @param styleProp
     * @returns {*}
     */
    this.getStyle = function(el, styleProp) {
        var value, defaultView = el.ownerDocument.defaultView;
        // W3C standard way:
        if (defaultView && defaultView.getComputedStyle) {
            // sanitize property name to css notation (hypen separated words eg. font-Size)
            styleProp = styleProp.replace(/([A-Z])/g, "-$1").toLowerCase();
            return defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
        } else if (el.currentStyle) { // IE
            // sanitize property name to camelCase
            styleProp = styleProp.replace(/\-(\w)/g, function(str, letter) {
                return letter.toUpperCase();
            });
            value = el.currentStyle[styleProp];
            // convert other units to pixels on IE
            if (/^\d+(em|pt|%|ex)?$/i.test(value)) {
                return (function(value) {
                    var oldLeft = el.style.left, oldRsLeft = el.runtimeStyle.left;
                    el.runtimeStyle.left = el.currentStyle.left;
                    el.style.left = value || 0;
                    value = el.style.pixelLeft + "px";
                    el.style.left = oldLeft;
                    el.runtimeStyle.left = oldRsLeft;
                    return value;
                })(value);
            }
            return value;
        }
    };

    /**
     * Reset
     */
    this.reset = function(){
        this.removeClass(document.body, 'vba-state-paused');
        this.removeClass(document.body, 'vba-reverse');
        animStarted = [];
        animEnded = [];
        this.iteration = 0;
        this.isPaused = false;
        this.iterationStarted = false;
    };

    /**
     * Animation play/pause toggle
     * @param pause
     * @param element
     */
    this.animationPauseToggle = function(pause, element){
        if( typeof element === 'undefined' ){
            element = document.body;
        }
        if( typeof pause === 'undefined' ){
            pause = element.className.indexOf('vba-state-paused') === -1;
        }
        if( pause ){
            this.addClass(element, 'vba-state-paused');
            this.isPaused = true;
        } else {
            this.removeClass(element, 'vba-state-paused');
            this.isPaused = false;
        }
    };

    /**
     * Restart animation
     */
    this.animationRestart = function(){
        this.reset();
        this.addClass(document.body, 'vba-state-stopped');
        setTimeout(function(){
            self.removeClass(document.body, 'vba-state-stopped');
        }, 1);
    };

    /** Add class */
    this.addClass = function(el, className){
        if (el.classList)
            el.classList.add(className);
        else
            el.className += ' ' + className;
    };

    /** Remove class */
    this.removeClass = function(el, className){
        if (el.classList)
            el.classList.remove(className);
        else
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    };

    /** logging */
    this.log = function(){
        if( this.options.logging ){
            for (var i = 0; i < arguments.length; i++) {
                console.log( arguments[i] );
            }
        }
    };

    this.init();
};
