'use strict';

var Validate = require('./_validate.js');

function FormRegistration(){
    this.form = '#form-register';
    this.rules = {
        'name': 'required',
        'email': 'required|email',
        'password': 'required|min:6',
        '_confirmpassword': 'required|same:password'
    };
}

FormRegistration.prototype.init = function() {
    if($(this.form).length > 0) {
        this.submitHandler();
    }
};

FormRegistration.prototype.submitHandler = function() {
    var vm = this;

    $(vm.form).submit(function(event) {
        event.preventDefault();

        var validate = new Validate();
        validate.setFrom(vm.form).setRules(vm.rules);

        if(validate.passed()) {
            vm.sent(validate.getData());
        }
        else {
           validate.showErrors();
        }
    });
};

FormRegistration.prototype.sent = function(data) {
    console.log(data);
};

module.exports = function(){
    var formRegistration = new FormRegistration();
    formRegistration.init();
};
