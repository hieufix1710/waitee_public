'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'motion/react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { FileText, CheckCircle, CreditCard, Shield, Database, AlertTriangle, Scale, Mail } from 'lucide-react';

export default function TermsPage() {
  const { t } = useLanguage();

  const sections = [
    {
      icon: FileText,
      title: t.termsPage.introduction.title,
      content: t.termsPage.introduction.content
    },
    {
      icon: CheckCircle,
      title: t.termsPage.acceptance.title,
      content: t.termsPage.acceptance.content
    },
    {
      icon: FileText,
      title: t.termsPage.services.title,
      content: t.termsPage.services.content
    },
    {
      icon: Shield,
      title: t.termsPage.userResponsibilities.title,
      subsections: [
        {
          title: t.termsPage.userResponsibilities.accuracy.title,
          content: t.termsPage.userResponsibilities.accuracy.content
        },
        {
          title: t.termsPage.userResponsibilities.security.title,
          content: t.termsPage.userResponsibilities.security.content
        },
        {
          title: t.termsPage.userResponsibilities.compliance.title,
          content: t.termsPage.userResponsibilities.compliance.content
        }
      ]
    },
    {
      icon: CreditCard,
      title: t.termsPage.payment.title,
      content: t.termsPage.payment.content
    },
    {
      icon: Shield,
      title: t.termsPage.intellectualProperty.title,
      content: t.termsPage.intellectualProperty.content
    },
    {
      icon: Database,
      title: t.termsPage.dataOwnership.title,
      content: t.termsPage.dataOwnership.content
    }
  ];

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t.termsPage.title}
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              {t.termsPage.lastUpdated.replace('{{date}}', 'May 14, 2026')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {sections.map((section, index) => {
              const IconComponent = section.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                        {section.title}
                      </h2>

                      {section.content && (
                        <p className="text-gray-700 leading-relaxed mb-6">
                          {section.content}
                        </p>
                      )}

                      {section.subsections && (
                        <div className="space-y-6">
                          {section.subsections.map((subsection, subIndex) => (
                            <div key={subIndex}>
                              <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {subsection.title}
                              </h3>
                              <p className="text-gray-700 leading-relaxed">
                                {subsection.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Additional Sections */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    {t.termsPage.termination.title}
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {t.termsPage.termination.content}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    {t.termsPage.disclaimer.title}
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {t.termsPage.disclaimer.content}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Scale className="w-6 h-6 text-red-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    {t.termsPage.limitation.title}
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {t.termsPage.limitation.content}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Scale className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    {t.termsPage.governingLaw.title}
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {t.termsPage.governingLaw.content}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    {t.termsPage.changes.title}
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {t.termsPage.changes.content}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-blue-50 rounded-lg p-8 text-center"
            >
              <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t.termsPage.contact.title}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t.termsPage.contact.content}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}