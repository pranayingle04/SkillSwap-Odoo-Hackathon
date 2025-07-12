import React, { useState } from 'react';
import { User, MapPin, Plus, X, Calendar, Save, Camera } from 'lucide-react';

interface ProfileSetupProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
  onCompleteProfile: (profileData: {
    name: string;
    location?: string;
    skillsOffered: string[];
    skillsWanted: string[];
    availability: string[];
    isPublic: boolean;
    openTo: string[];
    openToDescription?: string;
  }) => void;
}

export function ProfileSetup({ user, onCompleteProfile }: ProfileSetupProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState({
    name: user.name,
    location: '',
    skillsOffered: [] as string[],
    skillsWanted: [] as string[],
    availability: [] as string[],
    isPublic: true,
    openTo: [] as string[],
    openToDescription: ''
  });

  const [newSkill, setNewSkill] = useState('');
  const [newWantedSkill, setNewWantedSkill] = useState('');
  const [newAvailability, setNewAvailability] = useState('');

  const addSkillOffered = () => {
    if (newSkill.trim() && !profileData.skillsOffered.includes(newSkill.trim())) {
      setProfileData({
        ...profileData,
        skillsOffered: [...profileData.skillsOffered, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const addSkillWanted = () => {
    if (newWantedSkill.trim() && !profileData.skillsWanted.includes(newWantedSkill.trim())) {
      setProfileData({
        ...profileData,
        skillsWanted: [...profileData.skillsWanted, newWantedSkill.trim()]
      });
      setNewWantedSkill('');
    }
  };

  const addAvailability = () => {
    if (newAvailability.trim() && !profileData.availability.includes(newAvailability.trim())) {
      setProfileData({
        ...profileData,
        availability: [...profileData.availability, newAvailability.trim()]
      });
      setNewAvailability('');
    }
  };

  const removeSkillOffered = (index: number) => {
    setProfileData({
      ...profileData,
      skillsOffered: profileData.skillsOffered.filter((_, i) => i !== index)
    });
  };

  const removeSkillWanted = (index: number) => {
    setProfileData({
      ...profileData,
      skillsWanted: profileData.skillsWanted.filter((_, i) => i !== index)
    });
  };

  const removeAvailability = (index: number) => {
    setProfileData({
      ...profileData,
      availability: profileData.availability.filter((_, i) => i !== index)
    });
  };

  const toggleOpenTo = (option: string) => {
    setProfileData((prev) => {
      const alreadySelected = prev.openTo.includes(option);
      return {
        ...prev,
        openTo: alreadySelected
          ? prev.openTo.filter((item) => item !== option)
          : [...prev.openTo, option],
      };
    });
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    onCompleteProfile(profileData);
  };

  const isStep1Valid = profileData.name.trim().length > 0;
  const isStep2Valid = profileData.skillsOffered.length > 0;
  const isStep3Valid = profileData.skillsWanted.length > 0 && profileData.availability.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
          <p className="text-gray-600">Let's set up your SkillSwap profile to get started</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Step {currentStep} of 3</span>
            <span className="text-sm text-gray-500">{Math.round((currentStep / 3) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: ${(currentStep / 3) * 100}% }}
            ></div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Basic Information</h2>
                <p className="text-gray-600">Tell us about yourself</p>
              </div>

              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-12 w-12 text-gray-400" />
                  </div>
                  <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location (Optional)</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="City, State or Country"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Skills Offered</h2>
                <p className="text-gray-600">What skills can you share with others?</p>
              </div>

              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="e.g., JavaScript, Photography, Guitar"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && addSkillOffered()}
                />
                <button
                  onClick={addSkillOffered}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add</span>
                </button>
              </div>

              <div className="space-y-3">
                {profileData.skillsOffered.map((skill, index) => (
                  <div key={index} className="flex items-center justify-between bg-blue-50 px-4 py-3 rounded-lg">
                    <span className="text-blue-800 font-medium">{skill}</span>
                    <button
                      onClick={() => removeSkillOffered(index)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              {profileData.skillsOffered.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No skills added yet. Add at least one skill to continue.</p>
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Skills & Availability</h2>
                <p className="text-gray-600">What do you want to learn and when are you available?</p>
              </div>

              {/* Skills Wanted */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Skills Wanted</h3>
                <div className="flex space-x-2 mb-4">
                  <input
                    type="text"
                    value={newWantedSkill}
                    onChange={(e) => setNewWantedSkill(e.target.value)}
                    placeholder="e.g., Python, Design, Marketing"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && addSkillWanted()}
                  />
                  <button
                    onClick={addSkillWanted}
                    className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {profileData.skillsWanted.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between bg-orange-50 px-4 py-2 rounded-lg">
                      <span className="text-orange-800 font-medium">{skill}</span>
                      <button
                        onClick={() => removeSkillWanted(index)}
                        className="text-orange-600 hover:text-orange-800 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Your Availability</h3>
                <div className="flex space-x-2 mb-4">
                  <div className="relative flex-1">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={newAvailability}
                      onChange={(e) => setNewAvailability(e.target.value)}
                      placeholder="e.g., Weekends, Evenings, Weekdays"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && addAvailability()}
                    />
                  </div>
                  <button
                    onClick={addAvailability}
                    className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {profileData.availability.map((time, index) => (
                    <div key={index} className="flex items-center justify-between bg-teal-50 px-4 py-2 rounded-lg">
                      <span className="text-teal-800 font-medium">{time}</span>
                      <button
                        onClick={() => removeAvailability(index)}
                        className="text-teal-600 hover:text-teal-800 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Open To */}
              <div className="space-y-4 mt-6">
                <h3 className="text-lg font-medium text-gray-900">Open To</h3>
                <div className="flex flex-wrap gap-4">
                  {['Collaboration', 'Mentorship', 'Learning'].map((option) => (
                    <label key={option} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={profileData.openTo.includes(option)}
                        onChange={() => toggleOpenTo(option)}
                        className="form-checkbox text-blue-600"
                      />
                      <span className="text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mt-4 mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    value={profileData.openToDescription}
                    onChange={(e) => setProfileData({ ...profileData, openToDescription: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell us more about how you're open to collaborate or learn..."
                  />
                </div>
              </div>

              {/* Visibility */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Profile Visibility</h4>
                    <p className="text-sm text-gray-600">Make your profile visible to other users</p>
                  </div>
                  <button
                    onClick={() => setProfileData({ ...profileData, isPublic: !profileData.isPublic })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      profileData.isPublic ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        profileData.isPublic ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Back
            </button>

            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !isStep1Valid) || (currentStep === 2 && !isStep2Valid)
                }
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                <span>Next</span>
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={!isStep3Valid}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Complete Profile</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
