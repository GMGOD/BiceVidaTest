import React from 'react';

export const Plan = () => {

  return (
    <>
    <div className="container">
      <div className="row">
        <div className="col">
          <div className="input-group mb-3">
            <label for="inputGroupSelect01">Seleccionar plan</label>
            <select id="inputGroupSelect01">
              <option selected></option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
            </select>
          </div>
        </div>
        <div className="col">
          <button>Buscar!</button>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="card">
            <div className="card-img-top">
              <img className="card-img-top" src="data:image/jpeg;base64,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" alt="Card image cap"/>
              <label className="card-label">label</label>
            </div>
            
            <div className="card-body clearfix">
              <h5 className="card-title titulo">Card title</h5>
              <p className="card-text parrafo">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
   
    
    </>
  )
}
