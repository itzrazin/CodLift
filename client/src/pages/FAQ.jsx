import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { SEO } from '../utils/SEO';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/ui/Core';
import { HelpCircle, ChevronRight, Globe, ShieldCheck, Trophy } from 'lucide-react';

const FAQItem = ({ question, answer }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="mb-8"
  >
    <h3 className="text-xl md:text-2xl font-syne font-extrabold mb-3 flex items-center gap-3">
      <HelpCircle className="w-6 h-6 text-purple shrink-0" />
      {question}
    </h3>
    <div className="pl-9">
      <p className="text-gray-400 text-lg leading-relaxed">
        {answer}
      </p>
    </div>
  </motion.div>
);

const FAQ = () => {
  const faqs = [
    {
      question: "What is CodLift?",
      answer: "CodLift is a premium, interactive coding platform designed to help beginners master full-stack development. Unlike traditional platforms that focus on video lectures, CodLift emphasizes 'learning by doing' through an integrated, interactive IDE and AI-powered feedback system."
    },
    {
      question: "How does CodLift help me learn faster?",
      answer: "CodLift accelerates learning by removing the gap between theory and practice. You spend 90% of your time writing real code in your browser, receiving instant AI validation. This active engagement builds muscle memory and problem-solving skills much faster than passive watching."
    },
    {
      question: "What programming languages can I learn on CodLift?",
      answer: "Currently, CodLift offers comprehensive tracks for HTML5, CSS3, JavaScript (ES6+), and React. We are constantly expanding our curriculum to include Python, Node.js, and System Design to provide a complete full-stack path."
    },
    {
      question: "Is CodLift free?",
      answer: "Yes! CodLift offers a robust free tier that includes all fundamental lessons, the interactive coding arena, and daily challenges. We believe high-quality coding education should be accessible to everyone."
    },
    {
      question: "How does the AI code checker work?",
      answer: "Our proprietary AI Verification System analyzes your code against specific lesson requirements and test cases in real-time. It doesn't just check if the code runs; it verifies your logic and provides helpful hints if you get stuck, acting like a 1-on-1 mentor."
    },
    {
      question: "Is the AI feedback on CodLift accurate?",
      answer: "Highly accurate. We utilize advanced models (like Claude 3.5 Sonnet) trained specifically on coding syntax and educational pedagogy. The feedback is designed to be encouraging and strict on logic, ensuring you learn best practices from day one."
    },
    {
      question: "Can I track my progress?",
      answer: "Absolutely. CodLift features an interactive dashboard where you can track your skill tree progress and coding stats. Your progress is synced across devices, allowing you to resume your learning journey exactly where you left off."
    },
    {
      question: "Does CodLift provide a certificate?",
      answer: "While we focus on skill-based progression, completing major tracks unlocks 'Mastery Badges' on your profile. These verifiable achievements serve as a testament to your hands-on coding proficiency."
    }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer
      }
    }))
  };

  return (
    <div className="min-h-screen bg-background text-white selection:bg-purple/30">
      <SEO 
        title="Frequently Asked Questions | CodLift"
        description="Find answers to common questions about CodLift, our interactive coding lessons, AI feedback system, and how to start your coding journey."
        url="/faq"
        schema={faqSchema}
      />
      <Navbar />

      <main className="container mx-auto px-6 py-24 md:py-32">
        <div className="max-w-4xl mx-auto">
          <header className="mb-20 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple/10 border border-purple/20 text-purple text-xs font-bold mb-6"
            >
              <Trophy className="w-3 h-3" /> HELP CENTER
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-syne font-extrabold tracking-tight mb-8">
              Common <span className="text-gradient-purple">Questions</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
              Everything you need to know about the CodLift platform, our pedagogical 
              approach, and how to maximize your learning.
            </p>
          </header>

          <section className="grid gap-4">
            {faqs.map((faq, index) => (
              <FAQItem key={index} {...faq} />
            ))}
          </section>

          <GlassCard className="mt-20 p-10 md:p-16 text-center bg-gradient-to-br from-purple/10 to-transparent border-purple/20">
            <h2 className="text-3xl font-syne font-extrabold mb-6">Still have questions?</h2>
            <p className="text-gray-400 mb-10 max-w-xl mx-auto">
              Our community is here to help. Join our Discord or reach out to us 
              directly for 1-on-1 support.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="px-8 py-4 bg-purple text-black font-bold rounded-2xl hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all">
                Join Discord
              </button>
              <button className="px-8 py-4 border border-white/10 font-bold rounded-2xl hover:bg-white/5 transition-all">
                Contact Support
              </button>
            </div>
          </GlassCard>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
