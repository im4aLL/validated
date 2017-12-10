'use strict';

/**
 * Form validation
 * Laravel like form validation
 *
 * @version  1.0.0
 * @author  me@habibhadi.com
 * @usage commercial
 */

/**
 * Constructor
 */
function Validate(){
    this.form = '';
    this.rules = {};
    this.data = {};
    this.errors = [];
}

/**
 * Main form dom element
 *
 * @param id or class
 */
Validate.prototype.setFrom = function(selector) {
    this.form = selector;

    return this;
};

/**
 * Rules
 *
 * @param json
 */
Validate.prototype.setRules = function(rules) {
    this.rules = rules;

    return this;
};

/**
 * if validation pass
 *
 * @return boolean
 */
Validate.prototype.passed = function() {
    var vm = this;

    var rules = vm._getRules();

    $(vm.form).find('.is--error').removeClass('is--error');

    _.each(rules, function(ruleArray, key){
        _.each(ruleArray, function(rule){
            vm._check(rule, key);
        });
    });

    return _.size(vm.getErrors()) === 0;
};

/**
 * Show respective errors
 *
 * @return this;
 */
Validate.prototype.showErrors = function() {
    var vm = this;
    var errors = vm.getErrors();

    if(_.size(errors) > 0) {
        _.each(errors, function(fieldName){
            var $field = $('[name="'+ fieldName +'"]');

            if($field.length > 0) {
                $field.closest('.form__field').addClass('is--error');
            }
        });
    }

    return vm;
};

/**
 * Get form data
 *
 * @return object
 */
Validate.prototype.getData = function() {
    return _.pickBy(this.data, function(value, key) { return !key.startsWith('_'); });
};

/**
 * Readable rules
 *
 * @return object
 */
Validate.prototype._getRules = function() {
    var vm = this;

    var result = {};

    _.each(vm.rules, function(rule, key){
        var arr = rule.split('|');

        result[key] = arr;
    });

    return result;
};

/**
 * Get erros
 * @return array
 */
Validate.prototype.getErrors = function() {
    var vm = this;

    return vm.errors.filter(function(item, pos) {
        return vm.errors.indexOf(item) == pos;
    })
};

/**
 * Checking for validation
 *
 * @param rule array
 * @param key string
 * @return this
 */
Validate.prototype._check = function(rule, key) {
    var vm = this;

    if(rule === 'required') {
        vm._checkMethodRequired(rule, key);
    }
    else if(rule === 'email') {
        vm._checkMethodEmail(rule, key);
    }
    else if(rule.startsWith('min')) {
        vm._checkMethodMinLength(rule, key);
    }
    else if(rule.startsWith('same')) {
        vm._checkMethodSame(rule, key);
    }

    return vm;
};

/**
 * Required validation
 *
 * @param rule array
 * @param key string
 * @return this
 */
Validate.prototype._checkMethodRequired = function(rule, key) {
    var vm = this;
    var $field = $('[name="'+ key +'"]');

    if($field.length > 0) {
        var value = $field.val();

        if($.trim(value).length > 0) {
            vm.data[key] = value;
        }
        else {
            vm.errors.push(key);
        }
    }
    else {
        vm.errors.push(key);
    }
};

/**
 * Email validation
 *
 * @param rule array
 * @param key string
 * @return this
 */
Validate.prototype._checkMethodEmail = function(rule, key) {
    var vm = this;
    var $field = $('[name="'+ key +'"]');

    if($field.length > 0) {
        var value = $field.val();
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if(re.test(value)) {
            vm.data[key] = value;
        }
        else {
            vm.errors.push(key);
        }
    }
    else {
        vm.errors.push(key);
    }
};

/**
 * Min length validation
 *
 * @param rule array
 * @param key string
 * @return this
 */
Validate.prototype._checkMethodMinLength = function(rule, key) {
    var vm = this;
    var $field = $('[name="'+ key +'"]');

    if($field.length > 0) {
        var value = $field.val();
        var ruleArray = rule.split(':');
        var minLength = ruleArray[1] || 999999;

        if($.trim(value).length >= minLength) {
            vm.data[key] = value;
        }
        else {
            vm.errors.push(key);
        }
    }
    else {
        vm.errors.push(key);
    }
};

/**
 * Same as other field validation
 *
 * @param rule array
 * @param key string
 * @return this
 */
Validate.prototype._checkMethodSame = function(rule, key) {
    var vm = this;
    var $field = $('[name="'+ key +'"]');

    if($field.length > 0) {
        var value = $field.val();
        var ruleArray = rule.split(':');
        var matchedValue = $('[name="' + ruleArray[1] + '"]').length > 0 ? $('[name="' + ruleArray[1] + '"]').val() : null;

        if($.trim(value) == matchedValue) {
            vm.data[key] = value;
        }
        else {
            vm.errors.push(key);
        }
    }
    else {
        vm.errors.push(key);
    }
};

module.exports = Validate;
