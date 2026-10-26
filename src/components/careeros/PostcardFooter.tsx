'use client';

import React from 'react';

export function PostcardFooter() {
  return (
    <footer className="relative bg-[#dfdedb] dark:bg-[#1a1916] text-[#26251e] dark:text-[#edece8] pt-16 pb-12 overflow-hidden">
      {/* Postcard Scalloped Edge Cutout SVG */}
      <div className="w-full overflow-hidden leading-none mb-12">
        <svg
          className="w-full h-8 text-[#f2f1ed] dark:text-[#24231f] fill-current"
          viewBox="0 0 1200 24"
          preserveAspectRatio="none"
        >
          <path d="M0,0 C25,24 75,24 100,0 C125,24 175,24 200,0 C225,24 275,24 300,0 C325,24 375,24 400,0 C425,24 475,24 500,0 C525,24 575,24 600,0 C625,24 675,24 700,0 C725,24 775,24 800,0 C825,24 875,24 900,0 C925,24 975,24 1000,0 C1025,24 1075,24 1100,0 C1125,24 1175,24 1200,0 L1200,24 L0,24 Z" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-6 space-y-16">
        {/* Postcard Body: Two halves + Vintage Stamp */}
        <div className="p-8 md:p-12 rounded-2xl bg-[#f2f1ed] dark:bg-[#24231f] grid grid-cols-1 md:grid-cols-12 gap-8 items-start relative">
          {/* Vintage Stamp in Top-Right Corner */}
          <div className="md:absolute md:top-8 md:right-8 flex flex-col items-end">
            <div className="p-1.5 bg-white dark:bg-[#2d2c27] shadow-none rounded-sm">
              <img
                src="/assets/images/map-of-the-world.jpg"
                alt="Vintage map engraving stamp"
                className="w-20 h-24 object-cover filter grayscale contrast-125"
                width={80}
                height={96}
                loading="lazy"
                decoding="async"
              />
              <p className="text-[9px] text-center text-[#5f5d55] dark:text-[#a6a49c] mt-0.5 font-bold">
                JAIPUR • 2026
              </p>
            </div>
          </div>

          {/* Left Half: Message */}
          <div className="md:col-span-7 space-y-4">
            <h4 className="text-2xl sm:text-3xl font-serif font-bold text-[#26251e] dark:text-[#edece8]">
              Ready for placement season.
            </h4>
            <p className="text-sm text-[#5f5d55] dark:text-[#a6a49c] max-w-md leading-relaxed">
              Every score explained. Every interview transcript verifiable. Dedicated to engineering students and placement cells across Rajasthan and beyond.
            </p>
            <div className="flex gap-4 text-xs font-semibold pt-2">
              <a href="/login?role=student" className="text-[#2456d6] dark:text-[#4a7cf6] hover:underline">
                For Students →
              </a>
              <a href="/login?role=faculty" className="text-[#2456d6] dark:text-[#4a7cf6] hover:underline">
                For Universities →
              </a>
            </div>
          </div>

          {/* Right Half: Address Block */}
          <div className="md:col-span-5 space-y-3 pt-4 md:pt-0">
            <p className="text-xs font-bold tracking-wider text-[#5f5d55] dark:text-[#a6a49c]">
              CAMPUS ADDRESS
            </p>
            <div className="text-xs space-y-1.5 text-[#5f5d55] dark:text-[#a6a49c]">
              <p className="font-semibold text-[#26251e] dark:text-[#edece8]">
                JECRC University Campus
              </p>
              <p>Plot No. IS-2036 to 2039, Ramchandrapura Industrial Area</p>
              <p>Vidhani, Sitapura Extension, Jaipur, Rajasthan 303905</p>
              <p className="pt-2 text-[#2456d6] dark:text-[#4a7cf6]">placement.support@careeros.internal</p>
            </div>
          </div>
        </div>

        {/* CareerOS Full-Width Monument Wordmark */}
        <div className="text-center select-none overflow-hidden py-4">
          <span className="font-serif text-5xl sm:text-7xl md:text-9xl font-bold tracking-tighter opacity-15 text-[#26251e] dark:text-[#edece8] block leading-none">
            CAREEROS
          </span>
        </div>

        {/* Footer Credits: Open collections (Met Museum & Art Institute of Chicago) */}
        <div className="space-y-4 text-xs text-[#5f5d55] dark:text-[#a6a49c]">
          <p className="credits leading-relaxed">
            Pictures: <a href="https://www.metmuseum.org/art/collection/search/264521" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#26251e] dark:hover:text-[#edece8]">“Jaipur, Sanganeer - Ka - Chopal”</a>, 1860s–70s, <a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank" rel="noopener noreferrer" className="underline">public domain (CC0)</a>, via The Metropolitan Museum of Art; <a href="https://www.metmuseum.org/art/collection/search/264520" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#26251e] dark:hover:text-[#edece8]">“[Albert Hall Museum, Jaipur]”</a>, 1860s–70s, <a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank" rel="noopener noreferrer" className="underline">public domain (CC0)</a>, via The Metropolitan Museum of Art; <a href="https://www.metmuseum.org/art/collection/search/264573" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#26251e] dark:hover:text-[#edece8]">“[Four Elephants with Western Travellers and Attendants, Jaipur, India]”</a>, 1860s–70s, <a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank" rel="noopener noreferrer" className="underline">public domain (CC0)</a>, via The Metropolitan Museum of Art; <a href="https://www.artic.edu/artworks/152509" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#26251e] dark:hover:text-[#edece8]">“Map of the World”</a> by John Paul Cimerlin, 1889, <a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank" rel="noopener noreferrer" className="underline">public domain (CC0)</a>, via Art Institute of Chicago.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between pt-4 gap-2 text-[11px]">
            <span>© 2026 CareerOS Technologies. Idea validation prototype. Illustrative data.</span>
            <span>calibrated for JECRC University, Jaipur</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
