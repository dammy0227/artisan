import Student from "../models/Student.js";
import { generateToken } from "../utils/jwt.js";
import bcrypt from "bcryptjs";


export const registerStudent = async(req, res)=>{
      const {name, password, email, faculty, department, phone} = req.body
      try {
            const existing = await Student.findOne({email})
            if(existing){
                  return res.status(400).json({msg: 'email already exist'})
            }

            const student = new Student({
                  name,
                  email,
                  password,
                  faculty,
                  department,
                  phone
            })

            const salt = await bcrypt.genSalt(10)
            student.password = await bcrypt.hash(password, salt)

            await student.save()

            const token = await generateToken(student._id, 'student')

            res.status(201).json({
                  msg: 'Student Register Successfully',
                  token,
                  student: {
                        id: student._id,
                        name: student.name,
                        email: student.email,
                  }
            })

      } catch (error) {
            console.error(error.message)
            res.status(500).json({msg: 'Server error'})
            
      }
}

export const loginStudent = async(req,res)=>{
      const {email, password} = req.body
      try {
            const student = await Student.findOne({email})

            if(!student){
                 return res.status(400).json({msg: 'Invalid Email or Password'})
            }

            const isMatch = await bcrypt.compare(password, student.password)
            if(!isMatch){
                  return res.status(401).json({msg: 'Invalid Email or Password'})
            }

            const token = await generateToken(student._id, 'student')

            res.status(200).json({
                  msg: 'Login Successful',
                  token,
                  student : {
                       id: student._id,
                       name: student.name,
                       email: student.email,

                  }
            })
      } catch (error) {
            console.error(error.message)
            return res.status(500).json({msg: 'Server erorr'})
      }
}

export const getAllStudent = async(req, res)=>{
      try {
            const students = await Student.find().select('-password')
            res.json(students)
      } catch (error) {
            res.status(500).json({msg: 'Server Error'})
      }
}

export const getStudentById = async(req, res)=>{
      try {
            const student = await Student.findById(req.params.id).select('-password')
            res.json(student)
      } catch (error) {
            res.status(500).json({msg: 'Server Error'})
      }
}


export const updateStudent = async(req, res)=>{
      try {
          
            const {name, password, faculty, department, phone} = req.body

            const updateData = {name, faculty, department, phone}

            if(password){
                  const salt = await bcrypt.genSalt(10)
                  updateData.password = await bcrypt.hash(password, salt)
            }

            const student = await Student.findByIdAndUpdate(req.user.id, updateData, {new: true}).select('-password')
            if(!student){
                  return res.status(404).json({msg: 'Student not found'});
            }

             res.json({ message: "Student updated successfully", student });
      } catch (error) {
             res.status(500).json({ msg: 'Server Error'});
      }
}


export const deleteStudent = async(req, res)=>{
      try {
            const student = await Student.findByIdAndDelete(req.params.id)
            if(!student){
                  res.status(404).json({msg: 'Student not Found'})
            }

            res.json({msg: 'Student Deleted Sucessfully'})
      } catch (error) {
            res.status(500).json({msg: 'Server Error'})
      }
}

