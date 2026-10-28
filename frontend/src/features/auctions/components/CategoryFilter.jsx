export default function CategoryFilter({
  categories,
  selected,
  onSelect,
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {categories.map((category) => {
        const isActive = selected === category;

        return (
          <button
            key={category}
            type="button"
            onClick={() => onSelect(category)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${
              isActive
                ? "border-indigo-600 bg-indigo-600 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-700"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}