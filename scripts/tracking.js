import { getProduct } from '../data/products.js';
import { orders } from '../data/orders.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

function loadTrackingPage() {
    // Get parameters from URL
    const url = new URL(window.location.href);
    const orderId = url.searchParams.get('orderId');
    const productId = url.searchParams.get('productId');
    
    // Find the order
    const order = orders.find(o => o.id === orderId);
    if (!order) {
        document.querySelector('.main').innerHTML = '<h2>Order not found</h2>';
        return;
    }
    
    // Find the product in the order
    const orderProduct = order.products.find(p => p.productId === productId);
    if (!orderProduct) {
        document.querySelector('.main').innerHTML = '<h2>Product not found in order</h2>';
        return;
    }
    
    // Get product details
    const product = getProduct(productId);
    
    // Calculate delivery date
    const deliveryDate = dayjs(orderProduct.estimatedDeliveryTime);
    const deliveryDateString = deliveryDate.format('dddd, MMMM D');
    
    // Update the HTML
    document.querySelector('.delivery-date').innerHTML = 
        `Arriving on ${deliveryDateString}`;
    
    document.querySelector('.product-info').innerHTML = 
        product.name;
    
    document.querySelector('.product-info:nth-of-type(2)').innerHTML = 
        `Quantity: ${orderProduct.quantity}`;
    
    document.querySelector('.product-image').src = product.image;
    
    // Update progress based on current date
    updateProgressBar(order.orderTime, orderProduct.estimatedDeliveryTime);
}

function updateProgressBar(orderTime, deliveryTime) {
    const now = dayjs();
    const orderDate = dayjs(orderTime);
    const deliveryDate = dayjs(deliveryTime);
    
    const totalTime = deliveryDate.diff(orderDate);
    const elapsedTime = now.diff(orderDate);
    const progressPercent = Math.min((elapsedTime / totalTime) * 100, 100);
    
    // Update progress bar width
    document.querySelector('.progress-bar').style.width = `${progressPercent}%`;
    
    // Update status labels
    if (progressPercent >= 100) {
        document.querySelector('.progress-label:nth-of-type(3)').classList.add('current-status');
    } else if (progressPercent >= 50) {
        document.querySelector('.progress-label:nth-of-type(2)').classList.add('current-status');
    } else {
        document.querySelector('.progress-label:nth-of-type(1)').classList.add('current-status');
    }
}

// Load the page when DOM is ready
document.addEventListener('DOMContentLoaded', loadTrackingPage);
