interface SearchBarProps {
  search: string
  onChange: (value: string) => void
}

export function SearchBar({ search, onChange }: SearchBarProps) {
  return (
    <section className="border-2 border-[#174421] bg-[#fffdf7] p-4">
      <label htmlFor="search" className="mb-2 block text-sm font-semibold">
        Recherche (nom, disponibilité, compétences)
      </label>
      <input
        id="search"
        value={search}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Ex: react, disponible, ines"
        className="w-full border-2 border-[#174421] bg-white px-3 py-2 outline-none"
      />
    </section>
  )
}
