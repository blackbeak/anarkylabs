// src/components/svg.js
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faHandshake, 
  faNewspaper, 
  faPlay, 
  faComments, 
  faArrowRight,
  faUsers,
  faBuilding,
  faStar,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons'

// Main icons for your sections
export const HandshakeIconPro = ({ className = "w-8 h-8", ...props }) => (
  <FontAwesomeIcon icon={faHandshake} className={className} {...props} />
)

export const NewspaperIcon = ({ className = "w-8 h-8", ...props }) => (
  <FontAwesomeIcon icon={faNewspaper} className={className} {...props} />
)

// CTA Section icons
export const BuyNowIcon = ({ className = "w-6 h-6", ...props }) => (
  <FontAwesomeIcon icon={faPlay} className={className} {...props} />
)

export const TalkToSalesIcon = ({ className = "w-6 h-6", ...props }) => (
  <FontAwesomeIcon icon={faComments} className={className} {...props} />
)

export const StartTrialIcon = ({ className = "w-6 h-6", ...props }) => (
  <FontAwesomeIcon icon={faArrowRight} className={className} {...props} />
)

// Alternative icons you might want to use
export const UsersIcon = ({ className = "w-6 h-6", ...props }) => (
  <FontAwesomeIcon icon={faUsers} className={className} {...props} />
)

export const BuildingIcon = ({ className = "w-6 h-6", ...props }) => (
  <FontAwesomeIcon icon={faBuilding} className={className} {...props} />
)

export const StarIcon = ({ className = "w-6 h-6", ...props }) => (
  <FontAwesomeIcon icon={faStar} className={className} {...props} />
)

// Contact/utility icons
export const EmailIcon = ({ className = "w-6 h-6", ...props }) => (
  <FontAwesomeIcon icon={faEnvelope} className={className} {...props} />
)

export const PhoneIcon = ({ className = "w-6 h-6", ...props }) => (
  <FontAwesomeIcon icon={faPhone} className={className} {...props} />
)

export const LocationIcon = ({ className = "w-6 h-6", ...props }) => (
  <FontAwesomeIcon icon={faMapMarkerAlt} className={className} {...props} />
)

export const CheckIcon = ({ className = "w-6 h-6", ...props }) => (
  <FontAwesomeIcon icon={faCheckCircle} className={className} {...props} />
)