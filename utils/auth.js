import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 12);
};

export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

export const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export const validateGoogleFormUrl = (url) => {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname !== 'docs.google.com') {
      return null;
    }
    
    // Transform URL to embedded format if needed
    if (parsedUrl.pathname.endsWith('/viewform')) {
      const newPath = parsedUrl.pathname.replace('/viewform', '/viewform');
      parsedUrl.pathname = newPath;
      parsedUrl.search = '?embedded=true';
      return parsedUrl.toString();
    } else if (parsedUrl.href.includes('/viewform?embedded=true')) {
      return url;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};