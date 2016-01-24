## jquery.validate-me.js

This is jQuery plugin to validate form data. This is an early version, so it is proposed not to use it in a production environment.

## Code Example

Here's an example form:

```html
<form id="example-form" class="form-horizontal">
  <fieldset>

  <legend>Test form</legend>

  <div class="form-group">
    <label class="col-md-4 control-label" for="textinput">First name</label>
    <div class="col-md-4">
      <input name="first_name" placeholder="" class="form-control input-md" type="text">
      <span class="help-block" style="color:red;"></span>
    </div>
  </div>

  <div class="form-group">
    <label class="col-md-4 control-label" for="textinput">Last name</label>
    <div class="col-md-4">
      <input name="last_name" placeholder="" class="form-control input-md" type="text">
      <span class="help-block" style="color:red;"></span>
    </div>
  </div>

  <div class="form-group">
    <label class="col-md-4 control-label" for="textarea">Message</label>
    <div class="col-md-4">
      <textarea class="form-control" name="message"></textarea>
      <span class="help-block assert-msg" style="color:red;"></span>
    </div>
  </div>

  <div class="form-group">
    <label class="col-md-4 control-label" for="textinput">Email</label>
    <div class="col-md-4">
    <input name="email" placeholder="" class="form-control input-md" type="text">
    <span class="help-block assert-msg" style="color:red;"></span>
    </div>
  </div>

  <div class="form-group">
    <label class="col-md-4 control-label" for="textinput"></label>
    <div class="col-md-4">
      <button name="submit-button" class="btn btn-primary">Submit</button>
    </div>
  </div>

  </fieldset>
</form>

```

For example, we want to:
- 'first_name' - field can not be empty and can not contain special characters
- 'last_name' - field can not be empty and can not contain special characters
- 'message' - must have at least 10 characters
- 'email' - field can not be empty and must contain a valid email address

Here is an example, how to use it:

```javascript

$(document).ready(function() {
  $form = $('#example-form');

  $form.on('submit', function() {
    return $(this).validateMe({
      assertions : {
        first_name : ['isNonEmpty', 'isAlphaNum'],
        last_name  : ['isNonEmpty', 'isAlphaNum'],
        message    : ['lengthIsGreaterThan-10'],
        email      : ['isEmail']
      },
      onAssertionFail : function($field, msg) {
        if(!$field.hasClass('hasError')) {
          // add 'hasError' class to ever field with errors
          // add pass error message to next DOM element (span)
          $field.addClass('hasError');
          $field.next().text(msg);
        }
      }
    });
  });
});

```

## How to?

To use this plugin, call `.validateMe()` method on jQuery form object and
pass `options` object that contains assertions:

```javascript

assertions: {
  field_name : [assertions ...]
}

```
and a function  `onAssertionFail($field, msg)` that calls for each element that does not pass the assertion.
For example:

```javascript
onAssertionFail : function($field, msg) {
  // check if $field has already error class
  if(!$field.hasClass('hasError')) {
    // add 'hasError' class to ever field with errors
    $field.addClass('hasError');
    // show error message in next field
    $field.next().text(msg);
  }
}
```

## Possible assertions

For now possible assertions are:
- isNonEmpty - field can not be empty
- isNumber - field must contains only numbers
- isAlphaNum - field can not contains special characters
- isEmail - field value must be a valid email address
- lengthIsGreaterThan-X - field value length must be greater or equal than X (for example lengthIsGreaterThan-10)
- lengthIsLessThan-X - field value length must be less or equal than X (for example lengthIsLessThan-4)
- lengthIsEqualTo-X - field value length must be equal to X (form example lengthIsEqualTo-X)

## Warning

For now all assertion message are in Polish, but in future releases this will change
