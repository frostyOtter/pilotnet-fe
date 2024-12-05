"use client";

import React from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Image from "next/image";

const AboutPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-gradient-to-b from-zinc-200 to-white dark:from-zinc-800 dark:to-black">
      <Header />

      <main className="w-full max-w-5xl px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Planning for Automated Driving System</h1>

        <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md">
          <div className="prose dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="font-bold text-3xl mb-4">Project Object</h2>
              
              {/* Project Overview Images Container */}
              <div className="flex justify-center gap-4 mb-6">
                <Image
                  className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
                  src="/project_overview_1.jpg"
                  alt="project_overview_1"
                  width={300}
                  height={50}
                  priority
                />
                <Image
                  className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
                  src="/project_overview_2.jpg"
                  alt="project_overview_2"
                  width={300}
                  height={50}
                  priority
                />
              </div>

              <p>
                This project aims to develop an AI-driven solution for predicting car steering angles and optimal velocities with high accuracy and low latency.
                It focuses on practical deployment feasibility, ensuring steering predictions and precise and velocity predictions remain within acceptable limits under normal driving conditions.
              </p>
            </section>

            <hr className="my-8 border-gray-300 dark:border-gray-700" />

            <section className="mb-8">
              <h2 className="font-bold text-3xl mb-4">Pipeline Overview</h2>
              {/* Pipeline Overview Image Container */}
              <div className="flex justify-center">
                <Image
                  className=""
                  src="/Pipeline_Overview.png"
                  alt="pipeline_overview"
                  width={1000}
                  height={500}
                  priority
                />
              </div>
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