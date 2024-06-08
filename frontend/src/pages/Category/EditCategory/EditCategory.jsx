import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Preloader from "../../../components/Preloader/Preloader.jsx";

export default function EditCategory() {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const { id } = useParams();
  const [redirect, setRedirect] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const role = Cookies.get("role");
    if (!role || role !== "admin") setRedirect(true);
    else {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/categories/${id}`,
            { headers: { "x-auth-token": Cookies.get("token") } },
          );
          console.log(response.data);
          setName(response.data.name);
        } catch (error) {
          console.error(error);
        }
      };
      fetchData().finally(() => setLoading(false));
    }
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    if (file) formData.append("file", file[0]);
    try {
      const response = await axios.put(
        `http://localhost:5000/api/categories/${id}`,
        formData,
        { headers: { "x-auth-token": Cookies.get("token") } },
      );
      if (response.status === 200) alert("Category edited");
      setRedirect(true);
    } catch (error) {
      console.error(error);
    }
  };

  if (redirect) navigate("/admin");

  return loading ? (
    <Preloader />
  ) : (
    <div>
      <h1 style={{ textAlign: "center" }}>Edit Category</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor={"name"}>Name</label>
        <input
          value={name}
          type={"text"}
          id={"name"}
          required={true}
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor={"picture"}>Picture</label>
        <input
          required={false}
          type="file"
          onChange={(e) => setFile(e.target.files)}
        />
        <button type={"submit"}>Edit</button>
      </form>
    </div>
  );
}