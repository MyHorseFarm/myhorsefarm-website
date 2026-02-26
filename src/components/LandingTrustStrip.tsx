export default function LandingTrustStrip({
  items,
}: {
  items: { icon: string; label: string }[];
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
    </div>
  );
}
