import { Router } from 'express';
import { validateSchema } from '../middleware/schema-validation';
import { userSchema } from '../models/validations';
import { 
  createUser,
  getUser,
  updateUser,
  deleteUser,
  listUsers 
} from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/', validateSchema(userSchema), createUser);

// Protected routes
router.use(authenticate);
router.get('/', listUsers);
router.get('/:id', getUser);
router.put('/:id', validateSchema(userSchema), updateUser);
router.delete('/:id', deleteUser);

export default router; 