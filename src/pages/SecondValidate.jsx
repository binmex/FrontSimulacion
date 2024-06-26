import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ProgressSpinner } from "primereact/progressspinner";
import Webcam from "react-webcam";
import { Toast } from "primereact/toast";
import { SaveLocalStorage } from "../middleware/SaveLocalStorage";
import { encrypt } from "../middleware/Encryptation";

const SecondValidate = () => {
  const [image2, setImage2] = useState();
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [showWebcam, setShowWebcam] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const webcamRef = useRef(null);
  const toast = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const trueImage = JSON.parse(localStorage.getItem("imageURL"));

  useEffect(() => {
    localStorage.removeItem("secondAccess");
  }, [location.pathname]);

  const handleLogin = async () => {
    setIsLoading(true); //nicia elSpinner
    const loginData = {
      imageUrl1: trueImage[0],
      imageUrl2: image2,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 segundos

    try {
      const startTime = Date.now();

      const response = await fetch(
        "https://face-match-lxpiymvlcq-uc.a.run.app/face/compare",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
          signal: controller.signal,
        }
      );

      const endTime = Date.now();
      console.log(`Respuesta recibida en ${endTime - startTime} ms`);

      clearTimeout(timeoutId);

      console.log("Status:", response.status);
      console.log("StatusText:", response.statusText);
      console.log("Headers:", Object.fromEntries(response.headers.entries()));

      const responseData = await response.text();
      console.log("Response:", responseData);

      if (!response.ok) {
        toast.current.show({
          severity: "warn",
          summary: "Advertencia",
          detail: responseData,
        });
      } else {
        //aqui se verifica si funciona o no
        const result = JSON.parse(responseData);
        if (result.isSamePerson) {
          localStorage.removeItem("imageURL");
          SaveLocalStorage("twoFactorAuth", encrypt("ValidatedAccessTrue"));
          navigate("/listStudents");
        } else {
          toast.current.show({
            severity: "warn",
            summary: "Advertencia",
            detail: "No concuerdan los rostros",
          });
        }
      }
    } catch (error) {
      if (error.name === "AbortError") {
        toast.current.show({
          severity: "warn",
          summary: "Advertencia",
          detail: "La solicitud excedió el tiempo límite de 60 segundos",
        });
      } else {
        toast.current.show({
          severity: "warn",
          summary: "Advertencia",
          detail: error,
        });
      }
    } finally {
      setIsLoading(false);
      clearTimeout(timeoutId);
    }
  };
  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setResponse(imageSrc);
    setShowWebcam(false);
  };

  const uploadCapturedImage = async () => {
    if (capturedImage) {
      setIsUploading(true); // Inicia el spinner antes de la petición
      try {
        const uniqueTimestamp = new Date().toISOString().replace(/[:.-]/g, "");
        const uniqueFileName = `capturedImage_${uniqueTimestamp}.jpg`;
        const blob = await fetch(capturedImage).then((res) => res.blob());
        const formData = new FormData();
        formData.append("file", blob, uniqueFileName);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/login/uploadTemporal`,
          {
            method: "POST",
            body: formData,
          }
        );

        const result = await response.text();
        setImage2(result);
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setIsUploading(false); // Detiene el spinner después de la petición
      }
    }
  };

  return (
    <div>
      <div className="bg-gradient-primary" style={{ height: "100vh" }}>
        <div className="container h-100">
          <div className="row justify-content-center align-items-center h-100">
            <div className="col-md-9 col-lg-12 col-xl-10">
              <div className="card shadow-lg o-hidden border-0 my-5">
                <div className="card-body p-0">
                  <div className="row">
                    <div className="col-lg-6 d-none d-lg-flex">
                      <div
                        className="flex-grow-1 bg-login-image"
                        style={{
                          backgroundImage: `url(${
                            response ? response : "images/dogs/image3.jpeg"
                          })`,
                          position: "relative",
                          height: "100%",
                          width: "100%",
                        }}
                      >
                        {showWebcam && (
                          <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 20,
                              height: "100%",
                              width: "100%",
                            }}
                          />
                        )}
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="p-5">
                        <div className="text-center">
                          <h4 className="text-dark mb-4">
                            Reconocimiento Facial
                          </h4>
                          <div className="card mb-3">
                            <Toast ref={toast}></Toast>
                          </div>
                        </div>
                        <div className="user" id="login-form">
                          <div className="mb-3">
                            <div className="custom-control custom-checkbox small"></div>
                            <div className="p-1">
                              {/* <input type="file" onChange={handleFileChange} /> */}
                              <button
                                className="btn btn-success d-block btn-user w-100"
                                type="submit"
                                onClick={
                                  showWebcam
                                    ? captureImage
                                    : () => {
                                        setShowWebcam(true);
                                        setResponse("images/dogs/blanco.jpeg");
                                      }
                                }
                              >
                                {showWebcam
                                  ? "Capturar imagen"
                                  : "Mostrar camara"}
                              </button>
                            </div>
                            <div className="p-1">
                              {capturedImage && (
                                <button
                                  className="btn btn-info d-block btn-user w-100"
                                  type="submit"
                                  onClick={uploadCapturedImage}
                                >
                                  Guardar imágen
                                </button>
                              )}
                            </div>

                            <div className="card flex justify-content-center">
                              {isUploading ? <ProgressSpinner /> : null}
                            </div>

                            <button
                              className="btn btn-primary d-block btn-user w-100 butonFacial"
                              onClick={handleLogin}
                            >
                              Iniciar Sesión
                            </button>

                            <div className="card flex justify-content-center">
                              {isLoading ? <ProgressSpinner /> : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecondValidate;
