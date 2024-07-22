const enum HttpErrorMessage {
    /* General */
    INTERNAL_SERVER_ERROR_MESSAGE = 'Internal server error',
    MODEL_NOT_FOUND = 'Model not found',
    MULTER_ERROR = 'Multer error',
    FILE_NOT_FOUND = 'File not found',
    IMAGE_UPLOAD_FAIL = 'Image upload fails',
    NO_ROLE_ASSIGNED = 'No role assigned to the user.',
    NO_AIRPORT_TERMINAL_ASSIGNED = 'No airport or terminal assigned to the user.',
    SUPER_ADMIN_ACCESS = 'You are not authorized as superadmin.',
    ADMIN_ACCESS = 'You are not authorized as superadmin or admin.',
    UNABLE_TO_LOAD_ICON_LIST = 'Unable to load icons.',
    NO_URL_MATCHED = 'No URL matched.',
    LOGOUT_FAILED = 'Logout failed.',
    LIST_SIZE_EXCEPTION = 'List size too big, please provide a smaller filter range.',
    CONFIG_MASTER_CONSTANT_MISSING = 'config master constant missing from DB.',
    INCORRECT_CONFIG_MASTER_CONSTANT = 'Incorrect config master value.',
    EMAIL_GATEWAY_ERROR = 'Error occurred while sending email.',
    SMS_GATEWAY_ERROR = 'Error occurred while sending SMS.',
    API_ENDPOINT_NOT_FOUND = 'API endpoint not found',
    USER_EXPIRY_PARAMETER_MISSING = 'User expiry period missing from config master.',
    CHECK_USER_PASSWORD_EXPIRY_PARAMETER_MISSING = 'User expiry period check missing from config master.',

    /* Token */
    TOKEN_NOT_FOUND = 'Please provide a valid token to access api endpoint.',
    TOKEN_MALFORMED = 'Please authenticate with a valid token',

    /* Role */
    ROLE_EXIST = 'Role already exists with similar name.',
    ROLE_NOT_FOUND = 'Role not found.',
    INVALID_ID = 'ID is not of type number.',

    /* User */
    USER_EXIST_WITH_SAME_ROLE = 'Cannot inactivate User role. Active Users exist.',
    USER_EXIST = 'User already exists with a similar username.',
    USER_NOT_FOUND = 'User not found.',
    USER_NOT_ASSOCITED_WITH_ATRS = 'User does not have access to the provided ATRS.',
    USER_NOT_ASSOCITED_WITH_AIRPORT = 'User does not have access to the provided airport.',
    USER_NOT_ASSOCITED_WITH_TERMINAL = 'User does not have access to the provided terminal.',
    USER_DELETED = 'The user has been deleted. Please contact the administrator.',
    USER_FORBIDDEN = 'You do not have the priviliges to perform actions on this user. Please contact superadmin. ',
    NO_USERS_FOUND = 'No users found.',
    USER_FILTER = 'You do not have access priviliges to provide filter for this User. Please contact superadmin. ',
    SAME_PASSWORD_SUPPLIED = 'Please provide a different password.',
    CANNOT_RESET_SUPER_ADMIN_PWD = 'Can not reset super admin password.',
    USER_NOT_FOUND_MOBILE_NUMBER = 'Mobile number associated with this account was not found. Please contact superadmin.',
    EMAIL_NOT_CONFIGURED = 'Email is not configured for provided user.',
    SMS_NOT_CONFIGURED = 'SMS is not configured for provided user.',
    USER_LOCKED = 'User is locked, Please try again later or please contact your admin.',

    /* User-session */
    USER_SESSION_DOES_NOT_EXIST = 'No user session found. Please login again.',

    /* apart from login-apis do not use this message anywhere else for status code USER_SESSION_EXIST*/
    USER_SESSION_EXIST = 'A user session exists with the provided login credentials, Do you want to clear the session, And move forward with the login process?',

    /* Login */
    INVALID_CREDENTIALS = 'Invalid username or password.',
    UPDATE_PASSWORD = 'You need to update your password.',
    CHANGE_PASSWORD_ERROR = 'New password must be different from the existing password.',
    INVALID_OTP = 'Invalid OTP',
    OTP_EXPIRED = 'OTP has expired.',
    INCORRECT_OLD_PASSWORD = 'Incorrect old password.',
    SIGNOUT_FAIL = 'Sign-out failed.',
    PASSWORD_NOT_SET = 'You are logging in for the first time. Please check your email for your temporary password.',
    INVALID_OTP_REQUEST = 'OTP has been already sent. Please wait for a minute to resend new OTP.',

    /* Airport */
    AIPRORT_EXIST = 'Airport already exists with similar name.',
    AIPRORT_EXIST_CODE = 'Airport Code already exists with similar name.',
    AIRPORT_NOT_FOUND = 'Airport not found.',
    AIRPORT_NOT_DELETED = 'Cannot inactivate airport. Active terminals exist.',
    INVALID_AIRPORT_ID = 'Airport Id is not of type number.',
    UNABLE_TO_FETCH_AIRPORT_LIST = 'Unable to fetch airport list.',

    /* Terminal */
    TERMINAL_EXIST = 'Terminal already exists with the similar name.',
    TERMINAL_NOT_FOUND = 'Terminal not found.',
    TERMINAL_NOT_FOUND_FOR_THE_PROVIDED_ATRS_ID = 'Terminal not found for the provided ATRS.',
    TERMINAL_NOT_FOUND_FOR_PROVIDED_AIRPORT = 'Terminal not found for the provided airport.',
    TERMINAL_NOT_DELETED = 'Cannot inactivate terminal. Active ATRS machines exist.',
    INVALID_TERMINAL_ID = 'Provided terminal ID is either missing or incorrect.',

    /* Atrs */
    ATRS_EXIST = 'ATRS already exists with similar names.',
    ATRS_NOT_FOUND = 'ATRS not found.',
    ATRS_NOT_DELETED = 'Cannot inactivate ATRS. Active DFMD exists.',
    ATRS_FORBIDDEN = 'You do not have access priviliges to view this ATRS. Please contact superadmin.',

    /* Bag */
    BAGRECORD_EXIST = 'Bag record already exists with the similar name.',
    BAGRECORD_NOT_FOUND = 'Bag record not found.',
    IMAGE_PATH_EXIST = 'Icon category already exists.',

    /* Lag */
    LAGRECORD_EXIST = 'Lag record already exists with the similar name.',
    LAGRECORD_NOT_FOUND = 'Lag record not found.',
    INVALID_INCIDENT_AUTHORIZATION = 'You are not an operator, you cannot create incidents.',

    /* Incident */
    INCIDENT_EXIST = 'Incident already exists with the similar name.',
    INCIDENT_LIST_NOT_FOUND = 'Unable to fetch incident record list.',
    INVALID_TYPE_ID = 'Invalid type id for given category type.',
    INVALID_CATEGORY_TYPE = 'Invalid category type.',
    DUPLICATE_IMAGE = 'Incident details record with same image path already exists.',
    INVALID_INCIDENT_DATA = 'Invalid incident data.',
    UNABLE_TO_CREATE_INCIDENT = 'Unable to create incident, Please check if you have access to this ATRS or file selected to upload is present (minimum 1 file required).',
    INVALID_FILE_EXTENSION = 'Invalid file extension, please provide a valid file.',
    INCIDENT_DETAILS_AND_FILES_NOT_IN_SYNC = 'Provided incident details and images are not in sync. Please check if correct images are uploaded.',
    INCORRECT_INCIDENT_JSON = 'Incorrect incident JSON.',
    INCIDENT_OR_EVIDENCE_DOES_NOT_EXIST = 'Incident or evidence id does not exist.',
    UNABLE_TO_DELETE_INCIDENT = 'User does not have privilege to delete this incident.',
    UNABLE_TO_VIEW_INCIDENT = 'User does not have privilege to view this incident.',
    NO_INCIDENT_FOUND_BY_ID = 'No incident found with the provided id.',
    NO_INCIDENT_ID_PROVIDED = 'Please provide incident id to be deleted.',
    INCIDENT_ATRS_ASSOCIATION_INVALID = 'User does not have the privilige to create incident on the provided ATRS. Please contact superadmin.',
    USER_NOT_ASSOCITED_WITH_INCIDENT = 'User does not have access to the provided incident.',

    /* Device history*/
    DATA_NOT_FOUND = 'No data for this selection.',
    MISSING_PARAMETRS = 'Missing parameters. Please provide all required parameters.',
    SMITH_RETRY_MECHANISM = 'Unable to perform retry mechanism for smith, please contact the admin.',

    /* Dfmd*/
    DFMD_EXIST = 'DFMD exists with similar name for specified airport, terminal and ATRS.',
    DFMD_NOT_FOUND = 'DFMD record not found for the specified id.',

    /* Incident dashboard */
    USER_ID_BASED_FILTER = 'You are not an admin, you cannot provide filter based on user id.',
    INVALID_ADMIN_ACCESS_TO_VIEW_USER_CREATED_INCIDENTS = 'Admin does not have access to view incidents created by this user.',
    API_ROUTE_FORBIDDEN = 'You do not have necessary privilige to access this resource. Please contact the superadmin. ',

    /* Master Management */
    INCORRECT_DATA_TYPE_FOR_MODEL_ID = 'Model ID is not of type number.',

    /* Lvl1 cat master */
    LVL1Cat_MASTER_RECORD_EXIST = 'Level 1 cat master record exists with same name.',
    LVL2Cat_MASTER_RECORD_EXIST = 'Level 2 cat master record exists with same name and Level 1 id.',
    LVL3Cat_MASTER_RECORD_EXIST = 'Level 3 cat master record exists with same name, Level 1 id and Level 2 id.',
    LVL4Cat_MASTER_RECORD_EXIST = 'Level 4 cat master record exists with same name, Level 1 id , Level 2 id and Level 3 id.',
    CONFIG_MASTER_RECORD_EXIST = 'Config master record exists with same key.',
    LVL1Cat_MASTER_RECORD_NOT_FOUND = 'Level 1 cat master record not found with provided id.',
    LVL2Cat_MASTER_RECORD_NOT_FOUND = 'Level 2 cat master record not found with provided id.',
    LVL3Cat_MASTER_RECORD_NOT_FOUND = 'Level 3 cat master record not found with provided id.',
    LVL4Cat_MASTER_RECORD_NOT_FOUND = 'Level 4 cat master record not found with provided id.',
    CONFIG_MASTER_RECORD_NOT_FOUND = 'Config master record not found with provided id.',
    CANNOT_DELETE_LVL1Cat_MASTER_RECORD = 'Cannot inactivate Level 1 cat master record. Active Level 2 cat master record exist.',
    CANNOT_DELETE_LVL2Cat_MASTER_RECORD = 'Cannot inactivate Level 2 cat master record. Active Level 3 cat master record exist.',
    CANNOT_DELETE_LVL3Cat_MASTER_RECORD = 'Cannot inactivate Level 3 cat master record. Active Level 4 cat master record exist.',
    MISSING_LVL1Cat_Master_ID = 'Missing Level 1 cat master id',
    MISSING_LVL2Cat_Master_ID = 'Missing Level 2 cat master id',
    MISSING_LVL3Cat_Master_ID = 'Missing Level 3 cat master id',

    /* airline master */
    UNABLE_TO_ADD_RECORD_IN_AIRLINE_MASTER = 'Unable to add new entry in airline master.',

    /* encryption */
    RSA_DECRYPT_ERROR = 'Error decrypting RSA message.',
    AES_ENCRYPT_ERROR = 'Error encrypting message using AES.',
    AES_DECRYPT_ERROR = 'Error decrypting AES message.'
}
export default HttpErrorMessage;
