// src/app/privacy/page.tsx
'use client';

import { useState, useEffect } from 'react';

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-2xl font-bold font-headline mt-8 mb-4">{children}</h2>
);

const SubSectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-xl font-semibold font-headline mt-6 mb-3">{children}</h3>
);

export default function PrivacyPolicyPage() {
    const [lastUpdated, setLastUpdated] = useState('');

    useEffect(() => {
        setLastUpdated(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
    }, []);

    return (
        <div className="bg-secondary/30">
            <div className="container text-center py-16 lg:py-24">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-headline">
                    Privacy Policy
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                    Last Updated: {lastUpdated}
                </p>
            </div>

            <div className="container pb-24 max-w-4xl mx-auto bg-card p-8 sm:p-12 rounded-lg shadow-lg">
                <div className="prose prose-lg max-w-none text-muted-foreground">
                    <p>Shopiggo, Inc. ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services (collectively, the "Services").</p>
                    
                    <SectionTitle>1. Information We Collect</SectionTitle>
                    <p>We may collect information about you in a variety of ways. The information we may collect via the Services includes:</p>
                    <SubSectionTitle>1.1. Personal Data</SubSectionTitle>
                    <p>Personally identifiable information, such as your name, email address, and demographic information, that you voluntarily give to us when you register with the Services or when you choose to participate in various activities related to the Services.</p>
                     <SubSectionTitle>1.2. Financial Data</SubSectionTitle>
                    <p>We do not store any financial information. All financial information is stored and processed by our payment processor, Stripe. You are encouraged to review their privacy policy and contact them directly for responses to your questions.</p>
                    <SubSectionTitle>1.3. Usage Data</SubSectionTitle>
                    <p>Information our servers automatically collect when you access the Services, such as your IP address, browser type, operating system, access times, and the pages you have viewed directly before and after accessing the Services. This also includes your interactions with our AI assistant, Pixi AI, to improve its performance and accuracy.</p>
                    
                    <SectionTitle>2. How We Use Your Information</SectionTitle>
                    <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Services to:</p>
                     <ul className="list-disc pl-6 space-y-2">
                        <li>Create and manage your account.</li>
                        <li>Process your transactions and deliver the products and services you request.</li>
                        <li>Email you regarding your account or order.</li>
                        <li>Improve our website and services, including training our AI models.</li>
                        <li>Monitor and analyze usage and trends to improve your experience with the Services.</li>
                        <li>Notify you of updates to the Services.</li>
                        <li>Prevent fraudulent transactions, monitor against theft, and protect against criminal activity.</li>
                    </ul>

                    <SectionTitle>3. Disclosure of Your Information</SectionTitle>
                     <p>We do not share your information with third parties except in the circumstances described below:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>With Third-Party Retailers:</strong> When you make a purchase through our Unified Cart, we will share necessary information (such as your name and shipping address) with the respective retailers to fulfill your order.</li>
                        <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.</li>
                         <li><strong>With Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.</li>
                    </ul>

                    <SectionTitle>4. Security of Your Information</SectionTitle>
                    <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>

                    <SectionTitle>5. Your Data Protection Rights</SectionTitle>
                    <p>Depending on your location, you may have the following rights regarding your personal data:</p>
                     <ul className="list-disc pl-6 space-y-2">
                        <li>The right to access – You have the right to request copies of your personal data.</li>
                        <li>The right to rectification – You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.</li>
                        <li>The right to erasure – You have the right to request that we erase your personal data, under certain conditions.</li>
                    </ul>

                    <SectionTitle>6. Children's Privacy</SectionTitle>
                    <p>Our Services are not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.</p>

                    <SectionTitle>7. Changes to This Privacy Policy</SectionTitle>
                    <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.</p>
                    
                    <SectionTitle>8. Contact Us</SectionTitle>
                    <p>If you have questions or comments about this Privacy Policy, please contact us at <a href="mailto:privacy@shopiggo.com" className="text-primary hover:underline">privacy@shopiggo.com</a>.</p>
                </div>
            </div>
        </div>
    );
}
