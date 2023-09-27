import Link from "next-intl/link";

import { getCartAction } from "~/server/actions/cart";
import { cn, formatPrice } from "~/server/utils";
import { CartLineItems } from "~/islands/checkout/cart-line-items";
import { buttonVariants } from "~/islands/primitives/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/islands/primitives/card";
import { Separator } from "~/islands/primitives/separator";

interface CheckoutCardProps {
  storeId: number;
}

export async function CheckoutCard({ storeId }: CheckoutCardProps) {
  const cartLineItems = await getCartAction(storeId);

  return (
    <Card
      key={storeId}
      as="section"
      id={`checkout-store-${storeId}`}
      aria-labelledby={`checkout-store-${storeId}-heading`}
      className={cn(
        cartLineItems[0]?.storeStripeAccountId
          ? "border-green-500"
          : "border-destructive",
      )}
    >
      <CardHeader className="flex flex-row items-center space-x-4 py-4">
        <CardTitle className="line-clamp-1 flex-1">
          {cartLineItems[0]?.storeName}
        </CardTitle>
        {/* <CheckoutButton storeId={storeId} cartLineItems={cartLineItems} /> */}
        <Link
          href={`/checkout/${storeId}`}
          className={cn(
            buttonVariants({
              size: "sm",
            }),
          )}
        >
          Checkout
        </Link>
      </CardHeader>
      <Separator className="mb-4" />
      <CardContent className="pb-6 pl-6 pr-0">
        <CartLineItems
          cartLineItems={cartLineItems}
          className="max-h-[280px]"
        />
      </CardContent>
      <Separator className="mb-4" />
      <CardFooter className="space-x-4">
        <span className="flex-1">
          {cartLineItems.reduce((acc, item) => acc + Number(item.quantity), 0)}{" "}
          items
        </span>
        <span>
          {formatPrice(
            cartLineItems.reduce(
              (acc, item) => acc + Number(item.price) * Number(item.quantity),
              0,
            ),
          )}
        </span>
      </CardFooter>
    </Card>
  );
}
