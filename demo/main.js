$(document).ready(function() {
  $form = $('#example-form');

  $form.on('submit', function() {
    $(this).find(':input').each(function(){
      $(this).removeClass('hasError')
        .next().text('');
    });

    return $(this).validateMe({
      assertions : {
        first_name : ['isNonEmpty', 'isAlphaNum'],
        last_name  : ['isNonEmpty', 'isAlphaNum'],
        message    : ['lengthIsGreaterThan-10'],
        email      : ['isEmail']
      },
      onAssertionFail : function($field, msg) {
        if(!$field.hasClass('hasError')) {
          $field.addClass('hasError');
          $field.next().text(msg);
        }
      }
    });
  });
});
