const enum HttpSuccessMessage {
    /* Master management */
    GET_ALL_RECORDS = 'Records retrived successfully.',
    RECORD_CREATED = 'Record created successfully.',
    RECORD_UPDATED = 'Record updated successfully.',
    GET_RECORD = 'Record retrived successfully',
    DELETE_RECORD = 'Record deleted successfully',

    /* Authentication */
    LOGIN_SUCCESS = 'User logged in successfully.',
    LOGOUT_SUCCESS = 'Loged out successfully.',
    PASSWORD_RESET_SUCCESS = 'Password has been reset successfully.',
    OTP_VERIFICATION_SUCCESS = 'OTP verified successfully.',
    OTP_SENT_ON_EMAIL = 'OTP has been sent to your email address successfully.',
    OTP_SENT_ON_MOBILE_NUMBER = 'OTP has been sent to your mobile number successfully.',
    PASSWORD_CHANGED_SUCCESS = 'Password changed successfully.',
    PASSWORD_UPDATE_SUCCESS = 'Password updated successfully.',
    UPDATE_PASSWORD_AND_EXPIRY_PERIOD = 'Your password has expired. You need to update your password.',

    /* User */
    LOCK_REMOVED_SUCCESSFULLY = 'User lock removed successfully.',

    /* Atrs */
    ATRS_RECORD = 'ATRS machine details retrieved successfully.',
    GET_ALL_ATRS_BY_TERMINAL_ID_SUCCESS = 'ATRS by terminal Id retrieved successfully.',

    /* Dashboard */
    GET_ALL_DATA_STATASTICS = 'Data retrived successfully',
    SMITH_RETRY_MECHANISM = 'Retry mechanism successfully finished for SMITH.',
    PESC_DASHBOARD = 'Dashboard data retrieved successfully.',

    /* Access token */
    GENERATE_ACCESS_TOKEN = 'Access token generated successfully.',

    /* Incident master */
    GET_CAT_MASTER_HIERARCHY = 'Cat master hierarchy successfully fetched.',
    GET_CONTENT_LIST = 'Content list successfully fetched.',

    /* User session */
    USER_SESSION_CLEARED_SUCCESSFULLY = 'User session has been cleared successfully'
}

export default HttpSuccessMessage;
