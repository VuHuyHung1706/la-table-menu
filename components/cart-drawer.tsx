"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { FREE_DELIVERY_FROM, formatPrice, photoUrl } from "@/lib/menu";
import { BagIcon, CheckIcon, CloseIcon, MinusIcon, PlusIcon } from "./icons";
import { EASE } from "./motion";
import type { useCart } from "./use-cart";
import { useDialog } from "./use-dialog";

type Cart = ReturnType<typeof useCart>;

export function CartDrawer({ cart, onClose }: { cart: Cart; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [orderCode, setOrderCode] = useState<string | null>(null);
  const [note, setNote] = useState("");
  useDialog(onClose, closeRef);

  const placeOrder = () => {
    // No backend in this demo: generate a code and empty the cart.
    setOrderCode(`LT${Math.floor(100000 + Math.random() * 900000)}`);
    cart.clear();
    setNote("");
  };

  const remaining = FREE_DELIVERY_FROM - cart.subtotal;

  return (
    <div className="fixed inset-0 z-50">
      <motion.div
        className="absolute inset-0 bg-[#4a5245]/35 backdrop-blur-[4px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.aside
        role="dialog"
        aria-modal="true"
        aria-label="Giỏ hàng"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.5, ease: EASE }}
        className="absolute inset-y-0 right-0 flex w-full max-w-[420px] flex-col bg-paper shadow-[-30px_0_60px_-30px_rgb(30_20_10/0.4)]"
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <div>
            <p className="eyebrow">Đơn của bạn</p>
            <h2 className="font-serif text-[28px] leading-tight font-medium">Giỏ hàng</h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="grid size-10 place-items-center rounded-full border border-ink/60 hover:bg-tile"
            aria-label="Đóng giỏ hàng"
          >
            <CloseIcon width={16} height={16} />
          </button>
        </div>

        {orderCode ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="grid size-16 place-items-center rounded-full bg-accent text-paper">
              <CheckIcon width={28} height={28} />
            </span>
            <h3 className="mt-5 font-serif text-[30px] leading-tight font-medium">Bếp đã nhận đơn</h3>
            <p className="mt-2 text-[13px] text-muted">
              Mã đơn <span className="font-medium text-ink">{orderCode}</span>. Món sẽ đến trong khoảng 25–35 phút.
            </p>
            <button
              type="button"
              onClick={() => {
                setOrderCode(null);
                onClose();
              }}
              className="mt-8 h-11 rounded-full border border-line px-6 text-[13px] hover:bg-tile"
            >
              Tiếp tục xem thực đơn
            </button>
          </div>
        ) : cart.items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center text-muted">
            <BagIcon width={36} height={36} />
            <p className="mt-4 font-serif text-[24px] text-ink">Bàn vẫn còn trống</p>
            <p className="mt-1 text-[13px]">Chọn một món bạn thích để bắt đầu.</p>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-6">
              {cart.items.map(({ dish, qty }) => (
                <li key={dish.id} className="flex items-center gap-4 py-4">
                  <span className="plate plate-sm relative size-14 shrink-0 rounded-full">
                    <span className="plate-food absolute inset-[12%] overflow-hidden rounded-full">
                      <Image src={photoUrl(dish.photo, 200)} alt="" fill sizes="56px" style={{ scale: dish.zoom ?? 1.32 }} className="object-cover" />
                    </span>
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-serif text-[18px] leading-tight font-medium">{dish.name}</p>
                    <p className="mt-0.5 text-[12px] text-muted">{formatPrice(dish.price * qty)}</p>
                  </div>
                  <div className="flex h-9 items-center rounded-full border border-line" role="group" aria-label={`Số lượng ${dish.name}`}>
                    <button
                      type="button"
                      onClick={() => cart.setQty(dish.id, qty - 1)}
                      className="grid size-9 place-items-center text-muted hover:text-ink"
                      aria-label={qty === 1 ? `Bỏ ${dish.name}` : "Bớt một phần"}
                    >
                      {qty === 1 ? <CloseIcon width={12} height={12} /> : <MinusIcon width={12} height={12} />}
                    </button>
                    <span className="w-4 text-center text-[13px] tabular-nums">{qty}</span>
                    <button
                      type="button"
                      onClick={() => cart.setQty(dish.id, qty + 1)}
                      className="grid size-9 place-items-center text-muted hover:text-ink"
                      aria-label="Thêm một phần"
                    >
                      <PlusIcon width={12} height={12} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-line px-6 py-5">
              <label className="text-[11px] font-medium text-ink/80" htmlFor="note">
                Ghi chú cho bếp
              </label>
              <textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder="Ít cay, không hành…"
                className="mt-2 w-full resize-none rounded-xl border border-line bg-cream/60 px-3 py-2 text-[13px] outline-none placeholder:text-muted/70 focus:border-accent"
              />

              <dl className="mt-4 space-y-1.5 text-[13px]">
                <div className="flex justify-between text-muted">
                  <dt>Tạm tính</dt>
                  <dd>{formatPrice(cart.subtotal)}</dd>
                </div>
                <div className="flex justify-between text-muted">
                  <dt>Phí giao hàng</dt>
                  <dd>{cart.delivery === 0 ? "Miễn phí" : formatPrice(cart.delivery)}</dd>
                </div>
                {remaining > 0 && (
                  <p className="text-[11px] text-accent">Thêm {formatPrice(remaining)} để được miễn phí giao hàng.</p>
                )}
                <div className="flex items-end justify-between pt-2">
                  <dt className="font-medium">Tổng cộng</dt>
                  <dd className="font-serif text-[28px] leading-none font-semibold">{formatPrice(cart.total)}</dd>
                </div>
              </dl>

              <button
                type="button"
                onClick={placeOrder}
                className="mt-5 h-12 w-full rounded-full bg-accent text-[14px] font-medium text-paper transition-colors hover:bg-accent-strong"
              >
                Đặt món · {formatPrice(cart.total)}
              </button>
            </div>
          </>
        )}
      </motion.aside>
    </div>
  );
}
