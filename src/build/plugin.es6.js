/* globals $: false */
/* globals jQuery: false */
/* globals console: false */

(($) => {

  let validator = {}, assertDefs = {}, errors = [];

  validator.validate = validate;
  function validate(form, config) {
    let i, assert;

    errors.length = 0;

    for(i in form) {
      if(form.hasOwnProperty(i)) {
        if(!config[i]) {
          continue;
        }

        for(assert in config[i]) {
          if(!assertDefs[config[i][assert].split('-')[0]].check(form[i], config[i][assert].split('-')[1])) {
            errors.push({
              field : i,
              msg   : (() => {
                if(typeof config[i][assert].split('-')[1] !== 'undefined') {
                  return assertDefs[config[i][assert].split('-')[0]].message(config[i][assert].split('-')[1]);
                } else {
                  return assertDefs[config[i][assert]].message;
                }
              })()
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
  $.fn.validateMe = function(options) {

    let $form = this, $formVisible = $form.find(":input:not(:hidden)"),
        fields_map = {},
        config = $.extend({
          assertions  : {
            // assertions
          },
          onAssertionFail($field, msg) {
            $field.addClass('hasError');
            console.log('Assertion failed on ' + $field + ', with msg: ' + msg);
          }
        }, options);

    // fill fields_map
    $formVisible.serializeArray().forEach(field => {
      fields_map[field.name] = field.value;
    });

    // validate form
    if(validator.validate(fields_map, config.assertions)) {
      errors.forEach(error => {
        let form_input = $form.find('[name="' + error.field + '"]');
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
    check : value => {
      return value !== '';
    },
    message : 'pole nie może być puste'
  };

  assertDefs.isNumber = {
    check : value => {
      return !isNaN(value);
    },
    message : 'wartość musi być liczbą'
  };

  assertDefs.isAlphaNum = {
    check : value => {
      let pattern = /[^a-z0-9]/i;
      return !pattern.test(value);
    },
    message : 'pole może nie może zawierać znaków specjalnych'
  };

  assertDefs.isEmail = {
    check : value => {
      let pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return pattern.test(value);
    },
    message : 'pole musi zawierać prawidłowy adres email'
  };

  assertDefs.lengthIsGreaterThan = {
    check : (value, length) => {
      return value.length >= parseInt(length);
    },
    message : (length) => {
      return 'wartość nie może być mniejsza niż ' + length;
    }
  };

  assertDefs.lengthIsLessThan = {
    check : (value, length) => {
      return value.length <= parseInt(length);
    },
    message : (length) => {
      return 'wartość nie może być większa niż ' + length;
    }
  };

  assertDefs.lengthIsEqualTo = {
    check : (value, length) => {
      return value.length === parseInt(length);
    },
    message : (length) => {
      return 'wartość musi mieć dokładnie ' + length + ' znaków';
    }
  };

})(jQuery);
