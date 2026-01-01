import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

navigate("/fire", {
  state: {
    intensity: 0.3,
    mode: "smoke"
  }
});
