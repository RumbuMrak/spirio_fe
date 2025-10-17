import { Star } from '@phosphor-icons/react';
export default function RatingBox({ rating = 4.9 }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-[#fff0c1de] py-1 pl-1.5 pr-2 leading-none shadow-primary-550">
      <Star className="h-4 w-4 fill-[#e27d00] " weight="fill" />
      <span className="mt-0.5 text-sm font-400 leading-none text-[#481b00]">{rating.toFixed(1)}</span>
    </div>
  );
}
