var VBAnimationTemplateLib = function (options) {

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
    this.init = function () {

        this.extend(this.options, options);

        if (this.options.runOnReady) {
            this.onReady(this.run.bind(this));
        }
    };

    /** Run */
    this.run = function () {
        this.log('OPTIONS', this.options);
        animStarted = [];
        animEnded = [];
        this.options.elements.forEach(function (selector) {
            var element = document.querySelector(selector);
            if (element) {
                self.prefixedEvent(element, 'AnimationStart', self.animationListener.bind(self), false);
                self.prefixedEvent(element, 'AnimationIteration', self.animationListener.bind(self), false);
                self.prefixedEvent(element, 'AnimationEnd', self.animationListener.bind(self), false);
            }
        });
    };

    /** Extend */
    this.extend = function (out) {
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
    this.onReady = function (fn) {
        if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    };

    /** Apply prefixed event handlers */
    this.prefixedEvent = function (element, type, callback) {
        for (var p = 0; p < pfx.length; p++) {
            if (!pfx[p]) type = type.toLowerCase();
            element.addEventListener(pfx[p] + type, callback, false);
        }
    };

    /** Handle animation events */
    this.animationListener = function (e) {
        this.log('ANIMATION "' + e.animationName + '" type "' + e.type + '" at ' + e.elapsedTime.toFixed(2) + ' seconds');
        if (e.type.toLowerCase() === 'animationstart') {
            animStarted.push(e.animationName);
        }
        if (e.type.toLowerCase() === 'animationend') {
            animEnded.push(e.animationName);
            if (animStarted.length === animEnded.length) {
                this.onAnimationFinished();
            }
        }
    };

    /** On all animations finished */
    this.onAnimationFinished = function () {
        if (!this.isPaused) {
            this.iteration++;
            if (this.iteration === 1) {
                this.log('onAnimationFinished');
                this.addClass(document.body, 'vba-state-paused');
                setTimeout(function () {
                    self.addClass(document.body, 'vba-reverse');
                    self.removeClass(document.body, 'vba-state-paused');
                    self.isPaused = false;
                }, this.options.delay);
                this.isPaused = true;
            }
        }
    };

    /** Add class */
    this.addClass = function (el, className) {
        if (el.classList)
            el.classList.add(className);
        else
            el.className += ' ' + className;
    };

    /** Remove class */
    this.removeClass = function (el, className) {
        if (el.classList)
            el.classList.remove(className);
        else
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    };

    /** logging */
    this.log = function () {
        if (this.options.logging) {
            for (var i = 0; i < arguments.length; i++) {
                console.log(arguments[i]);
            }
        }
    };

    this.init();
};

/*Animation Config*/
(function(window) {

    // Helper vars and functions.
    function extend(a, b) {
        for(var key in b) {
            if( b.hasOwnProperty( key ) ) {
                a[key] = b[key];
            }
        }
        return a;
    }

    function createDOMEl(type, className, content) {
        var el = document.createElement(type);
        el.className = className || '';
        el.innerHTML = content || '';
        return el;
    }

    /**
     * RevealFx obj.
     */
    function RevealFx(el, options) {
        this.el = el;
        this.options = extend({}, this.options);
        extend(this.options, options);
        this._init();
    }

    /**
     * RevealFx options.
     */
    RevealFx.prototype.options = {
        // If true, then the content will be hidden until it´s "revealed".
        isContentHidden: true,
        // The animation/reveal settings. This can be set initially or passed when calling the reveal method.
        revealSettings: {
            // Animation direction: left right (lr) || right left (rl) || top bottom (tb) || bottom top (bt).
            direction: 'lr',
            // Revealer´s background color.
            bgcolor: '#f0f0f0',
            // Animation speed. This is the speed to "cover" and also "uncover" the element (seperately, not the total time).
            duration: 500,
            // Animation easing. This is the easing to "cover" and also "uncover" the element.
            easing: 'easeInOutQuint',
            // percentage-based value representing how much of the area should be left covered.
            coverArea: 0,
            // Callback for when the revealer is covering the element (halfway through of the whole animation).
            onCover: function(contentEl, revealerEl) { return false; },
            // Callback for when the animation starts (animation start).
            onStart: function(contentEl, revealerEl) { return false; },
            // Callback for when the revealer has completed uncovering (animation end).
            onComplete: function(contentEl, revealerEl) { return false; }
        }
    };

    /**
     * Init.
     */
    RevealFx.prototype._init = function() {
        this._layout();
    };

    /**
     * Build the necessary structure.
     */
    RevealFx.prototype._layout = function() {
        var position = getComputedStyle(this.el).position;
        if( position !== 'fixed' && position !== 'absolute' && position !== 'relative' ) {
            this.el.style.position = 'relative';
        }
        // Content element.
        this.content = createDOMEl('div', 'block-revealer__content', this.el.innerHTML);
        if( this.options.isContentHidden) {
            this.content.style.opacity = 0;
        }
        // Revealer element (the one that animates)
        this.revealer = createDOMEl('div', 'block-revealer__element');
        this.el.classList.add('block-revealer');
        this.el.innerHTML = '';
        this.el.appendChild(this.content);
        this.el.appendChild(this.revealer);
    };

    /**
     * Gets the revealer element´s transform and transform origin.
     */
    RevealFx.prototype._getTransformSettings = function(direction) {
        var val, origin, origin_2;

        switch (direction) {
            case 'lr' :
                val = 'scale3d(0,1,1)';
                origin = '0 50%';
                origin_2 = '100% 50%';
                break;
            case 'rl' :
                val = 'scale3d(0,1,1)';
                origin = '100% 50%';
                origin_2 = '0 50%';
                break;
            case 'tb' :
                val = 'scale3d(1,0,1)';
                origin = '50% 0';
                origin_2 = '50% 100%';
                break;
            case 'bt' :
                val = 'scale3d(1,0,1)';
                origin = '50% 100%';
                origin_2 = '50% 0';
                break;
            default :
                val = 'scale3d(0,1,1)';
                origin = '0 50%';
                origin_2 = '100% 50%';
                break;
        };

        return {
            // transform value.
            val: val,
            // initial and halfway/final transform origin.
            origin: {initial: origin, halfway: origin_2},
        };
    };

    /**
     * Reveal animation. If revealSettings is passed, then it will overwrite the options.revealSettings.
     */
    RevealFx.prototype.reveal = function(revealSettings) {
        // Do nothing if currently animating.
        if( this.isAnimating ) {
            return false;
        }
        this.isAnimating = true;

        // Set the revealer element´s transform and transform origin.
        var defaults = { // In case revealSettings is incomplete, its properties deafault to:
                duration: 500,
                easing: 'easeInOutQuint',
                delay: 0,
                bgcolor: '#f0f0f0',
                direction: 'lr',
                coverArea: 0
            },
            revealSettings = revealSettings || this.options.revealSettings,
            direction = revealSettings.direction || defaults.direction,
            transformSettings = this._getTransformSettings(direction);

        this.revealer.style.WebkitTransform = this.revealer.style.transform =  transformSettings.val;
        this.revealer.style.WebkitTransformOrigin = this.revealer.style.transformOrigin =  transformSettings.origin.initial;

        // Set the Revealer´s background color.
        this.revealer.style.backgroundColor = revealSettings.bgcolor || defaults.bgcolor;

        // Show it. By default the revealer element has opacity = 0 (CSS).
        this.revealer.style.opacity = 1;

        // Animate it.
        var self = this,
            // Second animation step.
            animationSettings_2 = {
                complete: function() {
                    self.isAnimating = false;
                    if( typeof revealSettings.onComplete === 'function' ) {
                        revealSettings.onComplete(self.content, self.revealer);
                    }
                }
            },
            // First animation step.
            animationSettings = {
                delay: revealSettings.delay || defaults.delay,
                complete: function() {
                    self.revealer.style.WebkitTransformOrigin = self.revealer.style.transformOrigin = transformSettings.origin.halfway;
                    if( typeof revealSettings.onCover === 'function' ) {
                        revealSettings.onCover(self.content, self.revealer);
                    }
                    anime(animationSettings_2);
                }
            };

        animationSettings.targets = animationSettings_2.targets = this.revealer;
        animationSettings.duration = animationSettings_2.duration = revealSettings.duration || defaults.duration;
        animationSettings.easing = animationSettings_2.easing = revealSettings.easing || defaults.easing;

        var coverArea = revealSettings.coverArea || defaults.coverArea;
        if( direction === 'lr' || direction === 'rl' ) {
            animationSettings.scaleX = [0,1];
            animationSettings_2.scaleX = [1,coverArea/100];
        }
        else {
            animationSettings.scaleY = [0,1];
            animationSettings_2.scaleY = [1,coverArea/100];
        }

        if( typeof revealSettings.onStart === 'function' ) {
            revealSettings.onStart(self.content, self.revealer);
        }
        anime(animationSettings);
    };

    window.RevealFx = RevealFx;

})(window);