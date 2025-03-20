import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import userModel from '../models/userModel.js';

dotenv.config();

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    
    try {
        const existingUser = await userModel.findOne({ email });    

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10); 
        
        const user = await userModel.create({ name, email, password: hashedPassword });

        res.status(201).json({message:"User registered successfully" , user});
    } catch (err) { 
        res.status(500).json({ message: err.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await userModel.findOne({ email });    

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);  

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });  

        res.status(200).json({message:"User logged in successfully" , user, token});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



export { registerUser , loginUser };






