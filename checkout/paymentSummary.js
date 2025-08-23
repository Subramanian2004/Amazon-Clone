import { cart } from "../data/cart.js";
import { getProduct } from "../data/products.js";
import { getDeliveryOption } from "../data/deliveryOptions.js";
import { formatCurrency } from "../scripts/utils/money.js";
import { addOrder } from "../data/orders.js";

export function paymentSummary(){

    let productPriceCents = 0;
    let shippingPriceCents = 0;

    cart.forEach((cartItem) => {

        const product = getProduct(cartItem.productId);
        productPriceCents += product.priceCents * cartItem.Quantity;
        const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
        shippingPriceCents += deliveryOption.priceCents;
    });
    const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
    const taxCents = totalBeforeTaxCents * 0.1;
    const totalCents = totalBeforeTaxCents + taxCents;

    

    const paymentSummaryHtml = `
        <div class="payment-summary-title">
            Order Summary
        </div>

        <div class="payment-summary-row">
        <div>Items (3):</div>
        <div class="payment-summary-money">
            $${formatCurrency(productPriceCents)}
        </div>
        </div>

        <div class="payment-summary-row">
        <div>Shipping &amp; handling:</div>
        <div class="payment-summary-money">
            $${formatCurrency(shippingPriceCents)}
        </div>
        </div>

        <div class="payment-summary-row subtotal-row">
        <div>Total before tax:</div>
        <div class="payment-summary-money">
            $${formatCurrency(totalBeforeTaxCents)}
        </div>
        </div>

        <div class="payment-summary-row">
        <div>Estimated tax (10%):</div>
        <div class="payment-summary-money">
            $${formatCurrency(taxCents)}
        </div>
        </div>

        <div class="payment-summary-row total-row">
        <div>Order total:</div>
        <div class="payment-summary-money">
            $${formatCurrency(totalCents)}
        </div>
        </div>
        
        <a href="orders.html">
        <button class="place-order-button button-primary js-place-order">
        Place your order
        </button> 
        
`
    document.querySelector('.js-payment-summary')
        .innerHTML = paymentSummaryHtml;

    //Make the place order button interactive
    document.querySelector('.js-place-order')
        .addEventListener('click', async () => {   //we are making request to the backend using fetch
            const response = await fetch('https://supersimplebackend.dev/orders',{  //we need to send some data to the backend(we need to send our cart)
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({  //we cant send object directly so we can use JSON
                    cart : cart
                })
            });
            const order = await response.json();
            addOrder(order);

            
        });
    }


