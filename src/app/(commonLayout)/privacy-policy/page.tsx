"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Home } from "lucide-react";

export default function PrivacyPolicy() {
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
          <Shield className="w-12 h-12 text-green-500" />
          <h1 className="text-4xl md:text-5xl font-bold">Privacy Policy</h1>
        </motion.div>

        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">
          Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="prose dark:prose-invert max-w-none space-y-8"
        >
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-500">1. Introduction</h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              ServiZen (Company, we, our, or us) operates the ServiZen website (the Service). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-500">2. Information Collection and Use</h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
              We collect several different types of information for various purposes to provide and improve our Service to you.
            </p>
            
            <h3 className="text-lg font-semibold mb-2">2.1 Personal Data</h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you (Personal Data). This may include but is not limited to:
            </p>
            <ul className="list-disc pl-6 text-zinc-600 dark:text-zinc-400 space-y-2 mt-3">
              <li>Email address</li>
              <li>First name and last name</li>
              <li>Phone number</li>
              <li>Address, State, Province, ZIP/Postal code, City</li>
              <li>Cookies and Usage Data</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-500">3. Use of Data</h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-3">
              ServiZen uses the collected data for various purposes:
            </p>
            <ul className="list-disc pl-6 text-zinc-600 dark:text-zinc-400 space-y-2">
              <li>To provide and maintain our Service</li>
              <li>To notify you about changes to our Service</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information</li>
              <li>To monitor the usage of our Service</li>
              <li>To detect, prevent and address technical issues</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-500">4. Security of Data</h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-500">5. Changes to This Privacy Policy</h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the Last updated date at the top of this Privacy Policy.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-500">6. Contact Us</h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mt-3">
              Email: privacy@servizen.com<br />
              Website: www.servizen.com
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mt-4">
              <Link href="/register" className="text-green-500 hover:text-green-600 font-semibold">
                Create an account
              </Link> to get started with ServiZen.
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
