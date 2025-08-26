import Link from 'next/link';
import { FooterLogo } from '@/components/shopiggo/Logo';

export function Footer() {
    return (
        <footer className="bg-muted/50 border-t">
            <div className="container py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="flex flex-col gap-4">
                        <Link href="/">
                            <FooterLogo />
                        </Link>
                        <p className="text-muted-foreground text-sm">Your AI-powered guide to smarter shopping across all your favorite stores.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4 font-headline">Company</h4>
                        <ul className="space-y-2">
                            <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary">About Us</Link></li>
                            <li><Link href="/investors" className="text-sm text-muted-foreground hover:text-primary">Investor Relations</Link></li>
                            <li><Link href="/careers" className="text-sm text-muted-foreground hover:text-primary">Careers</Link></li>
                            <li><Link href="/press" className="text-sm text-muted-foreground hover:text-primary">Press</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4 font-headline">Resources</h4>
                        <ul className="space-y-2">
                            <li><Link href="/blog" className="text-sm text-muted-foreground hover:text-primary">Blog</Link></li>
                            <li><Link href="/faq" className="text-sm text-muted-foreground hover:text-primary">FAQ</Link></li>
                            <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact Us</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4 font-headline">Legal</h4>
                        <ul className="space-y-2">
                            <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</Link></li>
                            <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
                             <li><Link href="/admin" className="text-sm text-muted-foreground hover:text-primary">Admin</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 border-t pt-8 flex flex-col sm:flex-row justify-between items-center">
                    <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Shopiggo, Inc. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}