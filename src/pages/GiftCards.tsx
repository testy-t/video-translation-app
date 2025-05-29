import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import GiftCardHero from "@/components/giftcards/GiftCardHero";
import GiftCardCatalog from "@/components/giftcards/GiftCardCatalog";

const GiftCards: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-grow">
        <GiftCardHero />
        <GiftCardCatalog />
      </main>

      <Footer />
    </div>
  );
};

export default GiftCards;
