export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/register',
    ME: '/user/me',
    UPDATE_LEVEL: '/user/level',
  },
  USER: {
    PROFILE: '/user/profile',
  },
  PROGRESS: {
    GET_ALL: '/progress',
    UPDATE: '/progress/update-progress',
    RESUME: '/progress/resume',
  },
  EXECUTE: {
    RUN: '/execute',
    VERIFY: '/execute/verify',
  },
  ADMIN: {
    STATS: '/admin/stats',
    GROWTH: '/admin/stats/growth',
    TOP_LEARNERS: '/admin/stats/top-learners',
    USERS: '/admin/users',
    INQUIRIES: '/admin/inquiries',
    REPLY_INQUIRY: (id) => `/admin/inquiries/${id}/reply`,
    BROADCAST_EMAIL: '/admin/broadcast/email',
    ANNOUNCEMENTS: '/admin/announcements',
    AUDIT_LOG: '/admin/audit-log',
  }
};
