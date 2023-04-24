const urlPattern = /^(http(s):\/\/.)[-a-zA-Z0-9:%._+~#=]{2,256}\/[-a-zA-Z0-9:%._+~#=]{2,256}/;
const idPattern = /^[0-9a-fA-F]{24}$/;
const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
module.exports = {
  urlPattern, idPattern, emailPattern,
};
