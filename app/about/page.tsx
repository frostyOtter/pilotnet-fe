"use client";
//The "use client" directive at the top of the file tells Next.js that this is a Client Component,
//allowing the use of React hooks and other client-side features.
import React from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AboutPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-gradient-to-b from-zinc-200 to-white dark:from-zinc-800 dark:to-black">
      <Header />

      <main className="w-full max-w-5xl px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">About PilotNet</h1>

        <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md">
          <div className="prose dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="font-bold text-2xl mb-4">Our Mission</h2>
              <p>
                PilotNet is dedicated to advancing autonomous driving technology through 
                innovative machine learning approaches. Our mission is to create safer,
                more efficient transportation systems that benefit society as a whole.
              </p>
            </section>

            <hr className="my-8 border-gray-300 dark:border-gray-700" />

            <section className="mb-8">
              <h2 className="font-bold text-2xl mb-4">The Technology</h2>
              <p>
                At the heart of PilotNet is a deep learning model designed to predict
                steering angles from camera inputs. By training on diverse driving scenarios,
                our model learns to navigate complex road conditions, adapting to various
                environments and situations.
              </p>
            </section>

            <hr className="my-8 border-gray-300 dark:border-gray-700" />

            <section className="mb-8">
              <h2 className="font-bold text-2xl mb-4">Key Features</h2>
              <ul className="list-disc pl-5">
                <li>End-to-end learning from pixels to steering commands</li>
                <li>Robust performance across different weather and lighting conditions</li>
                <li>Continuous improvement through iterative training and real-world data</li>
                <li>Modular architecture allowing for easy integration and expansion</li>
              </ul>
            </section>

            <hr className="my-8 border-gray-300 dark:border-gray-700" />

            <section className="mb-8">
              <h2 className="font-bold text-2xl mb-4">Our Team</h2>
              <p>
                PilotNet is developed by a diverse team of experts in machine learning,
                computer vision, and automotive engineering. Our collaborative approach
                brings together the best minds in the field to tackle the challenges of
                autonomous driving.
              </p>
            </section>

            <hr className="my-8 border-gray-300 dark:border-gray-700" />

            <section className="mb-8">
              <h2 className="font-bold text-2xl mb-4">Looking Forward</h2>
              <p>
                As we continue to refine and expand PilotNet, we're excited about the
                potential impact on transportation, urban planning, and environmental
                sustainability. We're committed to open collaboration and responsible
                development as we work towards a future of safer, smarter mobility.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Navbar />
      <Footer />
    </div>
  );
};

export default AboutPage;