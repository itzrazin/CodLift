import React, { useState } from 'react';
import { SEO } from '../utils/SEO';
import { motion } from 'framer-motion';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { GlassCard, Button } from '../components/ui/Core';
import { 
  Mail as MailIcon, 
  MessageSquare as MessageIcon, 
  MapPin as MapIcon, 
  Send as SendIcon, 
  CheckCircle2 as CheckIcon, 
  Sparkles as SparkleIcon, 
  Globe as GlobeIcon, 
  Linkedin as LinkedinIcon, 
  Github as GithubIcon, 
  Twitter as TwitterIcon 
} from 'lucide-react';

const ContactInfo = ({ icon: Icon, title, detail, subdetail }) => (
  <div className="flex gap-5">
    <div className="w-12 h-12 rounded-2xl bg-purple/10 border border-purple/20 flex items-center justify-center shrink-0">
      <Icon className="w-6 h-6 text-purple" />
    </div>
    <div>
      <h4 className="font-syne font-bold text-lg mb-1">{title}</h4>
      <p className="text-gray-300 font-medium">{detail}</p>
      {subdetail && <p className="text-gray-500 text-sm">{subdetail}</p>}
    </div>
  </div>
);

const Contact = () => {
  const [formStatus, setFormStatus] = useState('idle'); // idle | loading | success

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus('loading');
    // Simulate API call
    setTimeout(() => {
      setFormStatus('success');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background text-white selection:bg-purple/30">
      <SEO 
        title="Contact Us | CodLift Support"
        description="Have a question or need technical support? Reach out to the CodLift team. We're here to help you on your coding journey."
        url="/contact"
      />
      <Navbar />

      <main className="pt-32 pb-24 px-6 relative overflow-hidden">
        {/* Abstract background blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/5 blur-[120px] rounded-full translate-y-1/3 -translate-x-1/4" />

        <div className="container mx-auto max-w-6xl">
          <header className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple/10 border border-purple/20 text-purple text-xs font-bold mb-6 uppercase tracking-widest"
            >
              <SparkleIcon className="w-3 h-3" /> Connect with us
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-syne font-extrabold tracking-tight mb-8">
              We're here to <span className="text-gradient-purple">help</span>.
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Whether you're a student with a question, a developer with feedback, 
              or a company looking for talent — let's start the conversation.
            </p>
          </header>

          <div className="grid lg:grid-cols-5 gap-12 items-start">
            {/* Left: Contact Details */}
            <div className="lg:col-span-2 space-y-12">
              <div className="space-y-10">
                <ContactInfo 
                  icon={MailIcon} 
                  title="Direct Support" 
                  detail="support@codlift.site" 
                  subdetail="Typically replies within 24 hours"
                />
                <ContactInfo 
                  icon={MessageIcon} 
                  title="Community Help" 
                  detail="Join our Discord" 
                  subdetail="Instant help from fellow learners"
                />
                <ContactInfo 
                  icon={MapIcon} 
                  title="Global HQ" 
                  detail="Digital First" 
                  subdetail="Built with ❤️ by a remote team"
                />
              </div>

              <div className="pt-10 border-t border-white/5">
                <h4 className="font-syne font-bold mb-6 text-gray-400 uppercase tracking-widest text-xs">Follow our journey</h4>
                <div className="flex gap-4">
                  {[TwitterIcon, GithubIcon, LinkedinIcon, GlobeIcon].map((Icon, i) => (
                    <a key={i} href="#" className="w-12 h-12 rounded-2xl bg-navy border border-white/5 flex items-center justify-center hover:bg-purple hover:text-navy hover:-translate-y-1 transition-all">
                      <Icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="lg:col-span-3">
              <GlassCard className="p-8 md:p-12 border-white/5">
                {formStatus === 'success' ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
                      <CheckIcon className="w-10 h-10 text-green-500" />
                    </div>
                    <h2 className="text-3xl font-syne font-extrabold mb-4">Message Sent!</h2>
                    <p className="text-gray-400 mb-8 max-w-sm mx-auto">
                      Thanks for reaching out. A CodLift engineer will be in touch with you shortly.
                    </p>
                    <Button variant="ghost" onClick={() => setFormStatus('idle')}>
                      Send another message
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Your Name</label>
                        <input 
                          required
                          type="text" 
                          placeholder="John Doe"
                          className="w-full bg-navy/50 border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-purple/50 transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Email Address</label>
                        <input 
                          required
                          type="email" 
                          placeholder="john@example.com"
                          className="w-full bg-navy/50 border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-purple/50 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Subject</label>
                      <select className="w-full bg-navy/50 border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-purple/50 transition-colors appearance-none">
                        <option>General Inquiry</option>
                        <option>Technical Support</option>
                        <option>Curriculum Feedback</option>
                        <option>Partnership Proposal</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">How can we help?</label>
                      <textarea 
                        required
                        rows={5}
                        placeholder="Tell us about your request..."
                        className="w-full bg-navy/50 border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-purple/50 transition-colors resize-none"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full py-5 rounded-2xl text-lg group"
                      disabled={formStatus === 'loading'}
                    >
                      {formStatus === 'loading' ? (
                        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto" />
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          Send Message <SendIcon className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </span>
                      )}
                    </Button>
                  </form>
                )}
              </GlassCard>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
