//importing useEffect and useState hooks
import React, {useEffect, useState} from 'react'
//importing axios package
import axios from 'axios'
import './App.css';
import { model } from 'mongoose';

function App() {
  const [guitars, setGuitars] = useState([]);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    getGuitars();
  }, []);

  //Create
  const onSubmitGuitar = async e => {
    e.preventDefault()
    const {model, brand, description} = e.target
    await axios.post('https://cryptic-sea-23347.herokuapp.com/api/guitars', {
      model: model.value,
      brand: brand.value,
      description: description.value,
    })
    model.value = ''
    brand.value = ''
    description.value = ''
    getGuitars()
  }

  //Read
  const getGuitars = async () => {
    const res = await axios.get('https://cryptic-sea-23347.herokuapp.com/api/guitars')
    const data = res.data
    setGuitars(data)
  }

  //Update
  const onSubmitEdits = async (e, id) => {
    e.preventDefault()
    const {model, brand, description} = e.target
    await axios.post(`https://cryptic-sea-23347.herokuapp.com/api/guitars/update/${id}`, {
      model: model.value,
      brand: brand.value,
      description: description.value,
    })
    setEditing(null)
    getGuitars()
  }

  //Delete
  const deleteGuitar = async guitarToDelete => {
await axios ({
  method: 'DELETE',
  url: 'https://cryptic-sea-23347.herokuapp.com/api/guitars',
  data: {
    id: guitarToDelete,
  },
})
await getGuitars()
  }

  return (
    <div className="App">
      <div className="DataInput">
        <h2>Enter guitar:</h2>
        <form onSubmit={e => onSubmitGuitar(e)}>
          <label htmlFor='model'>Model:</label>
          <input type="text" name="model" />
          <label htmlFor="brand">Brand:</label>
          <input type="text" name="brand" />
          <label htmlFor="description">Description:</label>
          <input type="text" name="description" />
          <button>Add Guitar</button>
        </form>
      </div>
      <div className="DataOutput">
  {guitars.map(guitar => (
    <div key={guitar._id}>
      {editing !== guitar._id ? (
        <div key={guitar._id} className="DataOutput__card">
          <div className="DataOutput__card--details">
            <div>
              <span>Model:</span>
              {guitar.model}
            </div>
            <div>
              <span>Brand:</span>
              {guitar.brand}
            </div>
            <div>
              <span>Description:</span>
              {guitar.description}
            </div>
          </div>
          <div className="DataOutput__card--options">
            <button onClick={() => setEditing(guitar._id)}>Edit</button>
            <button onClick={() => deleteGuitar(guitar._id)}>Delete</button>
          </div>
        </div>
      ) : (
        <div key={guitar._id} className="DataOutput__editing">
          <form onSubmit={e => onSubmitEdits(e, guitar._id)}>
            <div className="DataOutput__editing--option">
              <label htmlFor="title">Model:</label>
              <input type="text" name="model" defaultValue={guitar.model} />
            </div>
            <div className="DataOutput__editing--option">
              <label htmlFor="brand">Brand:</label>
              <input type="text" name="brand" defaultValue={guitar.brand} />
            </div>
            <div className="DataOutput__editing--option">
              <label htmlFor="description">Description:</label>
              <input type="text" name="description" defaultValue={guitar.description} />
            </div>
            <div>
              <button type="Submit">Submit</button>
              <button
                className="DataOutput__editing--cancel"
                onClick={() => setEditing(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  ))}
</div>
    </div>
  );
}

export default App;
