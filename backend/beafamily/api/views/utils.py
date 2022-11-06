import enum


class HttpStatus(enum.IntEnum):
    BAD_REQUEST = 400
    UNAUTHORIZED = 401
    FORBIDDEN = 403
    NOT_FOUND = 404
    NOT_ALLOWED = 405
    OK = 200
    CREATED = 201
    ACCEPTED = 202
    NO_CONTENT = 204
