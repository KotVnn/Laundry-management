$('#total').on('keyup', () => {
  const total = $('#total').val();
  $('#point').val(total / 10);
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
  console.log(arrText);
  $(num).text(arrText.join(' '));
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
