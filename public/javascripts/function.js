const currentPoint = $('#point').val();
$('#total').on('keyup', () => {
  let total = $('#total').val();
  if (!total) total = 0;
  const point = parseInt(currentPoint) + total / 10;
  console.log(point);
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

$('#usePoint').change(function () {
  const total = $('#total');
  const point = $('#point');
  const discount = $('#discount');
  if (this.checked) {
    total.val(total.val() - currentPoint);
    discount.val(currentPoint);
    point.val(total.val() / 10);
  } else {
    total.val(parseInt(total.val()) + parseInt(discount.val()));
    discount.val(0);
    point.val(parseInt(currentPoint) + total.val() / 10);
  }
});

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
