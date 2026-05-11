import React from 'react';
import SEO from '../components/common/SEO';
import Breadcrumb from '../components/common/Breadcrumb';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SEO title="Privacy Policy" path="/privacy-policy" description="GovtExamPath privacy policy. Learn how we collect, use, and protect your personal information." />
      <Breadcrumb items={[{ label: 'Privacy Policy' }]} />

      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-8">
        Privacy <span className="gradient-text">Policy</span>
      </h1>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-gray-500"><strong>Last updated:</strong> April 24, 2026</p>

        <h2>1. Information We Collect</h2>
        <p>When you use GovtExamPath, we may collect the following information:</p>
        <ul>
          <li><strong>Account Information:</strong> Name, email address, and password when you create an account.</li>
          <li><strong>Usage Data:</strong> Pages visited, features used, and time spent on the platform (collected via Google Analytics).</li>
          <li><strong>Device Information:</strong> Browser type, operating system, and screen resolution for improving user experience.</li>
          <li><strong>Preferences:</strong> Bookmarked exams, notification preferences, and eligibility checker inputs.</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>We use collected information to:</p>
        <ul>
          <li>Provide personalized exam recommendations through our AI Career Guide.</li>
          <li>Save your bookmarks and notification preferences.</li>
          <li>Send exam notification alerts you've subscribed to.</li>
          <li>Improve our platform features and content based on usage patterns.</li>
          <li>Respond to your questions and support requests.</li>
        </ul>

        <h2>3. Information Sharing</h2>
        <p>We <strong>do not sell, trade, or rent</strong> your personal information to third parties. We may share anonymized, aggregated data for analytics purposes. We use the following third-party services:</p>
        <ul>
          <li><strong>Google Analytics</strong> — For understanding site usage and improving features.</li>
          <li><strong>Netlify</strong> — For hosting the website.</li>
          <li><strong>Render</strong> — For hosting backend services.</li>
          <li><strong>MongoDB Atlas</strong> — For secure database storage.</li>
        </ul>

        <h2>4. Data Security</h2>
        <p>We implement industry-standard security measures to protect your data:</p>
        <ul>
          <li>Passwords are hashed using bcrypt and never stored in plain text.</li>
          <li>HTTPS encryption for all data in transit.</li>
          <li>JWT (JSON Web Tokens) for secure authentication.</li>
          <li>Rate limiting to prevent abuse.</li>
          <li>Regular security reviews of our codebase.</li>
        </ul>

        <h2>5. Cookies and Tracking Technologies</h2>
        <p>We use cookies and local storage for:</p>
        <ul>
          <li>Keeping you logged in (authentication tokens).</li>
          <li>Remembering your dark/light theme preference.</li>
          <li>Google Analytics tracking (you can opt out using browser settings).</li>
        </ul>

        <h2>6. Advertising and Google AdSense</h2>
        <p>GovtExamPath uses Google AdSense to display advertisements. Google AdSense is a third-party advertising service provided by Google LLC. Regarding advertising on our platform:</p>
        <ul>
          <li><strong>Third-party cookies:</strong> Google and its advertising partners may use cookies, web beacons, and similar technologies to serve advertisements based on your prior visits to our website and other websites on the internet.</li>
          <li><strong>Personalized advertising:</strong> Google may use the DART cookie and other technologies to display ads based on your browsing history and interests. You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google's Ad Settings</a>.</li>
          <li><strong>Third-party ad networks:</strong> Third-party vendors, including Google, use cookies to serve ads based on your prior visits. You can opt out of third-party vendor cookies for personalized advertising by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">aboutads.info</a>.</li>
          <li><strong>Data collection by advertisers:</strong> Advertisers and ad networks may collect information such as your IP address, browser type, pages visited, and interaction with ads. This data collection is governed by the respective advertisers' privacy policies.</li>
          <li><strong>No control over ad content:</strong> We do not control the content of advertisements displayed by Google AdSense. If you encounter inappropriate ads, please report them to us or directly to Google.</li>
        </ul>

        <h2>7. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal data stored on our platform.</li>
          <li>Update or correct your account information.</li>
          <li>Delete your account and associated data.</li>
          <li>Opt out of email notifications.</li>
          <li>Disable cookies through your browser settings.</li>
        </ul>

        <h2>8. Children's Privacy</h2>
        <p>GovtExamPath is intended for users aged 14 and above. We do not knowingly collect information from children under 14. If you are under 14, please use our platform with parental guidance.</p>

        <h2>9. Changes to This Policy</h2>
        <p>We may update this privacy policy from time to time. Changes will be posted on this page with an updated revision date. Continued use of the platform after changes constitutes acceptance of the revised policy.</p>

        <h2>10. Contact Us</h2>
        <p>If you have questions about this privacy policy or your personal data, contact us at:</p>
        <ul>
          <li>Email: <a href="mailto:govtexampath@gmail.com">govtexampath@gmail.com</a></li>
          <li>Address: New Delhi, India</li>
        </ul>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
