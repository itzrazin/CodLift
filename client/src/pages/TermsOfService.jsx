import React from 'react';
import { SEO } from '../utils/SEO';

export const TermsOfService = () => {
  const lastUpdated = "May 7, 2026";

  return (
    <div className="min-h-screen bg-background text-white pt-24 pb-16 px-6">
      <SEO 
        title="Terms of Service | CodLift"
        description="Terms of Service for using the CodLift platform."
        url="/terms-of-service"
      />
      
      <div className="max-w-3xl mx-auto prose prose-invert prose-cyan">
        <h1 className="text-4xl md:text-5xl font-syne font-extrabold mb-4">Terms of Service</h1>
        <p className="text-gray-400 mb-12">Last Updated: {lastUpdated}</p>

        <section className="mb-10">
          <h2 className="text-2xl font-syne font-bold mb-4 text-cyan">1. Acceptance of Terms</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            By accessing and using CodLift, you accept and agree to be bound by these terms.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-syne font-bold mb-4 text-cyan">2. Description of Service</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            CodLift is a free, interactive educational platform designed to teach coding. The platform is provided "as is".
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-syne font-bold mb-4 text-cyan">3. Contact Us</h2>
          <p className="text-gray-300 leading-relaxed">
            If you have any questions about these Terms, please contact us:<br/>
            <a href="mailto:hello@codlift.site" className="text-cyan hover:underline font-bold mt-2 inline-block">hello@codlift.site</a>
          </p>
        </section>

      </div>
    </div>
  );
};
