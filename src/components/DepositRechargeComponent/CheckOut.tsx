import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
import { useEffect, useState } from 'react';
import { rechargeApi } from '../../api/recharge';
import './toss.css';

interface CheckoutPageProps {
  inputValue: number;
}

const generateRandomString = () =>
  window.btoa(Math.random().toString()).slice(0, 20);
const clientKey = 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm';
const customerKey = generateRandomString();
export default function CheckoutPage({ inputValue }: CheckoutPageProps) {
  const [widgets, setWidgets] = useState<any>(null);
  const [amount, setAmount] = useState({
    currency: 'KRW',
    value: inputValue,
  });

  useEffect(() => {
    async function fetchPaymentWidgets() {
      const tossPayments = await loadTossPayments(clientKey);
      const widgets = tossPayments.widgets({ customerKey });
      setWidgets(widgets);
    }

    fetchPaymentWidgets();
  }, []);

  useEffect(() => {
    async function renderPaymentWidgets() {
      if (widgets == null) {
        return;
      }

      await widgets.setAmount(amount);

      await widgets.renderPaymentMethods({
        selector: '#payment-method',
        variantKey: 'DEFAULT',
      });

      await widgets.renderAgreement({
        selector: '#agreement',
        variantKey: 'AGREEMENT',
      });
    }

    renderPaymentWidgets();
  }, [widgets, amount]);

  useEffect(() => {
    setAmount({
      currency: 'KRW',
      value: inputValue,
    });
  }, [inputValue]);

  return (
    <div className="wrapper w-100">
      <div className="max-w-540 w-100">
        <div id="payment-method" className="w-100" />
        <div id="agreement" className="w-100" />
        <div className="btn-wrapper w-100">
          <button
            className="btn primary w-100"
            onClick={async () => {
              try {
                // 결제 요청 전 서버에 orderId와 amount 저장
                const checkoutResponse = await rechargeApi.checkout({
                  amount: amount.value,
                  paymentType: '카드', // 임시
                  orderName: '예치금 충전',
                  // 필요한 경우 다른 데이터 추가
                });

                const orderId = checkoutResponse.data.orderId;

                await widgets?.requestPayment({
                  orderId: orderId,
                  orderName: '예치금 충전',
                  customerName: '김토스',
                  customerEmail: 'customer123@gmail.com',
                  successUrl:
                    window.location.origin +
                    '/sandbox/success' +
                    window.location.search,
                  failUrl:
                    window.location.origin +
                    '/sandbox/fail' +
                    window.location.search,
                });
              } catch (error) {
                // TODO: 에러 처리
                console.error('결제 요청 중 오류가 발생했습니다:', error);
                alert('결제 요청 중 오류가 발생했습니다. 다시 시도해 주세요.');
              }
            }}
          >
            결제하기
          </button>
        </div>
      </div>
    </div>
  );
}
