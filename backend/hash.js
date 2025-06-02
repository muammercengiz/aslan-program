const bcrypt = require('bcrypt');

const run = async () => {
  const hashed = await bcrypt.hash("123456", 10);
  console.log("Şifre hash:", hashed);
};

run();
