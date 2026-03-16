import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetProfileState, submitProfile } from "../Redux/profile";
import axiosinstance from "../Connection/Api";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";

const COUNTRIES = ["Pakistan", "India", "China", "USA", "UK", "UAE", "Canada", "Other"];
const GENDERS = ["Male", "Female", "Other"];
const MARITAL_STATUSES = ["Single", "Married", "Divorced", "Widowed"];
const RESIDENT_STATUSES = ["Citizen", "Permanent Resident", "Work Visa", "Student Visa", "Other"];
const SHIFT_PREFERENCES = ["Day Shift", "Night Shift", "Flexible", "Remote"];
const WORK_AUTHORIZATIONS = [
  "Pakistan Work Visa",
  "Other Work Visa",
  "Permanent Residency",
  "Citizenship",
  "No Authorization Needed"
];
const DEGREE_TITLES = [
  "Bachelor of Science",
  "Bachelor of Arts", 
  "Master of Science",
  "Master of Arts",
  "PhD",
  "Associate Degree",
  "Diploma",
  "Other"
];
const INSTITUTES = [
  "University of Punjab",
  "Lahore University of Management Sciences (LUMS)",
  "University of Karachi",
  "Quaid-i-Azam University",
  "Aga Khan University",
  "COMSATS University",
  "University of Engineering and Technology",
  "Other"
];
const JOB_TITLES = [
  "Software Engineer",
  "Data Analyst",
  "Project Manager",
  "Marketing Specialist",
  "Sales Executive",
  "HR Manager",
  "Accountant",
  "Operations Manager",
  "Other"
];
const COMPANIES = [
  "Systems Limited",
  "Techlogix",
  "ArhamSoft",
  "10Pearls",
  "Contour Software",
  "Netsol",
  "Avanza Solutions",
  "Other"
];
const INDUSTRIES = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
  "Retail",
  "Consulting",
  "Other"
];
const JOB_FUNCTIONS = [
  "Software Development",
  "Data Analysis",
  "Project Management",
  "Marketing",
  "Sales",
  "Human Resources",
  "Finance",
  "Operations"
];
const VISIBILITY_PRESETS = ["Public", "Private", "Hide"];
const VERIFICATION_LEVELS = ["Silver", "Gold", "Platinum"];

// Templates
const newEducationTemplate = {
  id: "",
  degreeTitle: "",
  startDate: null,
  endDate: null,
  institute: "",
  website: "",
  degreeFile: null,
};

const newExperienceTemplate = {
  id: "",
  jobTitle: "",
  startDate: null,
  endDate: null,
  company: "",
  website: "",
  experienceFile: null,
  jobFunctions: [],
  industry: "",
};

// Components
const FileUpload = ({ label, onDrop, file, className = "" }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1
  });

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-center gap-1">
        <VerificationBadge level="Silver" />
        <label className="block text-xs font-semibold text-slate-700">
          {label}
          <span className="text-red-500 ml-0.5">*</span>
        </label>
      </div>
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer 
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
      >
        <input {...getInputProps()} />
        {file ? (
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm text-gray-700">{file.name}</span>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-600">
              {isDragActive ? 'Drop the file here' : 'Drag & drop a file here, or click to select'}
            </p>
            <p className="text-xs text-gray-500 mt-1">PDF, PNG, JPG (Max 5MB)</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Section = ({ title, icon, children }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-[#f4793d]">
        {icon && <span className="text-xl">{icon}</span>}
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      </div>
      {children}
    </div>
  );
};

const VerificationBadge = ({ level }) => {
  const badgeColors = {
    Silver: "bg-gray-300 text-gray-800",
    Gold: "bg-yellow-400 text-yellow-800",
    Platinum: "bg-blue-100 text-blue-800"
  };

  return (
    <span 
      className={`text-xs px-2 py-0.5 rounded-full ${badgeColors[level] || badgeColors.Silver}`}
      title={`Verified: ${level}`}
    >
      {level}
    </span>
  );
};

const Input = ({ label, name, value, onChange, required = false, type = "text", className = "", disabled = false }) => {
  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-center gap-1">
        <VerificationBadge level="Silver" />
        <label className="block text-xs font-semibold text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-[#f4793d] focus:border-[#f4793d] transition-colors bg-white text-slate-900 ${
          disabled ? 'bg-gray-100 cursor-not-allowed' : ''
        }`}
      />
    </div>
  );
};

const Select = ({ name, label, value, onChange, options, defaultOption, className = "", disabled = false }) => {
  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-center gap-1">
        <VerificationBadge level="Silver" />
        {label && <label className="block text-xs font-semibold text-slate-700">{label}</label>}
      </div>
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-[#f4793d] focus:border-[#f4793d] transition-colors bg-white text-slate-900 ${
          disabled ? 'bg-gray-100 cursor-not-allowed' : ''
        }`}
      >
        {defaultOption && <option value="">{defaultOption}</option>}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

const DateInput = ({ label, value, onChange, className = "", disabled = false }) => {
  const formatDateForInput = (date) => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0];
  };

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-center gap-1">
        <VerificationBadge level="Silver" />
        <label className="block text-xs font-semibold text-slate-700">{label}</label>
      </div>
      <input
        type="date"
        value={formatDateForInput(value)}
        onChange={(e) => {
          const date = e.target.value ? new Date(e.target.value) : null;
          onChange(date);
        }}
        disabled={disabled}
        className={`w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-[#f4793d] focus:border-[#f4793d] transition-colors bg-white text-slate-900 ${
          disabled ? 'bg-gray-100 cursor-not-allowed' : ''
        }`}
      />
    </div>
  );
};

const CheckboxGroup = ({ legend, options, selectedOptions, onChange, className = "", disabled = false }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-1">
        <VerificationBadge level="Silver" />
        <legend className="text-xs font-semibold text-slate-700">{legend}</legend>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {options.map((option) => (
          <label
            key={option}
            className={`flex items-center gap-2 p-2 rounded border border-slate-200 transition-colors ${
              disabled ? 'cursor-not-allowed bg-gray-100' : 'cursor-pointer hover:bg-slate-50'
            }`}
          >
            <input
              type="checkbox"
              checked={selectedOptions.includes(option)}
              onChange={() => !disabled && onChange(option)}
              disabled={disabled}
              className={`w-3.5 h-3.5 text-[#f4793d] border-gray-300 rounded focus:ring-[#f4793d] ${
                disabled ? 'cursor-not-allowed' : ''
              }`}
            />
            <span className="text-xs text-slate-700">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

const FileUploadButton = ({ label, onChange, className = "", disabled = false }) => {
  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-center gap-1">
        <VerificationBadge level="Silver" />
        <label className="block text-xs font-semibold text-slate-700">{label}</label>
      </div>
      <div className="relative">
        <input 
          type="file" 
          onChange={!disabled ? onChange : undefined}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
          accept=".pdf,.png,.jpg,.jpeg"
          disabled={disabled}
        />
        <div className={`w-full px-3 py-2 border border-dashed rounded-md transition-colors text-center ${
          disabled 
            ? 'bg-gray-100 border-gray-300 cursor-not-allowed' 
            : 'border-slate-300 bg-slate-50 cursor-pointer hover:border-[#f4793d]'
        }`}>
          <div className="flex items-center justify-center gap-1">
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <span className="text-xs text-slate-600">Upload file</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const VisibilityControl = ({ fieldName, currentVisibility, onChange, disabled = false }) => {
  return (
    <div className="flex flex-col gap-1 mt-1 p-2 rounded bg-slate-50">
      <span className="text-xs font-medium text-slate-600">Visibility:</span>
      <div className="flex gap-2">
        {VISIBILITY_PRESETS.map((option) => (
          <label key={option} className={`flex items-center gap-1 text-xs ${
            disabled ? 'cursor-not-allowed text-gray-500' : 'cursor-pointer'
          }`}>
            <input
              type="radio"
              name={`vis-${fieldName}`}
              value={option}
              checked={currentVisibility === option}
              onChange={() => !disabled && onChange(fieldName, option)}
              disabled={disabled}
              className={`w-3 h-3 text-[#f4793d] border-gray-300 focus:ring-[#f4793d] ${
                disabled ? 'cursor-not-allowed' : ''
              }`}
            />
            <span className="text-slate-700">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

const FieldWrapper = ({ children, fieldName, formData, handleFieldVisibility, isCnicField = false, disabled = false }) => {
  const visibility = formData.fieldVisibilities[fieldName] || "Private";

  return (
    <div>
      {children}
      {fieldName && !isCnicField && (
        <VisibilityControl 
          fieldName={fieldName}
          currentVisibility={visibility}
          onChange={handleFieldVisibility}
          disabled={disabled}
        />
      )}
    </div>
  );
};

const UserForm = () => {
  const location = useLocation();
  const loggedInEmail = location.state?.email || "";
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, success, profile } = useSelector(state => state.profile);

const [isSubmitted, setIsSubmitted] = useState(false);
const [isEditMode, setIsEditMode] = useState(false);  // If not already defined

  const [formData, setFormData] = useState({
    personal: {
      name: "",
      mobile: "",
      email: loggedInEmail,
      cnic: "",
      fatherName: "",
      city: "",
      country: "Pakistan",
      gender: "",
      maritalStatus: "",
      residentStatus: "",
      shiftPreferences: [],
      workLocationPreference: "",
      dob: null,
      nationality: "Pakistan",
      workAuthorization: [],
    },
    fieldVisibilities: {},
    education: [{ ...newEducationTemplate, id: Date.now().toString() }],
    experience: [{ ...newExperienceTemplate, id: Date.now().toString() }],
  });
  

  const toggleEditMode = () => {
  if (isSubmitted) {
    setIsEditMode(!isEditMode);
  }
};


  const [files, setFiles] = useState({
    resume: null,
    profilePicture: null 
  });

  const [selectedPreset, setSelectedPreset] = useState("");

  // Check if profile data exists and set form data
  useEffect(() => {
    if (profile) {
      // Transform profile data into form data structure
      const transformedProfile = {
        personal: {
          name: profile.name || "",
          mobile: profile.mobile || "",
          email: profile.email || loggedInEmail,
          cnic: profile.cnic || "",
          fatherName: profile.fatherName || "",
          city: profile.city || "",
          country: profile.country || "Pakistan",
          gender: profile.gender || "",
          maritalStatus: profile.maritalStatus || "",
          residentStatus: profile.residentStatus || "",
          shiftPreferences: profile.shiftPreferences || [],
          workLocationPreference: profile.workLocationPreference || "",
          dob: profile.dob ? new Date(profile.dob) : null,
          nationality: profile.nationality || "Pakistan",
          workAuthorization: profile.workAuthorization || [],
        },
        fieldVisibilities: profile.fieldVisibilities || {},
        education: profile.education?.length > 0 
          ? profile.education.map(edu => ({
              ...edu,
              id: edu.id || Date.now().toString(),
              startDate: edu.startDate ? new Date(edu.startDate) : null,
              endDate: edu.endDate ? new Date(edu.endDate) : null,
              degreeFile: null // We'll handle file URLs separately
            }))
          : [{ ...newEducationTemplate, id: Date.now().toString() }],
        experience: profile.experience?.length > 0 
          ? profile.experience.map(exp => ({
              ...exp,
              id: exp.id || Date.now().toString(),
              startDate: exp.startDate ? new Date(exp.startDate) : null,
              endDate: exp.endDate ? new Date(exp.endDate) : null,
              experienceFile: null, // We'll handle file URLs separately
              jobFunctions: exp.jobFunctions || []
            }))
          : [{ ...newExperienceTemplate, id: Date.now().toString() }],
      };

      setFormData(transformedProfile);
      
      // Set files if they exist in profile
      if (profile.resumeUrl) {
        setFiles(prev => ({
          ...prev,
          resume: { name: "resume.pdf" } // Simplified for demo
        }));
      }
      if (profile.profilePictureUrl) {
        setFiles(prev => ({
          ...prev,
          profilePicture: { name: "profile.jpg" } // Simplified for demo
        }));
      }
    }
  }, [profile, loggedInEmail]);

  useEffect(() => {
    if (success) {
      toast.success("Profile submitted successfully!");
      setIsEditMode(false); // Exit edit mode after successful update
      dispatch(resetProfileState());
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (error) {
      const errorMessage = error.message || 
                          error.error || 
                          JSON.stringify(error);
      toast.error(`Error: ${errorMessage}`);
    }
  }, [error]);

  const handleFileDrop = (field) => (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0 && !isEditMode) {
      if (field === 'profilePicture') {
        const imageFile = acceptedFiles.find(file => 
          file.type.startsWith('image/')
        );
        if (imageFile) {
          setFiles(prev => ({
            ...prev,
            [field]: imageFile
          }));
        }
      } else {
        setFiles(prev => ({
          ...prev,
          [field]: acceptedFiles[0]
        }));
      }
    }
  };

  const handleRemoveFile = (field) => {
    if (!isEditMode) {
      setFiles(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const applyVisibilityPreset = (preset) => {
    if (isEditMode) return;
    
    const newFieldVisibilities = {};
    
    const allFields = [
      ...Object.keys(formData.personal).filter(field => !Array.isArray(formData.personal[field])),
      'dob',
      ...formData.education.flatMap((edu, index) => [
        `education-${index}-degreeTitle`,
        `education-${index}-startDate`,
        `education-${index}-endDate`,
        `education-${index}-institute`,
        `education-${index}-website`,
        `education-${index}-degreeFile`
      ]),
      ...formData.experience.flatMap((exp, index) => [
        `experience-${index}-jobTitle`,
        `experience-${index}-startDate`,
        `experience-${index}-endDate`,
        `experience-${index}-company`,
        `experience-${index}-website`,
        `experience-${index}-experienceFile`,
        `experience-${index}-jobFunctions`,
        `experience-${index}-industry`
      ])
    ];

    allFields.forEach(field => {
      if (field !== 'cnic' && !field.includes('cnic')) {
        newFieldVisibilities[field] = preset;
      }
    });

    setFormData(prev => ({
      ...prev,
      fieldVisibilities: newFieldVisibilities
    }));
  };

  const handleApplyPreset = () => {
    if (selectedPreset && !isEditMode) {
      applyVisibilityPreset(selectedPreset);
    }
  };

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, personal: { ...prev.personal, [name]: value } }));
  };

  
  const handleDobChange = (date) => {
    setFormData(prev => ({ 
      ...prev, 
      personal: { 
        ...prev.personal, 
        dob: date
      } 
    }));
  };

  const handleCheckboxChange = (group, option) => {
    if (isEditMode) return;
    
    setFormData(prev => {
      const currentSelection = prev.personal[group];
      const newSelection = currentSelection.includes(option)
        ? currentSelection.filter(item => item !== option)
        : [...currentSelection, option];
      return { 
        ...prev, 
        personal: { 
          ...prev.personal, 
          [group]: newSelection 
        } 
      };
    });
  };

  const handleDynamicChange = (section, index, e) => {
    const { name, value } = e.target;
    const updated = [...formData[section]];
    updated[index][name] = value;
    setFormData(prev => ({ ...prev, [section]: updated }));
  };

  const handleDynamicDateChange = (section, index, field, date) => {
    const updated = [...formData[section]];
    updated[index][field] = date;
    setFormData(prev => ({ ...prev, [section]: updated }));
  };

  const handleDynamicFileChange = (section, index, e) => {
    if (isEditMode) return;
    
    const file = e.target.files?.[0];
    if (!file) return;
    const updated = [...formData[section]];
    updated[index][section === "education" ? "degreeFile" : "experienceFile"] = file;
    setFormData(prev => ({ ...prev, [section]: updated }));
  };

  const handleDynamicCheckboxChange = (section, index, field, option) => {
    if (isEditMode) return;
    
    const updated = [...formData[section]];
    const options = updated[index][field] || [];
    updated[index][field] = options.includes(option) 
      ? options.filter(o => o !== option) 
      : [...options, option];
    setFormData(prev => ({ ...prev, [section]: updated }));
  };

  const addNewEntry = (section) => {
    if (isEditMode) return;
    
    const newItem = section === "education"
      ? { ...newEducationTemplate, id: Date.now().toString() }
      : { ...newExperienceTemplate, id: Date.now().toString() };
    setFormData(prev => ({ ...prev, [section]: [...prev[section], newItem] }));
  };

  const removeDynamicItem = (section, id) => {
    if (isEditMode) return;
    
    setFormData(prev => ({ 
      ...prev, 
      [section]: prev[section].filter(item => item.id !== id) 
    }));
  };

  const handleFieldVisibility = (field, value) => {
    if (isEditMode) return;
    
    setFormData(prev => ({
      ...prev,
      fieldVisibilities: {
        ...prev.fieldVisibilities,
        [field]: value
      }
    }));
  };

const validateForm = () => {
  const errors = [];
  const { personal } = formData;

  // Required personal information
  if (!personal.name?.trim()) errors.push({ field: 'name', message: 'Name is required' });
  if (!personal.fatherName?.trim()) errors.push({ field: 'fatherName', message: "Father's Name is required" });
  if (!personal.cnic?.trim()) errors.push({ field: 'cnic', message: 'CNIC is required' });
  if (!personal.gender?.trim()) errors.push({ field: 'gender', message: 'Gender is required' });
  if (!personal.dob) errors.push({ field: 'dob', message: 'Date of Birth is required' });
  if (!personal.mobile?.trim()) errors.push({ field: 'mobile', message: 'Mobile number is required' });
  if (!personal.email?.trim()) errors.push({ field: 'email', message: 'Email is required' });
  if (!personal.city?.trim()) errors.push({ field: 'city', message: 'City is required' });
  if (!personal.residentStatus?.trim()) errors.push({ field: 'residentStatus', message: 'Resident Status is required' });

  // Validate CNIC format (basic validation)
  if (personal.cnic && !/^\d{5}-\d{7}-\d{1}$/.test(personal.cnic) && !/^\d{13}$/.test(personal.cnic)) {
    errors.push({ field: 'cnic', message: 'CNIC should be in format XXXXX-XXXXXXX-X or 13 digits' });
  }

  // Validate email format
  if (personal.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personal.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }

  // Validate mobile number (basic Pakistan format)
  if (personal.mobile && !/^(\+92|0)?3\d{9}$/.test(personal.mobile.replace(/\s/g, ''))) {
    errors.push({ field: 'mobile', message: 'Please enter a valid mobile number (e.g., 03XXXXXXXXX)' });
  }

  // Check for at least one education entry with required fields
  if (formData.education.length > 0) {
    formData.education.forEach((edu, index) => {
      if (edu.degreeTitle?.trim()) {
        // If degree title is filled, check other fields
        if (!edu.institute?.trim()) {
          errors.push({ field: `education-${index}-institute`, message: `Institute is required for education entry ${index + 1}` });
        }
      }
    });
  }

  return errors;
};

const handleSubmit = async (e) => {
  e.preventDefault();

  // Validate form
  const validationErrors = validateForm();
  
  if (validationErrors.length > 0) {
    // Show first error in toast
    toast.error(validationErrors[0].message);
    
    // Scroll to first missing field
    const firstErrorField = validationErrors[0].field;
    let elementToScroll;
    
    if (firstErrorField.includes('education')) {
      // Handle education fields
      const index = parseInt(firstErrorField.split('-')[1]);
      elementToScroll = document.getElementById(`education-${index}`);
    } else if (firstErrorField.includes('experience')) {
      // Handle experience fields
      const index = parseInt(firstErrorField.split('-')[1]);
      elementToScroll = document.getElementById(`experience-${index}`);
    } else {
      // Handle personal fields - find input by name attribute
      elementToScroll = document.querySelector(`input[name="${firstErrorField}"], select[name="${firstErrorField}"]`);
    }
    
    if (elementToScroll) {
      elementToScroll.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Add focus if it's an input/select
      if (elementToScroll.focus) {
        elementToScroll.focus();
      }
    }
    
    return;
  }

  if (!isEditMode && (!files.resume || !files.profilePicture)) {
    toast.error('Please upload both resume and profile picture');
    // Scroll to file upload section
    const fileUploadSection = document.querySelector('input[type="file"]');
    if (fileUploadSection) {
      fileUploadSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }

  const formDataToSend = new FormData();

  // Append personal info with visibility
  Object.entries(formData.personal).forEach(([key, value]) => {
    if (key === 'dob' && value) {
      formDataToSend.append(key, value.toISOString());
      formDataToSend.append(`${key}Visibility`, formData.fieldVisibilities[key] || "Private");
    } else if (Array.isArray(value)) {
      value.forEach(item => formDataToSend.append(key, item));
      formDataToSend.append(`${key}Visibility`, formData.fieldVisibilities[key] || "Private");
    } else if (value !== null && value !== undefined) {
      formDataToSend.append(key, value);
      formDataToSend.append(`${key}Visibility`, formData.fieldVisibilities[key] || "Private");
    }
  });

  // Append main files with visibility
  if (files.resume) {
    formDataToSend.append('resume', files.resume);
    formDataToSend.append('resumeVisibility', formData.fieldVisibilities['resume'] || "Private");
  }
  if (files.profilePicture) {
    formDataToSend.append('profilePicture', files.profilePicture);
    formDataToSend.append('profilePictureVisibility', formData.fieldVisibilities['profilePicture'] || "Private");
  }

  // Append education data with visibility
  formData.education.forEach((edu, index) => {
    Object.entries(edu).forEach(([field, value]) => {
      if (field !== 'id' && field !== 'degreeFile' && value !== null && value !== undefined) {
        formDataToSend.append(`education[${index}][${field}]`, value);
        if (field !== 'verificationLevel') {
          formDataToSend.append(
            `education[${index}][${field}Visibility]`,
            formData.fieldVisibilities[`education-${index}-${field}`] || "Private"
          );
        }
      }
    });

    if (edu.degreeFile) {
      formDataToSend.append('degreeFiles', edu.degreeFile);
      formDataToSend.append(
        `education[${index}][degreeFileVisibility]`,
        formData.fieldVisibilities[`education-${index}-degreeFile`] || "Private"
      );
    }
  });

  // Append experience data with visibility
  formData.experience.forEach((exp, index) => {
    Object.entries(exp).forEach(([field, value]) => {
      if (field !== 'id' && field !== 'experienceFile' && value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach(item =>
            formDataToSend.append(`experience[${index}][${field}][]`, item)
          );
          formDataToSend.append(
            `experience[${index}][${field}Visibility]`,
            formData.fieldVisibilities[`experience-${index}-${field}`] || "Private"
          );
        } else {
          formDataToSend.append(`experience[${index}][${field}]`, value);
          formDataToSend.append(
            `experience[${index}][${field}Visibility]`,
            formData.fieldVisibilities[`experience-${index}-${field}`] || "Private"
          );
        }
      }
    });

    if (exp.experienceFile) {
      formDataToSend.append('experienceFiles', exp.experienceFile);
      formDataToSend.append(
        `experience[${index}][fileUrlVisibility]`,
        formData.fieldVisibilities[`experience-${index}-experienceFile`] || "Private"
      );
    }
  });

  try {
    const endpoint = profile ? '/profile/update' : '/profile';
    const method = profile ? 'put' : 'post';

    const response = await axiosinstance[method](endpoint, formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response) {
      setIsSubmitted(true);
      setIsEditMode(false);
      toast.success(`Profile ${profile ? 'updated' : 'created'} successfully`);
      if (!profile) {
        navigate('/success');
      }
    }
  } catch (err) {
    toast.error(`Error ${isEditMode ? 'updating' : 'submitting'} profile: ${err.response?.data?.message || err.message}`);
    if (err.response?.data?.errors) {
      toast.error('Validation errors occurred');
    }
  }
};


  

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white text-gray-900 py-4 shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-3">
          <div className="flex-col md:flex-row md:flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-[#f4793d] to-[#ff8748] p-2 rounded-lg shadow">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#f4793d] to-[#ff8748]">
                  Professional Profile
                </h1>
                <p className="text-gray-500 text-xs mt-1">
                  {isEditMode ? "Edit your profile" : profile ? "View your profile" : "Complete your profile"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center mt-7 md:mt-0 gap-2">
              {!isEditMode && !profile && (
                <>
                  <div className="space-y-1 w-48">
                    <label className="block text-xs font-semibold text-slate-700">Visibility Preset</label>
                    <select
                      name="visibilityPreset"
                      value={selectedPreset}
                      onChange={e => setSelectedPreset(e.target.value)}
                      className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-[#f4793d] focus:border-[#f4793d] transition-colors bg-white text-slate-900"
                    >
                      <option value="">Set all visibility</option>
                      {VISIBILITY_PRESETS.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={handleApplyPreset}
                    className="px-3 py-1.5 bg-[#f4793d] text-white rounded hover:bg-[#e66e33] mt-5 text-sm font-medium"
                  >
                    Apply
                  </button>
                </>
              )}
              
              {profile && (
                <button
                  onClick={toggleEditMode}
                  className={`px-3 py-1.5 rounded mt-5 text-sm font-medium ${
                    isEditMode 
                      ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                      : 'bg-[#f4793d] text-white hover:bg-[#e66e33]'
                  }`}
                >
                  {isEditMode ? 'Cancel Edit' : 'Edit Profile'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-3 py-4">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Personal Information */}
          <Section
            icon={
              <div className="bg-gradient-to-r from-gray-100 to-indigo-100 p-1.5 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#f4793d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            }
            title="Personal Information"
          >
            <div className="bg-white rounded-lg p-3 shadow border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FieldWrapper 
                  fieldName="name" 
                  formData={formData} 
                  handleFieldVisibility={handleFieldVisibility}
                  disabled={!!profile && !isEditMode}
                >
                  <Input
                    label="Name"
                    name="name"
                    value={formData.personal.name}
                    onChange={handlePersonalChange}
                    required
                    disabled={!!profile && !isEditMode}
                  />
                </FieldWrapper>

                <FieldWrapper 
                  fieldName="mobile" 
                  formData={formData} 
                  handleFieldVisibility={handleFieldVisibility}
                   disabled={!!profile && !isEditMode}
                >
                  <Input
                    label="Mobile"
                    name="mobile"
                    value={formData.personal.mobile}
                    onChange={handlePersonalChange}
                    required
                   disabled={!!profile && !isEditMode}
                  />
                </FieldWrapper>

                <FieldWrapper 
                  fieldName="email" 
                  formData={formData} 
                  handleFieldVisibility={handleFieldVisibility}
                 disabled={!!profile && !isEditMode}
                >
                  <Input
                    label="Email"
                    name="email"
                    value={formData.personal.email}
                    onChange={handlePersonalChange}
                    type="email"
                    required
                   disabled={!!profile && !isEditMode}
                  />
                </FieldWrapper>

                <FieldWrapper 
                  fieldName="cnic" 
                  formData={formData} 
                  handleFieldVisibility={handleFieldVisibility} 
                  isCnicField
              disabled={!!profile && !isEditMode}
                >
                  <Input
                    label="CNIC"
                    name="cnic"
                    value={formData.personal.cnic}
                    onChange={handlePersonalChange}
                    required
                  disabled={!!profile && !isEditMode}
                  />
                </FieldWrapper>

                <FieldWrapper 
                  fieldName="fatherName" 
                  formData={formData} 
                  handleFieldVisibility={handleFieldVisibility}
              disabled={!!profile && !isEditMode}
                >
                  <Input
                    label="Father Name"
                    name="fatherName"
                    value={formData.personal.fatherName}
                    onChange={handlePersonalChange}
                    required
           disabled={!!profile && !isEditMode}
                  />
                </FieldWrapper>

                <FieldWrapper 
                  fieldName="city" 
                  formData={formData} 
                  handleFieldVisibility={handleFieldVisibility}
                  disabled={!!profile && !isEditMode}
                >
                  <Input
                    label="City"
                    name="city"
                    value={formData.personal.city}
                    onChange={handlePersonalChange}
                    required
         disabled={!!profile && !isEditMode}
                  />
                </FieldWrapper>

                <FieldWrapper 
                  fieldName="country" 
                  formData={formData} 
                  handleFieldVisibility={handleFieldVisibility}
                disabled={!!profile && !isEditMode}
                >
                  <Select
                    name="country"
                    label="Country"
                    value={formData.personal.country}
                    onChange={handlePersonalChange}
                    options={COUNTRIES}
              disabled={!!profile && !isEditMode}
                  />
                </FieldWrapper>

                <FieldWrapper 
                  fieldName="gender" 
                  formData={formData} 
                  handleFieldVisibility={handleFieldVisibility}
          disabled={!!profile && !isEditMode}
                >
                  <Select
                    name="gender"
                    label="Gender"
                    value={formData.personal.gender}
                    onChange={handlePersonalChange}
                    options={GENDERS}
                    defaultOption="Select Gender"
                    disabled={!!profile && !isEditMode}
                  />
                </FieldWrapper>

                <FieldWrapper 
                  fieldName="maritalStatus" 
                  formData={formData} 
                  handleFieldVisibility={handleFieldVisibility}
      disabled={!!profile && !isEditMode}
                >
                  <Select
                    name="maritalStatus"
                    label="Marital Status"
                    value={formData.personal.maritalStatus}
                    onChange={handlePersonalChange}
                    options={MARITAL_STATUSES}
                    defaultOption="Select Marital Status"
                    disabled={!!profile && !isEditMode}
                  />
                </FieldWrapper>

                <FieldWrapper 
                  fieldName="residentStatus" 
                  formData={formData} 
                  handleFieldVisibility={handleFieldVisibility}
              disabled={!!profile && !isEditMode}
                >
                  <Select
                    name="residentStatus"
                    label="Resident Status"
                    value={formData.personal.residentStatus}
                    onChange={handlePersonalChange}
                    options={RESIDENT_STATUSES}
                    defaultOption="Select Resident Status"
                  disabled={!!profile && !isEditMode}
                  />
                </FieldWrapper>

                <FieldWrapper 
                  fieldName="nationality" 
                  formData={formData} 
                  handleFieldVisibility={handleFieldVisibility}
                   disabled={!!profile && !isEditMode}
                >
                  <Input
                    label="Nationality"
                    name="nationality"
                    value={formData.personal.nationality}
                    onChange={handlePersonalChange}
                   disabled={!!profile && !isEditMode}
                  />
                </FieldWrapper>

                <FieldWrapper 
                  fieldName="dob" 
                  formData={formData} 
                  handleFieldVisibility={handleFieldVisibility}
                  disabled={!!profile && !isEditMode}
                >
                  <DateInput
                    label="Date of Birth"
                    value={formData.personal.dob}
                    onChange={handleDobChange}
                 disabled={!!profile && !isEditMode}
                  />
                </FieldWrapper>

                <FieldWrapper 
                  fieldName="resume" 
                  formData={formData} 
                  handleFieldVisibility={handleFieldVisibility}
                disabled={!!profile && !isEditMode}
                >
                  <FileUpload
                    label="Upload Resume (PDF)"
                    onDrop={handleFileDrop('resume')}
                    file={files.resume}
                    className="col-span-2"
                  />
                  {files.resume && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFile('resume')}
                      className={`text-xs mt-1 flex items-center gap-1 ${
                        !isEditMode && profile ? 'text-gray-500 cursor-not-allowed' : 'text-red-500'
                      }`}
                      disabled={!isEditMode && !!profile}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Remove file
                    </button>
                  )}
                </FieldWrapper>

                <FieldWrapper 
                  fieldName="profilePicture" 
                  formData={formData} 
                  handleFieldVisibility={handleFieldVisibility}
            disabled={!!profile && !isEditMode}
                >
                  <FileUpload
                    label="Upload Profile Picture (Image)"
                    onDrop={handleFileDrop('profilePicture')}
                    file={files.profilePicture}
                    className="col-span-2"
                    accept="image/*"
                  />
                  {files.profilePicture && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFile('profilePicture')}
                      className={`text-xs mt-1 flex items-center gap-1 ${
                        !isEditMode && profile ? 'text-gray-500 cursor-not-allowed' : 'text-red-500'
                      }`}
                      disabled={!isEditMode && !!profile}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Remove file
                    </button>
                  )}
                </FieldWrapper>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100">
                <FieldWrapper 
                  fieldName="shiftPreferences" 
                  formData={formData} 
                  handleFieldVisibility={handleFieldVisibility}
                   disabled={!!profile && !isEditMode}
                >
                  <CheckboxGroup
                    legend="Shift Preferences"
                    options={SHIFT_PREFERENCES}
                    selectedOptions={formData.personal.shiftPreferences}
                    onChange={opt => handleCheckboxChange("shiftPreferences", opt)}
               disabled={!!profile && !isEditMode}
                  />
                </FieldWrapper>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100">
                <FieldWrapper 
                  fieldName="workAuthorization" 
                  formData={formData} 
                  handleFieldVisibility={handleFieldVisibility}
             disabled={!!profile && !isEditMode}
                >
                  <CheckboxGroup
                    legend="Work Authorization"
                    options={WORK_AUTHORIZATIONS}
                    selectedOptions={formData.personal.workAuthorization}
                    onChange={opt => handleCheckboxChange("workAuthorization", opt)}
                    disabled={!!profile && !isEditMode}
                  />
                </FieldWrapper>
              </div>
            </div>
          </Section>

          {/* Education */}
          <Section 
            title="Education" 
            icon={
              <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-1.5 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#f4793d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
              </div>
            }
          >
            <div className="space-y-3">
              {formData.education.map((edu, index) => (
                <div key={edu.id} className="bg-white rounded-lg p-3 shadow border border-gray-100">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                        <span>Education {index + 1}</span>
                      </h3>
                      <p className="text-gray-500 text-xxs">Academic qualifications</p>
                    </div>
                    {formData.education.length > 1 && !isEditMode && !profile && (
                      <button
                        type="button"
                        onClick={() => removeDynamicItem("education", edu.id)}
                        className="text-gray-400 hover:text-red-500 text-xxs flex items-center gap-0.5 mt-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <FieldWrapper 
                        fieldName={`education-${index}-degreeTitle`} 
                        formData={formData} 
                        handleFieldVisibility={handleFieldVisibility}
                     disabled={!!profile && !isEditMode}
                      >
                        <Select
                          name="degreeTitle"
                          label="Degree Title"
                          value={edu.degreeTitle}
                          onChange={(e) => handleDynamicChange("education", index, e)}
                          options={DEGREE_TITLES}
                          defaultOption="Select Degree"
                         disabled={!!profile && !isEditMode}
                        />
                      </FieldWrapper>

                      <FieldWrapper 
                        fieldName={`education-${index}-startDate`} 
                        formData={formData} 
                        handleFieldVisibility={handleFieldVisibility}
                        disabled={!!profile && !isEditMode}
                      >
                        <DateInput
                          label="Start Date"
                          value={edu.startDate}
                          onChange={(date) => handleDynamicDateChange("education", index, "startDate", date)}
                        disabled={!!profile && !isEditMode}
                        />
                      </FieldWrapper>

                      <FieldWrapper 
                        fieldName={`education-${index}-endDate`} 
                        formData={formData} 
                        handleFieldVisibility={handleFieldVisibility}
                        disabled={!!profile && !isEditMode}
                      >
                        <DateInput
                          label="End Date"
                          value={edu.endDate}
                          onChange={(date) => handleDynamicDateChange("education", index, "endDate", date)}
                        disabled={!!profile && !isEditMode}
                        />
                      </FieldWrapper>
                    </div>

                    <div className="space-y-2">
                      <FieldWrapper 
                        fieldName={`education-${index}-institute`} 
                        formData={formData} 
                        handleFieldVisibility={handleFieldVisibility}
                        disabled={!!profile && !isEditMode}
                      >
                        <Select
                          name="institute"
                          label="Institute"
                          value={edu.institute}
                          onChange={(e) => handleDynamicChange("education", index, e)}
                          options={INSTITUTES}
                          defaultOption="Select Institute"
                          disabled={!!profile && !isEditMode}
                        />
                      </FieldWrapper>

                      <FieldWrapper 
                        fieldName={`education-${index}-website`} 
                        formData={formData} 
                        handleFieldVisibility={handleFieldVisibility}
                        disabled={!!profile && !isEditMode}
                      >
                        <Input
                          name="website"
                          label="Institute Website" 
                          value={edu.website}
                          onChange={(e) => handleDynamicChange("education", index, e)}
                         disabled={!!profile && !isEditMode}
                        />
                      </FieldWrapper>

                      <FieldWrapper 
                        fieldName={`education-${index}-degreeFile`} 
                        formData={formData} 
                        handleFieldVisibility={handleFieldVisibility}
                      disabled={!!profile && !isEditMode}
                      >
                        <FileUploadButton
                          label="Upload Degree"
                          onChange={(e) => handleDynamicFileChange("education", index, e)}
                          disabled={!!profile && !isEditMode}
                        />
                      </FieldWrapper>
                    </div>
                  </div>
                </div>
              ))}

              {(!isEditMode && !profile) && (
                <button
                  type="button"
                  onClick={() => addNewEntry("education")}
                  className="w-full py-2 px-3 bg-white text-[#f4793d] rounded hover:bg-blue-50 text-xs font-medium border border-dashed border-gray-200 flex items-center justify-center gap-1 hover:border-[#f4793d]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Education
                </button>
              )}
            </div>
          </Section>

          {/* Experience */}
          <Section 
            title="Experience" 
            icon={
              <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-1.5 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#f4793d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            }
          >
            <div className="space-y-3">
              {formData.experience.map((exp, index) => (
                <div key={exp.id} className="bg-white rounded-lg p-3 shadow border border-gray-100">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                        <span>Experience {index + 1}</span>
                      </h3>
                      <p className="text-gray-500 text-xxs">Work experience</p>
                    </div>
                    {formData.experience.length > 1 && !isEditMode && !profile && (
                      <button
                        type="button"
                        onClick={() => removeDynamicItem("experience", exp.id)}
                        className="text-gray-400 hover:text-red-500 text-xxs flex items-center gap-0.5 mt-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <FieldWrapper 
                        fieldName={`experience-${index}-jobTitle`} 
                        formData={formData} 
                        handleFieldVisibility={handleFieldVisibility}
                      disabled={!!profile && !isEditMode}
                      >
                        <Select
                          name="jobTitle"
                          label="Job Title"
                          value={exp.jobTitle}
                          onChange={(e) => handleDynamicChange("experience", index, e)}
                          options={JOB_TITLES}
                          defaultOption="Select Job Title"
                         disabled={!!profile && !isEditMode}
                        />
                      </FieldWrapper>

                      <FieldWrapper 
                        fieldName={`experience-${index}-startDate`} 
                        formData={formData} 
                        handleFieldVisibility={handleFieldVisibility}
                         disabled={!!profile && !isEditMode}
                      >
                        <DateInput
                          label="Start Date"
                          value={exp.startDate}
                          onChange={(date) => handleDynamicDateChange("experience", index, "startDate", date)}
                           disabled={!!profile && !isEditMode}
                        />
                      </FieldWrapper>

                      <FieldWrapper 
                        fieldName={`experience-${index}-endDate`} 
                        formData={formData} 
                        handleFieldVisibility={handleFieldVisibility}
                        disabled={!!profile && !isEditMode}
                      >
                        <DateInput
                          label="End Date"
                          value={exp.endDate}
                          onChange={(date) => handleDynamicDateChange("experience", index, "endDate", date)}
                           disabled={!!profile && !isEditMode}
                        />
                      </FieldWrapper>

                      <FieldWrapper 
                        fieldName={`experience-${index}-company`} 
                        formData={formData} 
                        handleFieldVisibility={handleFieldVisibility}
                        disabled={!!profile && !isEditMode}
                      >
                        <Select
                          name="company"
                          label="Company"
                          value={exp.company}
                          onChange={(e) => handleDynamicChange("experience", index, e)}
                          options={COMPANIES}
                          defaultOption="Select Company"
                         disabled={!!profile && !isEditMode}
                        />
                      </FieldWrapper>
                    </div>

                    <div className="space-y-2">
                      <FieldWrapper 
                        fieldName={`experience-${index}-website`} 
                        formData={formData} 
                        handleFieldVisibility={handleFieldVisibility}
                     disabled={!!profile && !isEditMode}
                      >
                        <Input
                          name="website"
                          label="Company Website"
                          value={exp.website}
                          onChange={(e) => handleDynamicChange("experience", index, e)}
                         disabled={!!profile && !isEditMode}
                        />
                      </FieldWrapper>

                      <FieldWrapper 
                        fieldName={`experience-${index}-experienceFile`} 
                        formData={formData} 
                        handleFieldVisibility={handleFieldVisibility}
                      disabled={!!profile && !isEditMode}
                      >
                        <FileUploadButton
                          label="Upload Experience Letter"
                          onChange={(e) => handleDynamicFileChange("experience", index, e)}
                          disabled={!!profile && !isEditMode}
                        />
                      </FieldWrapper>

                      <FieldWrapper 
                        fieldName={`experience-${index}-jobFunctions`} 
                        formData={formData} 
                        handleFieldVisibility={handleFieldVisibility}
                         disabled={!!profile && !isEditMode}
                      >
                        <CheckboxGroup
                          legend="Job Functions"
                          options={JOB_FUNCTIONS}
                          selectedOptions={exp.jobFunctions}
                          onChange={(opt) => handleDynamicCheckboxChange("experience", index, "jobFunctions", opt)}
                          disabled={!!profile && !isEditMode}
                        />
                      </FieldWrapper>

                      <FieldWrapper 
                        fieldName={`experience-${index}-industry`} 
                        formData={formData} 
                        handleFieldVisibility={handleFieldVisibility}
                       disabled={!!profile && !isEditMode}
                      >
                        <Select
                          name="industry"
                          label="Industry"
                          value={exp.industry}
                          onChange={(e) => handleDynamicChange("experience", index, e)}
                          options={INDUSTRIES}
                          defaultOption="Select Industry"
                           disabled={!!profile && !isEditMode}
                        />
                      </FieldWrapper>
                    </div>
                  </div>
                </div>
              ))}

              {(!isEditMode && !profile) && (
                <button
                  type="button"
                  onClick={() => addNewEntry("experience")}
                  className="w-full py-2 px-3 bg-white text-[#f4793d] rounded hover:bg-blue-50 text-xs font-medium border border-dashed border-gray-200 flex items-center justify-center gap-1 hover:border-[#f4793d]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Experience
                </button>
              )}
            </div>
          </Section>

          {/* Submit Button */}
          {(isEditMode || !profile) && (
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2.5 bg-gradient-to-r from-[#f4793d] to-[#ff8748] text-white rounded hover:shadow transition-all text-sm font-semibold shadow flex items-center gap-1 ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  'Submitting...'
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {isEditMode ? 'Save Changes' : 'Complete Profile'}
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default function Home() {
  return <UserForm />;
}