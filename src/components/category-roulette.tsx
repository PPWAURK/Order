"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
  buildSoftGradient,
  formatPrice,
  hexToRgba,
} from "@/lib/catalog-data";
import type { MenuCategory, MenuProduct } from "@/lib/types";

type CategoryRouletteProps = {
  category: MenuCategory;
  onAddProduct: (productId: string) => void;
};

const SPIN_DURATION_MS = 4200;

function normalizeRotation(value: number) {
  return ((value % 360) + 360) % 360;
}

function getSegmentAngle(segmentCount: number) {
  return segmentCount > 0 ? 360 / segmentCount : 360;
}

function buildWheelGradient(segmentCount: number, themeColor: string) {
  if (segmentCount <= 0) {
    return buildSoftGradient(themeColor);
  }

  const segmentAngle = getSegmentAngle(segmentCount);
  const gradientStart = -(segmentAngle / 2);
  const opacities = [0.2, 0.34, 0.26, 0.4];

  return `conic-gradient(from ${gradientStart}deg, ${Array.from(
    { length: segmentCount },
    (_, index) => {
      const start = index * segmentAngle;
      const end = start + segmentAngle;

      return `${hexToRgba(themeColor, opacities[index % opacities.length])} ${start}deg ${end}deg`;
    },
  ).join(", ")})`;
}

export function CategoryRoulette({
  category,
  onAddProduct,
}: CategoryRouletteProps) {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<MenuProduct | null>(null);
  const [announcement, setAnnouncement] = useState(
    `Si vous hesitez encore, laissez la roue choisir dans ${category.name}.`,
  );
  const timerRef = useRef<number | null>(null);
  const spinningRef = useRef(false);

  useEffect(() => {
    return () => {
      spinningRef.current = false;

      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  function handleSpin() {
    if (spinningRef.current || category.products.length === 0) {
      return;
    }

    const nextIndex = Math.floor(Math.random() * category.products.length);
    const product = category.products[nextIndex];
    const segmentAngle = getSegmentAngle(category.products.length);
    const targetRotation = (360 - nextIndex * segmentAngle) % 360;
    const extraTurns = (5 + Math.floor(Math.random() * 2)) * 360;

    spinningRef.current = true;

    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    setIsSpinning(true);
    setSelectedProduct(null);
    setAnnouncement(`La roue choisit une option dans ${category.name}.`);
    setRotation((currentValue) => {
      const currentRotation = normalizeRotation(currentValue);
      const rotationDelta = (targetRotation - currentRotation + 360) % 360;

      return currentValue + extraTurns + rotationDelta;
    });

    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      spinningRef.current = false;
      setSelectedProduct(product);
      setIsSpinning(false);
      setAnnouncement(`${product.name} a ete tire dans ${category.name}.`);
    }, SPIN_DURATION_MS);
  }

  const segmentAngle = getSegmentAngle(category.products.length);

  return (
    <div
      className="mt-8 rounded-[32px] border border-white/70 p-5 shadow-[0_24px_60px_rgba(148,102,84,0.08)] backdrop-blur"
      style={{
        background: `linear-gradient(180deg, rgba(255,255,255,0.82), rgba(255,247,240,0.78)), ${buildSoftGradient(category.themeColor)}`,
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.24em] text-[#9e6f5d] uppercase">
            Roulette
          </p>
          <h3 className="mt-2 font-display text-2xl text-[#3b2b23]">
            Un tirage pour choisir
          </h3>
        </div>
        <span
          className="inline-flex shrink-0 items-center rounded-full border border-white/70 px-3 py-1 text-xs font-semibold text-[#6a4c41]"
          style={{ background: hexToRgba(category.themeColor, 0.18) }}
        >
          {category.products.length} choix
        </span>
      </div>

      <div className="mt-5 flex justify-center">
        <div className="relative aspect-square w-full max-w-[280px]">
          <div
            className="absolute left-1/2 top-0 z-20 h-[18px] w-[24px] -translate-x-1/2"
            style={{
              backgroundColor: category.themeColor,
              clipPath: "polygon(50% 100%, 0 0, 100% 0)",
            }}
          />

          <motion.div
            animate={{ rotate: rotation }}
            className="absolute inset-0"
            transition={
              isSpinning
                ? {
                    duration: SPIN_DURATION_MS / 1000,
                    ease: [0.16, 1, 0.3, 1],
                  }
                : { duration: 0.45, ease: "easeOut" }
            }
          >
            <div
              className="absolute inset-0 rounded-full border border-white/70 shadow-[0_24px_60px_rgba(148,102,84,0.16)]"
              style={{ background: buildWheelGradient(category.products.length, category.themeColor) }}
            />
            <div className="absolute inset-[8%] rounded-full border border-white/55 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.88),rgba(255,255,255,0.14)_58%,transparent_72%)]" />
            <div className="absolute inset-[28%] flex items-center justify-center rounded-full border border-white/70 bg-white/78 text-center shadow-[0_10px_24px_rgba(138,95,76,0.1)] backdrop-blur">
              <div className="px-4">
                <p className="text-[11px] font-semibold tracking-[0.22em] text-[#9b6956] uppercase">
                  {isSpinning ? "En cours" : "Chance du jour"}
                </p>
                <p className="mt-2 font-display text-2xl leading-none text-[#3d2b24]">
                  {isSpinning ? "..." : category.name}
                </p>
              </div>
            </div>

            {category.products.map((product, index) => {
              const angle = index * segmentAngle;

              return (
                <div
                  key={product.id}
                  className="absolute left-1/2 top-1/2 w-[112px]"
                  style={{
                    transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-105px)`,
                  }}
                >
                  <div
                    className="rounded-full border border-white/65 bg-white/80 px-3 py-1.5 text-center text-[11px] font-semibold leading-4 text-[#5f4337] shadow-[0_8px_18px_rgba(131,93,75,0.1)] backdrop-blur"
                    style={{ transform: `rotate(${-angle}deg)` }}
                  >
                    {product.name}
                  </div>
                </div>
              );
            })}
          </motion.div>

          <div className="absolute inset-[4%] rounded-full border border-dashed border-white/50" />
          <div className="absolute left-1/2 top-1/2 z-10 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.08)]" />
        </div>
      </div>

      <div className="mt-6 rounded-[28px] border border-white/70 bg-white/72 p-4 shadow-[0_14px_30px_rgba(145,101,83,0.08)] backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold tracking-[0.24em] text-[#9a6b59] uppercase">
            {selectedProduct ? "Resultat" : "Comment ca marche"}
          </p>
          {selectedProduct?.badge ? (
            <span
              className="inline-flex rounded-full px-3 py-1 text-xs font-semibold text-[#6b4a41]"
              style={{ background: hexToRgba(category.themeColor, 0.16) }}
            >
              {selectedProduct.badge}
            </span>
          ) : null}
        </div>

        <p className="mt-3 font-display text-3xl text-[#3a2a22]">
          {selectedProduct
            ? selectedProduct.name
            : isSpinning
              ? "La roue choisit pour vous"
              : "Lancez la roue pour tirer un produit au hasard dans cette serie"}
        </p>
        <p className="mt-3 text-sm leading-7 text-[#6d554c]">
          {selectedProduct
            ? selectedProduct.description
            : "Chaque lancer pioche parmi les produits disponibles de cette serie, ideal pour choisir vite sans hesiter."}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isSpinning}
            style={{ background: category.themeColor }}
            type="button"
            onClick={handleSpin}
          >
            <Sparkles className="h-4 w-4" />
            {isSpinning ? "Ca tourne..." : selectedProduct ? "Relancer" : "Lancer la roue"}
          </button>

          {selectedProduct ? (
            <button
              className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/86 px-5 py-3 text-sm font-semibold text-[#5f4338] transition hover:bg-white"
              type="button"
              onClick={() => onAddProduct(selectedProduct.id)}
            >
              Je prends celui-ci
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : null}

          <span className="text-sm font-semibold text-[#6a4d41]">
            {selectedProduct
              ? formatPrice(selectedProduct.priceCents)
              : `${category.products.length} choix dans cette serie`}
          </span>
        </div>

        <p aria-live="polite" className="sr-only">
          {announcement}
        </p>
      </div>
    </div>
  );
}
