
import Nav from "@/components/Nav";
import "./globals.css";


export const metadata = {
  title: "Novility",
  description: "Sell tokenized assets in a different way",
};

export default function RootLayout({ children }) {
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
        
         <Nav/>
         <div className="pt-[100px]">
        {children}
        </div>
      </body>
    </html>
  );
}
