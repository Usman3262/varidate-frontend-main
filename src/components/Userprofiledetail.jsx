import React, { useState, useEffect } from 'react';

const mockProfileData = {
  id: '123',
  name: 'John Doe',
  profilePicture: 'https://i.pravatar.cc/150?img=12',
  fatherName: 'Richard Doe',
  email: 'john.doe@example.com',
  city: 'San Francisco',
  country: 'USA',
  gender: 'Male',
  residentStatus: 'Citizen',
  nationality: 'American',
  dob: { $date: '1990-05-15T00:00:00.000Z' },
  mobile: '+1 123 456 7890',
  address: '123 Market St, San Francisco, CA 94103',
  experience: [
    {
      jobTitle: 'Senior Frontend Engineer',
      company: 'Tech Solutions Inc.',
      startDate: '2020-01-10T00:00:00.000Z',
      endDate: null,
      fileUrl: 'https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?w=400',
    },
    {
      jobTitle: 'Frontend Developer',
      company: 'Web Innovators',
      startDate: '2018-06-01T00:00:00.000Z',
      endDate: '2019-12-31T00:00:00.000Z',
      fileUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400',
    },
  ],
  education: [
    {
      degreeTitle: 'Master of Science in Computer Science',
      institute: 'Stanford University',
      startDate: '2016-09-01T00:00:00.000Z',
      endDate: '2018-05-25T00:00:00.000Z',
      website: 'cs.stanford.edu',
      jobFunctions: ['Software Engineering', 'AI'],
      degreeFile: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400',
    },
    {
      degreeTitle: 'Bachelor of Science in Information Technology',
      institute: 'State University',
      startDate: '2012-09-01T00:00:00.000Z',
      endDate: '2016-05-25T00:00:00.000Z',
      website: 'stateu.edu',
      jobFunctions: ['Web Development', 'Database Management'],
      degreeFile: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400',
    },
  ],
};

const CheckIcon = () => (
  <img
    src="https://i.pinimg.com/564x/29/9d/4e/299d4e690b6a9557188e5c64644f5acd.jpg"
    alt="Verified Checkmark"
    className="w-5 h-5"
  />
);

const RadioGroup = ({ name, value, onChange, disabled }) => (
  <div className="flex gap-4 items-center">
    <label className="text-sm text-gray-600 flex items-center gap-1">
      <input type="radio" name={name} value="yes" checked={value === 'yes'} onChange={onChange} disabled={disabled} className="text-orange-600 focus:ring-orange-500" />
      Yes
    </label>
    <label className="text-sm text-gray-600 flex items-center gap-1">
      <input type="radio" name={name} value="no" checked={value === 'no'} onChange={onChange} disabled={disabled} className="text-orange-600 focus:ring-orange-500" />
      No
    </label>
  </div>
);

const InfoField = ({ label, value, name, feedback, onFeedbackChange, isValidated }) => (
  <div className="flex justify-between items-center py-2">
    <div className="flex items-center gap-2">
      <CheckIcon />
      <div>
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{label}</p>
        <p className="text-sm font-semibold text-gray-900">{value}</p>
      </div>
    </div>
    {value && <RadioGroup name={name} value={feedback[name]} onChange={(e) => onFeedbackChange(name, e.target.value)} disabled={isValidated} />}
  </div>
);

const DocumentIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
  </svg>
);

const SubmissionModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50" role="dialog" aria-modal="true">
    <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center">
      <div className="mx-auto flex items-center justify-center h-10 w-10 rounded-full bg-green-100">
        <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mt-3">Validation Submitted</h3>
      <p className="text-sm text-gray-600 mt-2">Thank you for your feedback.</p>
      <button onClick={onClose} className="mt-4 w-full bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500">Close</button>
    </div>
  </div>
);

const ProfileValidatorApp = () => {
  const [currentProfile, setCurrentProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState({});
  const [showLetter, setShowLetter] = useState({});
  const [showDegree, setShowDegree] = useState({});
  const [isValidated, setIsValidated] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      try {
        setCurrentProfile(mockProfileData);
        setLoading(false);
      } catch {
        setError('Failed to load profile data.');
        setLoading(false);
      }
    }, 1000);
  }, []);

  const handleFeedbackChange = (key, value) => {
    if (isValidated) return;
    setFeedback((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting feedback:', feedback);
    setIsValidated(true);
    setShowSubmissionModal(true);
  };

  const toggleFile = (setter, index) => setter((prev) => ({ ...prev, [index]: !prev[index] }));

  if (loading) return <div className="flex justify-center items-center min-h-screen text-gray-600 font-semibold text-lg">Loading profile...</div>;
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-600">Error: {error}</div>;
  if (!currentProfile) return <div className="flex justify-center items-center min-h-screen text-gray-600">Profile not found.</div>;

  const aboutFields = [
    ['Name', currentProfile.name, 'name'],
    ["Father's Name", currentProfile.fatherName, 'fatherName'],
    ['Email', currentProfile.email, 'email'],
    ['Phone', currentProfile.mobile, 'phone'],
    ['Address', currentProfile.address, 'address'],
    ['City', currentProfile.city, 'city'],
    ['Country', currentProfile.country, 'country'],
    ['Gender', currentProfile.gender, 'gender'],
    ['Resident Status', currentProfile.residentStatus, 'residentStatus'],
    ['Nationality', currentProfile.nationality, 'nationality'],
    ['Date of Birth', currentProfile.dob?.$date ? new Date(currentProfile.dob.$date).toLocaleDateString() : null, 'dob'],
  ].filter(([_, value]) => value && value !== 'N/A' && value !== '');

  return (
    <>
      {showSubmissionModal && <SubmissionModal onClose={() => setShowSubmissionModal(false)} />}
      <main className="bg-orange-50 min-h-screen p-4 sm:p-6 lg:p-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg max-w-4xl mx-auto p-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <img src={currentProfile.profilePicture} alt="Avatar" className="w-16 h-16 rounded-full" />
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{currentProfile.name}</h1>
              <p className="text-sm text-gray-600">{currentProfile.experience?.[0]?.jobTitle}</p>
            </div>
          </div>

          {/* Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <h3 className="text-lg font-semibold text-orange-600">About</h3>
              {aboutFields.map(([label, value, key]) => (
                <InfoField key={key} label={label} value={value} name={key} feedback={feedback} onFeedbackChange={handleFeedbackChange} isValidated={isValidated} />
              ))}
            </div>
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-orange-600">Experience</h3>
                {currentProfile.experience?.map((exp, i) => (
                  <div key={i} className="mt-3">
                    <InfoField label="Role" value={exp.jobTitle} name={`exp-role-${i}`} feedback={feedback} onFeedbackChange={handleFeedbackChange} isValidated={isValidated} />
                    <InfoField label="Company" value={exp.company} name={`exp-company-${i}`} feedback={feedback} onFeedbackChange={handleFeedbackChange} isValidated={isValidated} />
                    <InfoField label="Period" value={`${new Date(exp.startDate).toLocaleDateString()} - ${exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}`} name={`exp-period-${i}`} feedback={feedback} onFeedbackChange={handleFeedbackChange} isValidated={isValidated} />
                    {exp.fileUrl && (
                      <div className="mt-2">
                        <button type="button" onClick={() => toggleFile(setShowLetter, i)} className="flex items-center gap-2 text-sm text-orange-600 hover:text-orange-800 transition">
                          <DocumentIcon className="w-4 h-4" />
                          {showLetter[i] ? 'Hide' : 'View'} Experience Letter
                        </button>
                        {showLetter[i] && <img src={exp.fileUrl} alt="Experience Letter" className="mt-2 w-full rounded" />}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-orange-600">Education</h3>
                {currentProfile.education?.map((edu, i) => (
                  <div key={i} className="mt-3">
                    <InfoField label="Degree" value={edu.degreeTitle} name={`edu-degree-${i}`} feedback={feedback} onFeedbackChange={handleFeedbackChange} isValidated={isValidated} />
                    <InfoField label="Institute" value={edu.institute} name={`edu-institute-${i}`} feedback={feedback} onFeedbackChange={handleFeedbackChange} isValidated={isValidated} />
                    <InfoField label="Year" value={`${new Date(edu.startDate).getFullYear()} - ${new Date(edu.endDate).getFullYear()}`} name={`edu-year-${i}`} feedback={feedback} onFeedbackChange={handleFeedbackChange} isValidated={isValidated} />
                    <InfoField label="Website" value={edu.website} name={`edu-website-${i}`} feedback={feedback} onFeedbackChange={handleFeedbackChange} isValidated={isValidated} />
                    <InfoField label="Job Functions" value={edu.jobFunctions?.join(', ')} name={`edu-job-${i}`} feedback={feedback} onFeedbackChange={handleFeedbackChange} isValidated={isValidated} />
                    {edu.degreeFile && (
                      <div className="mt-2">
                        <button type="button" onClick={() => toggleFile(setShowDegree, i)} className="flex items-center gap-2 text-sm text-orange-600 hover:text-orange-800 transition">
                          <DocumentIcon className="w-4 h-4" />
                          {showDegree[i] ? 'Hide' : 'View'} Degree Certificate
                        </button>
                        {showDegree[i] && <img src={edu.degreeFile} alt="Degree Certificate" className="mt-2 w-full rounded" />}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={isValidated}
              className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isValidated ? 'Validation Submitted' : 'Submit Validation'}
            </button>
          </div>
        </form>
      </main>
    </>
  );
};

export default ProfileValidatorApp;
