function write(level, message, meta = {}) {
  const record = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta
  };
  console.log(JSON.stringify(record));
}

function info(message, meta) {
  write("info", message, meta);
}

function warn(message, meta) {
  write("warn", message, meta);
}

function error(message, meta) {
  write("error", message, meta);
}

module.exports = {
  info,
  warn,
  error
};
