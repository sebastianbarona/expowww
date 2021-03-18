import React, {useState} from 'react';
import './App.css';
import axios from 'axios';
import {makeStyles} from '@material-ui/core/styles';
import {Table, TableContainer, TableHead, TableCell, TableBody, TableRow, Modal, Button, TextField} from '@material-ui/core';
import {Edit, Delete, DateRange, DateRangeOutlined} from '@material-ui/icons';

const baseUrl = 'http://127.0.0.1:8000/personas/'

const useStyles = makeStyles((theme) => ({
  modal: {
    position:'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },
  iconos:{
    cursor: 'pointer'
  }, 
  inputMaterial:{
    width: '100%'
  }
}));

function App() {
const styles= useStyles();
  const [data, setData]=useState([]);
  console.log(data)

  const [modalInsertar, setModalInsertar]=useState(false);
  const [modalEditar, setModalEditar]=useState(false);
  const [modalEliminar, setModalEliminar]=useState(false);

  const [persona, setPersonaSeleccionada]=useState({
    Nombres: '',
    Apellidos: '',
    Cedula: '',
    Telefono: '',
    Fecha: ''

  })

  const handleChange=e=>{
    const {name, value}=e.target;
    setPersonaSeleccionada(prevState=>({
      ...prevState,
      [name]: value
    }))
    console.log(persona);
  }

  const peticionGet=async()=>{
    await axios.get (baseUrl)
    .then(response=>{
      setData(response.data);
    })
  }

  const peticionPost=async()=>{
    await axios.post(baseUrl, persona)
    .then(response=>{
      setData(data.concat(response.data))
      abrirCerrarModalInsertar()
    })
  }

  const peticionPut=async()=>{
    await axios.put(baseUrl+persona.Cedula, persona)
    .then(response =>{
      var dataNueva=data;
      dataNueva.map(consola=>{
        if(persona.Cedula === consola.Cedula){
          consola.Nombres = persona.Nombres;
          consola.Apellidos = persona.Apellidos;
          consola.Telefono = persona.Telefono;
          consola.Fecha = persona.Fecha;
        }
      })
      setData(dataNueva);
      abrirCerrarModalEditar();
    })
  }

  const peticionDelete=async()=>{
    await axios.delete(baseUrl+persona.Cedula)
    .then(response=>{
      setData(data.filter(consola=>consola.Cedula!==persona.Cedula));
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

  const seleccionarpersona=(consola, caso)=>{
    setPersonaSeleccionada(consola);
    (caso=='Editar')?abrirCerrarModalEditar():abrirCerrarModalEliminar()
  }

  React.useEffect(async()=>{
    await peticionGet();
  },[])

  const bodyInsertar=(
    <div className={styles.modal}>
      <h3>Agregar Persona</h3>
      <TextField name="Nombres" className={styles.inputMaterial} label="Nombres" onChange={handleChange}/>
      <br />
      <TextField name="Apellidos" className={styles.inputMaterial} label="Apellidos" onChange={handleChange}/>
      <br />
      <TextField name="Cedula" className={styles.inputMaterial} label="Cedula" onChange={handleChange}/>
      <br />
      <TextField name="Telefono" className={styles.inputMaterial} label="Telefono" onChange={handleChange}/>
      <br />
      <TextField name="Fecha" className={styles.inputMaterial} label="Fecha" onChange={handleChange}/>
      <br /><br />
      <div align="right">
        <Button color="primary" onClick={()=>peticionPost()}>Insertar</Button>
        <Button onClick={()=>abrirCerrarModalInsertar()}>Cancelar</Button>
      </div>
    </div>
  )

  const bodyEditar=(
    <div className={styles.modal}>
      <h3>Editar Persona</h3>
      <TextField name="Nombres" className={styles.inputMaterial} label="Nombres" onChange={handleChange} value={persona.Nombres}/>
      <br />
      <TextField name="Apellidos" className={styles.inputMaterial} label="Apellidos" onChange={handleChange} value={persona.Apellidos}/>
      <br />
      <TextField name="Cedula" className={styles.inputMaterial} label="Cedula" onChange={handleChange} value={persona.Cedula}/>
      <br />
      <TextField name="Telefono" className={styles.inputMaterial} label="Telefono" onChange={handleChange} value={persona.Telefono}/>
      <br />
      <TextField name="Fecha" className={styles.inputMaterial} label="Fecha" onChange={handleChange} value={persona.Fecha}/>
      <br /><br />
      <div align="right">
        <Button color="primary" onClick={()=>peticionPut()}>Editar</Button>
        <Button onClick={()=>abrirCerrarModalEditar()}>Cancelar</Button>
      </div>
    </div>
  )

  const bodyEliminar=(
    <div className={styles.modal}>
      <p>Estás seguro que deseas eliminar la persona <b>{persona.Nombres}</b> ? </p>
      <div align="right">
        <Button color="secondary" onClick={()=>peticionDelete()} >Sí</Button>
        <Button onClick={()=>abrirCerrarModalEliminar()}>No</Button>

      </div>

    </div>
  )


  return (
    <div className="App">
      <br />
    <Button onClick={()=>abrirCerrarModalInsertar()}>Insertar</Button>
      <br /><br />
     <TableContainer>
       <Table>
         <TableHead>
           <TableRow>
             <TableCell>Cedula</TableCell>
             <TableCell>Nombres</TableCell>
             <TableCell>Apellidos</TableCell>
             <TableCell>Cedula</TableCell>
             <TableCell>Telefono</TableCell>
             <TableCell>Fecha</TableCell>
           </TableRow>
         </TableHead>

         <TableBody>
           {data.map(consola=>(
             <TableRow key={consola.Cedula}>
               <TableCell>{consola.Cedula}</TableCell>
               <TableCell>{consola.Nombres}</TableCell>
               <TableCell>{consola.Apellidos}</TableCell>
               <TableCell>{consola.Telefono}</TableCell>
               <TableCell>{consola.Fecha}</TableCell>
               <TableCell>
                 <Edit className={styles.iconos} onClick={()=>seleccionarpersona(consola, 'Editar')}/>
                 &nbsp;&nbsp;&nbsp;
                 <Delete  className={styles.iconos} onClick={()=>seleccionarpersona(consola, 'Eliminar')}/>
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
