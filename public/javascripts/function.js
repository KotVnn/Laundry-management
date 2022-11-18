let currentPoint;
const totalSum = parseInt($('#total').val());
const discountSum = parseInt($('#discount').val());
if ($('#total').val() && parseInt($('#total').val()) > 1) {
  currentPoint = $('#point').val() - $('#total').val() / 10;
} else {
  currentPoint = $('#point').val();
}
$('#total').on('keyup', () => {
  let total = $('#total').val();
  if (!total) total = 0;
  const point = (parseInt(currentPoint) + total / 10).toFixed();
  $('#point').val(point);
  if (total > 10) $('#usePoint').removeAttr('disabled');
  else $('#usePoint').attr('disabled', true);
});

const allTimeText = $('.timeText');
for (const timeText of allTimeText) {
  const date = $(timeText).text();
  const text = new Date(date).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  $(timeText).text(text);
}

const allNumText = $('.number');
for (const num of allNumText) {
  const arrText = $(num).text().split(' ');
  let i = 0;
  for (const el of arrText) {
    if (!isNaN(el) && el.length > 3) {
      arrText[i] = numberWithCommas(parseInt(el)) + 'đ';
    }
    i++;
  }
  $(num).text(arrText.join(' '));
}

$('#discount').on('keyup', () => {
  const total = $('#total');
  const point = $('#point');
  const discount = $('#discount');
  total.val(totalSum - discount.val());
  point.val(currentPoint - discount.val() + parseInt($('#total').val() / 10));
});

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
