import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  MessageSquare, Zap, Users, ArrowRight, ShieldCheck, Sparkles, 
  CheckCircle2, Play, BarChart3, Clock, Smartphone, ChevronDown, Check
} from "lucide-react";
import * as motion from "motion/react-client";

export default function Home() {
  const features = [
    {
      icon: <Users className="w-6 h-6 text-indigo-600" />,
      title: "Smart CRM Sync",
      description: "Instantly centralize all your prospect data into our scalable system. Never drop a lead again."
    },
    {
      icon: <Zap className="w-6 h-6 text-sky-500" />,
      title: "Gemini AI Engine",
      description: "Draft highly personalized, context-aware outreach instantly using state-of-the-art Google AI models."
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-emerald-500" />,
      title: "Native WhatsApp",
      description: "Automate engagement natively through the Meta Cloud API to ensure delivery and maximum reply rates."
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-indigo-600" />,
      title: "Conversion Tracking",
      description: "Monitor open rates, replies, and conversions in real-time with comprehensive analytics dashboards."
    },
    {
      icon: <Clock className="w-6 h-6 text-sky-500" />,
      title: "Smart Follow-ups",
      description: "Set up intelligent sequences that automatically follow up with leads based on their behavior."
    },
    {
      icon: <Smartphone className="w-6 h-6 text-emerald-500" />,
      title: "Mobile Optimized",
      description: "Manage your leads and approve AI-generated messages on the go with our fully responsive dashboard."
    }
  ];

  const testimonials = [
    {
      quote: "Before LeadPilot, we lost 30% of our leads by responding too late. Now, Gemini AI drafts perfect replies instantly. Our conversion rate tripled.",
      author: "Sarah Jenkins",
      role: "VP of Sales, TechGrowth",
      avatar: "SJ"
    },
    {
      quote: "The WhatsApp Cloud API integration is flawless. We moved from manual messaging to fully automated sequences in just two days.",
      author: "David Chen",
      role: "Founder, ScaleUp SaaS",
      avatar: "DC"
    },
    {
      quote: "I've tried every CRM tool for WhatsApp. LeadPilot is the only one that feels like a modern SaaS. Highly recommended.",
      author: "Elena Rodriguez",
      role: "Marketing Director, Bloom",
      avatar: "ER"
    }
  ];

  const faqs = [
    {
      question: "How does the Gemini AI integration work?",
      answer: "LeadPilot uses the latest Google Gemini models to analyze your lead's context, previous interactions, and your business details to draft highly personalized, human-like WhatsApp messages automatically."
    },
    {
      question: "Do I need technical skills to set it up?",
      answer: "Not at all. Our platform is designed to be plug-and-play. You can connect your Meta WhatsApp Business account and start automating conversations in under 10 minutes."
    },
    {
      question: "Is my data secure?",
      answer: "Yes. We use industry-standard encryption to protect your lead data. We do not use your proprietary conversation data to train public AI models."
    },
    {
      question: "Can I try it before buying?",
      answer: "Absolutely. We offer a 14-day free trial on all our plans, no credit card required."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 overflow-hidden">
      {/* Navigation */}
      <header className="px-6 md:px-12 h-24 flex items-center justify-between z-50 sticky top-0 bg-slate-50/80 backdrop-blur-xl border-b border-slate-200/50">
        <div className="flex items-center font-display font-bold text-2xl text-slate-900 tracking-tight">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-400 flex items-center justify-center mr-3 shadow-lg shadow-indigo-500/30">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          LeadPilot AI
        </div>
        <nav className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 mr-2">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a>
          </div>
          <Button variant="ghost" className="font-semibold hidden sm:inline-flex">Sign In</Button>
          <Button variant="default" className="font-semibold shadow-indigo-500/25">Get Started</Button>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center">
        {/* HERO SECTION */}
        <section className="w-full pt-28 pb-32 px-6 relative flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-5xl text-center z-10"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-sm text-indigo-700 text-sm font-bold mb-8"
            >
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>LeadPilot 2.0 with Gemini AI is live</span>
            </motion.div>
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tighter text-slate-900 mb-8 leading-[1.05]">
              Never Lose a <br className="hidden md:block"/>
              <span className="text-gradient bg-gradient-to-r from-emerald-500 to-sky-500">WhatsApp Lead</span> Again.
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
              Capture leads, draft hyper-personalized follow-ups with Google Gemini, and drive conversions on autopilot using the official Meta Cloud API.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-semibold rounded-2xl group">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="glass" className="w-full sm:w-auto h-14 px-8 text-lg font-semibold rounded-2xl group">
                <Play className="w-5 h-5 mr-2 text-indigo-600 group-hover:scale-110 transition-transform" />
                See how it works
              </Button>
            </div>
            <div className="flex items-center justify-center gap-6 mt-12 text-sm text-slate-500 font-medium">
              <span className="flex items-center"><ShieldCheck className="w-4 h-4 mr-2 text-emerald-500" /> No credit card required</span>
              <span className="flex items-center"><ShieldCheck className="w-4 h-4 mr-2 text-emerald-500" /> Cancel anytime</span>
            </div>
          </motion.div>
        </section>

        {/* DASHBOARD PREVIEW SECTION */}
        <section className="w-full max-w-6xl px-6 -mt-12 mb-32 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, type: "spring", bounce: 0.3 }}
            className="rounded-[2.5rem] p-2 bg-white/40 backdrop-blur-3xl border border-white/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500/20 via-sky-300/20 to-emerald-400/20 blur-2xl -z-10 rounded-[3rem]" />
            <div className="bg-slate-900 rounded-[2rem] w-full aspect-[16/9] border border-slate-800 shadow-2xl overflow-hidden flex flex-col align-center p-6 relative">
              {/* Mock Dashboard UI */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-slate-400 font-medium text-sm ml-4">leadpilot.ai / dashboard</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700"></div>
              </div>
              
              <div className="flex-1 flex gap-6">
                 {/* Sidebar */}
                 <div className="w-48 hidden md:flex flex-col gap-3">
                   <div className="h-10 rounded-lg bg-indigo-600/20 border border-indigo-500/30 w-full mb-4"></div>
                   <div className="h-8 rounded-lg bg-slate-800 w-full"></div>
                   <div className="h-8 rounded-lg bg-slate-800 w-full"></div>
                   <div className="h-8 rounded-lg bg-slate-800 w-[80%]"></div>
                 </div>
                 {/* Main Content */}
                 <div className="flex-1 flex flex-col gap-6">
                    <div className="flex gap-4">
                      <div className="flex-1 h-32 rounded-2xl bg-slate-800 border border-slate-700 p-5 flex flex-col justify-between">
                         <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30"></div>
                         <div>
                            <div className="text-slate-400 text-sm mb-1">Total Leads</div>
                            <div className="text-white text-3xl font-display font-medium">1,248</div>
                         </div>
                      </div>
                      <div className="flex-1 h-32 rounded-2xl bg-slate-800 border border-slate-700 p-5 flex flex-col justify-between">
                         <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/30"></div>
                         <div>
                            <div className="text-slate-400 text-sm mb-1">AI Replies</div>
                            <div className="text-white text-3xl font-display font-medium">8,492</div>
                         </div>
                      </div>
                      <div className="flex-1 h-32 rounded-2xl bg-slate-800 border border-slate-700 p-5 flex flex-col justify-between hidden lg:flex">
                         <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30"></div>
                         <div>
                            <div className="text-slate-400 text-sm mb-1">Conversion Rate</div>
                            <div className="text-white text-3xl font-display font-medium">24.8%</div>
                         </div>
                      </div>
                    </div>
                    {/* Chat Area */}
                    <div className="flex-1 rounded-2xl bg-slate-800 border border-slate-700 p-6 flex flex-col justify-end gap-3 pb-8">
                       <div className="self-end w-2/3 h-12 rounded-2xl rounded-tr-sm bg-indigo-600 border border-indigo-500 shadow-md"></div>
                       <div className="self-start w-1/2 h-20 rounded-2xl rounded-tl-sm bg-slate-700 border border-slate-600 flex items-start p-4 mb-2 relative">
                         <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-slate-800 shadow-sm">
                           <Sparkles className="w-3 h-3 text-white" />
                         </div>
                       </div>
                       <div className="self-end w-3/4 h-16 rounded-2xl rounded-tr-sm bg-indigo-600 border border-indigo-500 opacity-60"></div>
                    </div>
                 </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* LOGOS SECTION */}
        <section className="w-full py-10 border-y border-slate-200/60 bg-white/40 flex flex-col items-center">
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">Trusted by hyper-growth startups</p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-50 grayscale">
            <div className="text-2xl font-display font-bold">Acme Corp</div>
            <div className="text-2xl font-display font-bold">Globex</div>
            <div className="text-2xl font-display font-bold">Soylent</div>
            <div className="text-2xl font-display font-bold hidden md:block">Initech</div>
            <div className="text-2xl font-display font-bold hidden md:block">Umbrella</div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="w-full py-32 px-6 max-w-7xl relative">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6 tracking-tight">Everything you need to scale WhatsApp revenue.</h2>
            <p className="text-lg text-slate-600 font-medium">Stop wasting time manually responding to leads. Let AI do the heavy lifting while you focus on closing deals.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Card className="h-full border-white/80 hover:border-indigo-100/80 transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 shadow-sm">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-display font-bold text-slate-900 mb-3">{feature.title}</h3>
                    <p className="text-slate-600 font-medium leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" className="w-full py-32 px-6 bg-slate-900 text-white relative overflow-hidden">
          {/* Background decorations for dark section */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-600/20 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 tracking-tight text-white">How it works</h2>
              <p className="text-lg text-slate-400 font-medium">Three simple steps to put your WhatsApp lead generation on autopilot.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12 md:gap-8">
              {[
                { step: "01", title: "Connect", desc: "Link your WhatsApp Business account in one click." },
                { step: "02", title: "Configure", desc: "Tell Gemini about your business and define your ideal responses." },
                { step: "03", title: "Convert", desc: "Watch as AI engages leads instantly, 24/7, booking meetings for you." }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.2 }}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl font-display font-bold text-indigo-400 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-bold font-display mb-4 text-slate-100">{item.title}</h3>
                  <p className="text-slate-400 font-medium leading-relaxed max-w-xs">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section className="w-full py-32 px-6 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6 tracking-tight">Loved by founders & sales teams</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <Card key={idx} className="bg-white/60">
                <CardContent className="p-8 flex flex-col h-full">
                  <div className="flex gap-1 mb-6 text-yellow-400">
                    {[...Array(5)].map((_, i) => <StarIcon key={i} />)}
                  </div>
                  <p className="text-slate-700 italic flex-1 mb-8 font-medium leading-relaxed">
                    "{t.quote}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-sky-100 border border-slate-200 flex items-center justify-center text-indigo-700 font-bold font-display">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{t.author}</div>
                      <div className="text-sm font-medium text-slate-500">{t.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        
        {/* PRICING SECTION */}
        <section id="pricing" className="w-full py-24 px-6 max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6 tracking-tight">Simple, transparent pricing</h2>
            <p className="text-lg text-slate-600 font-medium">Start for free, upgrade when you need to scale.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Pro Plan */}
            <Card className="border-slate-200/60 bg-white/60">
              <CardContent className="p-10">
                <h3 className="text-2xl font-bold font-display text-slate-900 mb-2">Pro</h3>
                <p className="text-slate-500 font-medium mb-6">Perfect for small teams getting started.</p>
                <div className="mb-8 flex items-end gap-1">
                  <span className="text-5xl font-display font-extrabold text-slate-900">$49</span>
                  <span className="text-slate-500 font-medium mb-1">/mo</span>
                </div>
                <div className="space-y-4 mb-10">
                  {['1,000 AI Messages/mo', 'Single WhatsApp Number', 'Basic CRM Auth', 'Standard Support'].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                      <span className="text-slate-700 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full h-12 text-md font-bold rounded-xl" variant="outline">Start 14-day Free Trial</Button>
              </CardContent>
            </Card>
            
            {/* Enterprise Plan */}
            <Card className="border-indigo-500/30 bg-white relative shadow-2xl shadow-indigo-500/10 scale-100 md:scale-105 z-10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-500 to-sky-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                Most Popular
              </div>
              <CardContent className="p-10">
                <h3 className="text-2xl font-bold font-display text-slate-900 mb-2">Scale</h3>
                <p className="text-slate-500 font-medium mb-6">For teams automating at high volumes.</p>
                <div className="mb-8 flex items-end gap-1">
                  <span className="text-5xl font-display font-extrabold text-slate-900">$149</span>
                  <span className="text-slate-500 font-medium mb-1">/mo</span>
                </div>
                <div className="space-y-4 mb-10">
                  {['Unlimited AI Messages', 'Up to 5 WhatsApp Numbers', 'Advanced CRM Integrations', 'Priority 24/7 Support', 'Custom AI Prompting'].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      <span className="text-slate-700 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full h-12 text-md font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700">Get Started Now</Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="w-full py-24 px-6 max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-6 tracking-tight">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <Card key={idx} className="border-slate-200/60 bg-white/50 hover:bg-white/80 transition-colors">
                <CardContent className="p-6">
                  <h4 className="flex items-cnter justify-between text-lg font-bold text-slate-900 mb-2">
                    {faq.question}
                  </h4>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="w-full max-w-5xl mx-auto px-6 py-24 mb-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-[3rem] p-12 md:p-20 bg-gradient-to-br from-indigo-700 via-indigo-600 to-sky-600 text-center text-white relative overflow-hidden shadow-2xl shadow-indigo-600/30"
          >
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-display font-extrabold mb-6 tracking-tighter">Ready to scale your outreach?</h2>
              <p className="text-xl text-indigo-100 font-medium mb-12 max-w-2xl mx-auto">Join hundreds of modern sales teams automating their WhatsApp workflows with LeadPilot AI.</p>
              <Button size="lg" className="h-14 px-10 text-lg font-bold rounded-2xl bg-white text-indigo-600 hover:bg-slate-50 shadow-xl shadow-indigo-900/20">
                Start your 14-day free trial
              </Button>
              <p className="mt-8 text-indigo-200 text-sm font-medium">No credit card required. Setup takes 5 minutes.</p>
            </div>
          </motion.div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="w-full py-12 px-6 border-t border-slate-200/60 bg-white">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center font-display font-bold text-xl text-slate-900">
              <MessageSquare className="w-5 h-5 text-indigo-600 mr-2" />
              LeadPilot AI
            </div>
            <div className="flex items-center gap-8 text-sm font-medium text-slate-500">
               <a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
               <a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a>
               <a href="#" className="hover:text-indigo-600 transition-colors">Contact</a>
            </div>
            <div className="text-sm font-medium text-slate-400">
               © {new Date().getFullYear()} LeadPilot AI Inc. All rights reserved.
            </div>
         </div>
      </footer>
    </div>
  );
}

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
  </svg>
)
