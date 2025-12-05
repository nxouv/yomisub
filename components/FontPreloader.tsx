"use client";

import { useEffect } from "react";

const FONTS_TO_PRELOAD = [
  { family: "NotoSansJP", src: "/fonts/NotoSansJP-Light.woff2", weight: "300" },
  { family: "NotoSansJP", src: "/fonts/NotoSansJP-Regular.woff2", weight: "400" },
  { family: "NotoSansJP", src: "/fonts/NotoSansJP-Medium.woff2", weight: "500" },
  { family: "BIZUDPGothic", src: "/fonts/BIZUDPGothic-Bold.woff2", weight: "700" },
  { family: "MPLUSRounded1c", src: "/fonts/MPLUSRounded1c-Regular.woff2", weight: "400" },
  { family: "MPLUSRounded1c", src: "/fonts/MPLUSRounded1c-Medium.woff2", weight: "500" },
];

export function FontPreloader() {
  useEffect(() => {
    const timer = setTimeout(() => {
      FONTS_TO_PRELOAD.forEach(({ family, src, weight }) => {
        const font = new FontFace(family, `url(${src})`, { weight });
        font.load().then((loadedFont) => {
          document.fonts.add(loadedFont);
        }).catch((err) => {
          console.warn(`Font load failed: ${family} ${weight}`, err);
        });
      });
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
