"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HelpCircle, ChevronDown, Home } from "lucide-react";
import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "How do I book a service on ServiZen?",
    answer: "Simply browse our available services, select the one you need, choose your preferred date and time, and complete the booking. You will receive a confirmation email with all the details."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, debit cards, and online payment methods. Your payment information is securely processed and never stored on our servers."
  },
  {
    question: "Can I cancel or reschedule my booking?",
    answer: "Yes, you can cancel or reschedule your booking up to 24 hours before the scheduled service. Cancellations within 24 hours may incur a cancellation fee. Visit your booking page to manage your reservations."
  },
  {
    question: "What if I am not satisfied with the service?",
    answer: "Your satisfaction is our priority. If you are not happy with the service, please contact our support team within 48 hours with details of your concern. We will work to resolve the issue promptly."
  },
  {
    question: "Are service providers verified and insured?",
    answer: "Yes, all our service providers go through a rigorous verification process and carry appropriate insurance. We prioritize your safety and quality of service."
  },
  {
    question: "How can I track my service provider?",
    answer: "Once your booking is confirmed and the service provider is assigned, you will receive real-time location updates and can track them on the app or website."
  },
  {
    question: "What should I do if there is an emergency?",
    answer: "For emergency situations, contact our 24/7 customer support team immediately. We have emergency protocols in place to assist you quickly."
  },
  {
    question: "How do I provide feedback or report an issue?",
    answer: "You can submit feedback or report issues through your account dashboard, or contact our support team directly via email or phone. We value all feedback and take concerns seriously."
  },
  {
    question: "Are there any hidden charges?",
    answer: "No, we maintain complete transparency. The price you see during booking is the final price. Any additional services requested will be quoted before proceeding."
  },
  {
    question: "Do you offer discounts or loyalty rewards?",
    answer: "Yes! We offer seasonal discounts, promotional codes, and a loyalty rewards program for regular customers. Check our promotions page for current offers."
  }
];

function FAQItem({ item, index }: { item: FAQItem; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="border border-zinc-200 dark:border-white/10 rounded-lg overflow-hidden bg-white dark:bg-white/5 hover:border-green-500 dark:hover:border-green-500 transition-colors"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors"
      >
        <h3 className="font-semibold text-zinc-900 dark:text-white">
          {item.question}
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-5 h-5 text-green-500 flex-shrink-0 ml-4" />
        </motion.div>
      </button>

      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="px-6 py-4 border-t border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-white/[0.02]">
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {item.answer}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function FAQ() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#050505] text-zinc-900 dark:text-white py-12 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto">
        {/* Home Button */}
        <Link href="/" className="inline-flex items-center gap-2 mb-8 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors">
          <Home className="w-4 h-4" />
          Home
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex items-center gap-4"
        >
          <HelpCircle className="w-12 h-12 text-green-500" />
          <h1 className="text-4xl md:text-5xl font-bold">Frequently Asked Questions</h1>
        </motion.div>

        <p className="text-zinc-600 dark:text-zinc-400 text-lg mb-12">
          Find answers to common questions about ServiZen. Cant find what you re looking for? Contact our support team.
        </p>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <FAQItem key={index} item={item} index={index} />
          ))}
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-16 p-8 bg-gradient-to-r from-green-500/10 to-green-600/10 dark:from-green-500/5 dark:to-green-600/5 border border-green-500/30 rounded-lg text-center"
        >
          <h3 className="text-2xl font-bold mb-3">Didn t find your answer?</h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            Our support team is here to help. Get in touch with us for any questions or concerns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors text-center"
            >
              Get Started
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 border border-green-500 dark:border-green-500 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-500/10 font-semibold rounded-lg transition-colors text-center"
            >
              Contact Support
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
