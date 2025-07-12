import React from 'react';
import {
  Users,
  Search,
  MessageSquare,
  Star,
  ArrowRight,
  BookOpen,
  Shield,
  Zap,
  TrendingUp
} from 'lucide-react';

interface HomePageProps {
  onGetStarted: () => void;
}

export function HomePage({ onGetStarted }: HomePageProps) {
  const features = [
    {
      icon: Search,
      title: 'Discover Amazing Skills',
      description: 'Explore thousands of skills from talented individuals worldwide. Find exactly what you want to learn.',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: MessageSquare,
      title: 'Connect & Communicate',
      description: 'Send swap requests and chat directly with skill sharers. Build meaningful connections.',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: Star,
      title: 'Trust & Quality',
      description: 'Our rating system ensures quality exchanges. Share feedback and build your reputation.',
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      icon: Shield,
      title: 'Safe & Secure',
      description: 'Your privacy matters. Secure profiles, verified users, and complete control over your data.',
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  const stats = [
    { number: '25K+', label: 'Active Learners', icon: Users },
    { number: '100K+', label: 'Skills Shared', icon: BookOpen },
    { number: '50K+', label: 'Successful Swaps', icon: TrendingUp },
    { number: '4.9', label: 'Average Rating', icon: Star }
  ];

  const skillCategories = [
    { name: 'Programming', count: '2.5K+', icon: '💻' },
    { name: 'Design', count: '1.8K+', icon: '🎨' },
    { name: 'Languages', count: '3.2K+', icon: '🌍' },
    { name: 'Music', count: '1.1K+', icon: '🎵' },
    { name: 'Photography', count: '950+', icon: '📸' },
    { name: 'Business', count: '1.6K+', icon: '💼' }
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-teal-50">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          {/* Logo */}
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="relative">
              <Users className="h-20 w-20 text-blue-600" />
              <div className="absolute -top-2 -right-2 h-8 w-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-6 leading-tight">
            Learn Anything
            Teach Everything
          <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
              {' '}Collaborate to Build Your Vision
            </span>
          </h1>

          <p className="text-2xl md:text-3xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            Welcome to community driven skill-sharing platform.
            <br />
            Connect with passionate learners to exchange knowledge and mentor bright minds.
            <br />
            <span className="text-blue-600 font-semibold"> Collaborate with like minded people to Build and Share your Vision.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button
              onClick={onGetStarted}
              className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:from-blue-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center space-x-3"
            >
              <span>Start Learning Today</span>
              <ArrowRight className="h-6 w-6" />
            </button>

            <button className="text-gray-700 hover:text-gray-900 px-10 py-5 rounded-2xl font-bold text-xl transition-all duration-300 flex items-center space-x-3 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50">
              <BookOpen className="h-6 w-6" />
              <span>Watch Demo</span>
            </button>
          </div>

          {/* Skill Categories */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
            {skillCategories.map((category, index) => (
              <div
                key={category.name}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
              >
                <div className="text-3xl mb-3">{category.icon}</div>
                <h3 className="font-bold text-gray-900 mb-1">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.count} experts</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Trusted by Thousands</h2>
            <p className="text-xl text-blue-100">Join our growing community of learners and teachers</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">
                    <Icon className="h-12 w-12 text-blue-300" />
                  </div>
                  <div className="text-5xl md:text-6xl font-bold text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-blue-200 font-medium text-lg">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Why Choose <span className="text-blue-600">SkillSwap?</span>
            </h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto">
              Experience the future of learning with our innovative platform designed for real skill exchange.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100"
                >
                  <div className={`h-20 w-20 ${feature.color} rounded-3xl flex items-center justify-center mb-8`}>
                    <Icon className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-5xl font-bold mb-6">Ready to Swap Skills?</h2>
          <p className="text-2xl mb-10">
            Join SkillSwap and discover a new way to learn, share, and grow.
          </p>
          <button
            onClick={onGetStarted}
            className="bg-white text-blue-600 px-10 py-5 rounded-2xl font-bold text-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl"
          >
            Get Started Now
          </button>
        </div>
      </section>
    </div>
  );
}
