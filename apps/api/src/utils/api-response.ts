export function apiResponse<T>(data: T, message = "Success") {
  return {
    success: true,
    message,
    data
  };
}
