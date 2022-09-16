import React, {useEffect, useState} from 'react';
import './App.css';
import './api/styles.css';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import {Edit, Delete} from '@mui/icons-material';

const baseUrl='http://localhost:3000/api/peliculas'


function App() {

  const [data, setData]=useState([]);
  const [modalInsertar, setModalInsertar]=useState(false);
  const [modalEditar, setModalEditar]=useState(false);
  const [modalEliminar, setModalEliminar]=useState(false);
  
  const [consolaSeleccionada, setConsolaSeleccionada]=useState({
    nombre: '',
    empresa:'',
    lanzamiento: '',
    unidades_vendidas: ''
  })

  const handleChange=e=>{
    const {name, value}=e.target;
    setConsolaSeleccionada(prevState=>({
      ...prevState,
      [name]: value
    }))
    console.log(consolaSeleccionada);
  }

  const peticionGet=async()=>{
    await axios.get(baseUrl)
    .then(response=>{
      setData(response.data);
    })
  }

  const peticionPost=async()=>{
    await axios.post(baseUrl, consolaSeleccionada)
    .then(response=>{
      setData(data.concat(response.data))
      abrirCerrarModalInsertar()
    })
  }
  const peticionPut=async()=>{
    await axios.put(baseUrl+consolaSeleccionada.id, consolaSeleccionada)
    .then(response=>{
      var dataNueva=data;
      dataNueva.map(consola=>{
        if(consolaSeleccionada.id===consola.id){
          consola.nombre=consolaSeleccionada.nombre;
          consola.lanzamiento=consolaSeleccionada.lanzamiento;
          consola.empresa=consolaSeleccionada.empresa;
          consola.unidades_vendidas=consolaSeleccionada.unidades_vendidas;
        }
      })
      setData(dataNueva);
      abrirCerrarModalEditar();
    })
  }
  const peticionDelete=async()=>{
    await axios.delete(baseUrl+consolaSeleccionada.id)
    .then(response=>{
      setData(data.filter(consola=>consola.id!==consolaSeleccionada.id));
      abrirCerrarModalEliminar();
    })
  }

  const abrirCerrarModalInsertar=()=>{
    setModalInsertar(!modalInsertar);
  }
  const abrirCerrarModalEditar=()=>{
    setModalEditar(!modalEditar);
  }
  const abrirCerrarModalEliminar=()=>{
    setModalEliminar(!modalEliminar);
  }
  const seleccionarConsola=(consola, caso)=>{
    setConsolaSeleccionada(consola);
    (caso==='Editar')?abrirCerrarModalEditar():abrirCerrarModalEliminar()
  }

  useEffect(()=>{
    peticionGet();
  },[])

  const bodyInsertar=(
    <div className='modal'>
      <h3>Agregar Nueva Consola</h3>
      <TextField name="nombre" className='inputMaterial' label="Nombre" onChange={handleChange}/>
      <br />
      <TextField name="empresa" className='inputMaterial' label="Empresa" onChange={handleChange}/>
      <br />
      <TextField name="lanzamiento" className='inputMaterial' label="Lanzamiento" onChange={handleChange}/>
      <br />
      <TextField name="unidades_vendidas" className='inputMaterial' label="Unidades Vendidas" onChange={handleChange}/>
      <br /><br />
      <div align="right">
        <Button color="primary" onClick={()=>peticionPost()}>Insertar</Button>
        <Button onClick={()=>abrirCerrarModalInsertar()}>Cancelar</Button>
      </div>
    </div>
  )
  const bodyEditar=(
    <div className='modal'>
      <h3>Editar Consola</h3>
      <TextField name="nombre" className='inputMaterial' label="Nombre" onChange={handleChange} value={consolaSeleccionada && consolaSeleccionada.nombre}/>
      <br />
      <TextField name="empresa" className='inputMaterial' label="Empresa" onChange={handleChange} value={consolaSeleccionada && consolaSeleccionada.empresa}/>
      <br />
      <TextField name="lanzamiento" className='inputMaterial' label="Lanzamiento" onChange={handleChange} value={consolaSeleccionada && consolaSeleccionada.lanzamiento}/>
      <br />
      <TextField name="unidades_vendidas" className='inputMaterial' label="Unidades Vendidas" onChange={handleChange} value={consolaSeleccionada && consolaSeleccionada.unidades_vendidas}/>
      <br /><br />
      <div align="right">
        <Button color="primary" onClick={()=>peticionPut()}>Editar</Button>
        <Button onClick={()=>abrirCerrarModalEditar()}>Cancelar</Button>
      </div>
    </div>
  )
  const bodyEliminar=(
    <div className='modal'>
      <p>Estás seguro que deseas eliminar la consola <b>{consolaSeleccionada && consolaSeleccionada.nombre}</b> ? </p>
      <div align="right">
        <Button color="secondary" onClick={()=>peticionDelete()} >Sí</Button>
        <Button onClick={()=>abrirCerrarModalEliminar()}>No</Button>

      </div>
    </div>
  )

  return (
    <div className="App">
      <br />
    <Button onClick={abrirCerrarModalInsertar}>Insertar</Button>
      <br /><br />
     <TableContainer>
       <Table>
         <TableHead>
           <TableRow>
             <TableCell>Nombre</TableCell>
             <TableCell>Empresa</TableCell>
             <TableCell>Año de Lanzamiento</TableCell>
             <TableCell>Unidades Vendidas (millones)</TableCell>
             <TableCell>Acciones</TableCell>
           </TableRow>
         </TableHead>

         <TableBody>
           {data.map(consola=>(
             <TableRow key={consola.id}>
               <TableCell>{consola.nombre}</TableCell>
               <TableCell>{consola.empresa}</TableCell>
               <TableCell>{consola.lanzamiento}</TableCell>
               <TableCell>{consola.unidades_vendidas}</TableCell>
               <TableCell>
                 <Edit className='iconos' onClick={()=>seleccionarConsola(consola, 'Editar')}/>
                 &nbsp;&nbsp;&nbsp;
                 <Delete className='iconos' onClick={()=>seleccionarConsola(consola, 'Eliminar')}/>
                </TableCell>
             </TableRow>
           ))}
         </TableBody>
       </Table>
     </TableContainer>
     
     <Modal
      open={modalInsertar}
      onClose={abrirCerrarModalInsertar}>
        {bodyInsertar}
     </Modal>
     
     <Modal
     open={modalEditar}
     onClose={abrirCerrarModalEditar}>
        {bodyEditar}
     </Modal>

     <Modal
     open={modalEliminar}
     onClose={abrirCerrarModalEliminar}>
        {bodyEliminar}
     </Modal>
    </div>
  );
}

export default App;