const getInitials = (str) => {
  if (typeof str !== "string" || str.trim() === "") {
    return ""; // Return an empty string or a default value if str is not valid
  }

  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
};

export default getInitials;
