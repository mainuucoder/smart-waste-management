import { Link } from 'react-router-dom';
import { Recycle, MapPin, Calendar, TrendingUp, Sparkles, Trash2, Mail, Phone, MapPin as MapPinIcon } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <MapPin className="h-12 w-12 text-green-600" />,
      title: 'Report Issues',
      description: 'Easily report waste collection problems in your area with photos and location',
    },
    {
      icon: <Calendar className="h-12 w-12 text-green-600" />,
      title: 'Collection Schedule',
      description: 'View waste collection schedules for your area and get timely reminders',
    },
    {
      icon: <Recycle className="h-12 w-12 text-green-600" />,
      title: 'Recycling Info',
      description: 'Learn about proper waste segregation and recycling practices',
    },
    {
      icon: <TrendingUp className="h-12 w-12 text-green-600" />,
      title: 'Track Progress',
      description: 'Monitor the status of your reports and see community impact',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <section 
        className="relative min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Green Overlay for Better Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/70 via-green-800/60 to-emerald-900/70"></div>
        
        {/* Animated Sparkles Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Sparkles className="absolute top-20 left-20 text-white/30 w-6 h-6 animate-pulse" />
          <Sparkles className="absolute top-40 right-32 text-white/20 w-8 h-8 animate-pulse animation-delay-200" />
          <Sparkles className="absolute bottom-32 left-1/4 text-white/25 w-7 h-7 animate-pulse animation-delay-400" />
          <Sparkles className="absolute top-1/3 right-20 text-white/30 w-5 h-5 animate-pulse animation-delay-600" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Animated Heading */}
            <h1 className="text-7xl font-extrabold text-white mb-6 animate-fade-in-down drop-shadow-2xl">
              Smart Waste Management
            </h1>
            
            {/* Animated Subtitle */}
            <p className="text-3xl text-white font-medium mb-10 max-w-4xl mx-auto animate-fade-in-up animation-delay-200 drop-shadow-lg leading-relaxed">
              Join us in building sustainable cities and communities. 
              <span className="block mt-2 text-green-200">
                Report waste issues, track collection schedules, and contribute to a cleaner environment.
              </span>
            </p>
            
            {/* Animated Buttons */}
            <div className="flex justify-center space-x-6 animate-fade-in animation-delay-400">
              <Link 
                to="/register" 
                className="bg-white text-green-700 hover:bg-green-50 px-10 py-5 text-xl font-bold rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 hover:shadow-green-500/50"
              >
                🌱 Get Started
              </Link>
              <Link 
                to="/login" 
                className="bg-green-600/90 backdrop-blur-sm text-white hover:bg-green-700 px-10 py-5 text-xl font-bold rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 border-2 border-white/30"
              >
                ♻️ Sign In
              </Link>
            </div>

            {/* Cleaning Person Illustration */}
            <div className="mt-16 animate-fade-in animation-delay-600">
              <div className="relative inline-block">
                {/* Using emoji/SVG representation */}
                <div className="text-9xl drop-shadow-2xl animate-bounce-slow">
                  🧹🌍
                </div>
                <p className="text-white text-lg mt-4 font-semibold drop-shadow-lg">
                  Together, we clean our planet
                </p>
              </div>
            </div>
          </div>

          {/* Animated SDG Badge */}
          <div className="mt-16 text-center animate-fade-in animation-delay-800">
            <div className="inline-block bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-300 border-4 border-green-500">
              <p className="text-sm text-green-600 mb-2 font-bold uppercase tracking-wider">Supporting</p>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                SDG 11: Sustainable Cities and Communities
              </h3>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="text-white text-4xl">↓</div>
          <p className="text-white text-sm mt-2">Scroll to explore</p>
        </div>
      </section>

      {/* Features Section with Clean Background */}
      <section className="relative py-24" 
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* White Overlay */}
        <div className="absolute inset-0 bg-white/95"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl font-bold text-center text-gray-900 mb-4 animate-fade-in">
            How It Works
          </h2>
          <p className="text-center text-xl text-gray-600 mb-16 max-w-2xl mx-auto">
            Four simple steps to make your community cleaner
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-300 animate-slide-up border-2 border-green-100 hover:border-green-400"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-center mb-6 transform hover:rotate-12 hover:scale-110 transition-transform duration-300 bg-green-50 rounded-full p-4 mx-auto w-fit">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section with Nature Background */}
      <section 
        className="relative py-24"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Green Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 via-emerald-800/90 to-green-900/90"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl font-bold text-center text-white mb-16">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="animate-count-up bg-white/10 backdrop-blur-md rounded-2xl p-10 border-2 border-white/30">
              <h3 className="text-7xl font-bold mb-4 text-white drop-shadow-lg">500+</h3>
              <p className="text-2xl text-green-100 font-semibold">Active Users</p>
            </div>
            <div className="animate-count-up animation-delay-200 bg-white/10 backdrop-blur-md rounded-2xl p-10 border-2 border-white/30">
              <h3 className="text-7xl font-bold mb-4 text-white drop-shadow-lg">1,200+</h3>
              <p className="text-2xl text-green-100 font-semibold">Reports Submitted</p>
            </div>
            <div className="animate-count-up animation-delay-400 bg-white/10 backdrop-blur-md rounded-2xl p-10 border-2 border-white/30">
              <h3 className="text-7xl font-bold mb-4 text-white drop-shadow-lg">85%</h3>
              <p className="text-2xl text-green-100 font-semibold">Issues Resolved</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-50 py-24 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 animate-fade-in">
            Ready to Make a Difference?
          </h2>
          <p className="text-2xl text-gray-600 mb-12 animate-fade-in animation-delay-200 max-w-3xl mx-auto">
            Join our community and help create cleaner, more sustainable cities for future generations.
          </p>
          <Link 
            to="/register" 
            className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 px-12 py-6 text-2xl font-bold rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 animate-pulse-slow"
          >
            🌟 Join Now
          </Link>
        </div>
      </section>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

// Footer Component
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Trash2 className="h-8 w-8 text-green-500" />
              <span className="text-xl font-bold text-white">
                Smart Waste Management
              </span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Making cities cleaner and more sustainable through technology and 
              community participation. Supporting SDG 11: Sustainable Cities and Communities.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-green-400" />
                <span className="text-sm">info@smartwaste.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-green-400" />
                <span className="text-sm">+254 700 000 000</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPinIcon className="h-4 w-4 text-green-400" />
                <span className="text-sm">Kisumu, Kenya</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="hover:text-green-400 transition-colors duration-300 flex items-center space-x-2">
                  <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link to="/reports" className="hover:text-green-400 transition-colors duration-300 flex items-center space-x-2">
                  <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                  <span>Reports</span>
                </Link>
              </li>
              <li>
                <Link to="/schedules" className="hover:text-green-400 transition-colors duration-300 flex items-center space-x-2">
                  <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                  <span>Schedules</span>
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-green-400 transition-colors duration-300 flex items-center space-x-2">
                  <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                  <span>Dashboard</span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="hover:text-green-400 transition-colors duration-300 flex items-center space-x-2">
                  <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                  <span>About Us</span>
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition-colors duration-300 flex items-center space-x-2">
                  <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                  <span>Contact</span>
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition-colors duration-300 flex items-center space-x-2">
                  <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                  <span>FAQ</span>
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition-colors duration-300 flex items-center space-x-2">
                  <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                  <span>Privacy Policy</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © {currentYear} Smart Waste Management System. All rights reserved.
            </p>
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <span className="text-sm text-gray-400">Built with</span>
              <div className="text-red-500 animate-pulse">❤️</div>
              <span className="text-sm text-gray-400">for SDG 11</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Home;