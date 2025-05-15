export const errorHandle = (
  error: object,
  fileName: string,
  feature: string,
  errorMessage: string
): void => {
  console.error({
    error: error,
    "File : ": fileName,
    "Feature ": feature,
    "Message ": errorMessage,
  });
};
