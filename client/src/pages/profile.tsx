import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import SEOHead from "@/components/seo-head";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import NotFound from "@/pages/not-found";
import type { Profile } from "@/lib/types";

export default function ProfilePage() {
  const [match, params] = useRoute("/profile/:slug");
  const slug = params?.slug;

  const { data: profile, isLoading, error } = useQuery<Profile>({
    queryKey: ["/api/profiles", slug],
    queryFn: async () => {
      const response = await fetch(`/api/profiles/${slug}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Profile not found");
        }
        throw new Error("Failed to fetch profile");
      }
      return response.json();
    },
    enabled: !!slug,
  });

  if (!match) {
    return <NotFound />;
  }

  if (isLoading) {
    return (
      <div className="py-20 bg-slate-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Skeleton className="w-32 h-32 rounded-2xl" />
              <div className="flex-1 text-center md:text-left space-y-4">
                <Skeleton className="h-8 w-64 mx-auto md:mx-0" />
                <Skeleton className="h-6 w-48 mx-auto md:mx-0" />
                <Skeleton className="h-4 w-32 mx-auto md:mx-0" />
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return <NotFound />;
  }

  const skillsArray = profile.skills ? profile.skills.split(',').map(s => s.trim()) : [];
  const achievementsArray = profile.achievements ? profile.achievements.split('\n').filter(a => a.trim()) : [];

  const profileUrl = `${window.location.origin}/profile/${profile.slug}`;
  
  const profileSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": profile.name,
    "jobTitle": profile.profession,
    "email": profile.email,
    "telephone": profile.phone,
    "address": profile.address,
    "description": `${profile.profession} with ${profile.experience || 'professional'} experience`,
    "url": profileUrl,
    "image": profile.profilePhoto ? `${window.location.origin}${profile.profilePhoto}` : undefined
  };

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`;
    window.open(url, '_blank');
  };

  const shareOnTwitter = () => {
    const text = `Check out ${profile.name}'s professional profile - ${profile.profession}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(profileUrl)}`;
    window.open(url, '_blank');
  };

  const copyProfileLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  return (
    <>
      <SEOHead
        title={`${profile.name} - ${profile.profession} | Show Yourself`}
        description={`Professional profile of ${profile.name}, ${profile.profession} with ${profile.experience || 'professional'} experience. ${profile.address ? `Based in ${profile.address}.` : ''}`}
        keywords={`${profile.name}, ${profile.profession}, ${skillsArray.join(', ')}, professional profile`}
        ogTitle={`${profile.name} - ${profile.profession}`}
        ogDescription={`Professional ${profile.profession} with ${profile.experience || 'professional'} experience`}
        ogUrl={profileUrl}
        ogImage={profile.profilePhoto ? `${window.location.origin}${profile.profilePhoto}` : undefined}
        schema={profileSchema}
      />

      <section className="py-20 bg-slate-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <img
                src={profile.profilePhoto || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"}
                alt={`${profile.name} Profile Photo`}
                className="w-32 h-32 rounded-2xl object-cover border-4 border-primary-100"
                data-testid="img-profile-photo"
              />
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2" data-testid="text-profile-name">
                  {profile.name}
                </h1>
                <p className="text-xl text-primary-600 font-semibold mb-2" data-testid="text-profile-profession">
                  {profile.profession}
                </p>
                {profile.address && (
                  <p className="text-gray-600 mb-4" data-testid="text-profile-location">{profile.address}</p>
                )}

                {/* Contact Information */}
                <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-600">
                  <div className="flex items-center" data-testid="text-profile-email">
                    <i className="fas fa-envelope mr-2 text-primary-600"></i>
                    {profile.email}
                  </div>
                  {profile.phone && (
                    <div className="flex items-center" data-testid="text-profile-phone">
                      <i className="fas fa-phone mr-2 text-primary-600"></i>
                      {profile.phone}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Work Experience Section */}
              {profile.workExperience && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Work Experience</h2>
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line" data-testid="text-work-experience">
                    {profile.workExperience}
                  </div>
                </div>
              )}

              {/* Education Section */}
              {profile.education && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Education</h2>
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line" data-testid="text-education">
                    {profile.education}
                  </div>
                </div>
              )}

              {/* Achievements Section */}
              {achievementsArray.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Achievements</h2>
                  <ul className="space-y-2 text-gray-700">
                    {achievementsArray.map((achievement, index) => (
                      <li key={index} className="flex items-start" data-testid={`text-achievement-${index}`}>
                        <i className="fas fa-trophy text-yellow-500 mr-3 mt-1"></i>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Skills Section */}
              {skillsArray.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {skillsArray.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                        data-testid={`tag-skill-${index}`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience */}
              {profile.experience && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Experience</h2>
                  <div className="flex items-center text-gray-600">
                    <i className="fas fa-briefcase mr-2 text-primary-600"></i>
                    <span data-testid="text-years-experience">{profile.experience}</span>
                  </div>
                </div>
              )}

              {/* Contact Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Get In Touch</h2>
                <div className="space-y-3">
                  <a
                    href={`mailto:${profile.email}`}
                    className="flex items-center text-gray-600 hover:text-primary-600 transition-colors duration-200"
                    data-testid="link-email"
                  >
                    <i className="fas fa-envelope mr-3 text-primary-600"></i>
                    {profile.email}
                  </a>
                  {profile.phone && (
                    <a
                      href={`tel:${profile.phone}`}
                      className="flex items-center text-gray-600 hover:text-primary-600 transition-colors duration-200"
                      data-testid="link-phone"
                    >
                      <i className="fas fa-phone mr-3 text-primary-600"></i>
                      {profile.phone}
                    </a>
                  )}
                  {profile.address && (
                    <div className="flex items-center text-gray-600" data-testid="text-address">
                      <i className="fas fa-map-marker-alt mr-3 text-primary-600"></i>
                      {profile.address}
                    </div>
                  )}
                </div>
              </div>

              {/* Share Profile */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Share Profile</h2>
                <div className="flex space-x-3">
                  <Button
                    size="sm"
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={shareOnLinkedIn}
                    data-testid="button-share-linkedin"
                  >
                    <i className="fab fa-linkedin"></i>
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-blue-400 hover:bg-blue-500"
                    onClick={shareOnTwitter}
                    data-testid="button-share-twitter"
                  >
                    <i className="fab fa-twitter"></i>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={copyProfileLink}
                    data-testid="button-copy-link"
                  >
                    <i className="fas fa-copy"></i>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
