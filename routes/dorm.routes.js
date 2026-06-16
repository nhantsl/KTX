import express from 'express';
const router = express.Router();
import { getHome, getDangKy, postDangKy, getPhongDetail} from '../src/controllers/dorm.controller.js';

router.get('/', getHome);
router.get('/dang-ky', getDangKy);
router.post('/dang-ky', postDangKy);
router.get('/:id', getPhongDetail);

export default router;