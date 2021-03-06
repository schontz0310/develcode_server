import {Request, Response, } from 'express';
import connection from '../../../database/knex/connection'
import path from 'path';
import fs from 'fs';

interface IUserDTO {
  users_id: string;
  users_name: string;
  users_date_of_birth: string;
  users_avatar: string;
  users_created_at: string;
  users_updated_at: string;
}

interface ICount{
  count: string
  
}  


interface Ipage{
  page: string
}


export default class UsersController{
public async delete(request: Request, response: Response){
    const {users_id} = request.params;

    const [user] = await connection('users')
    .where('users_id', users_id)
    .select<IUserDTO[]>('*');

    if (!user) {
      
      throw new Error('Only Authenticated users can change avatar!');
    }

    if (user.users_avatar) {
      const filePath = path.resolve(__dirname, '..', '..', '..', '..', 'uploads', user.users_avatar)
      try {
        await fs.promises.stat(filePath);
      } catch (err) {
        console.log(err)
        return;
      }
      await fs.promises.unlink(filePath);
    }

    await connection('users')
    .where<IUserDTO>('users_id', users_id)
    .delete();

    return response.status(204).send();
  }
}