"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-react";
import {
  startTransition,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import {
  brandName,
  buildSoftGradient,
  formatPrice,
  getCategoryStory,
  hexToRgba,
} from "@/lib/catalog-data";
import { CategoryIcon } from "@/lib/icon-map";
import type { MenuCategory } from "@/lib/types";

type MenuExperienceProps = {
  categories: MenuCategory[];
};

type CartState = Record<string, number>;

function buildCartProductMap(categories: MenuCategory[]) {
  return categories.flatMap((category) =>
    category.products.map((product) => ({
      ...product,
      categoryName: category.name,
      themeColor: category.themeColor,
    })),
  );
}

function ProductVisual({
  imageUrl,
  name,
  themeColor,
}: {
  imageUrl: string | null;
  name: string;
  themeColor: string;
}) {
  return (
    <div
      aria-label={`${name} 商品展示`}
      className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-white/70"
      role="img"
      style={{
        background: `${buildSoftGradient(themeColor)}${
          imageUrl
            ? `, linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.35))`
            : ""
        }`,
      }}
    >
      {imageUrl ? (
        <div
          className="absolute inset-0 bg-cover bg-center mix-blend-multiply"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      ) : null}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.7),transparent_45%),linear-gradient(180deg,transparent_20%,rgba(255,255,255,0.3)_100%)]" />
      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
        <span className="inline-flex rounded-full bg-white/78 px-3 py-1 text-[11px] font-semibold tracking-[0.24em] text-[#6f574c] uppercase backdrop-blur">
          Sweet Pick
        </span>
        <Sparkles className="h-5 w-5 text-white/85" />
      </div>
    </div>
  );
}

function EmptyMenuState() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#fff7ee,transparent_45%),linear-gradient(180deg,#fffaf4_0%,#fff3e9_100%)] px-6 text-center">
      <div className="max-w-xl space-y-5">
        <span className="inline-flex items-center rounded-full border border-[#f2d8c7] bg-white/70 px-4 py-2 text-xs font-semibold tracking-[0.26em] text-[#9a6c58] uppercase">
          菜单暂时空空的
        </span>
        <h1 className="font-display text-4xl text-[#3d2b23] sm:text-6xl">
          先去后台加一点甜甜的新品吧
        </h1>
        <p className="text-base leading-8 text-[#6e5750] sm:text-lg">
          当前还没有上架商品，所以前台会先显示这张空白海报。去后台创建系列和商品后，菜单会立即更新。
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            className="inline-flex items-center gap-2 rounded-full bg-[#2f241f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#47362e]"
            href="/admin"
          >
            去后台添加内容
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function MenuExperience({ categories }: MenuExperienceProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.slug ?? "");
  const [cart, setCart] = useState<CartState>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const successTimerRef = useRef<number | null>(null);
  const highlightId = useId();
  const allProducts = buildCartProductMap(categories);

  useEffect(() => {
    if (!categories.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];

        if (!visibleEntry) {
          return;
        }

        const slug = visibleEntry.target.id.replace("section-", "");
        startTransition(() => {
          setActiveCategory((current) => (current === slug ? current : slug));
        });
      },
      {
        rootMargin: "-30% 0px -55% 0px",
        threshold: [0.2, 0.35, 0.5, 0.75],
      },
    );

    for (const category of categories) {
      const element = document.getElementById(`section-${category.slug}`);

      if (element) {
        observer.observe(element);
      }
    }

    return () => observer.disconnect();
  }, [categories]);

  useEffect(() => {
    return () => {
      if (successTimerRef.current) {
        window.clearTimeout(successTimerRef.current);
      }
    };
  }, []);

  function updateCartQuantity(productId: string, nextQuantity: number) {
    setCart((currentCart) => {
      const nextCart = { ...currentCart };

      if (nextQuantity <= 0) {
        delete nextCart[productId];
        return nextCart;
      }

      nextCart[productId] = nextQuantity;
      return nextCart;
    });
  }

  function addProduct(productId: string) {
    setCart((currentCart) => ({
      ...currentCart,
      [productId]: (currentCart[productId] ?? 0) + 1,
    }));
    setIsCartOpen(true);
  }

  function scrollToCategory(slug: string) {
    const target = document.getElementById(`section-${slug}`);

    if (!target) {
      return;
    }

    target.scrollIntoView({ behavior: "smooth", block: "start" });
    startTransition(() => {
      setActiveCategory(slug);
    });
  }

  function confirmCheckout() {
    setCart({});
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setSuccessMessage("本次点单已经帮你打包好啦");

    if (successTimerRef.current) {
      window.clearTimeout(successTimerRef.current);
    }

    successTimerRef.current = window.setTimeout(() => {
      setSuccessMessage("");
    }, 2800);
  }

  const cartItems = allProducts.flatMap((product) => {
    const quantity = cart[product.id];

    if (!quantity) {
      return [];
    }

    return [
      {
        ...product,
        quantity,
      },
    ];
  });

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.priceCents,
    0,
  );

  if (!categories.length) {
    return <EmptyMenuState />;
  }

  return (
    <div className="relative overflow-hidden bg-[linear-gradient(180deg,#fffaf4_0%,#fff1e6_48%,#fff7ef_100%)] text-[#2f241f]">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.95),transparent_34%),radial-gradient(circle_at_right,rgba(255,211,183,0.8),transparent_30%),linear-gradient(140deg,#ffd6c7_0%,#fff2df_42%,#f4d7b7_100%)]">
        <motion.div
          animate={{ y: [0, -16, 0] }}
          className="absolute left-[-8rem] top-10 h-60 w-60 rounded-full bg-white/35 blur-3xl"
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        <motion.div
          animate={{ y: [0, 22, 0] }}
          className="absolute right-[-5rem] top-24 h-72 w-72 rounded-full bg-[#f4c7d8]/45 blur-3xl"
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        <motion.div
          animate={{ rotate: [0, 10, 0] }}
          className="absolute bottom-[-4rem] left-1/3 h-44 w-44 rounded-full border border-white/35"
          transition={{ duration: 14, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />

        <div className="mx-auto flex max-w-7xl flex-col px-4 pb-14 pt-6 sm:px-6 lg:min-h-[92svh] lg:flex-row lg:items-center lg:gap-10 lg:px-10 lg:pb-18 lg:pt-8">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 max-w-xl"
            initial={{ opacity: 0, y: 28 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/72 shadow-[0_12px_35px_rgba(175,119,80,0.16)] backdrop-blur">
                  <ShoppingBag className="h-5 w-5 text-[#8e5a44]" />
                </div>
                <div>
                  <p className="font-display text-2xl text-[#4c352c]">{brandName}</p>
                  <p className="text-xs tracking-[0.2em] text-[#8d6658] uppercase">
                    Sweet kiosk
                  </p>
                </div>
              </div>
              <Link
                className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/58 px-4 py-2 text-sm font-semibold text-[#5f4338] backdrop-blur transition hover:bg-white/82"
                href="/admin"
              >
                后台管理
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <span className="inline-flex items-center rounded-full border border-white/70 bg-white/64 px-4 py-2 text-xs font-semibold tracking-[0.3em] text-[#9d6b56] uppercase backdrop-blur">
              轻甜现点菜单
            </span>
            <h1 className="mt-5 max-w-lg font-display text-5xl leading-[0.98] text-[#3a271f] sm:text-7xl">
              {brandName}
              <span className="mt-2 block text-[#a35e66]">一屏挑完今天想吃的。</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-[#684f46] sm:text-lg">
              奶茶、零食、主食、甜品和互动专区已经排好队。往下滑就能按系列挑选，右下角会一直帮你记住这一轮想点的东西。
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                className="inline-flex items-center gap-2 rounded-full bg-[#2f241f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#47362e]"
                type="button"
                onClick={() => scrollToCategory(categories[0]?.slug ?? "")}
              >
                开始挑选
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-6 py-3 text-sm font-semibold text-[#5e4339] backdrop-blur transition hover:bg-white/82"
                type="button"
                onClick={() => setIsCartOpen(true)}
              >
                查看购物车
                <ShoppingBag className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[26px] border border-white/70 bg-white/54 px-4 py-4 backdrop-blur">
                <p className="text-xs tracking-[0.24em] text-[#9c705e] uppercase">系列</p>
                <p className="mt-2 font-display text-4xl text-[#402d25]">{categories.length}</p>
              </div>
              <div className="rounded-[26px] border border-white/70 bg-white/54 px-4 py-4 backdrop-blur">
                <p className="text-xs tracking-[0.24em] text-[#9c705e] uppercase">商品</p>
                <p className="mt-2 font-display text-4xl text-[#402d25]">{allProducts.length}</p>
              </div>
              <div className="rounded-[26px] border border-white/70 bg-white/54 px-4 py-4 backdrop-blur">
                <p className="text-xs tracking-[0.24em] text-[#9c705e] uppercase">当前加购</p>
                <p className="mt-2 font-display text-4xl text-[#402d25]">{cartCount}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="relative mt-14 flex flex-1 items-center justify-center lg:mt-0"
            initial={{ opacity: 0, scale: 0.94 }}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative aspect-square w-full max-w-[560px]">
              <motion.div
                animate={{ rotate: [0, 6, 0] }}
                className="absolute inset-0 rounded-full border border-white/60 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.92),rgba(255,255,255,0.2)_44%,transparent_65%),linear-gradient(180deg,rgba(255,245,238,0.92),rgba(255,228,205,0.62))] shadow-[0_40px_100px_rgba(153,99,79,0.22)]"
                transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              />
              <div className="absolute inset-[10%] rounded-full border border-dashed border-white/55" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="rounded-full border border-white/70 bg-white/75 px-4 py-2 text-xs font-semibold tracking-[0.24em] text-[#9b6656] uppercase backdrop-blur">
                  Today&apos;s mix
                </span>
                <p className="mt-6 max-w-xs font-display text-5xl leading-none text-[#3c2c25] sm:text-6xl">
                  Boba
                  <span className="block text-[#995863]">&amp; Bites</span>
                </p>
                <p className="mt-5 max-w-xs text-sm leading-7 text-[#6c5348] sm:text-base">
                  把想吃的先加进右下角，最后一起确认，一次逛完整张菜单。
                </p>
              </div>

              {categories.map((category, index) => {
                const angle = (Math.PI * 2 * index) / categories.length - Math.PI / 2;
                const radius = 41;
                const left = 50 + Math.cos(angle) * radius;
                const top = 50 + Math.sin(angle) * radius;

                return (
                  <motion.button
                    key={category.id}
                    className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full border border-white/70 bg-white/82 px-4 py-2 text-sm font-semibold text-[#594038] shadow-[0_16px_34px_rgba(145,101,83,0.14)] backdrop-blur transition hover:-translate-y-[55%]"
                    style={{ left: `${left}%`, top: `${top}%` }}
                    transition={{ duration: 0.4 }}
                    type="button"
                    onClick={() => scrollToCategory(category.slug)}
                  >
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-full"
                      style={{ background: hexToRgba(category.themeColor, 0.18) }}
                    >
                      <CategoryIcon
                        className="h-4 w-4"
                        icon={category.icon}
                        style={{ color: category.themeColor }}
                      />
                    </span>
                    {category.name}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="sticky top-0 z-30 border-y border-white/60 bg-[rgba(255,247,239,0.78)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl gap-6 overflow-x-auto px-4 py-4 sm:px-6">
          {categories.map((category) => {
            const isActive = category.slug === activeCategory;

            return (
              <button
                key={category.id}
                aria-pressed={isActive}
                className="relative flex shrink-0 items-center gap-2 pb-2 text-sm font-semibold text-[#6e5348] transition hover:text-[#3b2922]"
                type="button"
                onClick={() => scrollToCategory(category.slug)}
              >
                <CategoryIcon
                  className="h-4 w-4"
                  icon={category.icon}
                  style={{ color: category.themeColor }}
                />
                <span>{category.name}</span>
                {isActive ? (
                  <motion.span
                    className="absolute inset-x-0 bottom-0 h-[3px] rounded-full"
                    layoutId={`${highlightId}-menu-highlight`}
                    style={{ background: category.themeColor }}
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <main className="pb-32">
        {categories.map((category, index) => {
          const story = getCategoryStory(category.slug, category.name);

          return (
            <section
              key={category.id}
              className="border-b border-white/55"
              id={`section-${category.slug}`}
              style={{
                background: `linear-gradient(180deg, ${hexToRgba(
                  category.themeColor,
                  0.14,
                )} 0%, rgba(255,251,246,0.92) 42%, rgba(255,247,239,0.98) 100%)`,
              }}
            >
              <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[290px_minmax(0,1fr)] lg:gap-12 lg:py-16">
                <div className="lg:sticky lg:top-24 lg:h-fit">
                  <span className="inline-flex items-center rounded-full border border-white/70 bg-white/70 px-4 py-2 text-xs font-semibold tracking-[0.28em] text-[#946758] uppercase backdrop-blur">
                    {story.eyebrow}
                  </span>
                  <div className="mt-5 flex items-center gap-4">
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-full border border-white/70"
                      style={{ background: hexToRgba(category.themeColor, 0.18) }}
                    >
                      <CategoryIcon
                        className="h-6 w-6"
                        icon={category.icon}
                        style={{ color: category.themeColor }}
                      />
                    </div>
                    <div>
                      <p className="text-sm tracking-[0.24em] text-[#a17361] uppercase">
                        Series {index + 1}
                      </p>
                      <h2 className="font-display text-4xl text-[#3b2a22]">
                        {category.name}
                      </h2>
                    </div>
                  </div>
                  <p className="mt-5 text-base leading-8 text-[#684f46]">
                    {story.description}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-[#8a685d]">
                    {story.detail}
                  </p>
                </div>

                <div className="space-y-5">
                  {category.products.map((product) => {
                    const quantity = cart[product.id] ?? 0;

                    return (
                      <article
                        key={product.id}
                        className="grid gap-4 border-b border-white/70 py-4 sm:grid-cols-[150px_minmax(0,1fr)_auto] sm:items-center sm:gap-6 sm:py-5"
                      >
                        <ProductVisual
                          imageUrl={product.imageUrl}
                          name={product.name}
                          themeColor={category.themeColor}
                        />

                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="font-display text-2xl text-[#3b2922]">
                              {product.name}
                            </h3>
                            {product.badge ? (
                              <span
                                className="inline-flex rounded-full px-3 py-1 text-xs font-semibold text-[#6d4b43]"
                                style={{ background: hexToRgba(category.themeColor, 0.16) }}
                              >
                                {product.badge}
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6b544b] sm:text-base">
                            {product.description}
                          </p>
                        </div>

                        <div className="flex flex-col items-start gap-3 sm:items-end">
                          <p className="font-display text-3xl text-[#3c2a23]">
                            {formatPrice(product.priceCents)}
                          </p>

                          {quantity > 0 ? (
                            <div className="flex items-center gap-2 rounded-full border border-white/70 bg-white/78 p-1 shadow-[0_10px_24px_rgba(141,98,79,0.08)] backdrop-blur">
                              <button
                                className="flex h-10 w-10 items-center justify-center rounded-full text-[#62473d] transition hover:bg-[#f8eee7]"
                                type="button"
                                onClick={() => updateCartQuantity(product.id, quantity - 1)}
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="min-w-8 text-center text-sm font-semibold text-[#513931]">
                                {quantity}
                              </span>
                              <button
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2f241f] text-white transition hover:bg-[#47362e]"
                                type="button"
                                onClick={() => updateCartQuantity(product.id, quantity + 1)}
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-[#4d362d] shadow-[0_16px_30px_rgba(149,97,75,0.12)] transition hover:-translate-y-0.5"
                              type="button"
                              onClick={() => addProduct(product.id)}
                            >
                              加入点单
                              <Plus className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        })}
      </main>

      <button
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-3 rounded-full bg-[#2f241f] px-5 py-4 text-sm font-semibold text-white shadow-[0_24px_54px_rgba(70,49,40,0.3)] transition hover:-translate-y-1"
        type="button"
        onClick={() => setIsCartOpen(true)}
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/12">
          <ShoppingBag className="h-5 w-5" />
        </span>
        <span className="flex flex-col items-start">
          <span>购物车</span>
          <span className="text-xs font-medium text-white/72">{cartCount} 件商品</span>
        </span>
      </button>

      <AnimatePresence>
        {isCartOpen ? (
          <>
            <motion.button
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-40 bg-[rgba(52,37,31,0.3)] backdrop-blur-sm"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              type="button"
              onClick={() => setIsCartOpen(false)}
            />
            <motion.aside
              animate={{ opacity: 1, x: 0, y: 0 }}
              className="fixed bottom-4 right-4 z-50 flex max-h-[78vh] w-[min(420px,calc(100vw-2rem))] flex-col overflow-hidden rounded-[32px] border border-white/70 bg-[rgba(255,252,247,0.95)] shadow-[0_32px_80px_rgba(84,59,49,0.28)] backdrop-blur-xl"
              exit={{ opacity: 0, x: 24, y: 12 }}
              initial={{ opacity: 0, x: 24, y: 12 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center justify-between border-b border-[#efdcd0] px-5 py-5">
                <div>
                  <p className="text-xs tracking-[0.24em] text-[#9b705d] uppercase">Cart</p>
                  <h2 className="font-display text-3xl text-[#3a271f]">本次点单</h2>
                </div>
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ecd7c7] text-[#6e5146] transition hover:bg-white"
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4">
                {cartItems.length ? (
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-[26px] border border-white/70 bg-white/72 p-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-display text-xl text-[#3a2a22]">{item.name}</p>
                            <p className="mt-1 text-sm text-[#8a685d]">{item.categoryName}</p>
                          </div>
                          <p className="text-sm font-semibold text-[#594038]">
                            {formatPrice(item.priceCents * item.quantity)}
                          </p>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-2 rounded-full border border-[#ecd9cb] bg-[#fff9f4] p-1">
                            <button
                              className="flex h-9 w-9 items-center justify-center rounded-full text-[#65493f] transition hover:bg-white"
                              type="button"
                              onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="min-w-7 text-center text-sm font-semibold text-[#584039]">
                              {item.quantity}
                            </span>
                            <button
                              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2f241f] text-white transition hover:bg-[#47362e]"
                              type="button"
                              onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <button
                            className="text-sm font-semibold text-[#8d6254] transition hover:text-[#5a4036]"
                            type="button"
                            onClick={() => updateCartQuantity(item.id, 0)}
                          >
                            移除
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-[28px] border border-dashed border-[#e8cdbf] bg-white/56 px-5 py-8 text-center">
                    <p className="font-display text-2xl text-[#4a342b]">购物车还是空的</p>
                    <p className="mt-3 text-sm leading-7 text-[#87665b]">
                      去菜单里挑一杯奶茶或一份甜点，右下角会立刻帮你记下来。
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t border-[#efdcd0] px-5 py-5">
                <div className="flex items-center justify-between text-sm text-[#7b5a4f]">
                  <span>小计</span>
                  <span className="font-display text-3xl text-[#3b2a22]">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <button
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#2f241f] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#47362e] disabled:cursor-not-allowed disabled:bg-[#b39a90]"
                  disabled={!cartItems.length}
                  type="button"
                  onClick={() => setIsCheckoutOpen(true)}
                >
                  确认下单
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {isCheckoutOpen ? (
          <>
            <motion.button
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-[60] bg-[rgba(44,31,26,0.42)] backdrop-blur-sm"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              type="button"
              onClick={() => setIsCheckoutOpen(false)}
            />
            <motion.div
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="fixed inset-0 z-[61] flex items-center justify-center px-4"
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="w-full max-w-lg rounded-[34px] border border-white/70 bg-[rgba(255,251,247,0.97)] p-6 shadow-[0_28px_72px_rgba(72,51,42,0.28)] backdrop-blur-xl sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs tracking-[0.24em] text-[#9f705d] uppercase">
                      Checkout
                    </p>
                    <h3 className="mt-2 font-display text-3xl text-[#392820]">
                      确认这次点单
                    </h3>
                  </div>
                  <button
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ebd8ca] text-[#6f5348] transition hover:bg-white"
                    type="button"
                    onClick={() => setIsCheckoutOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-5 space-y-3">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-[22px] bg-[#fff5ed] px-4 py-3"
                    >
                      <div>
                        <p className="font-semibold text-[#443029]">{item.name}</p>
                        <p className="text-sm text-[#8b685c]">x {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-[#543b33]">
                        {formatPrice(item.quantity * item.priceCents)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-[24px] border border-[#f0ddd0] bg-white/70 px-4 py-4">
                  <p className="text-sm leading-7 text-[#77584e]">
                    这是演示版点单流程。确认后会显示成功提示并清空购物车，不会真的发送到厨房或收银台。
                  </p>
                </div>

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    className="rounded-full border border-[#ead5c7] px-5 py-3 text-sm font-semibold text-[#62483f] transition hover:bg-white"
                    type="button"
                    onClick={() => setIsCheckoutOpen(false)}
                  >
                    再看看
                  </button>
                  <button
                    className="rounded-full bg-[#2f241f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#47362e]"
                    type="button"
                    onClick={confirmCheckout}
                  >
                    就这样，下单吧
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {successMessage ? (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="fixed left-1/2 top-5 z-[70] w-[min(460px,calc(100vw-2rem))] -translate-x-1/2 rounded-full border border-white/70 bg-[rgba(255,251,247,0.94)] px-5 py-4 text-center text-sm font-semibold text-[#4f372f] shadow-[0_18px_44px_rgba(86,61,51,0.2)] backdrop-blur-xl"
            exit={{ opacity: 0, y: -12 }}
            initial={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
          >
            {successMessage}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
