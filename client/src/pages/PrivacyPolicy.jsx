import React from 'react';
import { SEO } from '../utils/SEO';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

const PrivacyPolicy = () => {
  const lastUpdated = "May 7, 2026";

  return (
    <div className="min-h-screen bg-background text-white pt-32 pb-16 px-6">
      <SEO 
        title="Privacy Policy | CodLift"
        description="Privacy Policy for CodLift. Learn how we collect, use, and protect your data according to Google AdSense standards."
        url="/privacy-policy"
      />
      <Navbar />
      
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-syne font-extrabold mb-4 tracking-tight">Privacy Policy</h1>
        <p className="text-gray-500 mb-12 font-mono text-sm uppercase tracking-widest">Last Updated: {lastUpdated}</p>

        <div className="prose prose-invert prose-purple max-w-none prose-h2:font-syne prose-h2:text-2xl prose-h2:font-bold prose-p:text-gray-400 prose-p:leading-relaxed prose-li:text-gray-400">
          <section>
            <h2>1. Introduction</h2>
            <p>
              Welcome to CodLift ("we," "us," or "our"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website at codlift.site and use our interactive coding platform.
            </p>
          </section>

          <section>
            <h2>2. Information We Collect</h2>
            <h3>Directly Provided Information</h3>
            <p>
              We collect information that you voluntarily provide to us when you register on the platform. This includes your name, email address, and profile picture.
            </p>
            <h3>Third-Party Authentication (Google OAuth)</h3>
            <p>
              When you log in using Google OAuth, we receive your public profile information (name and email) from Google. We use this data strictly to create and manage your CodLift account. We do not have access to your Google password or any other private data within your Google account.
            </p>
          </section>

          <section>
            <h2>3. Cookies and Tracking Technologies</h2>
            <p>
              We use "cookies" to collect information and improve our services.
            </p>
            <h3>Google Analytics</h3>
            <p>
              We use Google Analytics to monitor and analyze web traffic. Google Analytics is a web analysis service provided by Google Inc. ("Google"). Google utilizes the Data collected to track and examine the use of this Application, to prepare reports on its activities and share them with other Google services.
            </p>
            <h3>Google AdSense and DoubleClick DART Cookie</h3>
            <p>
              Google, as a third-party vendor, uses cookies to serve ads on our site. Google's use of the DoubleClick DART cookie enables it and its partners to serve ads to our users based on their visit to our site or other sites on the Internet. You may opt out of the use of the DART cookie for interest-based advertising by visiting <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.
            </p>
          </section>

          <section>
            <h2>4. Data Protection and Sharing</h2>
            <p>
              <strong>We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties.</strong> This does not include trusted third parties who assist us in operating our website, so long as those parties agree to keep this information confidential.
            </p>
          </section>

          <section>
            <h2>5. Contact Us</h2>
            <p>
              If you have any questions regarding this Privacy Policy, you may contact us using the information below:
            </p>
            <p className="font-bold text-white">
              Email: support@codlift.site
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
