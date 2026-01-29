'use client';

// TechHub.bg - Footer Component

import React from 'react';
import Link from 'next/link';
import { useUIStore } from '@/store';
import { translations } from '@/lib/translations';
import { colors } from '@/lib/colors';
import { Logo } from '@/components/ui/Logo';
import { FacebookIcon, InstagramIcon, TikTokIcon, TwitchIcon } from '@/components/ui/Icons';

export const Footer: React.FC = () => {
  const { isDark, language } = useUIStore();
  // isDark already boolean
  const t = translations[language];

  const footerLinks = [
    {
      title: language === 'bg' ? 'Информация' : 'Information',
      links: [
        { label: t.footer.about, href: '/about' },
        { label: t.footer.contact, href: '/contact' },
        { label: t.footer.shipping, href: '/shipping' },
        { label: t.footer.returns, href: '/returns' },
      ],
    },
    {
      title: language === 'bg' ? 'Категории' : 'Categories',
      links: [
        { label: t.gpu, href: '/category/graphics-cards' },
        { label: t.cpu, href: '/category/processors' },
        { label: t.motherboard, href: '/category/motherboards' },
        { label: t.peripherals, href: '/category/peripherals' },
      ],
    },
    {
      title: language === 'bg' ? 'Акаунт' : 'Account',
      links: [
        { label: t.myAccount, href: '/account' },
        { label: t.myOrders, href: '/account/orders' },
        { label: t.wishlist, href: '/wishlist' },
        { label: t.login, href: '/login' },
      ],
    },
  ];

  const socialLinks = [
    { icon: FacebookIcon, href: 'https://facebook.com/techhub.bg', label: 'Facebook' },
    { icon: InstagramIcon, href: 'https://instagram.com/techhub.bg', label: 'Instagram' },
    { icon: TikTokIcon, href: 'https://tiktok.com/@techhub.bg', label: 'TikTok' },
    { icon: TwitchIcon, href: 'https://twitch.tv/techhub', label: 'Twitch' },
  ];

  return (
    <footer className={`${isDark ? 'bg-[#0a0f15]' : 'bg-gray-100'} border-t ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
      {/* Newsletter Section */}
      <div className={`${isDark ? 'bg-[#00B553]/10' : 'bg-green-50'} py-10`}>
        <div className="max-w-[1400px] mx-auto px-6 text-center">
          <h3 className="font-['Russo_One'] text-xl mb-2">{t.newsletter}</h3>
          <p className={`text-sm mb-6 ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
            {t.newsletterDesc}
          </p>
          <form className="flex max-w-md mx-auto gap-2">
            <input
              type="email"
              placeholder={t.emailPlaceholder}
              className={`
                flex-1 px-4 py-3 rounded-lg text-sm outline-none
                ${isDark 
                  ? 'bg-white/10 border border-white/10 text-white placeholder:text-white/40 focus:border-[#00B553]' 
                  : 'bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#00B553]'
                }
              `}
            />
            <button 
              type="submit"
              className="px-6 py-3 bg-[#00B553] text-white rounded-lg font-semibold text-sm hover:bg-[#00a04a] transition-colors"
            >
              {t.subscribe}
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Logo & Social */}
          <div className="md:col-span-2">
            <Logo isDark={isDark} width={150} />
            <p className={`mt-4 text-sm ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
              {language === 'bg' 
                ? 'Вашият доверен партньор за компютърен хардуер и периферия в България.'
                : 'Your trusted partner for computer hardware and peripherals in Bulgaria.'
              }
            </p>
            <div className="flex gap-3 mt-6">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    w-10 h-10 rounded-lg flex items-center justify-center transition-colors
                    ${isDark 
                      ? 'bg-white/5 text-white/60 hover:bg-[#00B553] hover:text-white' 
                      : 'bg-gray-200 text-gray-600 hover:bg-[#00B553] hover:text-white'
                    }
                  `}
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section, i) => (
            <div key={i}>
              <h4 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link, j) => (
                  <li key={j}>
                    <Link
                      href={link.href}
                      className={`text-sm transition-colors ${isDark ? 'text-white/60 hover:text-[#00B553]' : 'text-gray-600 hover:text-[#00B553]'}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={`border-t ${isDark ? 'border-white/5' : 'border-gray-200'} py-6`}>
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className={`text-xs ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
            {t.footer.copyright}
          </p>
          <div className="flex gap-6">
            <Link 
              href="/privacy" 
              className={`text-xs ${isDark ? 'text-white/40 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
            >
              {t.footer.privacy}
            </Link>
            <Link 
              href="/terms" 
              className={`text-xs ${isDark ? 'text-white/40 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
            >
              {t.footer.terms}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
