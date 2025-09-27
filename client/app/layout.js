// app/layout.jsx (Your RootLayout file)
import Nav from "@/components/Nav";
import "./globals.css";
// NOTE: We remove the Zustand import here!
// import { useMobileNav } from "@/zustand/mobileNav"; // REMOVE THIS

// Import the new Client Component
import ClientWrapper from "@/components/ClientWrapper"; // Adjust path as necessary
import ProductionWalletProvider from "@/components/providers/ProductionWalletProvider";


export const metadata = {
  title: "Novility",
  description: "Sell tokenized assets in a different way",
};

export default function RootLayout({ children }) {
  // NOTE: We remove all state logic here!

  return (
    <html lang="en">

      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=TikTok+Sans:opsz,wght@12..36,300..900&display=swap" rel="stylesheet" />
      </head>
      <body
        className={` tiktok-sans antialiased`}
      >
        {/* Nav can remain a Server Component if it doesn't need Zustand, 
            or it should also be a client component if it interacts with mobileNav state. */}
        <Nav /> 
        
        {/* Production-safe Wallet Provider for global wallet state */}
        <ProductionWalletProvider>
          {/* Pass children to the ClientWrapper */}
          <ClientWrapper>
              {children}
          </ClientWrapper>
        </ProductionWalletProvider>
        
      </body>
    </html>
  );
}