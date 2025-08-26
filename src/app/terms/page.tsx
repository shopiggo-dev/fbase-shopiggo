// src/app/terms/page.tsx
'use client';

import { useState, useEffect } from 'react';

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-2xl font-bold font-headline mt-8 mb-4">{children}</h2>
);

const SubSectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-xl font-semibold font-headline mt-6 mb-3">{children}</h3>
);

export default function TermsOfServicePage() {
    const [lastUpdated, setLastUpdated] = useState('');

    useEffect(() => {
        setLastUpdated(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
    }, []);
    
    return (
        <div className="bg-secondary/30">
            <div className="container text-center py-16 lg:py-24">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-headline">
                    Terms of Service
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                    Last Updated: {lastUpdated}
                </p>
            </div>

            <div className="container pb-24 max-w-4xl mx-auto bg-card p-8 sm:p-12 rounded-lg shadow-lg">
                <div className="prose prose-lg max-w-none text-muted-foreground">
                    <p>Welcome to Shopiggo! These Terms of Service ("Terms") govern your use of the Shopiggo website, our AI shopping assistant ("Pixi AI"), and any other services we offer (collectively, the "Services"). By accessing or using our Services, you agree to be bound by these Terms.</p>
                    
                    <SectionTitle>1. Acceptance of Terms</SectionTitle>
                    <p>By creating an account or using our Services, you confirm that you have read, understood, and agree to be bound by these Terms. If you do not agree with these Terms, you may not use the Services.</p>

                    <SectionTitle>2. Description of Service</SectionTitle>
                    <p>Shopiggo provides a platform that allows users to search for products across multiple third-party retailers, receive AI-powered shopping advice, and utilize a unified cart for making purchases. We are an intermediary service and are not the seller of record for products purchased from third-party retailers through our platform.</p>

                    <SectionTitle>3. User Accounts & Membership</SectionTitle>
                    <SubSectionTitle>3.1. Account Registration</SubSectionTitle>
                    <p>You must register for an account to access certain features. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate. You are responsible for safeguarding your password and for all activities that occur under your account.</p>
                    <SubSectionTitle>3.2. Membership Tiers</SubSectionTitle>
                    <p>Shopiggo offers various membership tiers (e.g., Free, GoBasic, GoPlus). Each tier provides different levels of access to our Services. Features such as the Unified Cart and unlimited Pixi AI queries may require a paid membership. Fees and features for each tier are described on our Membership page.</p>
                    
                    <SectionTitle>4. User Conduct</SectionTitle>
                    <p>You agree not to use the Services to:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Violate any local, state, national, or international law.</li>
                        <li>Infringe upon or violate our intellectual property rights or the intellectual property rights of others.</li>
                        <li>Submit false or misleading information.</li>
                        <li>Engage in any activity that is harmful, fraudulent, deceptive, threatening, harassing, defamatory, obscene, or otherwise objectionable.</li>
                        <li>Attempt to reverse engineer or otherwise derive the source code of the Services.</li>
                    </ul>

                    <SectionTitle>5. Intellectual Property</SectionTitle>
                    <p>All content and materials available on Shopiggo, including but not limited to text, graphics, website name, code, images, and logos, are the intellectual property of Shopiggo, Inc., and are protected by applicable copyright and trademark law. Any inappropriate use is strictly prohibited.</p>

                    <SectionTitle>6. Third-Party Retailers & Purchases</SectionTitle>
                    <p>Shopiggo facilitates purchases from third-party retailers. We are not responsible for the products, shipping, returns, or any other aspect of your transaction with these retailers. All transactions made through our Unified Cart are subject to the terms and conditions of the respective retailers.</p>

                    <SectionTitle>7. Termination</SectionTitle>
                    <p>We may terminate or suspend your account and bar access to the Services immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Services will immediately cease.</p>

                    <SectionTitle>8. Disclaimers and Limitation of Liability</SectionTitle>
                    <p>THE SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. SHOPIGGO MAKES NO WARRANTIES, EXPRESSED OR IMPLIED, AND HEREBY DISCLAIMS ALL WARRANTIES, INCLUDING WITHOUT LIMITATION, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.</p>
                    <p>IN NO EVENT SHALL SHOPIGGO, INC. OR ITS DIRECTORS, EMPLOYEES, OR PARTNERS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, INCLUDING, WITHOUT LIMITATION, LOSS OF PROFITS, DATA, OR OTHER INTANGIBLES, ARISING OUT OF YOUR USE OF THE SERVICES.</p>

                    <SectionTitle>9. Governing Law</SectionTitle>
                    <p>These Terms shall be governed and construed in accordance with the laws of the State of Delaware, without regard to its conflict of law provisions.</p>

                    <SectionTitle>10. Changes to Terms</SectionTitle>
                    <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page. Your continued use of the Services after any such changes constitutes your acceptance of the new Terms.</p>
                    
                    <SectionTitle>11. Contact Us</SectionTitle>
                    <p>If you have any questions about these Terms, please contact us at <a href="mailto:legal@shopiggo.com" className="text-primary hover:underline">legal@shopiggo.com</a>.</p>
                </div>
            </div>
        </div>
    );
}
