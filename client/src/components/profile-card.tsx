import { Link } from "wouter";
import type { Profile } from "@/lib/types";

interface ProfileCardProps {
  profile: Profile;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const skillsArray = profile.skills ? profile.skills.split(',').map(s => s.trim()) : [];
  
  return (
    <div 
      className="profile-card bg-white rounded-2xl shadow-sm hover:shadow-xl p-6 border border-gray-200"
      data-testid={`card-profile-${profile.id}`}
    >
      <img 
        src={profile.profilePhoto || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"} 
        alt={`${profile.name} Profile Photo`}
        className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-4 border-primary-100"
        data-testid={`img-avatar-${profile.id}`}
      />
      
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-gray-900 mb-1" data-testid={`text-name-${profile.id}`}>
          {profile.name}
        </h3>
        <p className="text-primary-600 font-medium" data-testid={`text-profession-${profile.id}`}>
          {profile.profession}
        </p>
        {profile.address && (
          <p className="text-gray-500 text-sm" data-testid={`text-location-${profile.id}`}>
            {profile.address}
          </p>
        )}
      </div>
      
      {skillsArray.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {skillsArray.slice(0, 3).map((skill, index) => (
              <span 
                key={index}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                data-testid={`tag-skill-${profile.id}-${index}`}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        {profile.experience && (
          <div className="flex items-center text-gray-500 text-sm">
            <i className="fas fa-briefcase mr-1"></i>
            <span data-testid={`text-experience-${profile.id}`}>{profile.experience}</span>
          </div>
        )}
        <Link 
          href={`/profile/${profile.slug}`}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200 text-sm font-medium"
          data-testid={`link-profile-${profile.id}`}
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}
