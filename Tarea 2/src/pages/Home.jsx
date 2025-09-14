import React from "react";
import { Link } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";

function Home() {
  return (
    <>
      {/* Carrusel */}
      <Carousel className="mb-4">
        <Carousel.Item>
          <img
            className="carousel-img "
            src="/img/img1.jpg"
            alt="Programación I"
            style={{width:"100%", height: "50vh", objectFit: "cover"}}
          />
          <Carousel.Caption>
            <h3 style={{color:"white"}}>Programación I</h3>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="carousel-img "
            src="/img/img2.jpg"
            alt="Bases de Datos"
            style={{width:"100%", height: "50vh", objectFit: "cover" }}
          />
          <Carousel.Caption>
            <h3 style={{color:"white"}}>Bases de Datos</h3>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="carousel-img "
            src="/img/img3.jpg"
            alt="Arquitectura de Computadoras"
            style={{width:"100%", height: "50vh", objectFit: "cover" }}
          />
          <Carousel.Caption>
            <h3 style={{color:"white"}}>Arquitectura de Computadoras</h3>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="carousel-img "
            src="/img/img4.jpg"
            alt="Física I"
            style={{width:"100%", height: "50vh", objectFit: "cover" }}
          />
          <Carousel.Caption>
            <h3 style={{color:"white"}}>Física I</h3>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="carousel-img "
            src="/img/img5.jpg"
            alt="Redes de Computadoras"
            style={{width:"100%", height: "50vh", objectFit: "cover" }}
          />
          <Carousel.Caption>
            <h3 style={{color:"white"}}>Redes de Computadoras</h3>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      {/* Listado de Cursos */}
      <div className="container text-center mb-5">
        <h2>Listado de Cursos</h2>
        <div className="row mt-4">
          <div className="col-md-4 mb-3">
            <div className="card">
              <img src="/img/img1.jpg" className="card-img-top img-fluid" alt="Programación I" style={{width:"100%", height: "15vh", objectFit: "cover" }}/>
              <div className="card-body">
                <h5 className="card-title">Programación I</h5>
                <Link to="/curso1" className="btn btn-primary">Ver más</Link>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card">
              <img src="/img/img2.jpg" className="card-img-top img-fluid" alt="Bases de Datos" style={{width:"100%", height: "15vh", objectFit: "cover" }} />
              <div className="card-body">
                <h5 className="card-title">Bases de Datos</h5>
                <Link to="/curso2" className="btn btn-primary">Ver más</Link>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card">
              <img src="/img/img3.jpg" className="card-img-top img-fluid" alt="Arquitectura de Computadoras"  style={{width:"100%", height: "15vh", objectFit: "cover" }}/>
              <div className="card-body">
                <h5 className="card-title">Arquitectura de Computadoras</h5>
                <Link to="/curso3" className="btn btn-primary">Ver más</Link>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="card">
              <img src="/img/img4.jpg" className="card-img-top img-fluid" alt="Física I" style={{width:"100%", height: "15vh", objectFit: "cover" }}/>
              <div className="card-body">
                <h5 className="card-title">Física I</h5>
                <Link to="/curso4" className="btn btn-primary">Ver más</Link>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="card">
              <img src="/img/img5.jpg" className="card-img-top img-fluid" alt="Redes de Computadoras" style={{width:"100%", height: "15vh", objectFit: "cover" }}/>
              <div className="card-body">
                <h5 className="card-title">Redes de Computadoras</h5>
                <Link to="/curso5" className="btn btn-primary">Ver más</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}

export default Home;
