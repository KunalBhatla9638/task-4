import React, { useEffect, useState } from "react";
import axios from "axios";
import JSZip from "jszip";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  // const navigate = useNavigate();
  const [getData, setGetData] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async (event) => {
    event.preventDefault(); // Prevent default form submission

    try {
      const formData = new FormData();
      formData.append("doc", selectedFile);

      const response = await axios.post(
        "http://localhost:3000/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status == 200) {
        console.log("Successfully send");
      }
    } catch (error) {
      console.error(
        "Error uploading file:",
        error.response?.data?.error || error
      );
      toast.error(
        "Error uploading file: " +
          (error.response?.data?.error || error.message)
      );
    }
  };

  const fetchAllData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/products");
      if (response.status == 200) {
        setGetData(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const onClickExportData = async () => {
  //   try {
  //     const response = await axios.get("http://localhost:3000/api/export");
  //     if (response.status == 200) {
  //       console.log(response.data);
  //       const blob = new Blob([response.data], {
  //         type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //       });
  //       const link = document.createElement("a");
  //       link.href = window.URL.createObjectURL(blob);
  //       link.download = `${Date.now()}-exported_data.xlsx`;

  //       document.body.appendChild(link);
  //       link.click();

  //       document.body.removeChild(link);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  const onClickExportData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/export", {
        responseType: "arraybuffer", // Ensure proper handling of binary data
      });

      if (response.status === 200) {
        console.log("Response data:", response.data);

        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `${Date.now()}-exported_data.xlsx`; // File name

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchAllData();
  });

  return (
    <>
      <div className="mt-4">
        <form onSubmit={handleUpload}>
          <input type="file" onChange={handleFileChange} />
          <button type="submit" disabled={!selectedFile}>
            Upload
          </button>
        </form>
        <button
          type="button"
          className="btn btn-success m-4"
          onClick={onClickExportData}
        >
          export below table
        </button>
      </div>

      <div>
        <table className="table">
          <thead className="thead-dark">
            <tr>
              <th scope="col">productname</th>
              <th scope="col">price</th>
              <th scope="col">discountpercentage</th>
              <th scope="col">sku</th>
              <th scope="col">variantid</th>
              <th scope="col">description</th>
              <th scope="col">discountedPrice</th>
              <th scope="col">category_name</th>
            </tr>
          </thead>
          <tbody>
            {getData.map((item, idx) => {
              const {
                category_name,
                description,
                discountedPrice,
                discountpercentage,
                price,
                productname,
                sku,
                variantid,
              } = item;
              return (
                <tr key={idx}>
                  <td>{productname}</td>
                  <td>{price}</td>
                  <td>{discountpercentage}</td>
                  <td>{sku}</td>
                  <td>{variantid}</td>
                  <td>{description}</td>
                  <td>{discountedPrice}</td>
                  <td>{category_name}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default App;

