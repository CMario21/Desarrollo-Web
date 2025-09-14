import React from "react";
import { Link } from "react-router-dom";

function Curso4() {
  return (
    <div className="container mt-4">
      <h1>Curso: Física I</h1>
      <p>
        Física I es un curso introductorio que cubre los principios fundamentales del movimiento y las fuerzas...
      </p>

      <h2>Puntos Clave</h2>
      <ul className="list-group mb-3">
        <li className="list-group-item">Aplicación de las leyes del movimiento (cinemática y dinámica).</li>
        <li className="list-group-item">Comprensión y análisis de fuerzas en reposo y movimiento.</li>
        <li className="list-group-item">Trabajo, energía cinética y potencial, y principio de conservación.</li>
        <li className="list-group-item">Estudio del movimiento parabólico y circular uniforme.</li>
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
            <td>Cinemática</td>
            <td>Estudio del movimiento rectilíneo, aceleración, velocidad, gráficas de posición y tiempo.</td>
          </tr>
          <tr>
            <td>Leyes de Newton</td>
            <td>Relaciones entre fuerzas y movimientos. Aplicación en planos inclinados, sistemas de poleas.</td>
          </tr>
          <tr>
            <td>Trabajo y Energía</td>
            <td>Definición de trabajo, energía cinética, energía potencial y conservación.</td>
          </tr>
          <tr>
            <td>Movimiento Circular</td>
            <td>Fuerza centrípeta, velocidad angular y aceleración tangencial.</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Curso4;
