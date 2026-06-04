export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white p-8 md:p-16 text-slate-800">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold font-display text-slate-900">Privacy Policy</h1>
        <p className="text-sm text-slate-500">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-4">
          <h2 className="text-xl font-bold mt-8">1. Introduction</h2>
          <p>Welcome to LeadPilot. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our application.</p>
          
          <h2 className="text-xl font-bold mt-8">2. Information We Collect</h2>
          <p>We may collect information about you in a variety of ways, including data provided directly by you when you register for the app, and data relating to your messaging interactions through WhatsApp Business API integrations.</p>

          <h2 className="text-xl font-bold mt-8">3. How We Use Your Information</h2>
          <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. We use information collected about you to deliver the messaging services requested.</p>

          <h2 className="text-xl font-bold mt-8">4. Contact Us</h2>
          <p>If you have questions or comments about this Privacy Policy, please contact us.</p>
        </div>
      </div>
    </div>
  );
}
