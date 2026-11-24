"""Errors raised by services and turned into HTTP responses by the API."""


class ServiceError(Exception):
    """A rule was broken. `message` is shown to the user as-is."""

    def __init__(self, message: str, status_code: int = 400):
        super().__init__(message)
        self.message = message
        self.status_code = status_code


class NotFound(ServiceError):
    def __init__(self, message: str = 'Not found.'):
        super().__init__(message, 404)
