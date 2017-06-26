
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

//Animation Config
document.addEventListener('DOMContentLoaded', function() {

    // Define a blank array for the effect positions. This will be populated based on width of the title.
    var emptyArr = [];
    // Define a size array, this will be used to vary bubble sizes
    var bubbleSizeArr = [4,6,8,10];
    //Animation delay.
    var delay = 3000;
    //Bubbles length. How high bubbles should go. More percentage means more height
    var bLength = '100%';

    // Push the header width values to emptyArr
    for (var i = 0; i < $('#bubbly_text').width(); i++) {
        emptyArr.push(i);
    }

    // Function to select random array element
    // Used within the setInterval a few times
    function randomValue(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    // setInterval function used to create new bubble every 350 milliseconds
    setInterval(function(){

        // Get a random size, defined as variable so it can be used for both width and height
        var size = randomValue(bubbleSizeArr);
        // New bubble appended to div with it's size and left position being set inline
        // Left value is set through getting a random value from emptyArr
        $('#bubbly_text').append('<div class="bubble" style="left: ' + randomValue(emptyArr) + 'px; width: ' + size + 'px; height:' + size + 'px;"></div>');

        // Animate each bubble to the top (bottom 100%) and reduce opacity as it moves
        // Callback function used to remove finished animations from the page
        $('.bubble').animate({
                'bottom': bLength,
                'opacity' : '-=0.7'
            }, delay, function(){
                $(this).remove()
            }
        );
    }, 350);

});