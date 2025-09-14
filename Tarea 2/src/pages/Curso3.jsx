import React from "react";
import { Link } from "react-router-dom";

function Curso3() {
  return (
    <div className="container mt-4">
      <h1>Curso: Arquitectura de Computadoras</h1>
      <p>
        Este curso explora el funcionamiento interno de una computadora a nivel de hardware, enfatizando la arquitectura de procesadores, el flujo de datos y el control de operaciones...
      </p>

      <h2>Puntos Clave</h2>
      <ul className="list-group mb-3">
        <li className="list-group-item">Identificación de los componentes internos del procesador: unidad de control, registros, ALU.</li>
        <li className="list-group-item">Tipos de memoria en una computadora: RAM, ROM, caché, virtual, jerarquías de almacenamiento.</li>
        <li className="list-group-item">Funcionamiento del ciclo de instrucción: búsqueda, decodificación, ejecución.</li>
        <li className="list-group-item">Tipos de arquitectura: Von Neumann vs Harvard.</li>
      </ul>

      <h2>Temas del Curso</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Tema</th>
            <th>Descripción</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Ciclo de Instrucción</td>
            <td>Etapas que sigue una CPU para ejecutar instrucciones: fetch, decode, execute.</td>
          </tr>
          <tr>
            <td>Registros</td>
            <td>Registros internos como acumulador, contador de programa, IR, MAR, MDR.</td>
          </tr>
          <tr>
            <td>Memoria</td>
            <td>Jerarquía: caché (L1, L2), RAM, disco, y sus tiempos de acceso.</td>
          </tr>
          <tr>
            <td>Buses</td>
            <td>Canales de comunicación: bus de datos, bus de direcciones y bus de control.</td>
          </tr>
          <tr>
            <td>Set de Instrucciones</td>
            <td>Instrucciones básicas del procesador: carga, almacenamiento, suma, salto.</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Curso3;
