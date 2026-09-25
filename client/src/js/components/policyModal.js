import { state } from '../state.js';

export function renderPolicyModal() {
  const type = state.policyModalType;
  if (!type) return '';

  let title = 'Official Policy';
  let badge = 'Customer Information';
  let content = '';

  switch (type) {
    case 'privacy':
      title = 'Privacy Policy';
      badge = 'Data Protection';
      content = `
        <h4>1. Information We Collect</h4>
        <p>At VALEORA, we respect your privacy. We only collect essential customer details such as your name, email, contact phone number, and delivery address to fulfill your orders and provide real-time shipping updates across India.</p>
        
        <h4>2. Data Security & Payment Information</h4>
        <p>We do not store your credit card, debit card, or UPI credentials. All transactions are securely processed through RBI-authorized payment gateways using 256-bit bank-grade encryption.</p>
        
        <h4>3. Sharing of Information</h4>
        <p>Your delivery information is strictly shared only with our trusted courier logistics partners (such as Blue Dart, Delhivery, DTDC) solely to deliver your orders safely.</p>
        
        <h4>4. Contact for Privacy Inquiries</h4>
        <p>If you have any questions regarding your personal data or privacy rights, contact us at <strong>Valeora.shop@gmail.com</strong> or our Delhi Janakpuri office.</p>
      `;
      break;

    case 'terms':
      title = 'Terms & Conditions';
      badge = 'Store Terms';
      content = `
        <h4>1. General Overview & Policy Acceptance</h4>
        <p>VALEORA provides premium daily wear fashion jewelry across India. By creating an account, logging in, accessing our website, or placing an order, you acknowledge and agree to be bound by all our store policies, terms, and conditions.</p>
        
        <h4>2. Pricing & Orders</h4>
        <p>All prices listed on the website are in Indian Rupees (INR) and inclusive of all applicable taxes. We reserve the right to modify product prices without prior notice.</p>
        
        <h4>3. Delivery & Shipping</h4>
        <p>Enjoy <strong>100% FREE Delivery across the Delhi NCR region on orders above ₹999</strong>. Standard shipping for other distances is calculated from our Delhi hub (&lt;500 km: ₹79, &lt;1,000 km: ₹179, &lt;1,500 km: ₹279, 1,500+ km: ₹350).</p>
        
        <h4>4. Replacement Policy (No Returns / Refunds)</h4>
        <p>We offer <strong>Free Replacement within 24 hours of delivery</strong> exclusively for genuine issues such as transit damage, manufacturing defects, or size mismatches. We do not accept returns or offer refunds for subjective reasons (such as disliking the color/look in person or change of mind).</p>
      `;
      break;

    case 'refund':
    case 'return':
    case 'replacement':
      title = 'Replacement Policy';
      badge = '24-Hour Replacement';
      content = `
        <h4>1. Replacement-Only Policy (No Returns or Refunds)</h4>
        <p>At VALEORA, every piece of jewelry is individually quality-checked and packaged securely before dispatch. <strong>We do not offer returns or cash/bank refunds.</strong> Instead, we offer a <strong>100% Free Replacement</strong> if your item qualifies under our genuine issue criteria.</p>
        
        <h4>2. Eligible Issues for 24-Hour Replacement</h4>
        <p>Replacement requests must be raised within <strong>24 hours of delivery</strong> for the following genuine reasons only:</p>
        <ul>
          <li><strong>Transit Damage or Defect:</strong> Piece received broken, chipped, or damaged in shipping.</li>
          <li><strong>Size / Fitment Issue:</strong> Ring, bracelet, or necklace size mismatch with your order.</li>
          <li><strong>Incorrect Item Received:</strong> Received a different model or variation than what was ordered.</li>
        </ul>
        
        <h4>3. Ineligible Cases (Not Covered)</h4>
        <p>Replacements are <strong>not provided</strong> for:</p>
        <ul>
          <li>Subjective preferences (e.g. <em>"did not like the color in person"</em>, <em>"style didn't suit me"</em>, or change of mind).</li>
          <li>Damage resulting from rough use, misuse, or exposure to perfumes/chemicals after delivery.</li>
          <li>Requests submitted after the <strong>24-hour delivery window</strong> has expired.</li>
        </ul>
        
        <h4>4. How to Claim Your Free Replacement</h4>
        <p>To initiate a replacement within 24 hours of receiving your order, email us at <strong>Valeora.shop@gmail.com</strong> or submit a ticket via our Contact Us page with:</p>
        <ul>
          <li>Your <strong>Order ID</strong> and contact phone number.</li>
          <li>Clear <strong>photos or a brief unboxing video</strong> showing the defect, damage, or sizing issue.</li>
        </ul>
        <p>Our Delhi support team will verify your request and dispatch your brand-new replacement promptly.</p>
      `;
      break;

    case 'shipping':
      title = 'Shipping & Delivery Policy';
      badge = 'Delhi NCR & All-India';
      content = `
        <h4>1. Dispatch & Delivery Timelines</h4>
        <p>All orders are dispatched within 24 to 48 hours from our central warehouse in Delhi Janakpuri, India.</p>
        <ul>
          <li><strong>Delhi NCR:</strong> Delivered in 1 to 2 business days.</li>
          <li><strong>Metro Cities (Mumbai, Bengaluru, Kolkata, Chennai, Hyderabad):</strong> 2 to 4 business days.</li>
          <li><strong>Rest of India:</strong> 3 to 5 business days.</li>
        </ul>
        
        <h4>2. Shipping Charges by Distance (from Delhi Hub)</h4>
        <p>Standard delivery charges are calculated based on the transit distance from our central Delhi hub:</p>
        <ul>
          <li><strong>Under 500 km:</strong> ₹79</li>
          <li><strong>Under 1,000 km:</strong> ₹179</li>
          <li><strong>Under 1,500 km:</strong> ₹279</li>
          <li><strong>Above 1,500 km:</strong> ₹350</li>
        </ul>
        <p><strong>Exclusive Perk:</strong> <strong>100% FREE Delivery across the Delhi NCR region</strong> on all orders above <strong>₹999</strong>!</p>
        
        <h4>3. Real-Time Tracking</h4>
        <p>You will receive a real-time tracking link via SMS & Email as soon as your package is dispatched by our logistics partners (Blue Dart, Delhivery, DTDC).</p>
      `;
      break;

    default:
      title = 'Customer Support';
      badge = 'Help Center';
      content = `
        <h4>VALEORA Customer Care</h4>
        <p>Email: <strong>Valeora.shop@gmail.com</strong><br>
        Response Time: <strong>Less than 3 hours</strong><br>
        Location: <strong>Delhi Janakpuri, India</strong><br>
        Operating Hours: Monday – Saturday, 10:00 AM – 7:00 PM IST</p>
      `;
      break;
  }

  return `
    <div class="modal-overlay open" id="policy-modal-overlay">
      <div class="policy-curved-dialog">
        <!-- Close 'X' Circular Button -->
        <button class="modal-close-btn" id="policy-close-btn" aria-label="Close Policy Modal" title="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <!-- Header -->
        <div class="policy-modal-header">
          <span class="badge-pill badge-rose policy-badge">${badge}</span>
          <h3 class="policy-modal-title">${title}</h3>
        </div>

        <!-- Scrollable Body with Sleek Scrollbar -->
        <div class="policy-scroll-body">
          ${content}
        </div>

        <!-- Bottom Action Bar with 'I Understand' Button -->
        <div class="policy-modal-footer">
          <button class="btn btn-pill policy-ack-btn" id="policy-ack-btn">
            I Understand
          </button>
        </div>
      </div>
    </div>
  `;
}

export function bindPolicyModalEvents() {
  const overlay = document.getElementById('policy-modal-overlay');
  const closeBtn = document.getElementById('policy-close-btn');
  const ackBtn = document.getElementById('policy-ack-btn');

  const close = () => state.closePolicyModal();

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', close);
  if (ackBtn) ackBtn.addEventListener('click', close);
}
