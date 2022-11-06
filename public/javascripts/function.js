$('#total').on('keyup', () => {
  const total = $('#total').val();
  $('#point').val(total / 10);
});
