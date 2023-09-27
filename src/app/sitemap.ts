import { type MetadataRoute } from "next";

import { getProductsAction } from "~/server/actions/product";
import { getStoresAction } from "~/server/actions/store";
import { productCategories } from "~/server/config/products";
import { absoluteUrl } from "~/server/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const storesTransaction = await getStoresAction({
    limit: 10,
    offset: 0,
    sort: "createdAt.desc",
  });

  const stores = storesTransaction.items.map((store) => ({
    url: absoluteUrl(`/stores/${store.id}`),
    lastModified: new Date().toISOString(),
  }));

  const productsTransaction = await getProductsAction({
    limit: 10,
    offset: 0,
    sort: "createdAt.desc",
  });

  const products = productsTransaction.items.map((product) => ({
    url: absoluteUrl(`/product/${product.id}`),
    lastModified: new Date().toISOString(),
  }));

  const categories = productCategories.map((category) => ({
    url: absoluteUrl(`/categories/${category.title}`),
    lastModified: new Date().toISOString(),
  }));

  const subcategories = productCategories
    .map((category) =>
      category.subcategories.map((subcategory) => ({
        url: absoluteUrl(`/categories/${category.title}/${subcategory.slug}`),
        lastModified: new Date().toISOString(),
      })),
    )
    .flat();

  // const posts = allPosts.map((post) => ({
  //   url: absoluteUrl(`/blog/${post.slug}`),
  //   lastModified: new Date().toISOString()
  // }));

  const routes = [
    "",
    "/blog",
    "/custom/clothing",
    "/dashboard/account",
    "/dashboard/billing",
    "/dashboard/purchases",
    "/dashboard/settings",
    "/dashboard/stores",
    "/products",
    "/stores",
  ].map((route) => ({
    url: absoluteUrl(route),
    lastModified: new Date().toISOString(),
  }));

  // todo: find the proper way to handle locales

  return [
    ...routes,
    ...stores,
    ...products,
    ...categories,
    ...subcategories,
    // ...posts
  ];
}
