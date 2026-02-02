'use client';

import { useState } from 'react';

interface FAQ {
  question: string;
  answer: string;
}

export default function FAQsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQ[] = [
    {
      question: 'What percentage of perfume oil do you use in your fragrances?',
      answer: 'All our Inspired Designer Fragrances are Extrait de Parfum, composed with 35% premium quality perfume oil. This high concentration ensures long-lasting fragrance that stays with you throughout the day.',
    },
    {
      question: 'How close are Musshk\'s fragrances to the original high-street brands?',
      answer: 'Our fragrances are of exceptional quality—above 95% identical to the originals. We use premium ingredients and follow meticulous crafting processes to ensure the highest similarity to designer fragrances.',
    },
    {
      question: 'How do you keep prices so competitive?',
      answer: 'We operate mainly online and invest deeply in product innovation rather than traditional marketing or overheads. This allows us to offer premium quality fragrances at affordable prices without compromising on quality.',
    },
    {
      question: 'What makes your perfume special?',
      answer: 'Each batch is hand-crafted in small quantities using only the finest ingredients. Our designs are inspired, not widely mass-produced copycats. We focus on quality over quantity, ensuring every bottle meets our high standards.',
    },
    {
      question: 'Are the perfumes long lasting?',
      answer: 'Yes—thanks to the 35% concentration of quality fragrance oil, they should last through the day. Note: your nose may stop detecting the scent while others still can. This is a natural phenomenon called olfactory fatigue.',
    },
    {
      question: 'Where are the perfumes produced?',
      answer: 'All products are made in our atelier in Surat, Gujarat, India. We maintain strict quality control standards and use only premium ingredients sourced from trusted suppliers.',
    },
    {
      question: 'Do you use animal-derived ingredients or do animal testing?',
      answer: 'No. All Musshk fragrances are cruelty-free and contain no animal products. We are committed to ethical practices and never test on animals.',
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer full refunds for unopened bottles returned within 30 days of purchase. Items must be in their original packaging and unused condition. Please contact our customer service for return authorization.',
    },
    {
      question: 'How long does shipping take?',
      answer: 'Orders placed before 2pm on a working day are dispatched the same day. Delivery typically takes 3–5 working days within India. International shipping times may vary.',
    },
    {
      question: 'Can I try a fragrance before buying a full-size bottle?',
      answer: 'Yes! We offer smaller 20ml bottles so you can try our fragrances before committing to a full-size bottle. This allows you to experience the quality and longevity of our perfumes.',
    },
    {
      question: 'What if I receive damaged goods?',
      answer: 'If items arrive damaged, please take photos and contact us immediately. We\'ll send you a returns label and exchange it free of charge. Your satisfaction is our priority.',
    },
    {
      question: 'Do you offer gift wrapping?',
      answer: 'Yes, we offer elegant gift wrapping for all our products. You can select this option during checkout.',
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
      <p className="text-gray-600 mb-12">
        Find answers to common questions about our products, shipping, returns, and more.
      </p>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white border rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition"
            >
              <span className="font-semibold text-gray-900">{faq.question}</span>
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  openIndex === index ? 'transform rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openIndex === index && (
              <div className="px-6 py-4 bg-gray-50 border-t">
                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 bg-gray-50 rounded-lg p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">Still have questions?</h2>
        <p className="text-gray-600 mb-4">
          Can&apos;t find the answer you&apos;re looking for? Please contact our friendly team.
        </p>
        <a
          href="/contact"
          className="inline-block bg-primary-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-primary-700 transition"
        >
          Contact Us
        </a>
      </div>
    </div>
  );
}

