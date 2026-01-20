export default function ShippingPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">Shipping Policy</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-sm text-gray-500 mb-8">Last updated: March 2025</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Shipping Information</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            At Musshk, we strive to deliver your orders quickly and safely. Orders placed before 2pm on a working day 
            are dispatched the same day. Delivery typically takes 3–5 working days within India.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Shipping Methods & Rates</h2>
          <div className="bg-gray-50 rounded-lg p-6 mb-4">
            <h3 className="text-xl font-semibold mb-4">Standard Shipping (Free)</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Delivery time: 5-7 business days</li>
              <li>Free for orders above Rs. 999</li>
              <li>Tracking number provided</li>
            </ul>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Express Shipping</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Delivery time: 2-3 business days</li>
              <li>Additional charge: Rs. 99</li>
              <li>Priority handling and faster delivery</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Order Processing</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Here&apos;s what happens after you place an order:
          </p>
          <ol className="list-decimal list-inside text-gray-700 space-y-2">
            <li><strong>Order Confirmation:</strong> You&apos;ll receive an email confirmation immediately after placing your order</li>
            <li><strong>Processing:</strong> We prepare your order for shipment (usually within 24 hours)</li>
            <li><strong>Shipping:</strong> Your order is dispatched and you&apos;ll receive a tracking number</li>
            <li><strong>Delivery:</strong> Your package arrives at your doorstep</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Delivery Areas</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We currently ship to:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>All major cities and towns in India</li>
            <li>Remote areas may take additional 2-3 days</li>
            <li>International shipping available on request (contact us for details)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Tracking Your Order</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Once your order is shipped, you will receive:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>An email with your tracking number</li>
            <li>Real-time updates on your order status</li>
            <li>Estimated delivery date</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-4">
            You can track your order using the tracking number on our website or the courier company's website.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Delivery Issues</h2>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-4">
            <h3 className="text-xl font-semibold mb-2">What to do if:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Package is delayed:</strong> Contact us with your order number and we'll investigate</li>
              <li><strong>Package is damaged:</strong> Take photos and contact us immediately</li>
              <li><strong>Wrong item received:</strong> Contact us and we'll send the correct item</li>
              <li><strong>Package not received:</strong> Check with neighbors and local post office, then contact us</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Holiday Shipping</h2>
          <p className="text-gray-700 leading-relaxed">
            During holidays and peak seasons, delivery times may be extended. We recommend placing orders early to 
            ensure timely delivery. We'll notify you of any delays via email.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Address Accuracy</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Please ensure your shipping address is correct and complete:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Double-check your address before placing the order</li>
            <li>Include apartment/unit numbers, landmarks if needed</li>
            <li>Provide a contact phone number for delivery coordination</li>
            <li>Contact us immediately if you need to change the address (before shipment)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">International Shipping</h2>
          <p className="text-gray-700 leading-relaxed">
            We currently focus on domestic shipping within India. For international orders, please contact us at 
            <a href="mailto:Musshk09@gmail.com" className="text-primary-600 hover:underline">Musshk09@gmail.com</a> with your requirements, and we'll provide shipping options and costs.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="text-gray-700 leading-relaxed">
            For any shipping-related questions or concerns, please contact us:
          </p>
          <p className="text-gray-700 mt-2">
            Email: <a href="mailto:Musshk09@gmail.com" className="text-primary-600 hover:underline">Musshk09@gmail.com</a><br />
            Phone: <a href="tel:9759905151" className="text-primary-600 hover:underline">97599 05151</a><br />
            Hours: Monday - Saturday, 10:00 AM - 7:00 PM IST
          </p>
        </section>
      </div>
    </div>
  );
}

