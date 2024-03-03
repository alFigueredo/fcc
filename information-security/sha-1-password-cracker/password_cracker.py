import hashlib


def crack_sha1_hash(hash, use_salts=False):
  password_file = open("top-10000-passwords.txt", "r")
  passwords = password_file.readlines()
  salt_file = open("known-salts.txt", "r")
  salts = salt_file.readlines()
  for password in passwords:
    password = password.strip()
    if use_salts:
      for salt in salts:
        salt = salt.strip()
        salted_password = salt + password
        salted_password_hash = hashlib.sha1(
            salted_password.encode()).hexdigest()
        if salted_password_hash == hash:
          close_files([password_file, salt_file])
          return password
        salted_password = password + salt
        salted_password_hash = hashlib.sha1(
            salted_password.encode()).hexdigest()
        if salted_password_hash == hash:
          close_files([password_file, salt_file])
          return password
    else:
      password_hash = hashlib.sha1(password.encode()).hexdigest()
      if password_hash == hash:
        close_files([password_file, salt_file])
        return password
  close_files([password_file, salt_file])
  return "PASSWORD NOT IN DATABASE"


def close_files(files):
  for file in files:
    file.close()

