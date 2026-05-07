import React from 'react';
import { SEO } from '../utils/SEO';

const PrivacyPolicy = () => {
  const lastUpdated = "May 7, 2026";

  return (
    <div className="min-h-screen bg-background text-white pt-24 pb-16 px-6">
      <SEO 
        title="Privacy Policy | CodLift"
        description="Privacy Policy for CodLift. Learn how we collect, use, and protect your data."
        url="/privacy-policy"
      />
      
      <div className="max-w-3xl mx-auto prose prose-invert prose-cyan">
        <h1 className="text-4xl md:text-5xl font-syne font-extrabold mb-4">Privacy Policy</h1>
        <p className="text-gray-400 mb-12">Last Updated: {lastUpdated}</p>

        <section className="mb-10">
          <h2 className="text-2xl font-syne font-bold mb-4 text-cyan">1. Information We Collect</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            When you use CodLift, we collect information that you provide directly to us, including:
          </p>
          <ul className="list-disc pl-6 text-gray-300 space-y-2">
            <li><strong>Account Information:</strong> Username, email address, and profile details provided during sign-up or via third-party OAuth providers (Google, GitHub).</li>
            <li><strong>Learning Data:</strong> Your progress, completed exercises, code submissions, XP earned, and streak information.</li>
            <li><strong>Usage Data:</strong> Information about how you interact with our platform, pages visited, and time spent on lessons.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-syne font-bold mb-4 text-cyan">2. How We Use Your Information</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 text-gray-300 space-y-2">
            <li>Provide, maintain, and improve the CodLift platform and curriculum.</li>
            <li>Personalize your learning experience and track your progress.</li>
            <li>Communicate with you regarding account updates, security alerts, and support messages.</li>
            <li>Analyze usage patterns to enhance platform performance and user experience.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-syne font-bold mb-4 text-cyan">3. Google AdSense and Cookies</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            We use third-party advertising companies, including Google AdSense, to serve ads when you visit our website. These companies may use cookies to collect non-personally identifiable information.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-syne font-bold mb-4 text-cyan">4. Contact Us</h2>
          <p className="text-gray-300 leading-relaxed">
            If you have any questions or concerns, please contact us at:<br/>
            <a href="mailto:hello@codlift.site" className="text-cyan hover:underline font-bold mt-2 inline-block">hello@codlift.site</a>
          </p>
        </section>

      </div>
    </div>
  );
};

export default PrivacyPolicy;

