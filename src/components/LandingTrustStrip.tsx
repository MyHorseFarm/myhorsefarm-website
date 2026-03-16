export default function LandingTrustStrip({
  items,
  reviewCount,
  avgRating,
}: {
  items: { icon: string; label: string }[];
  reviewCount?: number;
  avgRating?: number;
}) {
  return (
    <div className="flex flex-wrap justify-center gap-5 bg-gray-100 py-4.5 px-5 border-b-2 border-primary max-md:gap-3 max-md:py-3.5 max-md:px-2.5">
      {items.map((item) => (
        <span
          key={item.label}
          className="font-semibold text-[0.95rem] text-gray-800 whitespace-nowrap max-md:text-sm"
        >
          <i className={`${item.icon} text-primary mr-1.5`} />
          {item.label}
        </span>
      ))}
      {reviewCount && reviewCount > 0 && (
        <span className="font-semibold text-[0.95rem] text-gray-800 whitespace-nowrap max-md:text-sm">
          <i className="fab fa-google text-primary mr-1.5" />
          {avgRating ? `${avgRating.toFixed(1)} ★` : "5.0 ★"} ({reviewCount} Reviews)
        </span>
      )}
    </div>
  );
}
