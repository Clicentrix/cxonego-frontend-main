export const errorHandle = (error, fileName, feature, errorMessage) => {
    console.error({
        error: error,
        "File : ": fileName,
        "Feature ": feature,
        "Message ": errorMessage,
    });
};
