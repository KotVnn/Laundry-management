let currentPoint;
const pointCal = $('#pointCal').val() / 100;
let totalSum = parseInt($('#total').val());
if ($('#total').val() && parseInt($('#total').val()) > 1) {
  currentPoint = $('#point').val() - $('#total').val() * pointCal;
} else {
  currentPoint = $('#point').val();
}
$('#total').on('keyup', () => {
  let total = $('#total').val();
  if (!total) total = 0;
  const point = (parseInt(currentPoint) + total * pointCal).toFixed();
  totalSum = parseInt(total);
  $('#point').val(point);
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
  if (parseInt(discount.val()) > currentPoint) discount.val(currentPoint);
  total.val(totalSum - discount.val());
  point.val(
    currentPoint - discount.val() + parseInt($('#total').val() * pointCal),
  );
});

$('#phone').bind('paste', () => {
  $('#phone').val(
    $('#phone')
      .val()
      .replace(/[ .+:?\\/*!@#$%^&()-]/g, '')
      .trim(),
  );
});

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
