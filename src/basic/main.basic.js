import { products } from './constants';

let $select, $addBtn, $cartDisplay, $cartTotal, $stockInfo;
let lastSelected;

function main() {
  const $root = document.getElementById('app');
  const $wrap = document.createElement('div');
  const $headingText = document.createElement('h1');

  $cartDisplay = document.createElement('div');
  $cartTotal = document.createElement('div');
  $select = document.createElement('select');
  $addBtn = document.createElement('button');
  $stockInfo = document.createElement('div');

  $cartDisplay.id = 'cart-items';
  $cartTotal.id = 'cart-total';
  $select.id = 'product-select';
  $addBtn.id = 'add-to-cart';
  $stockInfo.id = 'stock-status';

  $wrap.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8 mt-8';
  $headingText.className = 'text-2xl font-bold mb-4';
  $cartTotal.className = 'text-xl font-bold my-4';
  $select.className = 'border rounded p-2 mr-2';
  $addBtn.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  $stockInfo.className = 'text-sm text-gray-500 mt-2';

  $headingText.textContent = '장바구니';
  $addBtn.textContent = '추가';

  updateSelectOption();

  // 컴포넌트 생성
  $wrap.appendChild($headingText);
  $wrap.appendChild($cartDisplay);
  $wrap.appendChild($cartTotal);
  $wrap.appendChild($select);
  $wrap.appendChild($addBtn);
  $wrap.appendChild($stockInfo);
  $root.appendChild($wrap);

  calculateTotalPrice();

  setTimeout(function () {
    setInterval(function () {
      const luckyItem = products[Math.floor(Math.random() * products.length)];

      if (!luckyItem) {
        console.log();
      }

      if (Math.random() < 0.3 && luckyItem.quantity > 0) {
        luckyItem.price = Math.round(luckyItem.price * 0.8);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        updateSelectOption();
      }
    }, 30000);
  }, Math.random() * 10000);

  setTimeout(function () {
    setInterval(function () {
      if (lastSelected) {
        const suggest = products.find(function (item) {
          return item.id !== lastSelected && item.quantity > 0;
        });

        if (suggest) {
          alert(suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
          suggest.price = Math.round(suggest.price * 0.95);
          updateSelectOption();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

/** select option을 업데이트하는 함수 */
function updateSelectOption() {
  $select.innerHTML = '';
  products.forEach(function (item) {
    const $option = document.createElement('option');

    $option.value = item.id;
    $option.textContent = item.name + ' - ' + item.price + '원';

    if (item.quantity === 0) {
      $option.disabled = true;
    }
    $select.appendChild($option);
  });
}

/** 카트 아이템 총액 계산 */
function calculateTotalPrice() {
  let totalAmount = 0;
  let itemCount = 0;

  const cartItems = $cartDisplay.children;
  let subTotal = 0;

  for (let i = 0; i < cartItems.length; i++) {
    (function () {
      let currentItem;

      for (let j = 0; j < products.length; j++) {
        if (products[j].id === cartItems[i].id) {
          currentItem = products[j];
          break;
        }
      }

      const quantity = parseInt(cartItems[i].querySelector('span').textContent.split('x ')[1]);
      const itemTotalPrice = currentItem.price * quantity;

      let discount = 0;
      itemCount += quantity;
      subTotal += itemTotalPrice;

      if (quantity >= 10) {
        if (currentItem.id === 'p1') {
          discount = 0.1;
        } else if (currentItem.id === 'p2') {
          discount = 0.15;
        } else if (currentItem.id === 'p3') {
          discount = 0.2;
        } else if (currentItem.id === 'p4') {
          discount = 0.05;
        } else if (currentItem.id === 'p5') {
          discount = 0.25;
        }
      }

      totalAmount += itemTotalPrice * (1 - discount);
    })();
  }

  let discountRate = 0;

  if (itemCount >= 30) {
    const bulkDiscount = totalAmount * 0.25;
    const itemDiscount = subTotal - totalAmount;

    if (bulkDiscount > itemDiscount) {
      totalAmount = subTotal * (1 - 0.25);
      discountRate = 0.25;
    } else {
      discountRate = (subTotal - totalAmount) / subTotal;
    }
  } else {
    discountRate = (subTotal - totalAmount) / subTotal;
  }

  // 화요일 할인 적용
  if (new Date().getDay() === 2) {
    totalAmount *= 1 - 0.1;
    discountRate = Math.max(discountRate, 0.1);
  }

  $cartTotal.textContent = '총액: ' + Math.round(totalAmount) + '원';

  if (discountRate > 0) {
    const span = document.createElement('span');

    span.className = 'text-green-500 ml-2';
    span.textContent = '(' + (discountRate * 100).toFixed(1) + '% 할인 적용)';

    $cartTotal.appendChild(span);
  }

  updateStockInfo();
  renderBonusPoints(totalAmount);
}

/** 포인트 계산 및 출력 */
const renderBonusPoints = (totalAmount) => {
  const bonusPoint = Math.floor(totalAmount / 1000);
  let $pointsTag = document.getElementById('loyalty-points');

  if (!$pointsTag) {
    $pointsTag = document.createElement('span');
    $pointsTag.id = 'loyalty-points';
    $pointsTag.className = 'text-blue-500 ml-2';
    $cartTotal.appendChild($pointsTag);
  }

  $pointsTag.textContent = '(포인트: ' + bonusPoint + ')';
};

/** 재고 현황 출력 */
function updateStockInfo() {
  let infoMessage = '';

  products.forEach(function (item) {
    if (item.quantity < 5) {
      infoMessage +=
        item.name +
        ': ' +
        (item.quantity > 0 ? '재고 부족 (' + item.quantity + '개 남음)' : '품절') +
        '\n';
    }
  });
  $stockInfo.textContent = infoMessage;
}

main();

/** 상품 추가 */
$addBtn.addEventListener('click', function () {
  const selectedItem = $select.value;
  const itemToAdd = products.find(function (product) {
    return product.id === selectedItem;
  });

  if (itemToAdd && itemToAdd.quantity > 0) {
    const $item = document.getElementById(itemToAdd.id);
    if ($item) {
      const currentQuantity = parseInt($item.querySelector('span').textContent.split('x ')[1]) + 1;

      if (currentQuantity <= itemToAdd.quantity) {
        $item.querySelector('span').textContent =
          itemToAdd.name + ' - ' + itemToAdd.price + '원 x ' + currentQuantity;
        itemToAdd.quantity--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      const $newItem = document.createElement('div');

      $newItem.id = itemToAdd.id;
      $newItem.className = 'flex justify-between items-center mb-2';
      $newItem.innerHTML = /*HTML*/ `
        <span>${itemToAdd.name} - ${itemToAdd.price}원 x 1</span><div>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${itemToAdd.id}" data-change="-1">-</button>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${itemToAdd.id}" data-change="1"></button>
        <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${itemToAdd.id}">삭제</button></div>`;

      $cartDisplay.appendChild($newItem);
      itemToAdd.quantity--;
    }

    calculateTotalPrice();
    lastSelected = selectedItem;
  }
});

/** 상품 제거 및 재고 현황 업데이트 */
$cartDisplay.addEventListener('click', function (event) {
  const $target = event.target;

  if ($target.classList.contains('quantity-change') || $target.classList.contains('remove-item')) {
    const productId = $target.dataset.productId;
    const $item = document.getElementById(productId);
    const selectedProduct = products.find(function (p) {
      return p.id === productId;
    });

    if ($target.classList.contains('quantity-change')) {
      const quantityChange = parseInt($target.dataset.change);
      const currentQuantity =
        parseInt($item.querySelector('span').textContent.split('x ')[1]) + quantityChange;

      if (
        currentQuantity > 0 &&
        currentQuantity <=
          selectedProduct.quantity +
            parseInt($item.querySelector('span').textContent.split('x ')[1])
      ) {
        $item.querySelector('span').textContent =
          $item.querySelector('span').textContent.split('x ')[0] + 'x ' + currentQuantity;
        selectedProduct.quantity -= quantityChange;
      } else if (currentQuantity <= 0) {
        // 불필요한 로직: 수량이 0이하인 경우인데 삭제중
        // $item.remove();
        // selectedProduct.quantity -= quantityChange;
      } else {
        alert('재고가 부족합니다.');
      }
    } else if ($target.classList.contains('remove-item')) {
      // 불필요한 로직: 삭제할 아이템에 값 넣는중
      // const removeQuantity = parseInt($item.querySelector('span').textContent.split('x ')[1]);
      // selectedProduct.quantity += removeQuantity;
      $item.remove();
    }

    calculateTotalPrice();
  }
});
