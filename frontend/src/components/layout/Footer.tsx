import { Link } from 'react-router-dom';
import { Scissors, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-900 text-dark-300">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600">
                <Scissors className="h-5 w-5 text-dark-950" />
              </div>
              <span className="text-xl font-bold text-white">ApeX</span>
            </Link>
            <p className="text-sm text-dark-400">
              Premium barbershop experience. Book your appointment with the best barbers in town.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="p-2 rounded-lg bg-dark-800 hover:bg-gold-600 hover:text-dark-950 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-dark-800 hover:bg-gold-600 hover:text-dark-950 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-dark-800 hover:bg-gold-600 hover:text-dark-950 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { label: 'Home', href: '/' },
                { label: 'Barbershops', href: '/barbershops' },
                { label: 'Barbers', href: '/barbers' },
                { label: 'Book Appointment', href: '/book' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm hover:text-gold-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {[
                'Haircuts',
                'Beard Trim',
                'Hair Styling',
                'Hot Towel Shave',
                'Hair Coloring',
              ].map((service) => (
                <li key={service}>
                  <span className="text-sm">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-gold-500" />
                123 Barber Street, City
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-gold-500" />
                +1 234 567 8900
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-gold-500" />
                info@apex.com
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-dark-400">
              © {currentYear} ApeX Barbershop. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-dark-400 hover:text-gold-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-dark-400 hover:text-gold-400 transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
