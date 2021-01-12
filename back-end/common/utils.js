function getFormatedStringDate() {
  const currentTime = new Date();
  return  "\x1b[36m" + "[" + currentTime.toLocaleString() + "]" + "\x1b[0m";
}

module.exports = {
  getFormatedStringDate,
};