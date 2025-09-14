import React from "react";
import { Link } from "react-router-dom";

function Curso1() {
  return (
    <div className="container mt-4">
      <h1>Curso: Programación I</h1>
      <p>
        El curso de Programación I constituye la base esencial para el desarrollo de habilidades en lógica computacional...
      </p>

      <h2>Puntos Clave</h2>
      <ul className="list-group mb-3">
        <li className="list-group-item">Desarrollo de lógica algorítmica mediante pseudocódigo y diagramas de flujo.</li>
        <li className="list-group-item">Uso de estructuras de control de flujo: condicionales y ciclos.</li>
        <li className="list-group-item">Declaración y manipulación de variables y constantes.</li>
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
            <td>Introducción a la Programación</td>
            <td>Conceptos básicos de programación, algoritmos, lenguajes y compiladores.</td>
          </tr>
          <tr>
            <td>Tipos de Datos y Variables</td>
            <td>Enteros, flotantes, caracteres, cadenas, booleanos.</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Curso1;
