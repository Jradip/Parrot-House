"use client";

import { Check, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";

type AddToCartButtonProps = {
  birdId: string;
  maxQuantity: number;
  disabled?: boolean;
  isAuthenticated: boolean;
  loginHref: string;
  adminBlocked?: boolean;
};

export function AddToCartButton({
  birdId,
  maxQuantity,
  disabled,
  isAuthenticated,
  loginHref,
  adminBlocked = false,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    if (!isAuthenticated) {
      window.location.assign(loginHref);
      return;
    }

    addItem(birdId, maxQuantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <Button
      disabled={disabled || adminBlocked}
      onClick={handleClick}
      className="w-full sm:w-auto"
      aria-label={!isAuthenticated && !disabled ? "Masuk terlebih dahulu untuk menambahkan ke keranjang" : undefined}
    >
      {added ? <Check size={18} /> : <ShoppingBag size={18} />}
      {adminBlocked ? "Khusus akun pengguna" : disabled ? "Tidak dapat dibeli" : added ? "Ditambahkan" : "Tambah ke keranjang"}
    </Button>
  );
}
