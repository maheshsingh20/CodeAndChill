import React from 'react';
import {
  Users,
  Target,
  Award,
  Lightbulb,
  Heart,
  Globe,
  BookOpen,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Github,
  Twitter,
  Linkedin,
  Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  const stats = [
    { label: 'Active Learners', value: '50K+', icon: Users },
    { label: 'Courses Available', value: '200+', icon: BookOpen },
    { label: 'Success Rate', value: '95%', icon: TrendingUp },
    { label: 'Countries Reached', value: '120+', icon: Globe }
  ];

  const values = [
    {
      icon: Target,
      title: 'Mission-Driven',
      description: 'Democratizing quality tech education and making programming accessible to everyone, everywhere.'
    },
    {
      icon: Lightbulb,
      title: 'Innovation First',
      description: 'Constantly evolving our platform with cutting-edge technology and modern learning methodologies.'
    },
    {
      icon: Heart,
      title: 'Community Focused',
      description: 'Building a supportive community where learners help each other grow and succeed together.'
    },
    {
      icon: Award,
      title: 'Excellence Driven',
      description: 'Committed to delivering the highest quality content and learning experiences in the industry.'
    }
  ];

  const team = [
    {
      name: 'Alex Chen',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      bio: 'Former Google engineer with 10+ years in tech education',
      social: { twitter: '#', linkedin: '#', github: '#' }
    },
    {
      name: 'Sarah Johnson',
      role: 'Head of Curriculum',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
      bio: 'PhD in Computer Science, passionate about innovative teaching',
      social: { twitter: '#', linkedin: '#', github: '#' }
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Lead Developer',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      bio: 'Full-stack expert building the future of online learning',
      social: { twitter: '#', linkedin: '#', github: '#' }
    },
    {
      name: 'Emily Zhang',
      role: 'UX Director',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      bio: 'Design thinking advocate creating intuitive learning experiences',
      social: { twitter: '#', linkedin: '#', github: '#' }
    }
  ];

  const milestones = [
    {
      year: '2020',
      title: 'The Beginning',
      description: 'Started with a simple idea to make coding education more accessible and engaging.'
    },
    {
      year: '2021',
      title: 'First 1K Users',
      description: 'Reached our first milestone with 1,000 active learners and launched our core curriculum.'
    },
    {
      year: '2022',
      title: 'Global Expansion',
      description: 'Expanded internationally and introduced multi-language support for global accessibility.'
    },
    {
      year: '2023',
      title: 'AI Integration',
      description: 'Launched AI-powered personalized learning paths and intelligent code assistance.'
    },
    {
      year: '2024',
      title: 'Community of 50K+',
      description: 'Built a thriving community of 50,000+ learners with industry partnerships.'
    }
  ];

  const features = [
    'Interactive coding challenges',
    'Real-world project portfolio',
    'AI-powered learning assistant',
    'Live coding sessions',
    'Industry mentorship program',
    'Career placement support'
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/3 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <section className="text-center mb-20">
          <div className="mb-8">
            <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30 mb-4">
              About Code & Chill
            </Badge>
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
              Empowering the Next Generation of
              <span className="block bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                Tech Innovators
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              We're on a mission to democratize quality tech education, making programming accessible,
              engaging, and career-focused for learners worldwide.
            </p>
          </div>

          {/* Hero Image */}
          <div className="relative max-w-4xl mx-auto mb-12">
            <div className="aspect-video bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=600&fit=crop"
                alt="Team collaboration"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-white text-lg font-medium">
                  Building the future of tech education, one learner at a time
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 hover:border-gray-600 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <stat.icon className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                At Code & Chill, we believe that everyone deserves access to quality tech education.
                We're breaking down barriers and creating an inclusive learning environment where
                passion meets opportunity.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                Our platform combines cutting-edge technology with proven pedagogical methods to
                deliver personalized learning experiences that adapt to each student's pace and style.
              </p>

              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=600&fit=crop"
                  alt="Learning environment"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20" />
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Our Core Values</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              The principles that guide everything we do and shape our approach to education
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 hover:border-gray-600 transition-all duration-300 group">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <value.icon className="w-8 h-8 text-purple-400" />
                  </div>
                  <CardTitle className="text-white text-lg">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-sm leading-relaxed text-center">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Meet Our Team</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Passionate educators, developers, and innovators working together to transform tech education
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 hover:border-gray-600 transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <div className="relative mb-4">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-gray-600 group-hover:border-purple-400 transition-colors duration-300"
                    />
                    <div className="absolute inset-0 w-24 h-24 rounded-full mx-auto bg-gradient-to-br from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <h3 className="text-white font-semibold text-lg mb-1">{member.name}</h3>
                  <p className="text-purple-400 text-sm mb-3">{member.role}</p>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">{member.bio}</p>

                  <div className="flex justify-center gap-3">
                    <a href={member.social.twitter} className="text-gray-500 hover:text-blue-400 transition-colors">
                      <Twitter className="w-4 h-4" />
                    </a>
                    <a href={member.social.linkedin} className="text-gray-500 hover:text-blue-600 transition-colors">
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <a href={member.social.github} className="text-gray-500 hover:text-gray-300 transition-colors">
                      <Github className="w-4 h-4" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Our Journey</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              From a simple idea to a global platform - here's how we've grown
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-purple-500 to-pink-500 opacity-30" />

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center gap-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`flex-1 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                    <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700 hover:border-gray-600 transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="text-purple-400 font-bold text-lg mb-2">{milestone.year}</div>
                        <h3 className="text-white font-semibold text-xl mb-3">{milestone.title}</h3>
                        <p className="text-gray-400 leading-relaxed">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Timeline dot */}
                  <div className="relative z-10">
                    <div className="w-4 h-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full border-4 border-black" />
                  </div>

                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700">
            <CardContent className="p-12">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
                <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                  Join thousands of learners who are already building their future in tech.
                  Start with our free courses and discover what you can achieve.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link to="/auth?tab=signup">
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg">
                      Get Started Free
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>

                  <Link to="/courses">
                    <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-3 text-lg">
                      Explore Courses
                    </Button>
                  </Link>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-700">
                  <p className="text-gray-500 text-sm mb-4">Have questions? We'd love to hear from you.</p>
                  <div className="flex justify-center gap-6">
                    <a href="mailto:hello@codeandchill.com" className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors">
                      <Mail className="w-4 h-4" />
                      <span>hello@codeandchill.com</span>
                    </a>
                    <a href="#" className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors">
                      <Twitter className="w-4 h-4" />
                      <span>@codeandchill</span>
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};