import connectDB from '../../../utils/database';
import Form from '../../../models/Form';
import User from '../../../models/User';
import { verifyToken, validateGoogleFormUrl } from '../../../utils/auth';

export default async function handler(req, res) {
  await connectDB();

  // GET /api/forms - Get all forms (public - hanya form aktif)
  if (req.method === 'GET') {
    // Cek apakah ini permintaan dari guru (dengan token)
    const authHeader = req.headers.authorization;
    
    try {
      // Jika ada token, verifikasi apakah user adalah guru
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const decoded = verifyToken(token);
        
        if (decoded) {
          // Cari user
          const user = await User.findById(decoded.userId);
          // Jika user adalah guru, kirim semua form (aktif dan tidak aktif)
          if (user && user.role === 'teacher') {
            const forms = await Form.find({}, 'title description googleFormUrl dueDate createdAt updatedAt isActive');
            return res.status(200).json(forms);
          }
        }
      }
      
      // Untuk user biasa (siswa), hanya kirim form yang aktif
      const forms = await Form.find({ isActive: true }, 'title description googleFormUrl dueDate createdAt updatedAt');
      return res.status(200).json(forms);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // POST /api/forms - Create a new form (teacher only)
  if (req.method === 'POST') {
    try {
      // Check authorization
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization required' });
      }

      const token = authHeader.substring(7);
      const decoded = verifyToken(token);
      if (!decoded) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      // Verify user exists and is a teacher
      const user = await User.findById(decoded.userId);
      if (!user || user.role !== 'teacher') {
        return res.status(403).json({ message: 'Forbidden' });
      }

      const { title, description, googleFormUrl, dueDate } = req.body;

      // Validate Google Form URL
      const embeddedUrl = validateGoogleFormUrl(googleFormUrl);
      if (!embeddedUrl) {
        return res.status(400).json({ message: 'Invalid Google Form URL' });
      }

      // Create form
      const form = new Form({
        title,
        description,
        googleFormUrl: embeddedUrl,
        dueDate: new Date(dueDate),
        createdBy: user._id
      });

      await form.save();

      return res.status(201).json(form);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}