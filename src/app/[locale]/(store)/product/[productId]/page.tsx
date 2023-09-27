import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { and, desc, eq, not } from "drizzle-orm";
import Link from "next-intl/link";

import { formatPrice, toTitleCase } from "~/server/utils";
import { db } from "~/data/db/client";
import { products, stores } from "~/data/db/schema";
import { fullURL } from "~/data/meta/builder";
import { AddToCartForm } from "~/forms/add-to-cart-form";
import { ProductCard } from "~/islands/modules/cards/product-card";
import { Breadcrumbs } from "~/islands/navigation/pagination/breadcrumbs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/islands/primitives/accordion";
import { Separator } from "~/islands/primitives/separator";
import { ProductImageCarousel } from "~/islands/product-carousel";
import { Shell } from "~/islands/wrappers/shell-variants";

export const metadata: Metadata = {
  metadataBase: fullURL(),
  title: "Product",
  description: "Product description",
};

interface ProductPageProps {
  params: {
    productId: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const productId = Number(params.productId);

  const product = await db.query.products.findFirst({
    where: eq(products.id, productId),
  });

  if (!product) {
    notFound();
  }

  const store = await db.query.stores.findFirst({
    columns: {
      id: true,
      name: true,
    },
    where: eq(stores.id, product.storeId),
  });

  const productsFromStore = store
    ? await db
        .select({
          id: products.id,
          name: products.name,
          price: products.price,
          images: products.images,
          category: products.category,
          inventory: products.inventory,
        })
        .from(products)
        .limit(4)
        .where(
          and(
            eq(products.storeId, product.storeId),
            not(eq(products.id, productId)),
          ),
        )
        .orderBy(desc(products.inventory))
    : [];

  return (
    <Shell>
      <Breadcrumbs
        segments={[
          {
            title: "Products",
            href: "/products",
          },
          {
            title: toTitleCase(product.category),
            href: `/products?category=${product.category}`,
          },
          {
            title: product.name,
            href: `/product/${product.id}`,
          },
        ]}
      />
      <div className="flex flex-col gap-8 md:flex-row md:gap-16">
        <ProductImageCarousel
          className="w-full md:w-1/2"
          images={product.images ?? []}
          options={{
            loop: true,
          }}
        />
        <Separator className="mt-4 md:hidden" />
        <div className="flex w-full flex-col gap-4 md:w-1/2">
          <div className="space-y-2">
            <h2 className="line-clamp-1 text-2xl font-bold">{product.name}</h2>
            <p className="text-base text-muted-foreground">
              {formatPrice(product.price)}
            </p>
            {store ? (
              <Link
                href={`/products?store_ids=${store.id}`}
                className="line-clamp-1 inline-block text-base text-muted-foreground hover:underline"
              >
                {store.name}
              </Link>
            ) : null}
          </div>
          <Separator className="my-1.5" />
          <AddToCartForm productId={productId} />
          <Separator className="mt-5" />
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="description">
              <AccordionTrigger>Description</AccordionTrigger>
              <AccordionContent>
                {product.description ??
                  "No description is available for this product."}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      {store && productsFromStore.length > 0 ? (
        <div className="overflow-hidden md:pt-6">
          <h2 className="line-clamp-1 border-b pb-3 flex-1 text-2xl font-heading">
            Other products published by{" "}
            <Link
              href={`/products?store_ids=${store.id}`}
              className="font-bold hover:underline"
            >
              {store.name}
            </Link>{" "}
            store:
          </h2>
          <div className="overflow-x-auto pb-2 pt-6">
            <div className="flex w-fit gap-4">
              {productsFromStore.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  className="min-w-[260px]"
                />
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </Shell>
  );
}
