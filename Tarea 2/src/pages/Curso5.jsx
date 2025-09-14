import React from "react";
import { Link } from "react-router-dom";

function Curso5() {
  return (
    <div className="container mt-4">
      <h1>Curso: Redes de Computadoras</h1>
      <p>
        Redes de Computadoras es un curso enfocado en los fundamentos de la comunicación de datos entre dispositivos...
      </p>

      <h2>Puntos Clave</h2>
      <ul className="list-group mb-3">
        <li className="list-group-item">Comprensión del modelo OSI de 7 capas y su equivalente TCP/IP.</li>
        <li className="list-group-item">Identificación de dispositivos de red: switches, routers, hubs, módems.</li>
        <li className="list-group-item">Direccionamiento IP: clases, subredes, máscara de red.</li>
        <li className="list-group-item">Protocolos fundamentales: HTTP, FTP, DNS, DHCP, TCP, UDP.</li>
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
            <td>Modelo OSI</td>
            <td>Capas de red: física, enlace, red, transporte, sesión, presentación y aplicación.</td>
          </tr>
          <tr>
            <td>Protocolos</td>
            <td>Uso de protocolos como TCP/IP para transmisión confiable de datos.</td>
          </tr>
          <tr>
            <td>Direccionamiento IP</td>
            <td>IPv4, clases A, B, C, subredes, máscaras y NAT.</td>
          </tr>
          <tr>
            <td>Dispositivos de red</td>
            <td>Funciones y diferencias entre router, switch, hub y módem.</td>
          </tr>
          <tr>
            <td>Topologías</td>
            <td>Diseño físico y lógico de redes: estrella, bus, anillo, malla.</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Curso5;
