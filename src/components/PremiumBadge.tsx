import { Crown } from "lucide-react";
import { usePremium } from "@/hooks/usePremium";

export function PremiumBadge() {
  const { isPremium, loading } = usePremium();

  if (loading || !isPremium) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
      <Crown className="w-3 h-3" />
      <span>Premium</span>
    </div>
  );
}