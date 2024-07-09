export const ErrorMessages = ({ errors }: { errors: string[] }) => {
  if (errors.length === 0) return null;
  const text = errors[0];
  return <div className="text-red-600 peer">{text}</div>;
};
