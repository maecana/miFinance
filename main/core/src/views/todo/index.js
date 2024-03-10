import React, { useState } from 'react';
// material-ui
import MainCard from 'ui-component/cards/MainCard';
import { TextField, Button } from '@mui/material';
import { collection, addDoc } from 'firebase/firestore';
// project imports
import { db } from 'firebase-config';

const Todo = () => {
  const [todo, setTodo] = useState('');

  const addTodo = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'todos'), {
        todo: todo
      });
      console.log('Document written with ID: ', docRef.id);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  return (
    <MainCard title="Todo-App">
      <div className="todo">
        <div>
          <TextField
            label="What do you have to do today?"
            variant="outlined"
            fullWidth
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
          />
        </div>

        <div className="btn-container">
          <Button variant="contained" color="primary" onClick={addTodo}>
            Submit
          </Button>
        </div>

        <div className="todo-content">{/* Here you can display todo items */}</div>
      </div>
    </MainCard>
  );
};
export default Todo;
