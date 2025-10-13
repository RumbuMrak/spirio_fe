import { Star } from "@phosphor-icons/react";
 export default function RatingBox({ rating = 4.9 }) {
  return (
    <div className="inline-flex items-center gap-1 bg-[#fff0c1de] rounded-full px-2 py-1 shadow-primary-550">
      <Star className="w-4 h-4 fill-[#ffa600] " weight='fill' />
      <span className="text-black font-400 font-avenier text-sm">{rating.toFixed(2)}</span>
    </div>
  );
}