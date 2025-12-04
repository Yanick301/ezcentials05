# **App Name**: Atelier Luxe

## Core Features:

- Product Catalog: Display products with images, names, prices, and descriptions, loaded dynamically from JSON files. Images are in `/image-produit/` folders, separated by product type.
- Category Browsing: Enable browsing products by category (Men’s Clothing, Women’s Clothing, Accessories, Winter Clothing) via horizontal scrolling image menus. Category links use Next.js routing.
- Product Detail Pages: Display detailed product information, including additional images, reviews (minimum 5 per product), add to cart and favorites options.
- Shopping Cart: Manage products added to the cart with quantity updates and removal options. Calculate subtotal and total amounts.
- Checkout Process: Require user registration/login, integrate Stripe payment gateway with secure .env file keys, send email confirmations, and redirect to a thank-you page post-purchase.
- User Authentication: Implement Google OAuth for sign-up and login, email verification for registration, and forgot password/reset functionality.
- Multi-language support: Site supports translations of all textual content in multiple languages using a translation tool, defaulting to German.

## Style Guidelines:

- Primary color: Soft gray (#A9A9A9) inspired by the darker gray in the logo, conveying understated elegance and sophistication.
- Secondary color: Dusty rose (#D8BFD8) drawn from the logo's pink hue, providing a subtle contrast and a touch of femininity.
- Background color: Off-white (#F5F5F5), creating a clean, neutral backdrop that allows the products to stand out.
- Body and headline font: 'Cormorant Garamond', a refined serif font lending an elegant, intellectual, and contemporary feel suitable for both headings and body text, echoing the sophisticated aesthetic of the logo.
- Use minimalist line icons for UI elements, ensuring they are easily understood and contribute to the site's elegant aesthetic, maintaining consistency with the logo's simplicity.
- Implement a clean, spacious layout with plenty of whitespace, allowing products to stand out. Ensure responsiveness for all devices, prioritizing a seamless user experience.
- Subtle animations for hover effects on product cards and a smooth scrolling experience, enhancing the overall luxury feel and providing visual feedback to user interactions.