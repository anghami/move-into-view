(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * Package: move-into-view
 *
 * Decription: Move element inside of its parent with
 * configurable ratio.
 *
 * License MIT 2017 Svetlana Linuxenko
 */

/**
 * Finds element parent nodes
 *
 * @name parentsOf
 * @function
 * @access private
 * @param {Element} target HTML Element
 * @param {Function} isParent(element)
 * @returns {Element} Parent node
 */
function _parentsOf(target, isParent) {
    var parent = target.parentElement;
    var wrapper = parent;
    
    function hasParentAttributes(element) {
        var CSS = window.getComputedStyle(element);
        return ['overflow', 'overflowX', 'overflowY']
        .some(function(attr) {
              return CSS[attr] === 'hidden';
              });
    }
    
    if (typeof isParent !== 'function') {
        isParent = function() {
            return false;
        };
    }
    
    while (1) {
        if (isParent(parent) || hasParentAttributes(parent)) {
            return {
            parent: parent,
            wrapper: wrapper
            };
        }
        
        wrapper = parent;
        parent = parent.parentElement;
        
        if (!parent || parent.tagName === 'BODY') {
            return;
        }
    }
}

/**
 * Calculate wrapper's position based on an aspect ratio provided
 *
 * @name _position
 * @function
 * @access private
 * @param {Number} aspectX aspect x (default 0.5)
 * @param {Number} aspectY aspect y (default 0.5)
 * @returns {Object} Coordinates
 */
function _position(aspectX, aspectY) {
    aspectX = (typeof aspectX === 'undefined') ? 0.5 : aspectX;
    aspectY = (typeof aspectY === 'undefined') ? 0.5 : aspectY;
    
    var parent = this.parent.getBoundingClientRect();
    var wrapper = this.wrapper.getBoundingClientRect();
    var target = this.target.getBoundingClientRect();
    
    var x = 1 + ~wrapper.left + target.left + (target.width * aspectX) - (parent.width * aspectX);
    var y = 1 + ~wrapper.top + target.top + (target.height * aspectY) - parent.height * aspectY;
    
    if (x < 0) x = 0;
    if ((wrapper.width - x) < parent.width) x = wrapper.width - parent.width;
    
    if (y < 0) y = 0;
    if ((wrapper.height - y) < parent.height) y = wrapper.height - parent.height;
    
    return {
    x: x,
    y: y
    };
}

/**
 * Applying elements position
 *
 * @name _move
 * @function
 * @access private
 * @param {String} dir Direction
 * @param {Number} aspectX
 * @param {Number} aspectY
 */
function _move(dir, aspect) {
    var position = this.position(aspect, aspect);
    if (dir === "x" || dir === "both") {
        // this.wrapper.style.left = position.x * -1 + "px";
        this.wrapper.style.transform =
        "translate(" +
        -((position.x * 100) / this.wrapper.clientWidth) +
        "%,0) scale(1.0, 1.0)";
        this.wrapper.style.transition = "transform 100ms";
        
        this.wrapper.style.webkitTransform =
        "translate(" +
        -((position.x * 100) / this.wrapper.clientWidth) +
        "%,0) scale(1.0, 1.0)";
        this.wrapper.style.webkitTransition = "-webkit-transform 100ms";
        
        this.wrapper.style.mozTransform =
        "translate(" +
        -((position.x * 100) / this.wrapper.clientWidth) +
        "%,0) scale(1.0, 1.0)";
        this.wrapper.style.mozTransition = "-moz-transform 100ms";
        
        this.wrapper.style.msTransform =
        "translate(" +
        -((position.x * 100) / this.wrapper.clientWidth) +
        "%,0) scale(1.0, 1.0)";
        this.wrapper.style.msTransition = "-ms-transform 100ms";
        
        this.wrapper.style.webkitBackfaceVisibility = "hidden";
    }
    
    if (dir === "y" || dir === "both") {
        // this.wrapper.style.top = position.y * -1 + "px";
        this.wrapper.style.transform =
        "translate(0," +
        -((position.y * 100) / this.wrapper.clientHeight) +
        "%) scale(1.0, 1.0)";
        this.wrapper.style.transition = "transform 100ms ";
        
        this.wrapper.style.webkitTransform =
        "translate(0," +
        -((position.y * 100) / this.wrapper.clientHeight) +
        "%) scale(1.0, 1.0)";
        this.wrapper.style.webkitTransition = "-webkit-transform 100ms ";
        
        this.wrapper.style.mozTransform =
        "translate(0," +
        -((position.y * 100) / this.wrapper.clientHeight) +
        "%) scale(1.0, 1.0)";
        this.wrapper.style.mozTransition = "-moz-transform 100ms";
        
        this.wrapper.style.msTransform =
        "translate(0," +
        -((position.y * 100) / this.wrapper.clientHeight) +
        "%) scale(1.0, 1.0)";
        this.wrapper.style.msTransition = "-ms-transform 100ms";
        
        this.wrapper.style.webkitBackfaceVisibility = "hidden";
    }
    
    return this;
}

/**
 * Move specified target inside of a view (relative elements)
 *
 * @name MoveIntoView
 * @function
 * @access public
 * @param {Element} target Target element
 * @param {Object} options Options such as isParent()
 * validation fn or noreset (do not reset scroll values)
 * @returns {Object} view
 */
function MoveIntoView(target, options) {
    target = target || this;
    options = options || {};
    var parents = _parentsOf(target, options.isParent);
    
    if (!options.noreset) {
        parents.parent.scrollTop = 0;
        parents.parent.scrollLeft = 0;
        parents.wrapper.scrollTop = 0;
        parents.wrapper.scrollLeft = 0;
    }
    
    var view = {
    target: target,
    wrapper: parents.wrapper,
    parent: parents.parent,
    position: _position,
    move: {}
    };
    
    view.move.x = _move.bind(view, 'x');
    view.move.y = _move.bind(view, 'y');
    view.move.both = _move.bind(view, 'both');
    
    return view;
}

module.exports = MoveIntoView;

},{}],2:[function(require,module,exports){
var MoveIntoView = require('./');

/**
 * Shim of the Element.moveIntoView, such as scrollIntoView
 *
 * @name moveIntoView
 * @function
 * @access public
 * @param {Object} options Aspect ratios for any of dimensions x or y or both { x: 0, y: 0.9 }
 */
window.Element.prototype.moveIntoView = function (options) {
  options = options || {};

  var view = MoveIntoView(this);

  if ('x' in options) {
    view.move.x(options.x);
  } else if ('y' in options) {
    view.move.y(options.y);
  } else {
    view.move.both();
  }
};

},{"./":1}]},{},[2]);
