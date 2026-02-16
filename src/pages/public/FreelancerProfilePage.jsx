import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { usersApi } from '../../api/users'
import { gigsApi } from '../../api/gigs'
import { reviewsApi } from '../../api/reviews'
import { useToast } from '../../hooks/useToast'
import {
  User,
  Star,
  Briefcase,
  MapPin,
  Calendar,
  CheckCircle,
  MessageSquare,
  Award
} from 'lucide-react'
import RatingStars from '../../components/common/RatingStars'
import GigCard from '../../components/gigs/GigCard'
import ReviewCard from '../../components/reviews/ReviewCard'

const FreelancerProfilePage = () => {
  const { id } = useParams()
  const { showError } = useToast()

  const [freelancer, setFreelancer] = useState(null)
  const [gigs, setGigs] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFreelancerData()
  }, [id])

  const fetchFreelancerData = async () => {
    try {
      setLoading(true)

      // Fetch freelancer info
      const freelancerData = await usersApi.getFreelancerById(id)
      setFreelancer(freelancerData.freelancer)

      // Fetch freelancer's gigs
      const gigsData = await gigsApi.getAll({ freelancer: id })
      setGigs(gigsData.gigs || [])

      // Fetch reviews
      const reviewsData = await reviewsApi.getFreelancerReviews(id)
      setReviews(reviewsData.reviews || [])

    } catch (error) {
      showError('Failed to load freelancer profile')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!freelancer) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-600 mb-4">Freelancer not found</h2>
        <p className="text-gray-500">The freelancer you're looking for doesn't exist.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {freelancer.profilePicture ? (
              <img
                src={freelancer.profilePicture}
                alt={freelancer.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center border-4 border-white shadow-lg">
                <User size={64} className="text-primary-600" />
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold">{freelancer.name}</h1>
                <div className="flex items-center mt-2">
                  <RatingStars rating={freelancer.rating} size={20} />
                  <span className="ml-3 text-gray-600">
                    {freelancer.rating.toFixed(1)} ({freelancer.totalReviews} reviews)
                  </span>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <button className="btn-primary flex items-center">
                  <MessageSquare size={20} className="mr-2" />
                  Contact
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">{gigs.length}</div>
                <div className="text-sm text-gray-600">Services</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">{freelancer.totalReviews}</div>
                <div className="text-sm text-gray-600">Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">100%</div>
                <div className="text-sm text-gray-600">Response Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">24h</div>
                <div className="text-sm text-gray-600">Avg Response</div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Skills & Social */}
        <div className="space-y-8">
          {/* Bio */}
          {freelancer.bio && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">About Me</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{freelancer.bio}</p>
            </div>
          )}

          {/* Skills */}
          {freelancer.skills && freelancer.skills.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {freelancer.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Social Links & Resume */}
          {(freelancer.socialLinks || freelancer.resume) && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Connect</h2>
              <div className="space-y-4">
                {freelancer.resume && (
                  <a
                    href={freelancer.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-primary-600 hover:text-primary-700 font-medium"
                  >
                    <Briefcase size={20} className="mr-2" /> View Resume
                  </a>
                )}
                {freelancer.website && (
                  <a
                    href={freelancer.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-600 hover:text-primary-600"
                  >
                    <MapPin size={20} className="mr-2" /> Website
                  </a>
                )}
                {freelancer.socialLinks?.linkedin && (
                  <a href={freelancer.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 hover:text-[#0077b5]">
                    <span className="w-5 h-5 mr-2 flex items-center justify-center font-bold">in</span> LinkedIn
                  </a>
                )}
                {freelancer.socialLinks?.github && (
                  <a href={freelancer.socialLinks.github} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 hover:text-black">
                    <span className="w-5 h-5 mr-2 flex items-center justify-center font-bold">Gh</span> GitHub
                  </a>
                )}
                {freelancer.socialLinks?.twitter && (
                  <a href={freelancer.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 hover:text-[#1DA1F2]">
                    <span className="w-5 h-5 mr-2 flex items-center justify-center font-bold">X</span> Twitter
                  </a>
                )}
                {freelancer.socialLinks?.instagram && (
                  <a href={freelancer.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 hover:text-[#E1306C]">
                    <span className="w-5 h-5 mr-2 flex items-center justify-center font-bold">Ig</span> Instagram
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Education */}
          {freelancer.education && freelancer.education.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Education</h2>
              <div className="space-y-6">
                {freelancer.education.map((edu, index) => (
                  <div key={index} className="relative pl-6 border-l-2 border-gray-100 last:mb-0">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary-100 border-2 border-white"></div>
                    <h3 className="font-semibold text-gray-900">{edu.institution}</h3>
                    <p className="text-sm text-gray-600 mb-1">{edu.degree}</p>
                    <p className="text-xs text-gray-500">{edu.startYear} - {edu.endYear}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Services, Projects, Work Experience, Reviews */}
        <div className="lg:col-span-2 space-y-8">
          {/* Work Experience */}
          {freelancer.experience && freelancer.experience.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6">Work Experience</h2>
              <div className="space-y-8">
                {freelancer.experience.map((exp, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="mt-1">
                      <Briefcase size={24} className="text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{exp.title}</h3>
                      <div className="text-primary-600 font-medium mb-1">{exp.company}</div>
                      <div className="text-sm text-gray-500 mb-3">
                        {new Date(exp.startDate).getFullYear()} - {exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present'}
                      </div>
                      {exp.description && (
                        <p className="text-gray-600 text-sm leading-relaxed">{exp.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {freelancer.projects && freelancer.projects.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6">Portfolio Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {freelancer.projects.map((project, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.description}</p>
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-primary-600 text-sm font-medium hover:underline">
                        View Project &rarr;
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Services Section */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Services Offered</h2>
              <span className="text-gray-600">{gigs.length} services</span>
            </div>

            {gigs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {gigs.slice(0, 6).map(gig => (
                  <GigCard key={gig._id} gig={gig} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <Briefcase className="mx-auto mb-4 text-gray-400" size={48} />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No services yet</h3>
                <p className="text-gray-500">This freelancer hasn't created any services yet.</p>
              </div>
            )}
          </div>

          {/* Reviews Section */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Reviews ({reviews.length})</h2>

            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.slice(0, 5).map(review => (
                  <ReviewCard key={review._id} review={review} />
                ))}

                {reviews.length > 5 && (
                  <div className="text-center">
                    <button className="btn-outline">
                      Load More Reviews
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <Star className="mx-auto mb-4 text-gray-400" size={48} />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No reviews yet</h3>
                <p className="text-gray-500">This freelancer hasn't received any reviews yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FreelancerProfilePage