import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Heart, Users, Sparkles } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 py-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif font-semibold text-stone-900 mb-8">
            About Besties Craft
          </h1>

          <div className="space-y-12">
            <section className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-stone-100">
              <h2 className="text-3xl font-serif font-semibold text-stone-900 mb-6 flex items-center gap-3">
                <Heart className="w-8 h-8 text-amber-600" />
                Our Story
              </h2>
              <p className="text-lg text-stone-700 leading-relaxed">
                Besties Craft started as a passion project between two friends who loved creating handmade crochet products. What began as a hobby soon turned into a thriving business dedicated to bringing warmth and comfort to homes through beautiful, handcrafted woollen creations.
              </p>
            </section>

            <section className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-stone-100">
              <h2 className="text-3xl font-serif font-semibold text-stone-900 mb-6 flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-amber-600" />
                Our Mission
              </h2>
              <p className="text-lg text-stone-700 leading-relaxed">
                We believe in the power of handmade craftsmanship. Our mission is to create premium quality crochet products using sustainable materials while supporting fair trade practices. Every piece is made with love and attention to detail.
              </p>
            </section>

            <section className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-stone-100">
              <h2 className="text-3xl font-serif font-semibold text-stone-900 mb-6 flex items-center gap-3">
                <Users className="w-8 h-8 text-amber-600" />
                Why Choose Us
              </h2>
              <ul className="space-y-4 text-lg text-stone-700">
                <li className="flex items-start gap-3">
                  <span className="text-amber-600 font-bold">✓</span>
                  <span>100% handmade by skilled artisans</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-600 font-bold">✓</span>
                  <span>Premium quality woollen materials</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-600 font-bold">✓</span>
                  <span>Eco-friendly and sustainable practices</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-600 font-bold">✓</span>
                  <span>Unique designs crafted with care</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-600 font-bold">✓</span>
                  <span>Fast and secure delivery</span>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutPage;
