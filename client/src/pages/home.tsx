import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import ProfileCard from "@/components/profile-card";
import SEOHead from "@/components/seo-head";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type { Profile } from "@/lib/types";

interface ProfilesResponse {
  profiles: Profile[];
  total: number;
}

export default function Home() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [profession, setProfession] = useState("");
  
  const { data, isLoading, error } = useQuery<ProfilesResponse>({
    queryKey: ["/api/profiles", { page, search, profession }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12"
      });
      
      if (search) params.append("search", search);
      if (profession) params.append("profession", profession);
      
      const response = await fetch(`/api/profiles?${params}`);
      if (!response.ok) throw new Error("Failed to fetch profiles");
      return response.json();
    }
  });

  const profiles = data?.profiles || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / 12);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleProfessionFilter = (value: string) => {
    setProfession(value === "all" ? "" : value);
    setPage(1);
  };

  const scrollToProfiles = () => {
    document.getElementById('profiles')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <SEOHead
        title="Show Yourself - Upload Your Bio-Data & Build Your Public Profile"
        description="Upload your bio-data, build your public profile, and get visible on Google. Create professional profiles that showcase your skills, achievements, and experience."
        keywords="bio-data, professional profile, resume, CV, career, skills, achievements"
        ogTitle="Show Yourself - Build Your Professional Profile"
        ogDescription="Upload your bio-data and create a professional public profile visible on Google."
        schema={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Show Yourself",
          "description": "Professional bio-data and profile creation platform",
          "url": "https://showyourself.com"
        }}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in-up">
            <div className="mb-8">
              <div className="animate-logo-float inline-block">
                <i className="fas fa-users text-primary-600 text-6xl mb-4"></i>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Show Yourself
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Upload your bio-data, build your public profile, and get visible on Google
            </p>
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <Link href="/create-profile">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto text-lg font-semibold px-8 py-4 shadow-lg hover:scale-105 transition-all duration-200"
                  data-testid="button-create-profile-hero"
                >
                  <i className="fas fa-plus mr-2"></i>Create Your Profile
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg"
                className="w-full sm:w-auto text-lg font-semibold px-8 py-4 border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white transition-all duration-200"
                onClick={scrollToProfiles}
                data-testid="button-browse-profiles"
              >
                <i className="fas fa-search mr-2"></i>Browse Profiles
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Show Yourself?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Professional profiles that get noticed by employers and collaborators worldwide</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl hover:shadow-lg transition-shadow duration-300">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-search text-green-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">SEO Optimized</h3>
              <p className="text-gray-600">Your profile appears in Google search results with proper meta tags and structured data</p>
            </div>
            <div className="text-center p-6 rounded-2xl hover:shadow-lg transition-shadow duration-300">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-mobile-alt text-blue-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Mobile Friendly</h3>
              <p className="text-gray-600">Responsive design ensures your profile looks perfect on all devices</p>
            </div>
            <div className="text-center p-6 rounded-2xl hover:shadow-lg transition-shadow duration-300">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-share-alt text-purple-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Sharing</h3>
              <p className="text-gray-600">Share your unique profile URL on social media and professional networks</p>
            </div>
          </div>
        </div>
      </section>

      {/* Profiles Section */}
      <section id="profiles" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Profiles</h2>
              <p className="text-xl text-gray-600">Discover talented professionals from around the world</p>
            </div>
            <div className="mt-6 md:mt-0">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search profiles..."
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full sm:w-80 pl-10"
                    data-testid="input-search"
                  />
                  <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                </div>
                <Select value={profession || "all"} onValueChange={handleProfessionFilter}>
                  <SelectTrigger className="w-full sm:w-40" data-testid="select-profession">
                    <SelectValue placeholder="All Professions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Professions</SelectItem>
                    <SelectItem value="Software Developer">Software Developer</SelectItem>
                    <SelectItem value="Designer">Designer</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Profile Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
                  <Skeleton className="w-20 h-20 rounded-full mx-auto mb-4" />
                  <Skeleton className="h-6 w-32 mx-auto mb-2" />
                  <Skeleton className="h-4 w-24 mx-auto mb-4" />
                  <div className="flex gap-2 justify-center mb-4">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <i className="fas fa-exclamation-circle text-red-500 text-4xl mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to load profiles</h3>
              <p className="text-gray-600">Please try again later or contact support if the problem persists.</p>
            </div>
          ) : profiles.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-users text-gray-400 text-4xl mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No profiles found</h3>
              <p className="text-gray-600 mb-6">
                {search || profession ? "Try adjusting your search criteria." : "Be the first to create a profile!"}
              </p>
              <Link href="/create-profile">
                <Button data-testid="button-create-first-profile">
                  <i className="fas fa-plus mr-2"></i>Create Your Profile
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="profiles-grid">
                {profiles.map((profile) => (
                  <ProfileCard key={profile.id} profile={profile} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      data-testid="button-prev-page"
                    >
                      <i className="fas fa-chevron-left"></i>
                    </Button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPage(pageNum)}
                          data-testid={`button-page-${pageNum}`}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      data-testid="button-next-page"
                    >
                      <i className="fas fa-chevron-right"></i>
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Get Discovered?</h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have created their public profiles and increased their visibility online
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Link href="/create-profile">
              <Button 
                size="lg" 
                variant="secondary"
                className="w-full sm:w-auto text-lg font-semibold px-8 py-4 bg-white text-primary-600 hover:bg-gray-50 shadow-lg hover:scale-105 transition-all duration-200"
                data-testid="button-start-building"
              >
                <i className="fas fa-rocket mr-2"></i>Start Building Now
              </Button>
            </Link>
            <Button 
              size="lg"
              variant="outline"
              className="w-full sm:w-auto text-lg font-semibold px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-primary-600 transition-all duration-200"
              onClick={scrollToProfiles}
              data-testid="button-see-examples"
            >
              <i className="fas fa-users mr-2"></i>See Examples
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <i className="fas fa-user-circle text-primary-500 text-2xl mr-2"></i>
                <h3 className="text-xl font-bold">Show Yourself</h3>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                The platform where professionals showcase their skills, experience, and achievements to get discovered by the right opportunities.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/" className="hover:text-white transition-colors duration-200">Home</Link></li>
                <li><a href="#profiles" className="hover:text-white transition-colors duration-200">Browse Profiles</a></li>
                <li><Link href="/create-profile" className="hover:text-white transition-colors duration-200">Create Profile</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors duration-200">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Show Yourself. All rights reserved. Built for professionals who want to be discovered.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
