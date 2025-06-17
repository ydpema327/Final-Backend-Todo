import { Response, Request } from "express"
import { handleError, isValidObjectId } from '../utils/authUtils'
import Todo from '../models/todoModels'
import { ITodo } from "../types/authTypes"

// Get all todo
export const getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
        //Use lean() for better performance when you don't want
        // need full mongoose documents
        const todo = await Todo.find().lean()
        res.status(200).json({
            message: 'All todo list',
            data: todo
        })
    } catch (error) {
        handleError(res, error)
    }
}

//Get todo by ID
export const getById = async (req: Request, res: Response): Promise<void> => {
    try {
        const {id} = req.params;

        if (!id) {
            res.status(400).json({ message: 'To do Id is required' });
            return;
        }

        const todo = await Todo.findById(id).lean();
        if (!todo) {
            res.status(404).json({ message: 'todo not found' });
            return;
        }

        res.status(200).json({message: 'todo list by Id', data: todo});
    } catch (error) {
        handleError(res, error);
    }
}

// create new todo
export const create = async ( req: Request, res: Response): Promise<void> => {
    try {
        const { text, completed } = req.body
        
        if (typeof text !== 'string' || typeof completed !== 'boolean') {
      res.status(400).json({ message: 'Invalid input data' });
      return;
    }
        const newtodo = await Todo.create({ text, completed })
        res.status(201).json({
            message: 'Todo created successfully.',
            data: newtodo
        })
    } catch (error){
        handleError(res, error)
    }
}

//Update todo
export const update = async ( req: Request, res: Response): Promise<void> => {
    try {
        const {id} = req.params;
        const { text, completed } = req.body
        if (!isValidObjectId(id, res)) return
        //Ensure at least one update field is provided
        if (typeof text === 'undefined' && typeof completed === 'undefined') {
      res.status(400).json({ message: 'No update fields provided' });
      return;
    }
        //Build update object dynamically
        const updateData: Partial<ITodo> = {}
        if (typeof text === 'string') updateData.text = text;
        if (typeof completed !== 'undefined') updateData.completed = completed;
       
       
        const updatedTodo = await Todo.findByIdAndUpdate(id, updateData,{
            new: true,
            runValidators: true,
        })
        .lean()
        if (!updatedTodo) {
            res.status(404).json ({ message: 'Todo not found'})
            return
        }
        res.status(200).json({message:'Updated todo',data: updatedTodo})
    } catch (error) {
        handleError(res, error)
    }
}

//Delete todo
export const deleteTodo = async ( req: Request, res: Response): Promise<void> => {
    try {
        const {id} = req.params;
        if (!isValidObjectId(id, res)) return


        const deleteTodo = await Todo.findByIdAndDelete(id).lean()
        if (!deleteTodo) {
            res.status(404).json({ message: 'Todo not found'})
            return
        }
        res.status(200).json({ message: 'Todo deleted successfully'})
    } catch (error) {
        handleError(res, error)
    }
}
