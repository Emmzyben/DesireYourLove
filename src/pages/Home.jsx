
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, MessageCircle, Shield, Sparkles, Star, ArrowRight, Play, CheckCircle, TrendingUp, Award, Zap } from 'lucide-react';

const Home = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const heroImages = [
    '/images/sunset-happy-couple-e1425955022863.jpg',
    '/images/interracial.jpg',
    '/images/trendy-curly-man-joyful-young-600nw-2207145831.webp'
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-red-50 to-purple-50 overflow-x-hidden">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md shadow-lg border-b border-pink-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <Heart className="h-10 w-10 text-pink-500 group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
                  DesireYourLove
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-6">
              <Link
                to="/login"
                className="text-gray-700 hover:text-pink-500 transition-all duration-300 font-medium relative group"
              >
                Sign In
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-6 py-3 rounded-full hover:from-pink-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
              >
                Start Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Images Carousel */}
        <div className="absolute inset-0 z-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-20' : 'opacity-0'
              }`}
            >
              <img
                src={image}
                alt={`Hero ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/30 to-red-500/30"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className={`text-center lg:text-left transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <Star className="h-5 w-5 text-yellow-400 mr-2" />
                <span className="text-white font-medium">#1 Dating Platform</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Find Your <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">Perfect Match</span>
              </h1>

              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Where genuine connections bloom into lasting love stories. Join thousands who've discovered their soulmate through meaningful conversations and authentic relationships built on trust.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-pink-600 hover:to-red-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center group"
                >
                  Start Your Love Story
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/login"
                  className="border-2 border-white/30 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 hover:border-white/50 transition-all duration-300 backdrop-blur-sm"
                >
                  Sign In
                </Link>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-8 text-white/80">
                <div className="text-center">
                  <div className="text-3xl font-bold">50K+</div>
                  <div className="text-sm">Happy Couples</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">1M+</div>
                  <div className="text-sm">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">4.9★</div>
                  <div className="text-sm">User Rating</div>
                </div>
              </div>
            </div>

            {/* Right Content - Interactive Demo */}
            <div className={`relative transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="relative">
                {/* Floating Cards */}
                <div className="absolute -top-8 -left-8 bg-white rounded-2xl p-4 shadow-2xl animate-bounce">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-red-400 rounded-full flex items-center justify-center">
                      <Heart className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Sarah</div>
                      <div className="text-sm text-gray-500">Liked your profile!</div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-8 -right-8 bg-white rounded-2xl p-4 shadow-2xl animate-pulse">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                      <MessageCircle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Mike</div>
                      <div className="text-sm text-gray-500">Sent you a message</div>
                    </div>
                  </div>
                </div>

                {/* Main Phone Mockup */}
                <div className="bg-white rounded-3xl p-6 shadow-2xl mx-auto max-w-sm">
                  <div className="bg-gradient-to-br from-pink-100 to-red-100 rounded-2xl p-4 mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-pink-500 rounded-full"></div>
                        <span className="font-semibold text-gray-900">Emma</span>
                      </div>
                      <div className="text-pink-500">♥</div>
                    </div>
                    <p className="text-gray-700 text-sm mb-3">
                      "Hey! I saw we both love hiking and Italian food. Want to grab dinner sometime? 🍝🥾"
                    </p>
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-pink-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-pink-600 transition-colors">
                        Reply
                      </button>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                        👍
                      </button>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="inline-flex items-center space-x-1 text-pink-500">
                      <Sparkles className="h-4 w-4" />
                      <span className="text-sm font-medium">Perfect Match Found!</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-br from-white via-pink-50/30 to-purple-50/30 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff69b4' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-gradient-to-r from-pink-100 to-red-100 rounded-full px-6 py-3 mb-6">
              <Award className="h-5 w-5 text-pink-500 mr-2" />
              <span className="text-pink-700 font-semibold">Trusted by Millions</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose <span className="bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">DesireYourLove</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We believe in creating authentic connections that last a lifetime, not just fleeting moments
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-pink-50">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-red-400 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Genuine Connections</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                We prioritize meaningful relationships over casual encounters, fostering real emotional bonds
              </p>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-50">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Safe & Secure</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Advanced security measures and privacy protection ensure your data and conversations are safe
              </p>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-green-50">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-teal-400 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Smart Matching</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Our AI-powered algorithm finds compatible partners based on your values, interests, and goals
              </p>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-purple-50">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Real Conversations</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Connect through genuine conversations that matter, building relationships on shared experiences
              </p>
            </div>
          </div>

          {/* Additional Features */}
          <div className="mt-20 grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Verified Profiles</h4>
              <p className="text-gray-600 text-sm">All profiles are verified to ensure authenticity</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-blue-500" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Success Rate</h4>
              <p className="text-gray-600 text-sm">Over 70% of our couples meet within 3 months</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-purple-500" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Global Community</h4>
              <p className="text-gray-600 text-sm">Connect with singles from around the world</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-r from-pink-500 via-red-500 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Real Love Stories
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Hear from couples who've found their perfect match on DesireYourLove
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="flex items-center mb-6">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 bg-pink-300 rounded-full"></div>
                  <div className="w-10 h-10 bg-blue-300 rounded-full"></div>
                </div>
                <div className="ml-4">
                  <div className="text-white font-semibold">Alex & Jamie</div>
                  <div className="text-white/70 text-sm">Together 2 years</div>
                </div>
              </div>
              <p className="text-white/90 italic">
                "We matched instantly and knew we were meant to be. The conversations flowed naturally, and now we're planning our future together!"
              </p>
              <div className="flex text-yellow-300 mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="flex items-center mb-6">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 bg-green-300 rounded-full"></div>
                  <div className="w-10 h-10 bg-purple-300 rounded-full"></div>
                </div>
                <div className="ml-4">
                  <div className="text-white font-semibold">Maria & David</div>
                  <div className="text-white/70 text-sm">Married 1 year</div>
                </div>
              </div>
              <p className="text-white/90 italic">
                "The smart matching algorithm knew what we needed better than we did. We've never been happier!"
              </p>
              <div className="flex text-yellow-300 mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="flex items-center mb-6">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 bg-yellow-300 rounded-full"></div>
                  <div className="w-10 h-10 bg-red-300 rounded-full"></div>
                </div>
                <div className="ml-4">
                  <div className="text-white font-semibold">Sarah & Mike</div>
                  <div className="text-white/70 text-sm">Engaged</div>
                </div>
              </div>
              <p className="text-white/90 italic">
                "From our first message to our engagement, every step felt right. DesireYourLove brought us together!"
              </p>
              <div className="flex text-yellow-300 mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10"></div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center bg-gradient-to-r from-pink-500 to-red-500 rounded-full px-6 py-3 mb-8">
            <Sparkles className="h-6 w-6 text-white mr-2" />
            <span className="text-white font-semibold">Join the Movement</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Ready to Find Your <span className="bg-gradient-to-r from-pink-300 to-red-300 bg-clip-text text-transparent">Soulmate</span>?
          </h2>

          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join millions of singles who've found meaningful connections. Your perfect match is just one conversation away.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <Link
              to="/register"
              className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-10 py-4 rounded-full text-xl font-bold hover:from-pink-600 hover:to-red-600 transition-all duration-300 shadow-2xl hover:shadow-pink-500/25 transform hover:-translate-y-1 flex items-center group"
            >
              Start Your Love Story
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Link>

            <div className="text-gray-400">
              <span className="text-2xl font-bold text-white">Free</span> to join • No credit card required
            </div>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-400">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-400" />
              <span>100% Secure</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-blue-400" />
              <span>Verified Profiles</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-400" />
              <span>10M+ Members</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-pink-500/5 to-transparent"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <Link to="/" className="flex items-center space-x-3 mb-6">
                <div className="relative">
                  <Heart className="h-8 w-8 text-pink-500" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent">
                  DesireYourLove
                </span>
              </Link>
              <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
                Where genuine connections bloom into lasting love stories. Join our community of singles looking for meaningful relationships built on trust and authenticity.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">t</span>
                </div>
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">i</span>
                </div>
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">y</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Company</h4>
              <ul className="space-y-3">
                <li><Link to="#" className="text-gray-300 hover:text-pink-400 transition-colors">About Us</Link></li>
                <li><Link to="#" className="text-gray-300 hover:text-pink-400 transition-colors">Careers</Link></li>
                <li><Link to="#" className="text-gray-300 hover:text-pink-400 transition-colors">Press</Link></li>
                <li><Link to="#" className="text-gray-300 hover:text-pink-400 transition-colors">Blog</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Support</h4>
              <ul className="space-y-3">
                <li><Link to="#" className="text-gray-300 hover:text-pink-400 transition-colors">Help Center</Link></li>
                <li><Link to="#" className="text-gray-300 hover:text-pink-400 transition-colors">Safety Tips</Link></li>
                <li><Link to="#" className="text-gray-300 hover:text-pink-400 transition-colors">Community Guidelines</Link></li>
                <li><Link to="#" className="text-gray-300 hover:text-pink-400 transition-colors">Contact Us</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 mb-4 md:mb-0">
                © 2024 DesireYourLove. All rights reserved. Made with <Heart className="inline h-4 w-4 text-pink-500 mx-1" /> for love.
              </p>
              <div className="flex space-x-6 text-sm">
                <Link to="#" className="text-gray-400 hover:text-pink-400 transition-colors">Privacy Policy</Link>
                <Link to="#" className="text-gray-400 hover:text-pink-400 transition-colors">Terms of Service</Link>
                <Link to="#" className="text-gray-400 hover:text-pink-400 transition-colors">Cookie Policy</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
