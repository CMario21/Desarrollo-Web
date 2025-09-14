import React from "react";
import { Link } from "react-router-dom";

function Curso2() {
  return (
    <div className="container mt-4">
      <h1>Curso: Bases de Datos</h1>
      <p>
        El curso de Bases de Datos proporciona los conocimientos fundamentales para diseñar, implementar y gestionar bases de datos relacionales...
      </p>

      <h2>Puntos Clave</h2>
      <ul className="list-group mb-3">
        <li className="list-group-item">Diseño de bases de datos relacionales desde cero utilizando modelos conceptuales como el Modelo Entidad-Relación.</li>
        <li className="list-group-item">Dominio del lenguaje SQL para creación de tablas, inserción de datos, consultas (SELECT), filtros (WHERE), ordenamiento (ORDER BY) y funciones agregadas.</li>
        <li className="list-group-item">Aplicación de procesos de normalización (1FN, 2FN, 3FN) para evitar redundancia y mantener integridad de datos.</li>
        <li className="list-group-item">Comprensión del funcionamiento de los Sistemas de Gestión de Bases de Datos (DBMS) como MySQL, PostgreSQL u Oracle.</li>
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
            <td>Modelo ER</td>
            <td>Diseño lógico de una base de datos representando entidades, atributos, relaciones y cardinalidades.</td>
          </tr>
          <tr>
            <td>SQL Básico</td>
            <td>Instrucciones para manipular datos: SELECT, INSERT, UPDATE, DELETE.</td>
          </tr>
          <tr>
            <td>Consultas Avanzadas</td>
            <td>Subconsultas, uniones (JOIN), agrupaciones (GROUP BY), funciones agregadas y vistas.</td>
          </tr>
          <tr>
            <td>Normalización</td>
            <td>Aplicación de reglas para estructurar los datos eficientemente y evitar anomalías.</td>
          </tr>
          <tr>
            <td>Índices y Claves</td>
            <td>Definición de claves primarias, foráneas e índices para optimizar búsquedas.</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Curso2;
