const Footbar = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-16">
      <div className="max-w-6xl mx-auto px-6 text-center">
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 justify-items-center">
          
          <div>
            <h6 className="text-white font-semibold mb-4">Sistem Rapor Online</h6>
            <ul className="space-y-2">
              <li className="text-sm">Kelola nilai siswa dengan mudah</li>
              <li className="text-sm">Transparan dan terintegrasi</li>
            </ul>
          </div>

          <div>
            <h6 className="text-white font-semibold mb-4">Tentang</h6>
            <ul className="space-y-2">
              <li className="text-sm">Sistem Informasi Akademik</li>
              <li className="text-sm">SMK/MA/SMA</li>
            </ul>
          </div>

          <div>
            <h6 className="text-white font-semibold mb-4">Kontak</h6>
            <ul className="space-y-2">
              <li className="text-sm">Email: dugamngawi@sekolah.ac.id</li>
              <li className="text-sm">Telp: (021) 123-4567</li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 mt-12 pt-6 text-sm text-gray-500">
          © {new Date().getFullYear()} Sistem Rapor Online. All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footbar;

