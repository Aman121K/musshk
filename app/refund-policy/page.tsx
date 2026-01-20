export default function RefundPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">Refund Policy</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-sm text-gray-500 mb-8">Last updated: March 2025</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Returns & Refunds</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            At Musshk, we want you to be completely satisfied with your purchase. If you're not happy with your order, 
            we offer a hassle-free return and refund process.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Eligibility for Returns</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            To be eligible for a return and refund, the following conditions must be met:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>The item must be unopened and in its original packaging</li>
            <li>The return request must be made within 30 days of delivery</li>
            <li>The item must be in the same condition as when you received it</li>
            <li>All original tags, labels, and accessories must be included</li>
            <li>Proof of purchase (order number or receipt) must be provided</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Non-Returnable Items</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            The following items cannot be returned for hygiene and safety reasons:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Opened or used perfume bottles</li>
            <li>Items without original packaging</li>
            <li>Personalized or customized products</li>
            <li>Items damaged due to misuse or negligence</li>
            <li>Items purchased more than 30 days ago</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How to Return an Item</h2>
          <ol className="list-decimal list-inside text-gray-700 space-y-2">
            <li>Contact our customer service team at <a href="mailto:Musshk09@gmail.com" className="text-primary-600 hover:underline">Musshk09@gmail.com</a> or call <a href="tel:9759905151" className="text-primary-600 hover:underline">97599 05151</a></li>
            <li>Provide your order number and reason for return</li>
            <li>Our team will send you a Return Authorization (RA) number and return instructions</li>
            <li>Package the item securely in its original packaging</li>
            <li>Include the RA number on the package</li>
            <li>Ship the item back to us using the provided return address</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Refund Process</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Once we receive and inspect your returned item:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>We will process your refund within 5-7 business days</li>
            <li>Refunds will be issued to the original payment method</li>
            <li>You will receive an email confirmation once the refund is processed</li>
            <li>It may take 7-10 business days for the refund to appear in your account</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Return Shipping</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Return shipping costs are the responsibility of the customer, except in the following cases:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>If the item was damaged during shipping</li>
            <li>If you received the wrong item</li>
            <li>If the item was defective</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-4">
            In these cases, we will provide a prepaid return shipping label.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Damaged or Defective Items</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            If you receive a damaged or defective item:
          </p>
          <ol className="list-decimal list-inside text-gray-700 space-y-2">
            <li>Take photos of the damaged item and packaging</li>
            <li>Contact us within 48 hours of delivery</li>
            <li>We will send you a replacement or full refund at no cost to you</li>
            <li>We may request the damaged item to be returned for quality control purposes</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Exchange Policy</h2>
          <p className="text-gray-700 leading-relaxed">
            We currently do not offer direct exchanges. If you wish to exchange an item, please return it for a refund 
            and place a new order for the item you want. This ensures you get the freshest product possible.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Cancellation Policy</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            You can cancel your order before it is shipped:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Contact us immediately if you wish to cancel</li>
            <li>If the order hasn't been shipped, we'll process a full refund</li>
            <li>If the order has already been shipped, you'll need to follow the return process</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="text-gray-700 leading-relaxed">
            If you have any questions about our refund policy, please contact us:
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

