import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useForm, useFieldArray } from 'react-hook-form'
import { useToast } from '../../hooks/useToast'
import { User, MapPin, Globe, Plus, Trash2, Linkedin, Github, Twitter, Instagram, Camera } from 'lucide-react'

const FreelancerProfile = () => {
  const { user, updateProfile } = useAuth()
  const { showSuccess, showError } = useToast()

  const [profileImage, setProfileImage] = useState(user?.profilePicture || null)
  const [imageFile, setImageFile] = useState(null)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setProfileImage(URL.createObjectURL(file))
    }
  }

  const { register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      title: user?.title || '',
      bio: user?.bio || '',
      skills: user?.skills?.join(', ') || '',
      hourlyRate: user?.hourlyRate || '',
      location: user?.location || '',
      website: user?.website || '',
      // Enhanced Fields
      socialLinks: {
        linkedin: user?.socialLinks?.linkedin || '',
        github: user?.socialLinks?.github || '',
        twitter: user?.socialLinks?.twitter || '',
        instagram: user?.socialLinks?.instagram || ''
      },
      resume: user?.resume || '',
      education: user?.education || [],
      experience: user?.experience || [],
      projects: user?.projects || []
    }
  })

  // Dynamic fields
  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
    control,
    name: "education"
  });

  const { fields: experienceFields, append: appendExperience, remove: removeExperience } = useFieldArray({
    control,
    name: "experience"
  });

  const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({
    control,
    name: "projects"
  });

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      // Append basic fields
      formData.append('name', data.name);
      formData.append('title', data.title);
      formData.append('bio', data.bio);
      formData.append('hourlyRate', data.hourlyRate);
      formData.append('location', data.location);
      formData.append('website', data.website);

      // Handle Profile Picture
      if (imageFile) {
        formData.append('profilePicture', imageFile);
      }

      // Handle skills
      formData.append('skills', data.skills);

      // Append complex objects as JSON strings
      formData.append('education', JSON.stringify(data.education));
      formData.append('experience', JSON.stringify(data.experience));
      formData.append('projects', JSON.stringify(data.projects));
      formData.append('socialLinks', JSON.stringify(data.socialLinks));

      // Handle Resume (Link)
      if (data.resume) {
        formData.append('resume', data.resume);
      }

      await updateProfile(formData);
      showSuccess('Profile updated successfully');
      // Optional: Setup a redirect or refresh user data if needed, 
      // but updateProfile in context usually updates 'user' state.
    } catch (error) {
      console.error(error);
      showError(error.response?.data?.message || 'Failed to update profile');
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>

        {/* Profile Image Upload */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <User size={64} />
                </div>
              )}
            </div>
            <label
              htmlFor="profile-upload"
              className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-primary-700 transition-colors"
            >
              <Camera size={20} />
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Info */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                {/* Name and Email are managed in account settings, not profile */}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Professional Title</label>
                <input
                  type="text"
                  {...register('title')}
                  placeholder="e.g. Senior Web Developer"
                  className="input-field mt-1"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <textarea
                  {...register('bio')}
                  rows={4}
                  className="input-field mt-1"
                  placeholder="Tell clients about yourself..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Resume Link (Google Drive, Dropbox, etc.)</label>
                <div className="mt-1">
                  <input
                    type="url"
                    {...register('resume')}
                    placeholder="https://drive.google.com/file/d/..."
                    className="input-field"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Paste a public link to your resume. Make sure sharing permissions are set to "Anyone with the link".
                  </p>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Skills (comma separated)</label>
                <input
                  type="text"
                  {...register('skills')}
                  placeholder="React, Node.js, Design..."
                  className="input-field mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Hourly Rate ($)</label>
                <input
                  type="number"
                  {...register('hourlyRate')}
                  className="input-field mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <div className="relative mt-1">
                  <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    {...register('location')}
                    className="input-field pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Portfolio Website</label>
                <div className="relative mt-1">
                  <Globe size={16} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="url"
                    {...register('website')}
                    className="input-field pl-10"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Social Links */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Social Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
                <div className="relative mt-1">
                  <Linkedin size={16} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="url"
                    {...register('socialLinks.linkedin')}
                    className="input-field pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">GitHub</label>
                <div className="relative mt-1">
                  <Github size={16} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="url"
                    {...register('socialLinks.github')}
                    className="input-field pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Twitter</label>
                <div className="relative mt-1">
                  <Twitter size={16} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="url"
                    {...register('socialLinks.twitter')}
                    className="input-field pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Instagram</label>
                <div className="relative mt-1">
                  <Instagram size={16} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="url"
                    {...register('socialLinks.instagram')}
                    className="input-field pl-10"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Education */}
          <section className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Education</h2>
              <button
                type="button"
                onClick={() => appendEducation({ institution: '', degree: '', startYear: '', endYear: '' })}
                className="text-primary-600 hover:text-primary-700 flex items-center text-sm font-medium"
              >
                <Plus size={16} className="mr-1" /> Add Education
              </button>
            </div>

            <div className="space-y-6">
              {educationFields.map((field, index) => (
                <div key={field.id} className="p-4 bg-gray-50 rounded-lg relative">
                  <button
                    type="button"
                    onClick={() => removeEducation(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-500">Institution</label>
                      <input
                        {...register(`education.${index}.institution`)}
                        className="input-field mt-1"
                        placeholder="University Name"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">Degree</label>
                      <input
                        {...register(`education.${index}.degree`)}
                        className="input-field mt-1"
                        placeholder="B.Sc Computer Science"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">Start Year</label>
                      <input
                        type="number"
                        {...register(`education.${index}.startYear`)}
                        className="input-field mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">End Year</label>
                      <input
                        type="number"
                        {...register(`education.${index}.endYear`)}
                        className="input-field mt-1"
                      />
                    </div>
                  </div>
                </div>
              ))}
              {educationFields.length === 0 && <p className="text-gray-500 text-sm italic">No education added yet.</p>}
            </div>
          </section>

          {/* Experience */}
          <section className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Work Experience</h2>
              <button
                type="button"
                onClick={() => appendExperience({ title: '', company: '', startDate: '', endDate: '', description: '' })}
                className="text-primary-600 hover:text-primary-700 flex items-center text-sm font-medium"
              >
                <Plus size={16} className="mr-1" /> Add Experience
              </button>
            </div>

            <div className="space-y-6">
              {experienceFields.map((field, index) => (
                <div key={field.id} className="p-4 bg-gray-50 rounded-lg relative">
                  <button
                    type="button"
                    onClick={() => removeExperience(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-500">Job Title</label>
                      <input
                        {...register(`experience.${index}.title`)}
                        className="input-field mt-1"
                        placeholder="Software Engineer"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">Company</label>
                      <input
                        {...register(`experience.${index}.company`)}
                        className="input-field mt-1"
                        placeholder="Company Name"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">Start Date</label>
                      <input
                        type="date"
                        {...register(`experience.${index}.startDate`)}
                        className="input-field mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">End Date</label>
                      <input
                        type="date"
                        {...register(`experience.${index}.endDate`)}
                        className="input-field mt-1"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-medium text-gray-500">Description</label>
                      <textarea
                        {...register(`experience.${index}.description`)}
                        rows={3}
                        className="input-field mt-1"
                        placeholder="Describe your responsibilities..."
                      />
                    </div>
                  </div>
                </div>
              ))}
              {experienceFields.length === 0 && <p className="text-gray-500 text-sm italic">No working experience added yet.</p>}
            </div>
          </section>

          {/* Projects */}
          <section className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Projects</h2>
              <button
                type="button"
                onClick={() => appendProject({ title: '', link: '', description: '' })}
                className="text-primary-600 hover:text-primary-700 flex items-center text-sm font-medium"
              >
                <Plus size={16} className="mr-1" /> Add Project
              </button>
            </div>

            <div className="space-y-6">
              {projectFields.map((field, index) => (
                <div key={field.id} className="p-4 bg-gray-50 rounded-lg relative">
                  <button
                    type="button"
                    onClick={() => removeProject(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-500">Project Title</label>
                      <input
                        {...register(`projects.${index}.title`)}
                        className="input-field mt-1"
                        placeholder="Project Name"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">Project Link</label>
                      <input
                        type="url"
                        {...register(`projects.${index}.link`)}
                        className="input-field mt-1"
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">Description</label>
                      <textarea
                        {...register(`projects.${index}.description`)}
                        rows={3}
                        className="input-field mt-1"
                        placeholder="Describe what you built..."
                      />
                    </div>
                  </div>
                </div>
              ))}
              {projectFields.length === 0 && <p className="text-gray-500 text-sm italic">No projects added yet.</p>}
            </div>
          </section>

          <div className="flex justify-end pt-4 bg-white p-4 sticky bottom-0 border-t z-10">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary px-8"
            >
              {isSubmitting ? 'Saving...' : 'Save Profile Dashboard'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FreelancerProfile
