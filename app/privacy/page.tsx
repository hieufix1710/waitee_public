'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'motion/react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Shield, Eye, Lock, FileText, Cookie, Mail } from 'lucide-react';

export default function PrivacyPage() {
  const { t } = useLanguage();

  const sections = [
    {
      icon: Shield,
      title: t.privacyPage.introduction.title,
      content: t.privacyPage.introduction.content
    },
    {
      icon: Eye,
      title: t.privacyPage.informationWeCollect.title,
      subsections: [
        {
          title: t.privacyPage.informationWeCollect.personal.title,
          content: t.privacyPage.informationWeCollect.personal.content
        },
        {
          title: t.privacyPage.informationWeCollect.usage.title,
          content: t.privacyPage.informationWeCollect.usage.content
        },
        {
          title: t.privacyPage.informationWeCollect.device.title,
          content: t.privacyPage.informationWeCollect.device.content
        }
      ]
    },
    {
      icon: FileText,
      title: t.privacyPage.howWeUse.title,
      content: t.privacyPage.howWeUse.content
    },
    {
      icon: Lock,
      title: t.privacyPage.dataSecurity.title,
      content: t.privacyPage.dataSecurity.content
    },
    {
      icon: Cookie,
      title: t.privacyPage.cookies.title,
      content: t.privacyPage.cookies.content
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
              {t.privacyPage.title}
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              {t.privacyPage.lastUpdated.replace('{{date}}', 'May 14, 2026')}
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
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    {t.privacyPage.yourRights.title}
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {t.privacyPage.yourRights.content}
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
                    {t.privacyPage.changes.title}
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {t.privacyPage.changes.content}
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
                {t.privacyPage.contact.title}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t.privacyPage.contact.content}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}