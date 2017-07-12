
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
        if( e.type.toLowerCase() === 'animationstart' ){
            animStarted.push( e.animationName );
        }
        if ( e.type.toLowerCase() === 'animationend' ) {
            animEnded.push( e.animationName );
            if( animStarted.length === animEnded.length ){
                this.onAnimationFinished();
            }
        }
    };

    /** On all animations finished */
    this.onAnimationFinished = function(){
        if( !this.isPaused ){
            this.iteration++;
            if( this.iteration === 1 ){
                this.log('onAnimationFinished');
                this.addClass(document.body, 'vba-state-paused');                
                setTimeout(function(){
                    self.addClass(document.body, 'vba-reverse');
                    self.removeClass(document.body, 'vba-state-paused');                    
                    self.isPaused = false;
                }, this.options.delay);
                this.isPaused = true;
            }
        }
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

$(document).ready(function() {

    var delay = 3000;

    setTimeout(function () {
        $(".title").css('opacity', '1').lettering();
        animation();
    }, delay);

});

function animation() {
    var title1 = new TimelineMax();
    title1.to(".button", 0, {visibility: 'hidden', opacity: 0});
    title1.staggerFromTo(".title span", 0.5,
        {ease: Back.easeOut.config(1.7), opacity: 0, bottom: -80},
        {ease: Back.easeOut.config(1.7), opacity: 1, bottom: 0}, 0.05);
    title1.to(".button", 0.2, {visibility: 'visible' ,opacity: 1})
}
