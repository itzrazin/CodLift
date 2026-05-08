import React from 'react';
import { SEO } from '../utils/SEO';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

const TermsOfService = () => {
  const lastUpdated = "May 7, 2026";

  return (
    <div className="min-h-screen bg-background text-white pt-32 pb-16 px-6">
      <SEO 
        title="Terms of Service | CodLift"
        description="Read our Terms of Service to understand the rules and guidelines for using the CodLift interactive coding platform."
        url="/terms-of-service"
      />
      <Navbar />

      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-syne font-extrabold mb-4 tracking-tight">Terms of Service</h1>
        <p className="text-gray-500 mb-12 font-mono text-sm uppercase tracking-widest">Last Updated: {lastUpdated}</p>

        <div className="prose prose-invert prose-purple max-w-none prose-h2:font-syne prose-h2:text-2xl prose-h2:font-bold prose-p:text-gray-400 prose-p:leading-relaxed prose-li:text-gray-400">
          <section>
            <h2>1. Agreement to Terms</h2>
            <p>
              By accessing or using CodLift (the "Site"), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use our services.
            </p>
          </section>

          <section>
            <h2>2. Educational Use and Editor</h2>
            <p>
              The CodLift interactive code editor is provided for educational purposes only. You are permitted to write, run, and test code as part of our curriculum. However, you agree not to use the platform for:
            </p>
            <ul>
              <li>Executing malicious scripts or attempting to breach our server security.</li>
              <li>Hosting illegal content or using the platform for non-educational data storage.</li>
              <li>Mining cryptocurrency or performing high-compute tasks that degrade service for other users.</li>
            </ul>
          </section>

          <section>
            <h2>3. User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account information, including your Google or GitHub login sessions. You must notify us immediately of any unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2>4. Intellectual Property</h2>
            <p>
              The platform's content, including curriculum text, lesson structure, and gamification elements, is the property of CodLift. You may use this content for personal, non-commercial learning only.
            </p>
          </section>

          <section>
            <h2>5. Disclaimer of Liability</h2>
            <p>
              <strong>CodLift is an educational platform.</strong> The code executed in our sandbox environments is for learning purposes. We are not responsible for any real-world consequences, data loss, or security issues resulting from the use of code snippets learned on this site.
            </p>
          </section>

          <section>
            <h2>6. Termination</h2>
            <p>
              We reserve the right to terminate or suspend access to our platform immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users of the Site.
            </p>
          </section>

          <section>
            <h2>7. Contact</h2>
            <p>
              For any questions regarding these Terms, please reach out to us at:
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

export default TermsOfService;
