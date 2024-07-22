const enum MiddlewareType {
    /* short_hand_token is used for any authenticated activities which happens outside normal application login. */
    SHORT_HAND_TOKEN = 'short_hand_token',
    ACCESS_TOKEN = 'token',
    REFRESH_TOKEN = 'refresh_token'
}
export default MiddlewareType;
