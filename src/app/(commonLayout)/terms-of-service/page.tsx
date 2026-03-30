"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, Home } from "lucide-react";

export default function TermsOfService() {
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
          <FileText className="w-12 h-12 text-green-500" />
          <h1 className="text-4xl md:text-5xl font-bold">Terms of Service</h1>
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
            <h2 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-500">1. Agreement to Terms</h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              These Terms of Service (Terms) constitute a legally binding agreement between you (User, You) and ServiZen (Company, We, Us). By accessing and using the ServiZen platform and services, you agree to be bound by these Terms. If you do not agree with any part of these Terms, you must cease using the Service immediately.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-500">2. Use License</h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-3">
              Permission is granted to temporarily download one copy of the materials (information or software) on ServiZen s Service for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
            </p>
            <h3 className="text-lg font-semibold mb-2">Under this license you may not:</h3>
            <ul className="list-disc pl-6 text-zinc-600 dark:text-zinc-400 space-y-2">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to decompile or reverse engineer any software contained on the Service</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or mirror the materials on any other server</li>
              <li>Violate any applicable laws or regulations related to access to the Service</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-500">3. Disclaimer</h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              The materials on ServiZen s Service are provided on an as is basis. ServiZen makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-500">4. Limitations</h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              In no event shall ServiZen or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on ServiZen s Service, even if ServiZen or an authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-500">5. Accuracy of Materials</h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              The materials appearing on ServiZen s Service could include technical, typographical, or photographic errors. ServiZen does not warrant that any of the materials on its Service are accurate, complete, or current. ServiZen may make changes to the materials contained on its Service at any time without notice.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-500">6. Links</h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              ServiZen has not reviewed all of the sites linked to its Service and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by ServiZen of the site. Use of any such linked website is at the user s own risk.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-500">7. Modifications</h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              ServiZen may revise these terms of service for its Service at any time without notice. By using this Service, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-500">8. Governing Law</h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              These terms and conditions are governed by and construed in accordance with the laws of Bangladesh, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-500">9. Contact Information</h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mt-3">
              Email: terms@servizen.com<br />
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
