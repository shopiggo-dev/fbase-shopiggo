# **App Name**: Shopiggo

## Core Features:

- Authentication: Enable users to sign up and log in securely using email/password or Google OAuth through Firebase Authentication.
- User Profiles: Store and manage user profile data, including preferences, membership tier, and notification settings, in Firestore.
- Membership Tiers: Implement membership tiers (Free, GoBasic, GoPlus) and manage subscriptions via Stripe, storing status in Firestore.
- Multistore Product Search: Implement a product discovery feature to fetch results across multiple retailers (using mocked data in Firestore for those without open APIs), allowing users to filter by store, category, and price.
- AI Shopping Assistant: Integrate Pixi AI, a conversational tool that uses an LLM (mock placeholder) to provide buying advice and product explanations via Firebase Functions, logging interactions in Firestore.
- Unified Cart and Checkout: Develop a unified cart system to allow users to add products from different retailers and proceed to checkout via Stripe.
- Frontend: Serve the front-end through Firebase Hosting.

## Style Guidelines:

- Primary color: A vibrant orange (#FF7A00) to reflect energy and enthusiasm, drawing inspiration from the excitement of discovery.
- Background color: Light beige (#F5F5DC), a desaturated, bright tint of orange, for a clean, neutral backdrop.
- Accent color: Yellow (#FFD700), an analogous color that adds contrast to important interactive elements.
- Headline font: 'Poppins', a sans-serif font for a modern, fashionable, avant-garde look; pairing with 'PT Sans' for body text
- Use simple, modern icons to represent categories, brands, and features, ensuring clarity and easy recognition.
- Employ a clean, grid-based layout for product listings and search results to maintain a structured and easy-to-navigate experience.
- Subtle transitions and loading animations to enhance user experience when browsing products or receiving AI advice.