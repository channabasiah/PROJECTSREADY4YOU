import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiSave, FiCheck, FiX } from 'react-icons/fi';
import { useAuthStore } from '@/lib/store';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getEmailTemplate, saveEmailTemplate, getDefaultEmailTemplate } from '@/lib/db';

const EmailSettings = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [templateData, setTemplateData] = useState({
    subject: '',
    content: '',
    whatsappSupport: '+919986062337',
    emailSupport: 'support@projectsready4you.com',
  });

  useEffect(() => {
    // Check if user is admin
    if (!user) {
      router.push('/login');
      return;
    }

    if (!user.email?.includes('admin')) {
      alert('⛔ Access Denied! Only admins can access this page.');
      router.push('/projects');
      return;
    }

    loadTemplate();
  }, [user, router]);

  const loadTemplate = async () => {
    try {
      let template = await getEmailTemplate('request-received');
      if (!template) {
        template = getDefaultEmailTemplate();
      }
      setTemplateData({
        subject: template.subject || '',
        content: template.content || '',
        whatsappSupport: template.whatsappSupport || '+919986062337',
        emailSupport: template.emailSupport || 'support@projectsready4you.com',
      });
    } catch (error) {
      console.error('Error loading template:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTemplate = async (e: any) => {
    e.preventDefault();

    if (!templateData.subject || !templateData.content) {
      setMessage('✗ Please fill all fields');
      return;
    }

    if (!templateData.whatsappSupport || !templateData.emailSupport) {
      setMessage('✗ Please fill support contact information');
      return;
    }

    setSaving(true);
    try {
      await saveEmailTemplate('request-received', {
        subject: templateData.subject,
        content: templateData.content,
        whatsappSupport: templateData.whatsappSupport,
        emailSupport: templateData.emailSupport,
      });
      setMessage('✓ Email template saved successfully!');
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (error: any) {
      console.error('Error saving template:', error);
      setMessage(`✗ Error: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefault = async () => {
    if (confirm('Are you sure? This will reset to the default template.')) {
      const defaultTemplate = getDefaultEmailTemplate();
      setTemplateData({
        subject: defaultTemplate.subject,
        content: defaultTemplate.content,
        whatsappSupport: '+919986062337',
        emailSupport: 'support@projectsready4you.com',
      });
      setMessage('↻ Reset to default template');
      setTimeout(() => setMessage(''), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0e27] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neon-cyan"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0b0e27] via-[#151a36] to-[#0b0e27] py-8 sm:py-12">
      <div className="w-full px-4 sm:px-6 md:px-8 max-w-4xl mx-auto">
        {/* Breadcrumbs */}
        <div className="mb-4 sm:mb-6">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Admin', href: '/admin' }, { label: 'Email Settings' }]} />
        </div>

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-neon-cyan hover:text-neon-green transition-colors mb-8"
        >
          <FiArrowLeft size={20} />
          Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#151a36] border-2 border-neon-cyan rounded-lg p-8 box-glow-cyan"
        >
          <h1 className="text-3xl md:text-4xl font-bold neon-cyan-glow mb-2">Email Template Settings</h1>
          <p className="text-text-light mb-8">Customize the email sent to users when they submit a request.</p>

          {message && (
            <div className={`mb-6 p-4 rounded-lg font-semibold flex items-center gap-2 ${
              message.startsWith('✓')
                ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                : 'bg-red-500/20 text-red-300 border border-red-500/30'
            }`}>
              {message.startsWith('✓') ? <FiCheck size={20} /> : <FiX size={20} />}
              {message}
            </div>
          )}

          <form onSubmit={handleSaveTemplate} className="space-y-6">
            {/* Subject Line */}
            <div>
              <label className="block text-text-light text-sm font-semibold mb-2">Email Subject *</label>
              <input
                type="text"
                value={templateData.subject}
                onChange={(e) => setTemplateData({ ...templateData, subject: e.target.value })}
                placeholder="Enter email subject"
                className="w-full px-4 py-3 bg-[#0b0e27] border border-neon-cyan rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green transition-all"
                required
              />
              <p className="text-xs text-text-light mt-1">💡 This appears in the user's inbox as the email subject</p>
            </div>

            {/* Email Content */}
            <div>
              <label className="block text-text-light text-sm font-semibold mb-2">Email Content (HTML) *</label>
              <textarea
                value={templateData.content}
                onChange={(e) => setTemplateData({ ...templateData, content: e.target.value })}
                placeholder="Enter email content (supports HTML)"
                rows={15}
                className="w-full px-4 py-3 bg-[#0b0e27] border border-neon-cyan rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green transition-all font-mono text-sm"
                required
              />
              <p className="text-xs text-text-light mt-2">
                💡 <strong>Available variables:</strong> {'{{userName}}'}, {'{{projectName}}'}, {'{{requestId}}'}, {'{{amount}}'}, {'{{whatsappSupport}}'}, {'{{emailSupport}}'}
              </p>
            </div>

            {/* Support Contact Information */}
            <div className="bg-[#0b0e27] border border-neon-green rounded-lg p-6 space-y-4">
              <h3 className="text-text-light font-semibold neon-green-glow">Support Contact Information</h3>
              
              <div>
                <label className="block text-text-light text-sm font-semibold mb-2">WhatsApp Support Number *</label>
                <input
                  type="tel"
                  value={templateData.whatsappSupport}
                  onChange={(e) => setTemplateData({ ...templateData, whatsappSupport: e.target.value })}
                  placeholder="+919986062337"
                  className="w-full px-4 py-3 bg-[#151a36] border border-neon-cyan rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-text-light text-sm font-semibold mb-2">Email Support Address *</label>
                <input
                  type="email"
                  value={templateData.emailSupport}
                  onChange={(e) => setTemplateData({ ...templateData, emailSupport: e.target.value })}
                  placeholder="support@projectsready4you.com"
                  className="w-full px-4 py-3 bg-[#151a36] border border-neon-cyan rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green transition-all"
                  required
                />
              </div>
            </div>

            {/* Preview */}
            <div>
              <label className="block text-text-light text-sm font-semibold mb-2">Preview</label>
              <div 
                className="bg-[#0b0e27] border border-neon-green rounded-lg p-6"
                dangerouslySetInnerHTML={{
                  __html: templateData.content
                    .replace(/{{userName}}/g, 'John Doe')
                    .replace(/{{projectName}}/g, 'Employee Management System')
                    .replace(/{{requestId}}/g, 'REQ-2026-0001')
                    .replace(/{{amount}}/g, '300')
                    .replace(/{{whatsappSupport}}/g, templateData.whatsappSupport)
                    .replace(/{{emailSupport}}/g, templateData.emailSupport)
                }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 flex-wrap">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-neon-cyan to-neon-green text-black font-bold rounded-lg hover:shadow-neon-glow transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <FiSave size={20} />
                {saving ? 'Saving...' : 'Save Template'}
              </button>
              <button
                type="button"
                onClick={handleResetToDefault}
                className="flex-1 px-6 py-3 bg-[#0b0e27] border-2 border-neon-cyan text-neon-cyan font-bold rounded-lg hover:bg-neon-cyan hover:text-black transition-all"
              >
                Reset to Default
              </button>
            </div>
          </form>

          <div className="mt-8 p-4 bg-[#0b0e27] border border-neon-cyan rounded-lg">
            <p className="text-text-light text-sm">
              ℹ️ <strong>Note:</strong> Changes will apply to all future payment requests. Make sure to test the template before publishing.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EmailSettings;
