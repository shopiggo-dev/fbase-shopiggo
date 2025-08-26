// src/app/faq/page.tsx
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
    {
        question: "What is Shopiggo?",
        answer: "Shopiggo is an AI-powered shopping assistant that simplifies your online shopping experience. We allow you to search across multiple stores at once, compare prices, get product advice from our AI, and check out from different retailers using a single unified cart."
    },
    {
        question: "How does the Unified Cart work?",
        answer: "The Unified Cart is a premium feature that lets you add items from various supported online stores into a single shopping cart right here on Shopiggo. When you're ready to buy, you proceed through a single checkout process, and we handle placing the orders with each individual retailer on your behalf."
    },
    {
        question: "What is Pixi AI?",
        answer: "Pixi AI is your personal shopping assistant. You can ask it questions about products, request buying advice, get feature explanations, or even ask it to find product alternatives. Pixi is designed to help you make smarter and more informed purchasing decisions."
    },
    {
        question: "What are GoCoins and how do I earn them?",
        answer: "GoCoins are our loyalty rewards points. You earn GoCoins on every purchase made through the Shopiggo platform. The number of points you earn per dollar depends on your membership tier. These points can be redeemed for discounts on future purchases, exclusive offers, and more."
    },
    {
        question: "Is my payment information secure?",
        answer: "Absolutely. We take security very seriously. All payment processing is handled by Stripe, a certified PCI Level 1 Service Provider. Your financial details are encrypted and never stored on our servers, ensuring your information is always safe."
    },
    {
        question: "Can I use Shopiggo for free?",
        answer: "Yes! We offer a Free membership tier that allows you to use our basic multi-store search and get a limited view of hot deals. To unlock powerful features like the Unified Cart, Pixi AI Assistant, and GoCoins rewards, you can upgrade to one of our paid membership plans."
    },
     {
        question: "How do price drop alerts work?",
        answer: "For Gold members and above, you can set a price alert on any product. We will monitor the price for you across our supported retailers. If the price drops within your specified timeframe, we'll notify you via your preferred method (push notification, email, or SMS). Platinum and Diamond members can even have the item automatically added to their cart or purchased when the price hits their target."
    },
];

export default function FaqPage() {
    return (
        <div className="bg-secondary/30">
            <div className="container text-center py-16 lg:py-24">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-headline">
                    Frequently Asked Questions
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                    Have questions? We've got answers. If you can't find what you're looking for, feel free to contact us.
                </p>
            </div>

            <div className="container pb-24 max-w-3xl mx-auto">
                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>
    );
}
