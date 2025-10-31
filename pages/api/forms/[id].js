import connectDB from '../../../utils/database';
import Form from '../../../models/Form';
import User from '../../../models/User';
import { verifyToken, validateGoogleFormUrl } from '../../../utils/auth';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  await connectDB();
  
  const { id } = req.query;

  // Validate ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid form ID' });
  }

  // GET /api/forms/:id - Get a specific form
  if (req.method === 'GET') {
    try {
      const form = await Form.findById(id, 'title description googleFormUrl dueDate createdAt updatedAt isActive');
      if (!form) {
        return res.status(404).json({ message: 'Form not found' });
      }
      return res.status(200).json(form);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // PUT /api/forms/:id - Update a form (teacher only)
  if (req.method === 'PUT') {
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

      // Check if form exists and belongs to the user
      const form = await Form.findById(id);
      if (!form) {
        return res.status(404).json({ message: 'Form not found' });
      }

      if (form.createdBy.toString() !== user._id.toString()) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      const { title, description, googleFormUrl, dueDate, isActive } = req.body;

      // Validate Google Form URL (if provided)
      let embeddedUrl = form.googleFormUrl;
      if (googleFormUrl) {
        embeddedUrl = validateGoogleFormUrl(googleFormUrl);
        if (!embeddedUrl) {
          return res.status(400).json({ message: 'Invalid Google Form URL' });
        }
      }

      // Update form
      Object.assign(form, {
        title: title || form.title,
        description: description || form.description,
        googleFormUrl: embeddedUrl,
        dueDate: dueDate ? new Date(dueDate) : form.dueDate,
        updatedAt: new Date(),
        isActive: isActive !== undefined ? isActive : form.isActive
      });

      await form.save();

      return res.status(200).json(form);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // DELETE /api/forms/:id - Delete a form (teacher only)
  if (req.method === 'DELETE') {
    try {
      // Check authorization
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
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

      // Check if form exists and belongs to the user
      const form = await Form.findById(id);
      if (!form) {
        return res.status(404).json({ message: 'Form not found' });
      }

      if (form.createdBy.toString() !== user._id.toString()) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      // Delete form
      await Form.findByIdAndDelete(id);

      return res.status(200).json({ message: 'Form deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}