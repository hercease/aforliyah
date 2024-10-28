 import 'react-perfect-scrollbar/dist/css/styles.css'
//import 'nouislider/distribute/nouislider.css';
import '/public/assets/css/style.css';
import Script from "next/script"
import Header from "../components/header.js"
import BackToTop from '../components/BackToTop.js'
import { Manrope, Merienda, Poppins } from "next/font/google"
import 'boxicons/css/boxicons.min.css';
import 'swiper/swiper-bundle.css';                                             
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './globals.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Toaster } from "react-hot-toast";
import $ from 'jquery';



const manrope_init = Manrope({
    weight: ['300', '400', '500', '600', '700','800'],
    subsets: ['latin'],
    variable: "--manrope",
    display: 'swap',
})

const merienda_init = Merienda({
    weight: ['300', '400', '500', '600', '700','800'],
    subsets: ['latin'],
    variable: "--merienda",
    display: 'swap',
})

const poppins = Poppins({
  weight: ['400', '500', '600', '700'], // Specify the weights you want to use
  subsets: ['latin'], // Specify the subsets you need
});

/*export const metadata = {
  title: 'Afotravels | Home',
  description: 'Your gateway to extraordinary experiences.',
};*/

export async function generateMetadata({ params }) {
  // Extract slug from params
  const slug = params.slug || '';  // Catch undefined or empty paths

  // Define metadata for specific static pages
  const pageMeta = {
    '': {
      title: "Afoliyah Travels - Affordable Flights, Hotels & Holiday Packages",
      description: "Book affordable flights, hotels, and holiday packages with Afoliyah Travels. Trusted travel agency offering exclusive deals to Dubai, UAE, Qatar, and Africa.",
      keywords: "Afoliyah Travels, Nigeria travel agency, flight booking, hotel reservation, holiday packages, cheap flights Nigeria, best flight deals Nigeria, book flights online Nigeria, domestic flights Nigeria, international flights Nigeria, last minute flights Nigeria, budget flights Nigeria, airline tickets Nigeria, airfare Nigeria, travel, destination, online cheap flight, booking tickets, cheap business class, Lagos to Dubai, Lagos to London, Lagos to New York, Lagos to Abuja, cheap flights to Doha, Lagos to Johannesburg, Lagos to Accra, Lagos to Nairobi, Lagos to Paris, Lagos to Rome, Lagos to Toronto, Lagos to Atlanta, Lagos to Istanbul, Lagos to Las Vegas, Lagos to Kuala Lumpur, Lagos to Dusseldorf, Lagos to Melbourne, Lagos to Madrid, Lagos to Frankfurt, Lagos to Cairo, Lagos to Zanzibar, Lagos to Mauritius, Lagos to Boston, Lagos to San Francisco, Lagos to Abidjan, Lagos to Cape Town, Lagos to Dubai Marina, Lagos to Manama, Lagos to Rabat, Lagos to Enugu, Lagos to Port Harcourt, Lagos to Ibadan, Lagos to Kaduna, Lagos to Owerri, Lagos to Uyo, Lagos to Kano, Lagos to Warri, Lagos to Asaba, Lagos to Benin City, Lagos to Yola, Lagos to Jos, Lagos to Maiduguri, Lagos to Sokoto, Lagos to Taraba, Lagos to Gombe, Lagos to Lagos State, Lagos to Ghana, Lagos to Kenya, Lagos to Tanzania, Lagos to Uganda, Lagos to Rwanda, Lagos to Senegal, Lagos to Ethiopia, Lagos to Zimbabwe, Lagos to Namibia, Lagos to Botswana, Lagos to Malawi, Lagos to Cameroon, Lagos to Ivory Coast, Lagos to South Africa, Abuja to Ghana, Abuja to Kenya, Abuja to Tanzania, Abuja to Uganda, Abuja to Rwanda, Abuja to Senegal, Abuja to Ethiopia, Abuja to Zimbabwe, Abuja to Namibia, Abuja to Botswana, Abuja to Malawi, Abuja to Cameroon, Abuja to Ivory Coast, Abuja to South Africa",
    },
    aboutus: {
      title: "About Us | Afoliyah Travels",
      description: "Learn more about Afoliyah Travels, your trusted travel agency in Nigeria.",
      keywords: "Afoliyah Travels, About Us, Nigeria travel agency",
    },
    privacy: {
      title: "Privacy Policy | Afoliyah Travels",
      description: "Read the Privacy Policy of Afoliyah Travels to understand how we protect your personal information.",
      keywords: "Afoliyah Travels, Privacy Policy, user privacy, data protection",
    },
    contact: {
      title: "Contact Us | Afoliyah Travels",
      description: "Get in touch with Afoliyah Travels for inquiries and support.",
      keywords: "Afoliyah Travels, Contact, support, inquiries",
    },
  };

  // Fallback to default if slug doesn't match
  const meta = pageMeta[slug] || {
    title: "Afoliyah Travels - Best Deals on Flights, Hotels & Holiday Packages",
    description: "Explore top deals for flights and hotels with Afoliyah Travels. Your trusted travel agency in Nigeria.",
    keywords: "Afoliyah Travels, travel deals, flights, hotels, holiday packages",
  };

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    author: "Afoliyah Travels",
    robots: "index, follow",

    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `https://afotravels.com/${slug}`,
      type: "website",
      images: [
        {
          url: `https://afotravels.com/assets/imgs/logo.png`,
          width: 800,
          height: 600,
          alt: meta.title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [`https://afotravels.com/assets/imgs/twitter-image.jpg`],
    },

    icons: {
      icon: `/favicon/favicon.ico`,
      shortcut: `/favicon/android-chrome-192x192.png`,
      apple: `/favicon/apple-touch-icon.png`,
    },
  };
}

export const viewport = "width=device-width, initial-scale=1.0";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="body">
      <body>
		<Header />
		{children}
		<Toaster />
		<BackToTop target="top" />
  
{/* Tidio Script */}
<script src="//code.tidio.co/9r3slb1vdcat4waxwdk6embqcuvjsaag.js" async />
 {/* Google Analytics */}
 <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-F60CCNKWLV"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive" // Ensures the script runs after page load
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-F60CCNKWLV');
            `,
          }}
        />


		<Script id="demo-min" src="/assets/js/vendor/jquery-3.7.1.min.js"></Script>
		<Script id="main-js" src="/assets/js/vendor/bootstrap.bundle.min.js"></Script>
	  </body>
    </html>
  );
}
