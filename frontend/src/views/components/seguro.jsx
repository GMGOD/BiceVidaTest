import React, { useEffect, useReducer} from 'react'
import axios from 'axios'

const seguroReducer = (state, action) => {
  switch (action.type) {
    case 'GetSeguro':{
      return {
        ...state,
        loading: true,
        error: false,
        errorMensaje: ''
      }
    }
    case 'GetSeguroSuccess':{
      return {
        ...state,
        seguro: action.payload,
        loading: false,
        error: false,
        errorMensaje: ''
      }
    }
    case 'GetSeguroError':{
      return {
        ...state,
        seguro: null,
        loading: false,
        error: true,
        errorMensaje: action.payload !== undefined ? action.payload : 'Error al obtener el detalle de seguro, por favor vuelva a intentarlo.'
      }
    }
    case 'SeleccionarSeguro': {
      return {
        ...state,
        seguroSeleccionado: action.payload
      }
    }
    default:
      return state
  }
}

const initialState = {

  loading: false,

  seguroSeleccionado: 0,
  seguro: null,

  error: false,
  errorMensaje: ''
}
export const Seguro = () => {

  const [state, dispatch] = useReducer(seguroReducer, initialState)

  const { loading, seguroSeleccionado, seguro, error, errorMensaje } = state

  const buscarSeguro = (e) => {
    e.preventDefault()

    if(seguroSeleccionado === 0){
      dispatch({ type: 'GetSeguroError', payload: 'Por favor seleccione un seguro' })
      return
    }
    dispatch({ type: 'GetSeguro' })

    return axios.get(`https://dn8mlk7hdujby.cloudfront.net/interview/insurance/${seguroSeleccionado}`)
    .then(r => {
      if(r.status !== 200){
        dispatch({ type: 'GetSeguroError' })
        return
      }
      if(r.data === undefined){
        dispatch({ type: 'GetSeguroError' })
        return
      }

      if(r.data.insurance === undefined){
        dispatch({ type: 'GetSeguroError' })
        return
      }
      
      dispatch({ type: 'GetSeguroSuccess', payload: r.data.insurance })
    })
    .catch(e => {
      dispatch({ type: 'GetSeguroError' })
    })

  }
  const formatMoney = (amount, decimalCount = 2, decimal = ",", thousands = ".") => {
    // console.log('formatmoney', amount, decimalCount)
    try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

        const negativeSign = amount < 0 ? "-" : "";

        let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
        let j = (i.length > 3) ? i.length % 3 : 0;

        return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount && amount % 1 > 0 ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2).replace(/(\d)0+$/gm, '$1') : "");
    } catch (e) {
        console.log(e)
    }
}
  const seleccionarSeguro = () => {
    return (
      <div className="row">
        <div className="col">
          <div className="input-group mb-3">
            <label htmlFor="inputGroupSelect01">Seleccionar de seguro</label>
            <select id="inputGroupSelect01" onChange={e => dispatch({ type: 'SeleccionarSeguro', payload: +e.currentTarget.value })} value={seguroSeleccionado}>
              <option value="0"></option>
              <option value="58">Seguro Vida Activa</option>
              <option value="59">Seguro Viaje Protegido</option>
            </select>
          </div>
        </div>
        <div className="col">
          <button onClick={e => buscarSeguro(e)}>Buscar!</button>
        </div>
      </div>
    )
  }

  const detalleSeguro = () => {
    return (
      <div className="row">
        <div className="col">
          <div className="card">
            <div className="card-img-top">
              <img className="card-img-top" src={seguro.image} alt="Card image cap"/>
              <label className="card-label">$ {formatMoney(seguro.price)}</label>
            </div>
            
            <div className="card-body clearfix">
              <h5 className="card-title titulo">{seguro.name}</h5>
              <p className="card-text parrafo">{seguro.description}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
    <div className="container">
      {loading && 
        <div class="spinner-border text-primary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      }
      {!loading && error && 
        <div className="alert alert-danger" role="alert">
          {errorMensaje}
        </div>
      }
      {!loading && seleccionarSeguro()}
      {!loading && !error && seguro && detalleSeguro()}
    </div>
    </>
  )
}
