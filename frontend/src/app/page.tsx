'use client';

import { ArrowRight, BookOpen, Brain, Clock, Zap, Target, CheckCircle2, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Atlas</span>
          </div>
          <div className="hidden md:flex gap-8 items-center">
            <a href="#features" className="text-gray-700 hover:text-gray-900 transition">Features</a>
            <a href="#how-it-works" className="text-gray-700 hover:text-gray-900 transition">How It Works</a>
            <a href="#benefits" className="text-gray-700 hover:text-gray-900 transition">Benefits</a>
          </div>
          <div className="flex gap-4">
            <Link href="/auth/login">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Your AI-Powered Study Companion
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Get personalized study recommendations ranked by grade impact. Atlas tells you exactly what to study, when to study it, and provides practice material ready to go.
              </p>
              <div className="flex gap-4">
                <Link href="/auth/signup">
                  <Button size="lg" className="gap-2">
                    Get Started Free <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <a href="#how-it-works">
                  <Button variant="outline" size="lg">Learn More</Button>
                </a>
              </div>
              <p className="text-sm text-gray-600 mt-4">✓ No credit card required • Available at University of Arkansas & Texas A&M</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-1">
              <div className="bg-white rounded-xl p-8 shadow-xl">
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm font-semibold text-blue-900">This Week's Study Plan</p>
                    <p className="text-xs text-blue-700 mt-1">Ranked by grade impact</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium">Calc III - Ch. 14 Practice</p>
                        <p className="text-xs text-gray-500">+8 pts to grade • 90 min • Tuesday</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium">Biology - Quiz Review</p>
                        <p className="text-xs text-gray-500">Hold grade • 60 min • Thursday</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium">Chemistry - Topic Notes</p>
                        <p className="text-xs text-gray-500">Maintenance • 45 min • Optional</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">How Atlas Works</h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">Three simple steps to smarter studying</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 border border-blue-200">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">1. Add Your Classes</h3>
              <p className="text-gray-700">Snap a photo of your syllabus. Atlas extracts grading breakdown, deadlines, and topics automatically.</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-8 border border-purple-200">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">2. Log Your Grades</h3>
              <p className="text-gray-700">Enter your current grades. Atlas calculates weighted averages and shows what scores move your grade.</p>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-8 border border-indigo-200">
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">3. Get Your Plan</h3>
              <p className="text-gray-700">Every week, Atlas shows you what to study ranked by grade impact. Practice material ready to go.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">Powerful Features</h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <CheckCircle2 className="w-6 h-6 text-green-600 mt-1" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Syllabus Photo Upload</h3>
                <p className="text-gray-700">Just photograph your syllabus with your phone. Atlas AI extracts all structured data automatically.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <CheckCircle2 className="w-6 h-6 text-green-600 mt-1" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Grade Impact Ranking</h3>
                <p className="text-gray-700">Study sessions ranked by "grade movement per hour" — what will move your grades the most comes first.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <CheckCircle2 className="w-6 h-6 text-green-600 mt-1" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Calendar Integration</h3>
                <p className="text-gray-700">Connect your Blackboard or Canvas feed. Deadlines auto-populate and stay current all semester.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <CheckCircle2 className="w-6 h-6 text-green-600 mt-1" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">AI Study Material</h3>
                <p className="text-gray-700">Generated practice questions, flashcards, and concept summaries tuned to your professor's style.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <CheckCircle2 className="w-6 h-6 text-green-600 mt-1" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Photo Grade Reading</h3>
                <p className="text-gray-700">Snap a returned quiz or gradebook screenshot. Atlas reads scores and updates your plan automatically.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <CheckCircle2 className="w-6 h-6 text-green-600 mt-1" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">What-If Scenarios</h3>
                <p className="text-gray-700">Change your available time and see exactly how your plan adjusts. Know the trade-offs instantly.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900">Why Atlas Works</h2>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Clock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-gray-900">Save Hours Every Week</h3>
                    <p className="text-gray-700 text-sm">No more guessing what to study. Atlas does the thinking for you.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Brain className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-gray-900">Study Smarter, Not Harder</h3>
                    <p className="text-gray-700 text-sm">Focus on what moves your grades. Skip busy work. Prioritize impact.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Zap className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-gray-900">AI-Powered Insights</h3>
                    <p className="text-gray-700 text-sm">Claude analyzes your syllabus and grades to predict what will help most.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Target className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-gray-900">Confidence Labels</h3>
                    <p className="text-gray-700 text-sm">Know when recommendations are HIGH confidence vs. lower. You're always in control.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <p className="text-sm font-semibold text-green-900 mb-2">📊 Real Student Impact</p>
                <p className="text-gray-700">"Atlas ranked Bio as my #1 priority. I focused there, scored 92 on the final, and jumped from B to A in the class." — Beta tester, Texas A&M</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                <p className="text-sm font-semibold text-blue-900 mb-2">⏱️ Time Saved</p>
                <p className="text-gray-700">Average tester saved 3–4 hours per week by eliminating low-impact studying and busywork.</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                <p className="text-sm font-semibold text-purple-900 mb-2">🎯 Stress Down</p>
                <p className="text-gray-700">"I knew exactly what mattered. No more wondering if I'm studying the right thing." — Beta tester</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Study Smarter?</h2>
          <p className="text-xl text-blue-100 mb-8">Join the beta at University of Arkansas or Texas A&M. Free while in testing.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary" className="gap-2">
                Get Started <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <a href="mailto:atlas@example.com">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Contact Support
              </Button>
            </a>
          </div>
        </div>
      </section>

     
    </main>
  );
}