
## 과제 셀프회고

팀원들과 컨벤션을 맞추고 이야기 하는게 너무 재밌었다. 이미 설정되어있는 것만 사용하다가 다른 사람들의 취향도 알게되고 의견 나누는게 재밌었다. 
과제를 처음 시작하면서 맥락이 없는 상태에서 코드를 보니 내 코드에 대한 반성도 하게되었다. 변수명이 축약되어있어 이해가 어렵고 불필요한 조건문도 많고 .. 나누면서 희열을 느끼기도 했다 ㅋㅁㅋ 하지만 너무 시간이 부족해 기본적인 기능이 동작하도록 심화과제를 끝내지 못해 너무 아쉬운 과제였다..!

### 소소한 성능 개선
프로파일러를 켜두고 작업을 하다보니 hook으로 개선가능한 것들이 보여 적용해보았다. 

**before**
https://github.com/user-attachments/assets/0eddfd8d-ff86-47ab-aa8c-a79545fef10c

**afer**
https://github.com/user-attachments/assets/fb7918d9-7bbc-4a07-8163-d102cbda0b78

### 트러블 슈팅 🚀
context를 관리하기 쉽게 하기위해 동작과 공유로 분류해서 작업을 해두었다
* useCartStore: 상태를 변경하는 주요 로직
* useCartContext: 상태를 공유하는 주요 로직

useCartStore의 increaseItemQuantity를 사용하는데 장바구니 아이템의 수량에 변화가 없는 것을 발견하고 보니
아래처럼 사용하고 있어서 발생한 것이었다..!
```tsx
const { increaseItemQuantity } = useCartStore(); // ❌
const { increaseItemQuantity } = useCartContext(); // ✅

```
useCartStore vs useCartContext 이 둘이 크게 다른가 확인해보니 
useCartStore는 그냥 일반 커스텀 훅처럼 생기기 때문에 그것의 상태가 장바구니 아이템에 반영되지 않는 문제였다. 
위에 작성한 것 처럼 useCartStore는 그냥 상태를 변경해주는 것이고 이것을 구독한 컴포넌트에 반영하기 위해서는 useCartContext에서 가져다 써야 하는 것이었다..!


<!-- 과제에 대한 회고를 작성해주세요 -->

### 과제를 하면서 내가 제일 신경 쓴 부분은 무엇인가요?

**1️⃣ 린트 설정**
회사에서는 누군가 정해둔 설정을 사용하고 개인 프로젝트에서는 큰 불편함을 느끼지 못했는데 이번 기회에 어떤 스타일을 왜 선호하는지 이유를 붙여보며 스스로 코드스타일을 나름 찾은 것 같다!

몇가지 정리해보면
* ` curly: 'error'`: 중괄호를 강제해서 early return이라도 중괄호를 포함하게 한다
   * git diff를 봤을때 변경점을 줄이기 위함도 있고 통일성을 위해서도 있다.
*  `no-nested-ternary`: 'warn': 이중삼항연산자 제한
   * 이중삼항연산자는 맥락 파악을 어렵게 하는 요인이 된다
   * 전에 코드리뷰 받은 내용은 이중삼항연산자 대신 즉시실행함수 사용에 대한 피드백을 받았고 훨씬 가독성이 좋아졌다고 생각해 선호한다.
 * `import/order`
   * import문에 순서가 정해져있으면 어디에 넣을지 고민하지 않아도 되고 너무 편리해서 선호한다


```js

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    plugins: { js, import: plugImport },
    extends: [
      'js/recommended',
      prettier, // Prettier 설정 적용
    ],
    rules: {
      curly: 'error', // 중괄호를 항상 사용하도록 강제
      'prefer-const': 'error', // const 사용하도록 강제
      'no-const-assign': 'warn', // const변수 재할당 금지
      'no-var': 'error', // var 사용하지 못하도록 강제
      'no-nested-ternary': 'warn', // 이중삼항연산자 사용하지 못하도록 강제
      'import/first': 'error', // import가 중간에 있으면 위로 올려줌
      'import/order': [
        'warn',
        {
          groups: [
            'builtin', // Node 내장 모듈 (fs, path 등)
            'external', // 외부 모듈 (react 등)
            'internal', // 내부 경로 import (예: @/utils)
            ['parent', 'sibling', 'index'], // 상대경로
            'object', // object-style imports (ex: import * as foo from...)
            'type', // 타입 import (TypeScript용)
          ],
          'newlines-between': 'always', // 그룹 간 빈 줄 삽입함
          alphabetize: {
            order: 'asc', // 알파벳 오름차순 정렬
            caseInsensitive: true, // 대소문자 구분 없이 정렬
          },
        },
      ],
    },
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    languageOptions: { globals: globals.browser },
  },
  // prettier가 여기 있으면 린트 설정이 덮어씌워짐
]);

```

**2️⃣ js에서 리액트스럽게 컴포넌트 구성하기**
제목처럼 리액트스럽게 잘 되었는지는 모르겠지만 ㅎㅎ 이 덕분인지 리액트로 옮기는 과정에서 꽤 금방 옮겼던 것 같다.
createElement리는 컴포넌트 제너레이트 해주는 함수를 사용해 가독성도 높이고 반복되는 코드를 줄일 수 있었다.

```js
export const createElement = (tag, { id, className, textContent }) => {
    const $element = document.createElement(tag);

    if (id) {
        $element.id = id;
    }
    if (className) {
        $element.className = className;
    }
    if (textContent) {
        $element.textContent = textContent;
    }

    return $element;
};
```
```js
import { createElement } from '../utils/createElement';

const StockInfo = () => {
    return createElement('div', {
        id: 'stock-status',
        className: 'text-sm text-gray-500 mt-2',
    });
};

export default StockInfo;
```

### 과제를 다시 해보면 더 잘 할 수 있었겠다 아쉬운 점이 있다면 무엇인가요?
이번주는 시간이 너무너무 부족해 너무 아쉽다.....

### 리뷰 받고 싶은 내용이나 궁금한 것에 대한 질문 편하게 남겨주세요 :)

`CartStore`를 보면 cart에 대한 로직이 모두 담겨있습니다.
아래 함수는 `increaseItemQuantity`에서 사용하는 것인데 이런 역할을 하는 함수는 어떻게 관리하시는 편인가요?
메인 로직은 아니지만 메인 로직에 필요한 로직.. utils로 빼둘까 했지만 util..은 아닌 것 같아 남겨두었습니다..

```ts

    /** 기존 상품 수량과 장바구니 수량을 비교해 재고를 확인합니다 */
    const hasStock = (cartItems: CartItem) => {
        const filteredProduct = products.filter((product) => product.id === cartItems.productId);

        return filteredProduct[0].quantity - cartItems.cartQuantity > 0;
    };
```
