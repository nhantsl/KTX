import express from 'express';
const router = express.Router();
import { getHome, getGioiThieu, getNoiQuy, getDangKy, postDangKy } from '../src/controllers/dorm.controller.js';

router.get('/', getHome);
router.get('/gioi-thieu', getGioiThieu);
router.get('/noi-quy', getNoiQuy);
router.get('/dang-ky', getDangKy);
router.post('/dang-ky', postDangKy);

export default router;