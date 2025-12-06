/**
 * Centralized configuration for the Consultant Tracker frontend application.
 * 
 * All configuration variables are defined here and can be overridden via environment variables.
 */

// ============================================================================
// API CONFIGURATION
// ============================================================================
export const API_CONFIG = {
    BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
    TIMEOUT: parseInt(process.env.REACT_APP_API_TIMEOUT || '30000', 10), // 30 seconds
};

// ============================================================================
// AUTHENTICATION CONFIGURATION
// ============================================================================
export const AUTH_CONFIG = {
    TOKEN_STORAGE_KEY: 'token',
    USER_STORAGE_KEY: 'user',
    TOKEN_HEADER_PREFIX: 'Bearer',
};

// ============================================================================
// ROUTING CONFIGURATION
// ============================================================================
export const ROUTES = {
    // Public routes
    LOGIN: '/login',
    REGISTER: '/register',

    // Consultant routes
    CONSULTANT_DASHBOARD: '/consultant/dashboard',
    CONSULTANT_PROFILE: '/consultant/profile',
    CONSULTANT_JOBS: '/consultant/jobs',
    CONSULTANT_APPLICATIONS: '/consultant/applications',

    // Recruiter routes
    RECRUITER_DASHBOARD: '/recruiter/dashboard',
    RECRUITER_CONSULTANTS: '/recruiter/consultants',
    RECRUITER_JDS: '/recruiter/jds',
    RECRUITER_SUBMISSIONS: '/recruiter/submissions',

    // Common
    HOME: '/',
};

// ============================================================================
// USER ROLES
// ============================================================================
export const USER_ROLES = {
    ADMIN: 'ADMIN',
    CONSULTANT: 'CONSULTANT',
    RECRUITER: 'RECRUITER',
};

// ============================================================================
// FILE UPLOAD CONFIGURATION
// ============================================================================
export const FILE_UPLOAD_CONFIG = {
    MAX_SIZE: parseInt(process.env.REACT_APP_MAX_UPLOAD_SIZE || '10485760', 10), // 10MB
    ALLOWED_RESUME_TYPES: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    ALLOWED_RESUME_EXTENSIONS: ['.pdf', '.doc', '.docx'],
};

// ============================================================================
// UI CONFIGURATION
// ============================================================================
export const UI_CONFIG = {
    // Pagination
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [5, 10, 25, 50, 100],

    // Notifications/Toasts
    TOAST_DURATION: 3000, // 3 seconds

    // Debounce delays
    SEARCH_DEBOUNCE_MS: 300,

    // Date formats
    DATE_FORMAT: 'MMM DD, YYYY',
    DATETIME_FORMAT: 'MMM DD, YYYY HH:mm',
};

// ============================================================================
// JOB/SUBMISSION STATUS CONSTANTS
// ============================================================================
export const JOB_STATUS = {
    OPEN: 'OPEN',
    CLOSED: 'CLOSED',
    ON_HOLD: 'ON_HOLD',
};

export const SUBMISSION_STATUS = {
    SUBMITTED: 'SUBMITTED',
    UNDER_REVIEW: 'UNDER_REVIEW',
    INTERVIEW_SCHEDULED: 'INTERVIEW_SCHEDULED',
    OFFERED: 'OFFERED',
    REJECTED: 'REJECTED',
    WITHDRAWN: 'WITHDRAWN',
};

// Status display labels
export const JOB_STATUS_LABELS = {
    [JOB_STATUS.OPEN]: 'Open',
    [JOB_STATUS.CLOSED]: 'Closed',
    [JOB_STATUS.ON_HOLD]: 'On Hold',
};

export const SUBMISSION_STATUS_LABELS = {
    [SUBMISSION_STATUS.SUBMITTED]: 'Submitted',
    [SUBMISSION_STATUS.UNDER_REVIEW]: 'Under Review',
    [SUBMISSION_STATUS.INTERVIEW_SCHEDULED]: 'Interview Scheduled',
    [SUBMISSION_STATUS.OFFERED]: 'Offered',
    [SUBMISSION_STATUS.REJECTED]: 'Rejected',
    [SUBMISSION_STATUS.WITHDRAWN]: 'Withdrawn',
};

// Status colors for UI
export const SUBMISSION_STATUS_COLORS = {
    [SUBMISSION_STATUS.SUBMITTED]: 'info',
    [SUBMISSION_STATUS.UNDER_REVIEW]: 'warning',
    [SUBMISSION_STATUS.INTERVIEW_SCHEDULED]: 'primary',
    [SUBMISSION_STATUS.OFFERED]: 'success',
    [SUBMISSION_STATUS.REJECTED]: 'error',
    [SUBMISSION_STATUS.WITHDRAWN]: 'default',
};

export const JOB_STATUS_COLORS = {
    [JOB_STATUS.OPEN]: 'success',
    [JOB_STATUS.CLOSED]: 'error',
    [JOB_STATUS.ON_HOLD]: 'warning',
};

// ============================================================================
// VALIDATION RULES
// ============================================================================
export const VALIDATION = {
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PASSWORD_MIN_LENGTH: 8,
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 100,
    PHONE_REGEX: /^[\d\s\-\+\(\)]+$/,
};

// ============================================================================
// APPLICATION METADATA
// ============================================================================
export const APP_CONFIG = {
    NAME: 'Consultant Tracker',
    VERSION: '1.0.0',
    DESCRIPTION: 'Consultant and Recruiter Management System',
};

// ============================================================================
// ENVIRONMENT
// ============================================================================
export const ENVIRONMENT = {
    IS_PRODUCTION: process.env.NODE_ENV === 'production',
    IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
    NODE_ENV: process.env.NODE_ENV || 'development',
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get the full API URL for an endpoint
 * @param {string} endpoint - The API endpoint (e.g., '/auth/login')
 * @returns {string} Full API URL
 */
export const getApiUrl = (endpoint) => {
    const baseUrl = API_CONFIG.BASE_URL.replace(/\/$/, ''); // Remove trailing slash
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${baseUrl}${cleanEndpoint}`;
};

/**
 * Validate file for upload
 * @param {File} file - The file to validate
 * @returns {{valid: boolean, error: string|null}}
 */
export const validateResumeFile = (file) => {
    if (!file) {
        return { valid: false, error: 'No file selected' };
    }

    // Check file size
    if (file.size > FILE_UPLOAD_CONFIG.MAX_SIZE) {
        const maxSizeMB = FILE_UPLOAD_CONFIG.MAX_SIZE / (1024 * 1024);
        return { valid: false, error: `File size must be less than ${maxSizeMB}MB` };
    }

    // Check file type
    if (!FILE_UPLOAD_CONFIG.ALLOWED_RESUME_TYPES.includes(file.type)) {
        const allowedExtensions = FILE_UPLOAD_CONFIG.ALLOWED_RESUME_EXTENSIONS.join(', ');
        return { valid: false, error: `Only ${allowedExtensions} files are allowed` };
    }

    return { valid: true, error: null };
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
    return VALIDATION.EMAIL_REGEX.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {{valid: boolean, error: string|null}}
 */
export const validatePassword = (password) => {
    if (!password || password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
        return {
            valid: false,
            error: `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`
        };
    }
    return { valid: true, error: null };
};

// Log configuration on module load (development only)
if (ENVIRONMENT.IS_DEVELOPMENT) {
    console.log('📋 Configuration loaded:', {
        API_BASE_URL: API_CONFIG.BASE_URL,
        ENVIRONMENT: ENVIRONMENT.NODE_ENV,
    });
}

export default {
    API_CONFIG,
    AUTH_CONFIG,
    ROUTES,
    USER_ROLES,
    FILE_UPLOAD_CONFIG,
    UI_CONFIG,
    JOB_STATUS,
    SUBMISSION_STATUS,
    JOB_STATUS_LABELS,
    SUBMISSION_STATUS_LABELS,
    SUBMISSION_STATUS_COLORS,
    JOB_STATUS_COLORS,
    VALIDATION,
    APP_CONFIG,
    ENVIRONMENT,
    getApiUrl,
    validateResumeFile,
    isValidEmail,
    validatePassword,
};
