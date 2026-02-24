export function PageHeader() {
  return (
    <header className="border-2 border-[#174421] bg-[#fffdf7] p-4">
      <div className="flex items-center gap-4">
        <img src="/image.png" alt="Logo Sepefrei" className="h-16 w-16 border-2 border-[#174421] bg-white p-1" />
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em]">SEPEFREI</p>
          <h1 className="text-2xl font-bold">Gestion Intervenants & Études</h1>
          <p className="text-sm">Recherche, création d’intervenants.</p>
        </div>
      </div>
    </header>
  )
}
