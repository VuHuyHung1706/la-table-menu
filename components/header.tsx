import { BagIcon } from "./icons";

export function Header({ count, onCart }: { count: number; onCart: () => void }) {
  return (
    <header className="relative z-20 flex h-[72px] items-center justify-between px-5 md:px-10">
      <a href="#" className="flex items-center gap-3" aria-label="La Table — trang chủ">
        <span className="grid size-10 place-items-center border border-ink/70 font-serif text-[19px] font-medium tracking-tight">
          LT
        </span>
        <span className="leading-none">
          <span className="block font-serif text-[21px] font-medium tracking-[0.14em]">LA TABLE</span>
          <span className="mt-1 block text-[8px] tracking-[0.42em] text-muted uppercase">Restaurant</span>
        </span>
      </a>

      <p className="eyebrow hidden items-center gap-3 md:flex">
        <span className="h-px w-8 bg-line" />
        Một vòng vị ngon
        <span className="h-px w-8 bg-line" />
      </p>

      <button
        type="button"
        onClick={onCart}
        className="relative flex h-11 items-center gap-2 rounded-full border border-line bg-paper/60 px-4 text-[13px] transition-colors hover:bg-paper"
        aria-label={`Giỏ hàng, ${count} món`}
      >
        <BagIcon />
        <span className="hidden sm:inline">Giỏ hàng</span>
        {count > 0 && (
          <span className="grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1.5 text-[11px] font-medium text-paper">
            {count}
          </span>
        )}
      </button>
    </header>
  );
}
