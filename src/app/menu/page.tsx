"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { api } from "~/trpc/react";
import { formatCurrency } from "~/utils/format";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Skeleton } from "~/components/ui/skeleton";
import { Phone } from "lucide-react";

export default function MenuPage() {
  const [activeTab, setActiveTab] = useState("daily");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Fetch data
  const { data: categories, isLoading: loadingCategories } =
    api.menu.getCategories.useQuery();
  const { data: menuItems, isLoading: loadingItems } =
    api.menu.getMenuItems.useQuery(
      activeCategory ? { categoryId: activeCategory } : undefined,
    );
  const { data: dailyMenu, isLoading: loadingDailyMenu } =
    api.menu.getDailyMenu.useQuery();

  // Set first category as active when data loads
  useEffect(() => {
    if (categories && categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].id);
    }
  }, [categories, activeCategory]);

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  const isLoading = loadingCategories || loadingItems || loadingDailyMenu;

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.h1
        className="mb-8 text-center text-3xl font-light tracking-tight md:text-4xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Нашето Меню
      </motion.h1>

      {/* Call to Order Button (Always Visible) */}
      <motion.div
        className="sticky top-20 z-30 mb-6 flex w-full justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <a
          href="tel:+359888123456"
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-700 px-6 py-3 text-white shadow-lg transition-transform hover:scale-105"
        >
          <Phone className="h-5 w-5" />
          <span className="font-medium">Поръчай на 0888 123 456</span>
        </a>
      </motion.div>

      {/* Tab Switcher */}
      <Tabs
        defaultValue="daily"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-6 grid w-full grid-cols-2">
          <TabsTrigger value="daily" className="text-base">
            Дневно Меню
          </TabsTrigger>
          <TabsTrigger value="regular" className="text-base">
            Основно Меню
          </TabsTrigger>
        </TabsList>

        {/* Daily Menu Tab */}
        <TabsContent value="daily" className="outline-none">
          <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-center text-xl font-medium">
              Дневно Меню •{" "}
              {new Date().toLocaleDateString("bg-BG", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </h2>

            {loadingDailyMenu ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <Skeleton className="h-6 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-16 w-full rounded-lg" />
                  </div>
                ))}
              </div>
            ) : dailyMenu && dailyMenu.menuItems.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {dailyMenu.menuItems.map((item) => (
                  <MenuItem
                    key={item.id}
                    name={item.name}
                    description={item.description || ""}
                    price={item.price.toString()}
                    specialPrice={item.specialPrice?.toString()}
                    imageUrl={item.imageUrl}
                  />
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                <p>Няма налично дневно меню за днес.</p>
                <p className="mt-2">
                  Моля, проверете основното меню или се обадете за актуални
                  предложения.
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Regular Menu Tab */}
        <TabsContent value="regular" className="outline-none">
          <div className="mb-6 flex flex-wrap gap-2">
            {loadingCategories ? (
              <div className="flex w-full gap-2 overflow-x-auto pb-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-10 w-24 flex-shrink-0 rounded-full"
                  />
                ))}
              </div>
            ) : (
              categories?.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    activeCategory === category.id
                      ? "bg-orange-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category.name}
                </button>
              ))
            )}
          </div>

          <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
            {loadingItems ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <Skeleton className="h-6 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-16 w-full rounded-lg" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {menuItems?.map((item) => (
                  <MenuItem
                    key={item.id}
                    name={item.name}
                    description={item.description || ""}
                    price={item.price.toString()}
                    imageUrl={item.imageUrl}
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Floating Mobile Order Button - Only show on small screens */}
      <motion.div
        className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transform md:hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <a
          href="tel:+359888123456"
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-700 px-6 py-3 text-white shadow-lg"
        >
          <Phone className="h-5 w-5" />
          <span>Поръчай Сега</span>
        </a>
      </motion.div>
    </div>
  );
}

interface MenuItemProps {
  name: string;
  description: string;
  price: string;
  specialPrice?: string;
  imageUrl?: string | null;
}

function MenuItem({
  name,
  description,
  price,
  specialPrice,
  imageUrl,
}: MenuItemProps) {
  return (
    <motion.div
      className="flex flex-col rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-lg font-medium text-gray-900">{name}</h3>
        <div className="flex items-baseline gap-1">
          {specialPrice && (
            <span className="text-sm text-gray-500 line-through">
              {formatCurrency(parseFloat(price))}
            </span>
          )}
          <span className="text-base font-medium text-orange-700">
            {formatCurrency(parseFloat(specialPrice || price))}
          </span>
        </div>
      </div>

      {description && (
        <p className="mb-3 text-sm text-gray-600">{description}</p>
      )}

      {imageUrl && (
        <div className="relative mt-auto h-40 w-full overflow-hidden rounded-lg">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
    </motion.div>
  );
}
