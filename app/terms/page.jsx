'use client'

import Header from '@/Components/Header'
import Footer from '@/Components/Footer'
import { useTranslation } from 'react-i18next'

export default function TermsOfService() {
  const { t } = useTranslation()

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white py-16 px-5 md:px-10 lg:px-20">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-light text-gray-900 mb-3">{t('terms_of_service', 'Terms of Service')}</h1>
            <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
          
          <div className="space-y-10">
            <section>
              <h2 className="text-xl font-medium text-gray-800 mb-4 pb-2 border-b border-gray-100">1. Agreement to Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                By accessing or using our website, you agree to be bound by these Terms of Service 
                and all applicable laws and regulations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-gray-800 mb-4 pb-2 border-b border-gray-100">2. Use License</h2>
              <p className="text-gray-600 leading-relaxed">
                Permission is granted to temporarily access the materials on our website for personal, 
                non-commercial transitory viewing only.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-gray-800 mb-4 pb-2 border-b border-gray-100">3. Disclaimer</h2>
              <p className="text-gray-600 leading-relaxed">
                The materials on our website are provided on an 'as is' basis. We make no warranties, 
                expressed or implied, and hereby disclaim and negate all other warranties including, 
                without limitation, implied warranties or conditions of merchantability, fitness for 
                a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-gray-800 mb-4 pb-2 border-b border-gray-100">4. Limitations</h2>
              <p className="text-gray-600 leading-relaxed">
                In no event shall we or our suppliers be liable for any damages (including, without limitation, 
                damages for loss of data or profit, or due to business interruption) arising out of the use or 
                inability to use the materials on our website.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-gray-800 mb-4 pb-2 border-b border-gray-100">5. Accuracy of Materials</h2>
              <p className="text-gray-600 leading-relaxed">
                The materials appearing on our website could include technical, typographical, or photographic 
                errors. We do not warrant that any of the materials on our website are accurate, complete, or current.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-gray-800 mb-4 pb-2 border-b border-gray-100">6. Links</h2>
              <p className="text-gray-600 leading-relaxed">
                We have not reviewed all of the sites linked to our website and are not responsible for the 
                contents of any such linked site. The inclusion of any link does not imply endorsement by us.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-gray-800 mb-4 pb-2 border-b border-gray-100">7. Modifications</h2>
              <p className="text-gray-600 leading-relaxed">
                We may revise these terms of service for our website at any time without notice. By using 
                this website you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-gray-800 mb-4 pb-2 border-b border-gray-100">8. Governing Law</h2>
              <p className="text-gray-600 leading-relaxed">
                These terms and conditions are governed by and construed in accordance with the laws of 
                your country and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}