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
document.addEventListener('DOMContentLoaded', function () {

    var delay = 2000; /* delay */

// Replaces the element text with an array of spans
// and returns it
    function splitTextInSpans(elem) {
        var letters = elem.textContent.split('');
        elem.innerHTML = '';
        return letters.map(function (letter) {
            var span = document.createElement('span');
            span.textContent = letter;
            elem.appendChild(span);
            return span;
        });
    }

    function intro() {
        function animateLogo(tl) {
            var maxWindowSize = Math.max(window.innerHeight, window.innerWidth);

            var squareDarkWrapper = document.querySelector('.square-dark-wrapper');
            var squareDark = squareDarkWrapper.querySelector('.square-dark');

            var square = document.querySelector('.square-wrapper');
            var lines = square.querySelectorAll('.line');

            var sparks = document.querySelectorAll('.spark');
            var outerCircle = document.querySelector('.outer-logo-circle .circle');
            var logo = document.querySelector('.logo');

            tl.set(squareDark, {
                height: maxWindowSize,
                width: maxWindowSize
            }).set(lines, {scaleX: 0});

            _.forEach(lines, function (line, i) {
                tl.to(lines[i], 2, {
                    scaleX: 1,
                    ease: 'Expo.easeOut'
                }, i / 10);
            });

            tl.to(lines, .05, {
                opacity: 0
            }, 1).to(squareDarkWrapper, 1.5, {
                scale: 1.4,
                ease: 'Expo.easeOut'
            }, 1).to(square, 2, {
                rotationZ: 45,
                ease: 'Expo.easeOut'
            }, 1.5).to(sparks, 1, {
                strokeDashoffset: 0,
                ease: 'Expo.easeOut'
            }, 1.5).to(sparks, 1, {
                strokeDashoffset: 145,
                ease: 'Expo.easeOut'
            }, 1.5).to(outerCircle, 1.4, {
                strokeDashoffset: 0,
                ease: 'Expo.easeInOut'
            }, 1.7).to(outerCircle, .4, {
                opacity: 0,
                ease: 'Power4.easeOut'
            }, 2.7).to(logo, 1, {
                opacity: 1,
                scale: 1,
                ease: 'Power4.easeOut'
            }, 2.7);

            return tl;
        }

        function animateWords(tl) {
            var wordsWrapper = document.querySelector('.words');
            var words = wordsWrapper.querySelectorAll('.word');
            var lineSeparator = wordsWrapper.querySelector('.line-separator');

            tl.set(lineSeparator, {scaleX: 0}).to(lineSeparator, 1, {
                scaleX: 1,
                ease: 'Expo.easeOut'
            }, 3);

            _.forEach(words, function (word) {
                var spans = splitTextInSpans(word);
                _.forEach(spans, function (span, j) {
                    var tlWords = new TimelineMax();

                    tlWords.set(span, {y: span.clientHeight, opacity: 1});
                    var delay = (3 + Math.abs(spans.length / 2 - j) / 20).toFixed(2);
                    tlWords.to(span, 1.4, {
                        y: 0,
                        ease: 'Expo.easeOut'
                    }, delay);
                });
            });
            wordsWrapper.style.opacity = "1";
            return tl;
        }

        function animateBackground(tl) {
            var wrapper = document.querySelector('.bg-lines-wrapper');
            var createLines = function createLines(qty) {
                for (var i = 0; i < qty; i++) {
                    var line = document.createElement('div');
                    line.classList.add('line');
                    wrapper.appendChild(line);
                    tl.set(line, {
                        x: _.random(window.innerWidth),
                        y: _.random(window.innerHeight),
                        z: _.random(-200, 200),
                        width: _.random(0, 100) + 50,
                        scaleX: 0
                    });
                }
            };

            function animateLines(lines) {
                for (var _iterator = lines, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator](); ;) {
                    var _ref;

                    if (_isArray) {
                        if (_i >= _iterator.length) break;
                        _ref = _iterator[_i++];
                    } else {
                        _i = _iterator.next();
                        if (_i.done) break;
                        _ref = _i.value;
                    }

                    var line = _ref;

                    var startTime = _.random(5, true);
                    tl.to(line, .4, {
                        scaleX: 1,
                        ease: 'Expo.Power4'
                    }, startTime).to(line, 2, {
                        scaleX: 0,
                        x: '+=' + line.style.width,
                        ease: 'Power4.easeOut'
                    }, startTime + .4);
                }

                // 3d rotation
                var rotate = function rotate(rx, ry) {
                    TweenMax.to(wrapper, .75, {
                        rotationX: ry,
                        rotationY: rx,
                        ease: 'Power0.easenone'
                    });
                };

                // update rotation values
                function update(elem, event, tilt) {
                    if (tilt) {
                        var tiltLR = event.gamma;
                        var tiltFB = event.beta;
                        rotate(tiltLR / 1.5, tiltFB / 1.5);

                        return;
                    }

                    var xpos = event.layerX || event.offsetX;
                    var ypos = event.layerY || event.offsetY;

                    var ax = -(window.innerWidth / 2 - xpos) / 40;
                    var ay = (window.innerHeight / 2 - ypos) / 10;
                    rotate(ax, ay);
                }

                // get element for mousemove event tracking
                // on top of all other layers
                var trackerLayer = document.querySelector('.mouse-tracker-layer');
                trackerLayer.addEventListener('mousemove', function (e) {
                    return window.requestAnimationFrame(function () {
                        return update(wrapper, e);
                    });
                });

                if (window.DeviceOrientationEvent) {
                    window.addEventListener('deviceorientation', function (e) {
                        return window.requestAnimationFrame(function () {
                            return update(wrapper, e, true);
                        });
                    });
                }
            }

            createLines(50);
            animateLines(wrapper.querySelectorAll('.line'));
        }

        return {
            animateLogo: animateLogo,
            animateWords: animateWords,
            animateBackground: animateBackground
        };
    }

    /*intro().animateBackground(new TimelineMax({
     delay: 2.8,
     repeat: -1,
     repeatDelay: 0
     }))*/
    document.querySelector('.words').style.opacity = "0";
    setTimeout(function () {

        intro().animateLogo(new TimelineMax());
        intro().animateWords(new TimelineMax());
    }, delay);

});