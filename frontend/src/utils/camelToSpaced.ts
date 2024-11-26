const camelCaseToSpaced = (s: string) => {
  return s
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, function (str) {
      return str.toUpperCase();
    })
    .replace('_', ' ');
};

export const capitalize = (s: string) => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export default camelCaseToSpaced;
