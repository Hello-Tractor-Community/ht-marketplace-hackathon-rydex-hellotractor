// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getErrorMessage = (error: any, defaultMessage: string) => {
  return (
    error.response?.data?.data?.message ??
    error.response?.data?.message ??
    error.message ??
    defaultMessage
  );
};

export default getErrorMessage;
