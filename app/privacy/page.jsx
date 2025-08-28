'use client'

import Header from '@/Components/Header'
import Footer from '@/Components/Footer'
import { useTranslation } from 'react-i18next'

export default function PrivacyPolicy() {
  const { t } = useTranslation()

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white py-16 px-5 md:px-10 lg:px-20">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-light text-gray-900 mb-3">{t('privacy_policy', 'Privacy Policy')}</h1>
            <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
          
          <div className="space-y-10">
            <section>
              <h2 className="text-xl font-medium text-gray-800 mb-4 pb-2 border-b border-gray-100">1. Information We Collect</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                We collect information you provide directly to us, such as when you create an account, 
                subscribe to our newsletter, or contact us for support. This may include:
              </p>
              <ul className="text-gray-600 space-y-2 pl-5">
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  Name and contact information
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  Email address
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  Communication preferences
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  Any other information you choose to provide
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-medium text-gray-800 mb-4 pb-2 border-b border-gray-100">2. How We Use Your Information</h2>
              <p className="text-gray-600 mb-4">We use the information we collect to:</p>
              <ul className="text-gray-600 space-y-2 pl-5">
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  Provide, maintain, and improve our services
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  Respond to your comments, questions, and requests
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  Send you technical notices and support messages
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  Communicate with you about products, services, and events
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  Monitor and analyze trends, usage, and activities
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-medium text-gray-800 mb-4 pb-2 border-b border-gray-100">3. Information Sharing</h2>
              <p className="text-gray-600 leading-relaxed">
                We do not sell, trade, or otherwise transfer your personally identifiable information 
                to outside parties without your consent, except as described in this policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-gray-800 mb-4 pb-2 border-b border-gray-100">4. Data Security</h2>
              <p className="text-gray-600 leading-relaxed">
                We implement appropriate security measures to protect your personal information 
                against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-gray-800 mb-4 pb-2 border-b border-gray-100">5. Your Rights</h2>
              <p className="text-gray-600 leading-relaxed">
                You have the right to access, correct, or delete your personal information. 
                You may also have the right to restrict or object to certain processing activities.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-gray-800 mb-4 pb-2 border-b border-gray-100">6. Contact Us</h2>
              <p className="text-gray-600 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us to our email or whats app number
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}