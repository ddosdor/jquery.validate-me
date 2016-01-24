'use strict';

/* globals $: false */
/* globals jQuery: false */
/* globals console: false */

(function ($) {

  var validator = {},
      assertDefs = {},
      errors = [];

  validator.validate = validate;
  function validate(form, config) {
    var i = undefined,
        assert = undefined;

    errors.length = 0;

    for (i in form) {
      if (form.hasOwnProperty(i)) {
        if (!config[i]) {
          continue;
        }

        for (assert in config[i]) {
          if (!assertDefs[config[i][assert].split('-')[0]].check(form[i], config[i][assert].split('-')[1])) {
            errors.push({
              field: i,
              msg: function () {
                if (typeof config[i][assert].split('-')[1] !== 'undefined') {
                  return assertDefs[config[i][assert].split('-')[0]].message(config[i][assert].split('-')[1]);
                } else {
                  return assertDefs[config[i][assert]].message;
                }
              }()
            });
          }
        }
      }
    }

    return errors.length !== 0;
  }

  // ----------------------------------------------
  ////////// jQuery PLUGIN
  // ----------------------------------------------
  $.fn.validateMe = function (options) {

    var $form = this,
        $formVisible = $form.find(":input:not(:hidden)"),
        fields_map = {},
        config = $.extend({
      assertions: {
        // assertions
      },
      onAssertionFail: function onAssertionFail($field, msg) {
        $field.addClass('hasError');
        console.log('Assertion failed on ' + $field + ', with msg: ' + msg);
      }
    }, options);

    // fill fields_map
    $formVisible.serializeArray().forEach(function (field) {
      fields_map[field.name] = field.value;
    });

    // validate form
    if (validator.validate(fields_map, config.assertions)) {
      errors.forEach(function (error) {
        var form_input = $form.find('[name="' + error.field + '"]');
        config.onAssertionFail(form_input, error.msg);
      });

      return false;
    } else {
      return true;
    }
  };

  // ---------------------------------------------
  ////////// ALL ASSERTS DEFINITIONS
  // ---------------------------------------------

  assertDefs.isNonEmpty = {
    check: function check(value) {
      return value !== '';
    },
    message: 'pole nie może być puste'
  };

  assertDefs.isNumber = {
    check: function check(value) {
      return !isNaN(value);
    },
    message: 'wartość musi być liczbą'
  };

  assertDefs.isAlphaNum = {
    check: function check(value) {
      var pattern = /[^a-z0-9]/i;
      return !pattern.test(value);
    },
    message: 'pole może nie może zawierać znaków specjalnych'
  };

  assertDefs.isEmail = {
    check: function check(value) {
      var pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return pattern.test(value);
    },
    message: 'pole musi zawierać prawidłowy adres email'
  };

  assertDefs.lengthIsGreaterThan = {
    check: function check(value, length) {
      return value.length >= parseInt(length);
    },
    message: function message(length) {
      return 'wartość nie może być mniejsza niż ' + length;
    }
  };

  assertDefs.lengthIsLessThan = {
    check: function check(value, length) {
      return value.length <= parseInt(length);
    },
    message: function message(length) {
      return 'wartość nie może być większa niż ' + length;
    }
  };

  assertDefs.lengthIsEqualTo = {
    check: function check(value, length) {
      return value.length === parseInt(length);
    },
    message: function message(length) {
      return 'wartość musi mieć dokładnie ' + length + ' znaków';
    }
  };
})(jQuery);