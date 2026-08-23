import { showToast } from '../components/toast.js';

export function renderContactPage() {
  const faqs = [
    {
      q: "How should I store my Aurite supplements?",
      a: "Aurite dark forest glass jars are light-shielded. Store them in a cool, dry place away from direct sunlight. Refrigeration is not required but can extend fish oil freshness in warm climates."
    },
    {
      q: "Can I modify or pause my subscription anytime?",
      a: "Yes! You can skip deliveries, adjust delivery intervals (30, 60, or 90 days), or swap formulations anytime directly inside your User Account Dashboard."
    },
    {
      q: "Are Aurite products third-party tested?",
      a: "Every single production batch undergoes ISO-accredited 3rd-party laboratory testing for heavy metals, microbial safety, and active compound potency. Certificates of Analysis (COA) are accessible via your batch QR code."
    },
    {
      q: "What is your shipping & return policy?",
      a: "We offer Free Express 2-Day Shipping on orders over $75. All purchases are backed by our 30-Day Money-Back Guarantee."
    }
  ];

  return `
    <div class="container section-padding">
      <div style="text-align:center; max-width:680px; margin:0 auto 60px auto;">
        <span class="badge badge-gold" style="margin-bottom:12px;">Customer Support</span>
        <h1 style="font-family:var(--font-serif); font-size:3rem; color:var(--color-forest-dark); margin-bottom:16px;">
          We are here to help.
        </h1>
        <p style="color:var(--color-text-muted); font-size:1.05rem;">
          Have a question about your order, dosage guidelines, or custom subscription plans? Reach out to our wellness team.
        </p>
      </div>

      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:60px; align-items:start;">
        <!-- Contact Form -->
        <div style="background:var(--color-white); border:1px solid var(--color-sand-border); border-radius:var(--radius-lg); padding:36px; box-shadow:var(--shadow-sm);">
          <h3 style="font-family:var(--font-serif); font-size:1.8rem; margin-bottom:20px; color:var(--color-forest-dark);">Send Us a Message</h3>
          
          <form id="contact-page-form">
            <div class="form-group">
              <label class="form-label">Your Name</label>
              <input type="text" required class="form-input" placeholder="Alex Mercer">
            </div>

            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input type="email" required class="form-input" placeholder="alex@example.com">
            </div>

            <div class="form-group">
              <label class="form-label">Inquiry Subject</label>
              <select class="form-input">
                <option>General Question</option>
                <option>Subscription Assistance</option>
                <option>Order Tracking & Shipping</option>
                <option>Medical Professional Partnership</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Message</label>
              <textarea required class="form-input" rows="4" placeholder="How can we assist your wellness journey?"></textarea>
            </div>

            <button type="submit" class="btn btn-primary btn-lg" style="width:100%;">
              Send Message
            </button>
          </form>
        </div>

        <!-- FAQs Accordion -->
        <div>
          <h3 style="font-family:var(--font-serif); font-size:1.8rem; margin-bottom:24px; color:var(--color-forest-dark);">Frequently Asked Questions</h3>
          
          <div style="display:flex; flex-direction:column; gap:16px;">
            ${faqs.map(faq => `
              <div style="background:var(--color-white); border:1px solid var(--color-sand-border); border-radius:var(--radius-md); padding:20px;">
                <div style="font-weight:700; font-size:1rem; color:var(--color-forest-dark); margin-bottom:8px;">${faq.q}</div>
                <div style="font-size:0.88rem; color:var(--color-text-muted); line-height:1.6;">${faq.a}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

export function bindContactPageEvents() {
  const form = document.getElementById('contact-page-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Thank you! Your message has been sent to our customer care team.', 'success');
      form.reset();
    });
  }
}
