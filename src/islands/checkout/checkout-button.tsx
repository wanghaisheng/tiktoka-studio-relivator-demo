"use client";

import * as React from "react";
import { type CartLineItem } from "~/types";

import { createCheckoutSessionAction } from "~/server/actions/stripe";
import { getStripe } from "~/server/get-stripe";
import { catchError } from "~/server/utils";
import { Icons } from "~/islands/icons";
import { Button } from "~/islands/primitives/button";

interface CheckoutButtonProps {
  storeId: number;
  cartLineItems: CartLineItem[];
}

export function CheckoutButton({
  storeId,
  cartLineItems,
}: CheckoutButtonProps) {
  const [isPending, startTransition] = React.useTransition();

  const stripePromise = React.useMemo(
    () => getStripe(cartLineItems[0]?.storeStripeAccountId ?? ""),
    [cartLineItems],
  );

  return (
    <Button
      id={`store-${storeId}-checkout-button`}
      aria-label="Checkout with your cart items"
      size="sm"
      onClick={() => {
        startTransition(async () => {
          try {
            const stripe = await stripePromise;
            if (!stripe) return;

            const session = await createCheckoutSessionAction({
              storeId,
              items: cartLineItems,
            });

            const { error } = await stripe.redirectToCheckout({
              sessionId: session.id,
            });
            if (error) {
              catchError(error);
            }
          } catch (err) {
            catchError(err);
          }
        });
      }}
      disabled={isPending}
    >
      {isPending && (
        <Icons.spinner
          className="mr-2 h-4 w-4 animate-spin"
          aria-hidden="true"
        />
      )}
      Checkout
    </Button>
  );
}
