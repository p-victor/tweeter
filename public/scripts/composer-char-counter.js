$(document).ready(() => {
  const maxChar = 140;
  let charLeft = 0;

  $('.new-tweet > form > textarea ').on('input', function () {
    let counter = $(this).parent().children('span');
    charLeft = maxChar - $(this).val().length;
    let color = charLeft < 0 ? 'red' : '#545149';
    counter.text(charLeft)
    counter.css({color: color});
  });
});