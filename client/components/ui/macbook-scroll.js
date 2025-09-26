"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "../../lib/utils";
import {
  IconBrightnessDown,
  IconBrightnessUp,
  IconCaretRightFilled,
  IconCaretUpFilled,
  IconChevronUp,
  IconMicrophone,
  IconMoon,
  IconPlayerSkipForward,
  IconPlayerTrackNext,
  IconPlayerTrackPrev,
  IconTable,
  IconVolume,
  IconVolume2,
  IconVolume3,
  IconSearch,
  IconWorld,
  IconCommand,
  IconCaretLeftFilled,
  IconCaretDownFilled,
} from "@tabler/icons-react";
import Image from "next/image";

const MacbookScroll = ({ src, showGradient, badge }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end 20%"],
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 768) setIsMobile(true);
  }, []);

  const scaleX = useTransform(scrollYProgress, [0, 0.3], [1.2, isMobile ? 1 : 1.5]);
  const scaleY = useTransform(scrollYProgress, [0, 0.3], [0.6, isMobile ? 1 : 1.5]);
  const translate = useTransform(scrollYProgress, [0, 0.5], [0, 700]);
  const rotate = useTransform(scrollYProgress, [0.1, 0.12, 0.3], [-28, -28, 0]);

  return (
    <div
      ref={ref}
      className="flex md:min-h-[80vh] min-h-[40vh] min-w-100 shrink-0 transform flex-col items-center justify-start py-0 [perspective:800px] scale-50 md:scale-100 md:mt-50"
    >
      <Lid src={src} scaleX={scaleX} scaleY={scaleY} rotate={rotate} translate={translate} />
      <div className="relative -z-10 h-[22rem] w-[32rem] overflow-hidden rounded-2xl bg-gray-200 dark:bg-[#272729]">
        <div className="relative h-10 w-full">
          <div className="absolute inset-x-0 mx-auto h-4 w-[0%] bg-[#050505]" />
        </div>
        <div className="relative flex">
          <div className="mx-auto h-full w-[10%] overflow-hidden">
            <SpeakerGrid />
          </div>
          <div className="mx-auto h-full w-[80%]">
            <Keypad />
          </div>
          <div className="mx-auto h-full w-[10%] overflow-hidden">
            <SpeakerGrid />
          </div>
        </div>
        <Trackpad />
        <div className="absolute inset-x-0 bottom-0 mx-auto h-2 w-20 rounded-tl-3xl rounded-tr-3xl bg-gradient-to-t from-[#272729] to-[#050505]" />
        {showGradient && (
          <div className="absolute inset-x-0 bottom-0 z-50 h-40 w-full bg-gradient-to-t from-white via-white to-transparent dark:from-black dark:via-black" />
        )}
        {badge && <div className="absolute bottom-4 left-4">{badge}</div>}
      </div>
    </div>
  );
};

export const Lid = ({ scaleX, scaleY, rotate, translate, src }) => (
  <div className="relative [perspective:800px]">
    <div
      style={{
        transform: "perspective(800px) rotateX(-25deg) translateZ(0px)",
        transformOrigin: "bottom",
        transformStyle: "preserve-3d",
      }}
      className="relative h-[12rem] w-[32rem] rounded-2xl bg-[#010101] p-2"
    >
      <div
        style={{ boxShadow: "0px 2px 0px 2px #171717 inset" }}
        className="absolute inset-0 flex items-center justify-center rounded-lg bg-[#010101]"
      />
    </div>
    <motion.div
      style={{
        scaleX,
        scaleY,
        rotateX: rotate,
        translateY: translate,
        transformStyle: "preserve-3d",
        transformOrigin: "top",
      }}
      className="absolute inset-0 h-96 w-[32rem] rounded-xl bg-[#010101] p-2"
    >
      <div className="absolute inset-0 rounded-lg bg-[#272729]" />
      {src && <Image src={src} alt="logo" className="absolute inset-0 h-full w-full  rounded-lg object-fill object-left-top" />}
    </motion.div>
  </div>
);

export const Trackpad = () => (
  <div className="mx-auto my-1 h-32 w-[40%] rounded-xl" style={{ boxShadow: "0px 0px 1px 1px #00000020 inset" }} />
);

export const KBtn = ({ className, children, childrenClassName, backlit = true }) => (
  <div
    className={cn("[transform:translateZ(0)] rounded-[4px] p-[0.5px] [will-change:transform]", backlit && "bg-white/[0.2] shadow-xl shadow-white")}
  >
    <div
      className={cn("flex h-6 w-6 items-center justify-center rounded-[3.5px] bg-[#0A090D]", className)}
      style={{ boxShadow: "0px -0.5px 2px 0 #0D0D0F inset, -0.5px 0px 2px 0 #0D0D0F inset" }}
    >
      <div
        className={cn("flex w-full flex-col items-center justify-center text-[5px] text-neutral-200", childrenClassName, backlit && "text-white")}
      >
        {children}
      </div>
    </div>
  </div>
);

export const SpeakerGrid = () => (
  <div
    className="mt-2 flex h-40 gap-[2px] px-[0.5px]"
    style={{
      backgroundImage: "radial-gradient(circle, #08080A 0.5px, transparent 0.5px)",
      backgroundSize: "3px 3px",
    }}
  />
);

export const OptionKey = ({ className }) => (
  <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className={className}>
    <rect stroke="currentColor" strokeWidth={2} x={18} y={5} width={10} height={2} />
    <polygon stroke="currentColor" strokeWidth={2} points="10.6,5 4,5 4,7 9.4,7 18.4,27 28,27 28,25 19.6,25" />
    <rect width={32} height={32} stroke="none" />
  </svg>
);

export const Keypad = () => {
  const rows = [
    // First row: Function keys
    [
      { label: "esc", className: "w-10 items-end justify-start pb-[2px] pl-[4px]", childrenClassName: "items-start" },
      { icon: IconBrightnessDown, label: "F1" },
      { icon: IconBrightnessUp, label: "F2" },
      { icon: IconTable, label: "F3" },
      { icon: IconSearch, label: "F4" },
      { icon: IconMicrophone, label: "F5" },
      { icon: IconMoon, label: "F6" },
      { icon: IconPlayerTrackPrev, label: "F7" },
      { icon: IconPlayerSkipForward, label: "F8" },
      { icon: IconPlayerTrackNext, label: "F8" },
      { icon: IconVolume3, label: "F10" },
      { icon: IconVolume2, label: "F11" },
      { icon: IconVolume, label: "F12" },
      {
        custom: (
          <div className="h-4 w-4 rounded-full bg-gradient-to-b from-neutral-900 from-20% via-black via-50% to-neutral-900 to-95% p-px">
            <div className="h-full w-full rounded-full bg-black" />
          </div>
        ),
      },
    ],
    // Second row: Number keys
    [
      { label: "~", subLabel: "`" },
      { label: "!", subLabel: "1" },
      { label: "@", subLabel: "2" },
      { label: "#", subLabel: "3" },
      { label: "$", subLabel: "4" },
      { label: "%", subLabel: "5" },
      { label: "^", subLabel: "6" },
      { label: "&", subLabel: "7" },
      { label: "*", subLabel: "8" },
      { label: "(", subLabel: "9" },
      { label: ")", subLabel: "0" },
      { label: "—", subLabel: "_" },
      { label: "+", subLabel: "=" },
      { label: "delete", className: "w-10 items-end justify-end pr-[4px] pb-[2px]", childrenClassName: "items-end" },
    ],
    // Third row: Q-P
    [
      { label: "tab", className: "w-10 items-end justify-start pb-[2px] pl-[4px]", childrenClassName: "items-start" },
      "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P",
      { label: "{", subLabel: "[" },
      { label: "}", subLabel: "]" },
      { label: "|", subLabel: "\\" },
    ],
    // Fourth row: A-L
    [
      { label: "caps lock", className: "w-[2.8rem] items-end justify-start pb-[2px] pl-[4px]", childrenClassName: "items-start" },
      "A", "S", "D", "F", "G", "H", "J", "K", "L",
      { label: ":", subLabel: ";" },
      { label: '"', subLabel: "'" },
      { label: "return", className: "w-[2.85rem] items-end justify-end pr-[4px] pb-[2px]", childrenClassName: "items-end" },
    ],
    // Fifth row: Z-M
    [
      { label: "shift", className: "w-[3.65rem] items-end justify-start pb-[2px] pl-[4px]", childrenClassName: "items-start" },
      "Z", "X", "C", "V", "B", "N", "M",
      { label: "<", subLabel: "," },
      { label: ">", subLabel: "." },
      { label: "?", subLabel: "/" },
      { label: "shift", className: "w-[3.65rem] items-end justify-end pr-[4px] pb-[2px]", childrenClassName: "items-end" },
    ],
    // Sixth row: Fn / control / option / command / arrow
    [
      { label: "fn", icon: IconWorld },
      { label: "control", icon: IconChevronUp },
      { label: "option", icon: OptionKey },
      { label: "command", icon: IconCommand, className: "w-8" },
      { className: "w-[8.2rem]" },
      { label: "command", icon: IconCommand, className: "w-8" },
      { label: "option", icon: OptionKey },
      {
        custom: (
          <div className="mt-[2px] flex h-6 w-[4.9rem] flex-col items-center justify-end rounded-[4px] p-[0.5px]">
            <KBtn className="h-3 w-6">
              <IconCaretUpFilled className="h-[6px] w-[6px]" />
            </KBtn>
            <div className="flex">
              <KBtn className="h-3 w-6"><IconCaretLeftFilled className="h-[6px] w-[6px]" /></KBtn>
              <KBtn className="h-3 w-6"><IconCaretDownFilled className="h-[6px] w-[6px]" /></KBtn>
              <KBtn className="h-3 w-6"><IconCaretRightFilled className="h-[6px] w-[6px]" /></KBtn>
            </div>
          </div>
        ),
      },
    ],
  ];

  return (
    <div className="mx-1 h-full [transform:translateZ(0)] rounded-md bg-[#050505] p-1 [will-change:transform]">
      {rows.map((row, i) => (
        <div key={i} className="mb-[2px] flex w-full shrink-0 gap-[2px]">
          {row.map((key, j) => {
            if (typeof key === "string") return <KBtn key={j}>{key}</KBtn>;
            if (key.custom) return <div key={j}>{key.custom}</div>;
            return (
              <KBtn key={j} className={key.className} childrenClassName={key.childrenClassName}>
                {key.icon && <key.icon className="h-[6px] w-[6px]" />}
                {key.label && <span className={`block ${key.subLabel ? "mt-1" : ""}`}>{key.label}</span>}
                {key.subLabel && <span className="block">{key.subLabel}</span>}
              </KBtn>
            );
          })}
        </div>
      ))}
    </div>
  );
};


export default MacbookScroll;
