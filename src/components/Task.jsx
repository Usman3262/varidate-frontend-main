import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPublicProfiles } from '../Redux/profile';

const Task = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const {
    publicProfiles = [],
    publicProfilesLoading,
    publicProfilesError
  } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(fetchPublicProfiles());
  }, [dispatch]);

  if (publicProfilesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f4793d]"></div>
      </div>
    );
  }

  if (publicProfilesError) {
    return (
      <div className="text-red-500">
        Error loading profiles: {publicProfilesError?.message || String(publicProfilesError)}
      </div>
    );
  }

  const profilesToDisplay = Array.isArray(publicProfiles) ? publicProfiles : [];

  const getMongooseDoc = (doc) => {
    return doc?._doc || doc;
  };

  const handleProfileClick = (id) => {
    setSelectedProfileId(id);
    setShowModal(true);
  };

  const handleConfirm = () => {
    setShowModal(false);
    if (selectedProfileId) {
      navigate(`/profile/${selectedProfileId}`);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setSelectedProfileId(null);
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-[#f4793d] text-center mb-12 drop-shadow-md">
          👥 Public User Profiles
        </h1>

        {profilesToDisplay.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No public profiles found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {profilesToDisplay.map((profile) => {
              const education = Array.isArray(profile.education) && profile.education.length > 0
                ? getMongooseDoc(profile.education[0])
                : null;

              const experience = Array.isArray(profile.experience) && profile.experience.length > 0
                ? getMongooseDoc(profile.experience[0])
                : null;

              return (
                <div
                  key={profile?._id || Math.random().toString(36).substring(2, 9)}
                  onClick={() => handleProfileClick(profile._id)}
                  className="group bg-gray-50 hover:bg-white border border-gray-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between transition-all duration-300 shadow hover:shadow-xl cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={profile.profilePicture}
                      alt={profile?.name || 'User'}
                      className="w-16 h-16 rounded-full border-4 border-[#f4793d] group-hover:scale-105 transition-transform"
                    />
                    <div>
                      <h2 className="text-lg font-bold text-gray-800 group-hover:text-[#f4793d] transition-colors">
                        {profile?.name || 'Anonymous User'}
                      </h2>
                      {profile?.emailVisibility === 'Public' && profile?.email && (
                        <p className="text-sm text-gray-500">{profile.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 sm:mt-0 sm:text-right text-sm text-gray-700 space-y-1">
                    <p>
                      <span className="font-semibold text-[#f4793d]">📞</span> {profile.mobile}
                    </p>

                    {profile?.genderVisibility === 'Public' && profile?.gender && (
                      <p>
                        <span className="font-semibold text-[#f4793d]">⚧️</span> {profile.gender}
                      </p>
                    )}

                    {education?.degreeTitleVisibility === 'Public' && education?.degreeTitle ? (
                      <p>
                        <span className="font-semibold text-[#f4793d]">🎓</span> {education.degreeTitle}
                      </p>
                    ) : (
                      <p className="text-gray-400">
                        <span className="font-semibold text-[#f4793d]">🎓</span> Education not specified
                      </p>
                    )}

                    {experience?.jobTitleVisibility === 'Public' && experience?.jobTitle ? (
                      <p>
                        <span className="inline-block mt-1 bg-[#f4793d]/10 text-[#f4793d] px-3 py-1 rounded-full font-medium">
                          💼 {experience.jobTitle} at {experience.company}
                        </span>
                      </p>
                    ) : (
                      <p className="text-gray-400">
                        <span className="inline-block mt-1 bg-gray-100 text-gray-500 px-3 py-1 rounded-full font-medium">
                          💼 Experience not specified
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Confirm Navigation</h2>
            <p className="text-gray-600 mb-6">Do you really want to view this profile?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleCancel}
                className="bg-gray-200 text-gray-700 hover:bg-gray-300 px-6 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="bg-[#f4793d] text-white hover:bg-orange-600 px-6 py-2 rounded-lg"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Task;
