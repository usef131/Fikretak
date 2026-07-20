// Strips MongoDB operator injection from user input.
// Removes any object keys that start with '$' or contain '.', recursively.
// Dependency-free alternative to express-mongo-sanitize (which mutates the
// read-only req.query getter on newer Express and pulls in an extra dep).
function scrub(value) {
  if (Array.isArray(value)) {
    value.forEach(scrub);
    return value;
  }
  if (value && typeof value === 'object') {
    for (const key of Object.keys(value)) {
      if (key.startsWith('$') || key.includes('.')) {
        delete value[key];
      } else {
        scrub(value[key]);
      }
    }
  }
  return value;
}

module.exports = function sanitize(req, _res, next) {
  if (req.body) scrub(req.body);
  if (req.params) scrub(req.params);
  if (req.query) scrub(req.query); // Express 4: query is a mutable plain object
  next();
};
