import Link from "next/link";
import {
  Layers3,
  Package,
  Palette,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

import { ConfirmActionButton } from "@/components/confirm-action-button";
import { SubmitButton } from "@/components/submit-button";
import {
  createCategoryAction,
  createProductAction,
  deleteCategoryAction,
  deleteProductAction,
  updateBudgetSettingsAction,
} from "@/lib/actions";
import {
  brandName,
  defaultCategoryColor,
  formatPrice,
  iconOptionValues,
} from "@/lib/catalog-data";
import { getAdminCatalog, getBudgetOverview } from "@/lib/data";
import { CategoryIcon } from "@/lib/icon-map";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [categories, budget] = await Promise.all([getAdminCatalog(), getBudgetOverview()]);
  const totalProducts = categories.reduce(
    (sum, category) => sum + category.products.length,
    0,
  );
  const availableProducts = categories.reduce(
    (sum, category) =>
      sum + category.products.filter((product) => product.isAvailable).length,
    0,
  );
  const averagePrice =
    totalProducts > 0
      ? Math.round(
          categories
            .flatMap((category) => category.products)
            .reduce((sum, product) => sum + product.priceCents, 0) / totalProducts,
        )
      : 0;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffaf4_0%,#fff2e7_100%)] text-[#2e231e]">
      <header className="border-b border-white/60 bg-[rgba(255,249,244,0.82)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-10">
          <div>
            <p className="text-xs tracking-[0.24em] text-[#99705f] uppercase">Administration</p>
            <h1 className="mt-2 font-display text-4xl text-[#36261f]">
              Administration {brandName}
            </h1>
            <p className="mt-2 text-sm text-[#76584c]">
              Ajoutez ou supprimez des series et des produits. La carte publique se met a jour immediatement.
            </p>
          </div>
          <Link
            className="inline-flex items-center gap-2 rounded-full border border-[#edd9cc] bg-white px-5 py-3 text-sm font-semibold text-[#5c4439] transition hover:bg-[#fff7f2]"
            href="/"
          >
            Retour a la carte
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[30px] border border-white/70 bg-white/82 p-5 shadow-[0_18px_45px_rgba(144,100,82,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs tracking-[0.24em] text-[#987060] uppercase">Series</p>
                <p className="mt-3 font-display text-5xl text-[#392821]">
                  {categories.length}
                </p>
              </div>
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fff2e8]">
                <Layers3 className="h-5 w-5 text-[#b0745b]" />
              </span>
            </div>
          </div>
          <div className="rounded-[30px] border border-white/70 bg-white/82 p-5 shadow-[0_18px_45px_rgba(144,100,82,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs tracking-[0.24em] text-[#987060] uppercase">Produits</p>
                <p className="mt-3 font-display text-5xl text-[#392821]">
                  {availableProducts}/{totalProducts}
                </p>
              </div>
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fef0f4]">
                <ShoppingBag className="h-5 w-5 text-[#aa6173]" />
              </span>
            </div>
          </div>
          <div className="rounded-[30px] border border-white/70 bg-white/82 p-5 shadow-[0_18px_45px_rgba(144,100,82,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs tracking-[0.24em] text-[#987060] uppercase">Prix moyen</p>
                <p className="mt-3 font-display text-5xl text-[#392821]">
                  {formatPrice(averagePrice)}
                </p>
              </div>
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eef8ed]">
                <Sparkles className="h-5 w-5 text-[#65996f]" />
              </span>
            </div>
          </div>
          <div className="rounded-[30px] border border-white/70 bg-white/82 p-5 shadow-[0_18px_45px_rgba(144,100,82,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs tracking-[0.24em] text-[#987060] uppercase">Budget dispo</p>
                <p className="mt-3 font-display text-5xl text-[#392821]">
                  {formatPrice(budget.availableBudgetCents)}
                </p>
              </div>
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fff7e5]">
                <Sparkles className="h-5 w-5 text-[#c48a2d]" />
              </span>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-8 xl:grid-cols-[350px_minmax(0,1fr)]">
          <aside className="space-y-6">
            <section className="rounded-[32px] border border-white/70 bg-white/86 p-6 shadow-[0_18px_50px_rgba(144,100,82,0.08)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs tracking-[0.24em] text-[#9a705f] uppercase">
                    Budget mensuel
                  </p>
                  <h2 className="mt-2 font-display text-3xl text-[#382820]">
                    Budget commandes
                  </h2>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#fff7e8]">
                  <Sparkles className="h-5 w-5 text-[#c48a2d]" />
                </span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[22px] border border-[#f0ddd0] bg-[#fffaf6] px-4 py-4">
                  <p className="text-xs tracking-[0.22em] text-[#9a705f] uppercase">Disponible</p>
                  <p className="mt-2 font-display text-3xl text-[#3d2b24]">
                    {formatPrice(budget.availableBudgetCents)}
                  </p>
                </div>
                <div className="rounded-[22px] border border-[#f0ddd0] bg-[#fffaf6] px-4 py-4">
                  <p className="text-xs tracking-[0.22em] text-[#9a705f] uppercase">Report cumule</p>
                  <p className="mt-2 font-display text-3xl text-[#3d2b24]">
                    {formatPrice(budget.carryoverCents)}
                  </p>
                </div>
                <div className="rounded-[22px] border border-[#f0ddd0] bg-[#fffaf6] px-4 py-4">
                  <p className="text-xs tracking-[0.22em] text-[#9a705f] uppercase">
                    Budget de {budget.currentMonthLabel}
                  </p>
                  <p className="mt-2 font-display text-3xl text-[#3d2b24]">
                    {formatPrice(budget.currentMonthBudgetCents)}
                  </p>
                </div>
                <div className="rounded-[22px] border border-[#f0ddd0] bg-[#fffaf6] px-4 py-4">
                  <p className="text-xs tracking-[0.22em] text-[#9a705f] uppercase">Depense ce mois</p>
                  <p className="mt-2 font-display text-3xl text-[#3d2b24]">
                    {formatPrice(budget.currentMonthSpentCents)}
                  </p>
                </div>
              </div>

              <form action={updateBudgetSettingsAction} className="mt-6 space-y-4">
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-[#5f463d]">Budget mensuel en euros</span>
                  <input
                    className="w-full rounded-[20px] border border-[#eed9cd] bg-[#fffaf6] px-4 py-3 text-sm outline-none transition focus:border-[#d3ab98] focus:bg-white"
                    defaultValue={(budget.monthlyBudgetCents / 100).toFixed(2)}
                    min="0"
                    name="monthlyBudget"
                    required
                    step="0.01"
                    type="number"
                  />
                </label>

                <p className="text-sm leading-7 text-[#7a5b50]">
                  Le solde non utilise est reporte automatiquement au mois suivant. En modifiant le budget, vous mettez a jour l&apos;enveloppe du mois en cours.
                </p>

                <SubmitButton
                  className="w-full bg-[#2f241f] text-white hover:bg-[#47362e]"
                  pendingLabel="Enregistrement..."
                >
                  Enregistrer le budget
                </SubmitButton>
              </form>
            </section>

            <section className="rounded-[32px] border border-white/70 bg-white/86 p-6 shadow-[0_18px_50px_rgba(144,100,82,0.08)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs tracking-[0.24em] text-[#9a705f] uppercase">
                    Nouvelle serie
                  </p>
                  <h2 className="mt-2 font-display text-3xl text-[#382820]">
                    Ajouter une serie
                  </h2>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#fff3eb]">
                  <Palette className="h-5 w-5 text-[#b57460]" />
                </span>
              </div>

              <form action={createCategoryAction} className="mt-6 space-y-4">
                <label className="block space-y-2">
                    <span className="text-sm font-semibold text-[#5f463d]">Nom de la serie</span>
                  <input
                    className="w-full rounded-[20px] border border-[#eed9cd] bg-[#fffaf6] px-4 py-3 text-sm outline-none transition focus:border-[#d3ab98] focus:bg-white"
                    name="name"
                    placeholder="Ex. : Editions saisonnieres"
                    required
                    type="text"
                  />
                </label>

                <label className="block space-y-2">
                    <span className="text-sm font-semibold text-[#5f463d]">Nom de l&apos;icone</span>
                  <input
                    className="w-full rounded-[20px] border border-[#eed9cd] bg-[#fffaf6] px-4 py-3 text-sm outline-none transition focus:border-[#d3ab98] focus:bg-white"
                    list="icon-options"
                    name="icon"
                    placeholder="Sparkles"
                    type="text"
                  />
                  <datalist id="icon-options">
                    {iconOptionValues.map((iconName) => (
                      <option key={iconName} value={iconName} />
                    ))}
                  </datalist>
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block space-y-2">
                    <span className="text-sm font-semibold text-[#5f463d]">Couleur</span>
                    <input
                      className="h-12 w-full rounded-[20px] border border-[#eed9cd] bg-[#fffaf6] px-3 outline-none transition focus:border-[#d3ab98] focus:bg-white"
                      defaultValue={defaultCategoryColor}
                      name="themeColor"
                      type="color"
                    />
                  </label>
                  <label className="block space-y-2">
                    <span className="text-sm font-semibold text-[#5f463d]">Ordre</span>
                    <input
                      className="w-full rounded-[20px] border border-[#eed9cd] bg-[#fffaf6] px-4 py-3 text-sm outline-none transition focus:border-[#d3ab98] focus:bg-white"
                      defaultValue="6"
                      min="1"
                      name="sortOrder"
                      type="number"
                    />
                  </label>
                </div>

                <SubmitButton
                  className="w-full bg-[#2f241f] text-white hover:bg-[#47362e]"
                      pendingLabel="Ajout..."
                    >
                      Ajouter la serie
                    </SubmitButton>
              </form>
            </section>

            <section className="rounded-[32px] border border-white/70 bg-white/86 p-6 shadow-[0_18px_50px_rgba(144,100,82,0.08)]">
              <p className="text-xs tracking-[0.24em] text-[#9a705f] uppercase">Series</p>
              <h2 className="mt-2 font-display text-3xl text-[#382820]">Series actuelles</h2>

              <div className="mt-5 space-y-4">
                {categories.map((category) => (
                  <article
                    key={category.id}
                    className="rounded-[24px] border border-[#f0ddd0] bg-[#fffaf6] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span
                          className="mt-1 flex h-10 w-10 items-center justify-center rounded-full"
                          style={{ backgroundColor: `${category.themeColor}22` }}
                        >
                          <CategoryIcon
                            className="h-4 w-4"
                            icon={category.icon}
                            style={{ color: category.themeColor }}
                          />
                        </span>
                        <div>
                          <p className="font-semibold text-[#443029]">{category.name}</p>
                          <p className="mt-1 text-sm text-[#83655a]">
                            {category._count.products} {category._count.products > 1 ? "produits" : "produit"}
                          </p>
                          <p className="mt-2 text-xs text-[#9e7665]">
                            Ordre {category.sortOrder} · {category.themeColor}
                          </p>
                        </div>
                      </div>
                    </div>

                    <ConfirmActionButton
                      action={deleteCategoryAction}
                      className="mt-4 w-full border border-[#f0d8cd] bg-white text-[#8a584d] hover:bg-[#fff1ec]"
                      confirmMessage={`Supprimer \"${category.name}\" ? Cela supprimera aussi ${category._count.products} ${category._count.products > 1 ? "produits" : "produit"} de cette serie.`}
                      fields={{ id: category.id }}
                      label="Supprimer la serie"
                      pendingLabel="Suppression..."
                    />
                  </article>
                ))}
              </div>
            </section>
          </aside>

          <div className="space-y-6">
            <section className="rounded-[32px] border border-white/70 bg-white/86 p-6 shadow-[0_18px_50px_rgba(144,100,82,0.08)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs tracking-[0.24em] text-[#9a705f] uppercase">
                    Nouveau produit
                  </p>
                  <h2 className="mt-2 font-display text-3xl text-[#382820]">
                    Ajouter un produit
                  </h2>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#fff3eb]">
                  <Package className="h-5 w-5 text-[#b57460]" />
                </span>
              </div>

              {categories.length ? (
                <form action={createProductAction} className="mt-6 grid gap-4 lg:grid-cols-2">
                  <label className="block space-y-2">
                    <span className="text-sm font-semibold text-[#5f463d]">Serie</span>
                    <select
                      className="w-full rounded-[20px] border border-[#eed9cd] bg-[#fffaf6] px-4 py-3 text-sm outline-none transition focus:border-[#d3ab98] focus:bg-white"
                      defaultValue={categories[0]?.id}
                      name="categoryId"
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block space-y-2">
                    <span className="text-sm font-semibold text-[#5f463d]">Nom du produit</span>
                    <input
                      className="w-full rounded-[20px] border border-[#eed9cd] bg-[#fffaf6] px-4 py-3 text-sm outline-none transition focus:border-[#d3ab98] focus:bg-white"
                      name="name"
                      placeholder="Ex. : The au lait a l'osmanthe"
                      required
                      type="text"
                    />
                  </label>

                  <label className="block space-y-2 lg:col-span-2">
                    <span className="text-sm font-semibold text-[#5f463d]">Description</span>
                    <textarea
                      className="min-h-28 w-full rounded-[20px] border border-[#eed9cd] bg-[#fffaf6] px-4 py-3 text-sm outline-none transition focus:border-[#d3ab98] focus:bg-white"
                      name="description"
                      placeholder="Decrivez le gout, les ingredients ou le moment ideal"
                      required
                    />
                  </label>

                  <label className="block space-y-2">
                    <span className="text-sm font-semibold text-[#5f463d]">Prix</span>
                    <input
                      className="w-full rounded-[20px] border border-[#eed9cd] bg-[#fffaf6] px-4 py-3 text-sm outline-none transition focus:border-[#d3ab98] focus:bg-white"
                      min="0"
                      name="price"
                      placeholder="18"
                      required
                      step="0.01"
                      type="number"
                    />
                  </label>

                  <label className="block space-y-2">
                    <span className="text-sm font-semibold text-[#5f463d]">Badge</span>
                    <input
                      className="w-full rounded-[20px] border border-[#eed9cd] bg-[#fffaf6] px-4 py-3 text-sm outline-none transition focus:border-[#d3ab98] focus:bg-white"
                      name="badge"
                      placeholder="Signature / Nouveau / Edition limitee"
                      type="text"
                    />
                  </label>

                  <label className="block space-y-2 lg:col-span-2">
                    <span className="text-sm font-semibold text-[#5f463d]">URL de l&apos;image</span>
                    <input
                      className="w-full rounded-[20px] border border-[#eed9cd] bg-[#fffaf6] px-4 py-3 text-sm outline-none transition focus:border-[#d3ab98] focus:bg-white"
                      name="imageUrl"
                      placeholder="https://example.com/product.jpg"
                      type="url"
                    />
                  </label>

                  <label className="block space-y-2">
                    <span className="text-sm font-semibold text-[#5f463d]">Ordre</span>
                    <input
                      className="w-full rounded-[20px] border border-[#eed9cd] bg-[#fffaf6] px-4 py-3 text-sm outline-none transition focus:border-[#d3ab98] focus:bg-white"
                      defaultValue="1"
                      min="1"
                      name="sortOrder"
                      type="number"
                    />
                  </label>

                  <label className="flex items-center gap-3 rounded-[20px] border border-[#eed9cd] bg-[#fffaf6] px-4 py-3 text-sm font-semibold text-[#5b4339]">
                    <input
                      className="h-4 w-4 accent-[#8e5a44]"
                      defaultChecked
                      name="isAvailable"
                      type="checkbox"
                    />
                    Disponible immediatement
                  </label>

                  <div className="lg:col-span-2">
                    <SubmitButton
                      className="w-full bg-[#2f241f] text-white hover:bg-[#47362e]"
                      pendingLabel="Ajout..."
                    >
                      Ajouter le produit
                    </SubmitButton>
                  </div>
                </form>
              ) : (
                <div className="mt-6 rounded-[26px] border border-dashed border-[#ecd8ca] bg-[#fff8f2] px-5 py-6 text-sm leading-7 text-[#806056]">
                  Aucune serie pour le moment. Creez-en d&apos;abord une a gauche avant d&apos;ajouter un produit.
                </div>
              )}
            </section>

            <section className="space-y-5">
              {categories.map((category) => (
                <article
                  key={category.id}
                  className="rounded-[32px] border border-white/70 bg-white/86 p-6 shadow-[0_18px_50px_rgba(144,100,82,0.08)]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span
                        className="flex h-12 w-12 items-center justify-center rounded-full"
                        style={{ backgroundColor: `${category.themeColor}22` }}
                      >
                        <CategoryIcon
                          className="h-5 w-5"
                          icon={category.icon}
                          style={{ color: category.themeColor }}
                        />
                      </span>
                      <div>
                        <p className="text-xs tracking-[0.24em] text-[#9a705f] uppercase">
                            Liste des produits
                        </p>
                        <h3 className="mt-1 font-display text-3xl text-[#382820]">
                          {category.name}
                        </h3>
                      </div>
                    </div>
                    <span className="rounded-full bg-[#fff4ec] px-4 py-2 text-sm font-semibold text-[#7c5d52]">
                      {category.products.length} {category.products.length > 1 ? "produits" : "produit"}
                    </span>
                  </div>

                  {category.products.length ? (
                    <div className="mt-6 space-y-4">
                      {category.products.map((product) => (
                        <div
                          key={product.id}
                          className="grid gap-4 rounded-[24px] border border-[#f0ddd0] bg-[#fffaf6] p-4 lg:grid-cols-[minmax(0,1fr)_auto]"
                        >
                          <div>
                            <div className="flex flex-wrap items-center gap-3">
                              <p className="font-semibold text-[#433029]">{product.name}</p>
                              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#7d6155]">
                                {product.isAvailable ? "Disponible" : "Indisponible"}
                              </span>
                              {product.badge ? (
                                <span className="rounded-full bg-[#fff0f4] px-3 py-1 text-xs font-semibold text-[#aa6073]">
                                  {product.badge}
                                </span>
                              ) : null}
                            </div>
                            <p className="mt-3 text-sm leading-7 text-[#73574c]">
                              {product.description}
                            </p>
                            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#9c7565]">
                              <span>Ordre {product.sortOrder}</span>
                              <span>{formatPrice(product.priceCents)}</span>
                              <span>{product.imageUrl ? "Avec image" : "Illustration seule"}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-end">
                            <ConfirmActionButton
                              action={deleteProductAction}
                              className="border border-[#f0d8cd] bg-white text-[#8a584d] hover:bg-[#fff1ec]"
                              confirmMessage={`Supprimer le produit \"${product.name}\" ?`}
                              fields={{ id: product.id }}
                              label="Supprimer le produit"
                              pendingLabel="Suppression..."
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-6 rounded-[24px] border border-dashed border-[#ecd8ca] bg-[#fff8f2] px-5 py-6 text-sm leading-7 text-[#806056]">
                      Cette serie n&apos;a pas encore de produit. Utilisez le formulaire ci-dessus pour en ajouter.
                    </div>
                  )}
                </article>
              ))}
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}
