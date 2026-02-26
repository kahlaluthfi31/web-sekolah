
import React from 'react';
import { Mail, Phone, MapPin, Instagram, Twitter, Linkedin, Github } from 'lucide-react';
// Import PageType to ensure type safety in navigation
import { PageType } from '../App';

interface FooterProps {
  onNavigate?: (page: PageType) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-gray-900 text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
          <div className="lg:col-span-2">
            <span className="text-3xl font-bold text-white block mb-6 cursor-pointer" onClick={() => onNavigate?.('home')}>MySchool</span>
            <p className="text-gray-400 max-w-sm mb-10 leading-relaxed">
              Crafting exceptional digital experiences through thoughtful design and innovative solutions that elevate your brand presence.
            </p>
            <div className="space-y-4">
              <div className="flex items-center text-gray-400">
                <MapPin className="h-5 w-5 mr-4 text-[#0268ab]" />
                <span className="text-sm">123 Creative Boulevard, Design District, NY 10012</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Phone className="h-5 w-5 mr-4 text-[#0268ab]" />
                <span className="text-sm">+1 (555) 987-6543</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Mail className="h-5 w-5 mr-4 text-[#0268ab]" />
                <span className="text-sm">hello@designstudio.com</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-8">Studio</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              {/* Fix: use 'about-us' to match PageType definition */}
              <li><button onClick={() => onNavigate?.('about-us')} className="hover:text-white transition-colors">Our Story</button></li>
              <li><a href="#" className="hover:text-white transition-colors">Design Process</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Portfolio</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Case Studies</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Awards</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-8">Services</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Brand Identity</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Web Design</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Mobile Apps</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Digital Strategy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Consultation</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-8">Resources</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Design Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Style Guide</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Free Assets</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Inspiration</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-8">Connect</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Start Project</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Schedule Call</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Join Newsletter</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Follow Updates</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Partnership</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <h5 className="text-xl font-bold mb-2">Stay Inspired</h5>
              <p className="text-sm text-gray-500">Subscribe to receive design insights and creative inspiration delivered monthly.</p>
            </div>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-[#0268ab] transition-colors flex items-center gap-1"><Twitter className="h-4 w-4" /> Twitter</a>
              <a href="#" className="text-gray-400 hover:text-[#0268ab] transition-colors flex items-center gap-1"><Instagram className="h-4 w-4" /> Instagram</a>
              <a href="#" className="text-gray-400 hover:text-[#0268ab] transition-colors flex items-center gap-1"><Linkedin className="h-4 w-4" /> LinkedIn</a>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4">
            <p>© MyWebsite. All rights reserved.</p>
            <div className="flex space-x-8">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
              <a href="#" className="hover:text-white">Cookie Policy</a>
            </div>
            <p>Designed by <span className="text-white">BootstrapMade</span></p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


